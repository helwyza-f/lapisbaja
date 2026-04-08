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

func (r *TrainingRepository) flushCache(ctx context.Context) {
	_ = r.redis.Delete(ctx, "trainings_all")
}

func (r *TrainingRepository) Create(ctx context.Context, t *model.Training) error {
	query := `
        INSERT INTO trainings (title, description, date_start, price)
        VALUES ($1, $2, $3, $4)
        RETURNING id, created_at`
	
	err := r.db.QueryRowxContext(ctx, query, t.Title, t.Description, t.DateStart, t.Price).
		Scan(&t.ID, &t.CreatedAt)
	
	if err == nil {
		r.flushCache(ctx)
	}
	return err
}

func (r *TrainingRepository) GetAll(ctx context.Context) ([]model.Training, error) {
	// Inisialisasi empty slice supaya JSON balikan [] bukan null
	trainings := []model.Training{} 
	cacheKey := "trainings_all"

	cachedData, err := r.redis.Get(ctx, cacheKey)
	if err == nil && cachedData != "" {
		if err := json.Unmarshal([]byte(cachedData), &trainings); err == nil {
			// Double check agar tidak null setelah unmarshal
			if trainings == nil { trainings = []model.Training{} }
			return trainings, nil
		}
	}

	query := `SELECT id, title, description, date_start, price, created_at FROM trainings ORDER BY date_start ASC`
	err = r.db.SelectContext(ctx, &trainings, query)
	if err != nil {
		return nil, err
	}

	jsonData, _ := json.Marshal(trainings)
	_ = r.redis.Set(ctx, cacheKey, jsonData, 1*time.Hour)

	return trainings, nil
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
		r.flushCache(ctx)
	}
	return err
}

func (r *TrainingRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM trainings WHERE id = $1", id)
	if err == nil {
		r.flushCache(ctx)
	}
	return err
}