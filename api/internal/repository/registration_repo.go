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

// flushCache cerdas: Menghapus semua cache pendaftaran agar data di semua page tetap sinkron
func (r *RegistrationRepository) flushCache(ctx context.Context) {
	_ = r.redis.DeleteByPrefix(ctx, "registrations_")
}

func (r *RegistrationRepository) CreateRegistration(ctx context.Context, reg *model.Registration) error {
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// 1. Upsert Student
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

// GetAll Mendukung Pagination & Filter TrainingID (Flawless Version)
func (r *RegistrationRepository) GetAll(ctx context.Context, page, limit int, trainingID string) (*model.RegistrationPagedResponse, error) {
	// FIX: Inisialisasi sebagai empty slice, bukan nil. 
	// Ini supaya di JSON keluar sebagai [] bukan null.
	registrations := []model.Registration{} 
	var totalData int
	offset := (page - 1) * limit
	
	cacheKey := fmt.Sprintf("registrations_t%s_p%d_l%d", trainingID, page, limit)

	// 1. Cek Redis
	cachedData, err := r.redis.Get(ctx, cacheKey)
	if err == nil && cachedData != "" {
		var resp model.RegistrationPagedResponse
		if err := json.Unmarshal([]byte(cachedData), &resp); err == nil {
			// Pastikan Items tidak nil setelah unmarshal jika aslinya kosong
			if resp.Items == nil {
				resp.Items = []model.Registration{}
			}
			return &resp, nil
		}
	}

	// 2. Hitung Total Data Dinamis
	countQuery := `SELECT COUNT(*) FROM registrations WHERE 1=1`
	if trainingID != "" {
		countQuery += fmt.Sprintf(" AND training_id = '%s'", trainingID)
	}
	err = r.db.GetContext(ctx, &totalData, countQuery)
	if err != nil {
		return nil, err
	}

	// 3. Query Data Utama dengan JOIN ke Trainings
	query := `
        SELECT 
            r.id, r.student_id, r.training_id, t.title as training_title,
            COALESCE(r.proof_url, '') as proof_url, 
            r.status, r.created_at,
            s.name, s.email, s.phone, s.agency
        FROM registrations r
        JOIN students s ON r.student_id = s.id
        JOIN trainings t ON r.training_id = t.id
        WHERE 1=1`

	if trainingID != "" {
		query += fmt.Sprintf(" AND r.training_id = '%s'", trainingID)
	}
	
	query += " ORDER BY r.created_at DESC LIMIT $1 OFFSET $2"
	
	err = r.db.SelectContext(ctx, &registrations, query, limit, offset)
	if err != nil {
		return nil, err
	}

	// 4. Kalkulasi Metadata
	totalPage := 0
	if totalData > 0 {
		totalPage = int(math.Ceil(float64(totalData) / float64(limit)))
	}

	result := &model.RegistrationPagedResponse{
		Items: registrations, // Sekarang terjamin minimal []
		Meta: model.PaginationMeta{
			TotalData:   totalData,
			TotalPage:   totalPage,
			CurrentPage: page,
			Limit:       limit,
		},
	}

	// 5. Simpan ke Redis (Cache 10 Menit)
	jsonData, _ := json.Marshal(result)
	_ = r.redis.Set(ctx, cacheKey, jsonData, 10*time.Minute)

	return result, nil
}

func (r *RegistrationRepository) UpdateStatus(ctx context.Context, id string, status string) error {
	query := `UPDATE registrations SET status = $1 WHERE id = $2`
	_, err := r.db.ExecContext(ctx, query, status, id)
	if err == nil {
		r.flushCache(ctx)
	}
	return err
}

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

func (r *RegistrationRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM registrations WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, id)
	if err == nil {
		r.flushCache(ctx)
	}
	return err
}