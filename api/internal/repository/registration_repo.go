package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"math"
	"time"

	"github.com/helwiza/lapisbaja-api/internal/infra"
	"github.com/helwiza/lapisbaja-api/internal/model"
	"github.com/jmoiron/sqlx"
)

type RegistrationRepository struct {
	db    *sqlx.DB
	redis *infra.RedisService
}

func NewRegistrationRepository(db *sqlx.DB, redis *infra.RedisService) *RegistrationRepository {
	return &RegistrationRepository{
		db:    db,
		redis: redis,
	}
}

// flushCache: Menghapus semua cache pendaftaran agar data di Dashboard Admin selalu fresh
func (r *RegistrationRepository) flushCache(ctx context.Context) {
	_ = r.redis.DeleteByPrefix(ctx, "registrations_")
}

// CreateRegistration: Registrasi baru dengan Student Upsert (Transactional)
func (r *RegistrationRepository) CreateRegistration(ctx context.Context, reg *model.Registration) error {
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// 1. Upsert Student: Jika email sudah ada, sinkronkan data profil terbaru
	studentQuery := `
		INSERT INTO students (name, email, phone, agency)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (email) DO UPDATE 
		SET name = EXCLUDED.name, phone = EXCLUDED.phone, agency = EXCLUDED.agency
		RETURNING id`
	
	var studentID string
	err = tx.GetContext(ctx, &studentID, studentQuery, reg.Name, reg.Email, reg.Phone, reg.Agency)
	if err != nil {
		return err
	}

	// 2. Insert Registration
	regQuery := `
		INSERT INTO registrations (student_id, training_id, proof_url, status)
		VALUES ($1, $2, $3, 'PENDING')
		RETURNING id, status, created_at`
	
	err = tx.QueryRowxContext(ctx, regQuery, studentID, reg.TrainingID, reg.ProofURL).
		Scan(&reg.ID, &reg.Status, &reg.CreatedAt)
	if err != nil {
		return err
	}

	reg.StudentID = studentID
	
	if err := tx.Commit(); err != nil {
		return err
	}

	r.flushCache(ctx)
	return nil
}

// GetAll: Mendukung Smart Pagination, Multi-Filter (Status, Training, Date), & Search
func (r *RegistrationRepository) GetAll(ctx context.Context, page, limit int, search, status, trainingID, date string) (*model.RegistrationPagedResponse, error) {
	registrations := []model.Registration{}
	var totalData int
	offset := (page - 1) * limit
	
	// CACHE KEY GENERATOR: Menyertakan semua filter agar hasil search/filter masuk cache yang unik
	cacheKey := fmt.Sprintf("registrations_s%s_st%s_t%s_d%s_p%d_l%d", search, status, trainingID, date, page, limit)

	// 1. Cek Redis Cache
	cachedData, err := r.redis.Get(ctx, cacheKey)
	if err == nil && cachedData != "" {
		var resp model.RegistrationPagedResponse
		if err := json.Unmarshal([]byte(cachedData), &resp); err == nil {
			return &resp, nil
		}
	}

	// 2. BUILD DYNAMIC SQL QUERY
	// Base condition
	whereClause := "WHERE 1=1"
	args := []interface{}{}
	argIdx := 1

	// Filter Search (Name / Email)
	if search != "" {
		whereClause += fmt.Sprintf(" AND (s.name ILIKE $%d OR s.email ILIKE $%d)", argIdx, argIdx)
		args = append(args, "%"+search+"%")
		argIdx++
	}

	// Filter Status
	if status != "" && status != "ALL" {
		whereClause += fmt.Sprintf(" AND r.status = $%d", argIdx)
		args = append(args, status)
		argIdx++
	}

	// Filter Training ID
	if trainingID != "" {
		whereClause += fmt.Sprintf(" AND r.training_id = $%d", argIdx)
		args = append(args, trainingID)
		argIdx++
	}

	// Filter Date (YYYY-MM-DD)
	if date != "" {
		whereClause += fmt.Sprintf(" AND r.created_at::date = $%d", argIdx)
		args = append(args, date)
		argIdx++
	}

	// 3. Count Total Data (Untuk Pagination)
	countQuery := fmt.Sprintf(`
		SELECT COUNT(*) 
		FROM registrations r 
		JOIN students s ON r.student_id = s.id 
		%s`, whereClause)
	
	err = r.db.GetContext(ctx, &totalData, countQuery, args...)
	if err != nil {
		return nil, err
	}

	// 4. Query Data dengan JOIN & Pagination
	mainQuery := fmt.Sprintf(`
		SELECT 
			r.id, r.student_id, r.training_id, t.title as training_title,
			COALESCE(r.proof_url, '') as proof_url, 
			r.status, r.created_at,
			s.name, s.email, s.phone, s.agency
		FROM registrations r
		JOIN students s ON r.student_id = s.id
		JOIN trainings t ON r.training_id = t.id
		%s
		ORDER BY r.created_at DESC 
		LIMIT $%d OFFSET $%d`, whereClause, argIdx, argIdx+1)

	finalArgs := append(args, limit, offset)
	err = r.db.SelectContext(ctx, &registrations, mainQuery, finalArgs...)
	if err != nil {
		return nil, err
	}

	// 5. Kalkulasi Metadata & Response
	totalPage := 0
	if totalData > 0 {
		totalPage = int(math.Ceil(float64(totalData) / float64(limit)))
	}

	result := &model.RegistrationPagedResponse{
		Items: registrations,
		Meta: model.PaginationMeta{
			TotalData:   totalData,
			TotalPage:   totalPage,
			CurrentPage: page,
			Limit:       limit,
		},
	}

	// 6. Simpan ke Cache (5 Menit saja karena data admin sangat dinamis)
	jsonData, _ := json.Marshal(result)
	_ = r.redis.Set(ctx, cacheKey, jsonData, 5*time.Minute)

	return result, nil
}

