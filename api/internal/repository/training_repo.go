package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/helwiza/lapisbaja-api/internal/infra"
	"github.com/helwiza/lapisbaja-api/internal/model"
	"github.com/jmoiron/sqlx"
)

type TrainingRepository struct {
	db    *sqlx.DB
	redis *infra.RedisService
}

func NewTrainingRepository(db *sqlx.DB, redis *infra.RedisService) *TrainingRepository {
	return &TrainingRepository{db: db, redis: redis}
}

// flushCache menghapus SEMUA cache terkait trainings (pagination & search)
func (r *TrainingRepository) flushCache(ctx context.Context) {
	// Gunakan prefix agar key trainings_s_l10_o0 dkk ikut terhapus
	_ = r.redis.DeleteByPrefix(ctx, "trainings_")
}

func (r *TrainingRepository) Create(ctx context.Context, t *model.Training) error {
	query := `
		INSERT INTO trainings (title, description, date_start, price)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at`
	
	err := r.db.QueryRowxContext(ctx, query, t.Title, t.Description, t.DateStart, t.Price).
		Scan(&t.ID, &t.CreatedAt)
	
	if err == nil {
		r.flushCache(ctx) // Reset cache setelah insert
	}
	return err
}

func (r *TrainingRepository) GetAll(ctx context.Context, search string, limit, offset int) ([]model.Training, int, error) {
	trainings := []model.Training{}
	var total int

	// Key menyertakan 'search' agar hasil pencarian masuk cache yang benar
	cacheKey := fmt.Sprintf("trainings_s%s_l%d_o%d", search, limit, offset)

	// 1. Cek Cache
	cachedData, err := r.redis.Get(ctx, cacheKey)
	if err == nil && cachedData != "" {
		// Wrapper untuk unmarshal data dan total
		type cacheWrapper struct {
			Items []model.Training `json:"items"`
			Total int              `json:"total"`
		}
		var wrapper cacheWrapper
		if err := json.Unmarshal([]byte(cachedData), &wrapper); err == nil {
			return wrapper.Items, wrapper.Total, nil
		}
	}

	// 2. Query Total Data untuk Smart Pagination
	countQuery := `SELECT COUNT(*) FROM trainings WHERE title ILIKE $1`
	err = r.db.GetContext(ctx, &total, countQuery, "%"+search+"%")
	if err != nil {
		return nil, 0, err
	}

	// 3. Query Data dengan Search & Pagination
	// ILIKE untuk case-insensitive (Postgres)
	query := `SELECT id, title, description, date_start, price, created_at 
			  FROM trainings 
			  WHERE title ILIKE $1 
			  ORDER BY date_start ASC 
			  LIMIT $2 OFFSET $3`

	err = r.db.SelectContext(ctx, &trainings, query, "%"+search+"%", limit, offset)
	if err != nil {
		return nil, 0, err
	}

	// 4. Simpan ke Redis (Expire 1 Jam)
	// Kita simpan Items dan Total dalam satu JSON
	cachePayload := map[string]interface{}{
		"items": trainings,
		"total": total,
	}
	jsonData, _ := json.Marshal(cachePayload)
	_ = r.redis.Set(ctx, cacheKey, string(jsonData), 1*time.Hour)

	return trainings, total, nil
}

func (r *TrainingRepository) GetByID(ctx context.Context, id string) (*model.Training, error) {
	var t model.Training
	query := `SELECT id, title, description, date_start, price, created_at FROM trainings WHERE id = $1`
	err := r.db.GetContext(ctx, &t, query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("training not found")
		}
		return nil, err
	}
	return &t, nil
}

func (r *TrainingRepository) Update(ctx context.Context, t *model.Training) error {
	query := `
		UPDATE trainings 
		SET title = $1, description = $2, date_start = $3, price = $4 
		WHERE id = $5`
	
	_, err := r.db.ExecContext(ctx, query, t.Title, t.Description, t.DateStart, t.Price, t.ID)
	if err == nil {
		r.flushCache(ctx) // Reset cache setelah update
	}
	return err
}

func (r *TrainingRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM trainings WHERE id = $1", id)
	if err == nil {
		r.flushCache(ctx) // Reset cache setelah delete
	}
	return err
}