// FindByContact: Digunakan publik untuk mengecek status pendaftaran terakhir
func (r *RegistrationRepository) FindByContact(ctx context.Context, identifier string) (*model.Registration, string, error) {
	var result struct {
		model.Registration
		TrainingTitle string `db:"training_title"`
	}

	query := `
		SELECT 
			r.id, r.proof_url, r.status, r.created_at,
			s.name, s.email, s.phone,
			t.title as training_title
		FROM registrations r
		JOIN students s ON r.student_id = s.id
		JOIN trainings t ON r.training_id = t.id
		WHERE s.email = $1 OR s.phone = $1
		ORDER BY r.created_at DESC
		LIMIT 1`

	err := r.db.GetContext(ctx, &result, query, identifier)
	if err != nil {
		return nil, "", err
	}

	return &result.Registration, result.TrainingTitle, nil
}

// UpdateStatus: Digunakan Admin untuk Verifikasi pendaftar
func (r *RegistrationRepository) UpdateStatus(ctx context.Context, id string, status string) error {
	query := `UPDATE registrations SET status = $1, updated_at = NOW() WHERE id = $2`
	_, err := r.db.ExecContext(ctx, query, status, id)
	if err == nil {
		r.flushCache(ctx)
	}
	return err
}

// UpdateProofAndStatus: Digunakan user saat re-upload bukti bayar
func (r *RegistrationRepository) UpdateProofAndStatus(ctx context.Context, id, proofURL, status string) error {
	query := `UPDATE registrations SET proof_url = $1, status = $2, updated_at = NOW() WHERE id = $3`
	_, err := r.db.ExecContext(ctx, query, proofURL, status, id)
	if err == nil {
		r.flushCache(ctx)
	}
	return err
}

// GetByID: Fetch detail pendaftaran tunggal untuk halaman detail admin
func (r *RegistrationRepository) GetByID(ctx context.Context, id string) (*model.Registration, error) {
	var reg model.Registration
	query := `
		SELECT 
			r.id, r.student_id, r.training_id, t.title as training_title,
			COALESCE(r.proof_url, '') as proof_url, 
			r.status, r.created_at,
			s.name, s.email, s.phone, s.agency
		FROM registrations r
		JOIN students s ON r.student_id = s.id
		JOIN trainings t ON r.training_id = t.id
		WHERE r.id = $1`
	
	err := r.db.GetContext(ctx, &reg, query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("pendaftaran tidak ditemukan")
		}
		return nil, err
	}
	return &reg, nil
}

// Delete: Menghapus pendaftaran secara permanen
func (r *RegistrationRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM registrations WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, id)
	if err == nil {
		r.flushCache(ctx)
	}
	return err
}