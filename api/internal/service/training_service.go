package service

import (
	"context"
	"fmt"
	"time"

	"github.com/helwiza/lapisbaja-api/internal/model"
	"github.com/helwiza/lapisbaja-api/internal/repository"
)

type TrainingService struct {
	repo *repository.TrainingRepository
}

func NewTrainingService(repo *repository.TrainingRepository) *TrainingService {
	return &TrainingService{repo: repo}
}

// Helper untuk handle berbagai format tanggal dari Frontend (Next.js & Browser)
func parseDate(dateStr string) (time.Time, error) {
	// 1. Coba format ISO (RFC3339) dari .toISOString()
	t, err := time.Parse(time.RFC3339, dateStr)
	if err == nil {
		return t, nil
	}

	// 2. Fallback ke format tanggal simpel (YYYY-MM-DD)
	t, err = time.Parse("2006-01-02", dateStr)
	if err == nil {
		return t, nil
	}

	return time.Time{}, fmt.Errorf("invalid industrial date format: %s", dateStr)
}

func (s *TrainingService) CreateTraining(ctx context.Context, req model.CreateTrainingRequest) (*model.Training, error) {
	date, err := parseDate(req.DateStart)
	if err != nil {
		return nil, err
	}

	training := &model.Training{
		Title:       req.Title,
		Description: req.Description,
		DateStart:   date,
		Price:       req.Price,
	}

	err = s.repo.Create(ctx, training)
	return training, err
}

// ListTrainings: FIX ERROR DISINI
// Ditambahkan return 'int' untuk total data dan parameter 'search'
func (s *TrainingService) ListTrainings(ctx context.Context, search string, limit, page int) ([]model.Training, int, error) {
	if limit <= 0 {
		limit = 10
	}
	if page <= 0 {
		page = 1
	}

	// Kalkulasi offset untuk query PostgreSQL
	offset := (page - 1) * limit

	// Panggil repo dengan parameter lengkap: context, search, limit, offset
	return s.repo.GetAll(ctx, search, limit, offset)
}

func (s *TrainingService) GetTrainingByID(ctx context.Context, id string) (*model.Training, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *TrainingService) UpdateTraining(ctx context.Context, id string, req model.CreateTrainingRequest) (*model.Training, error) {
	existing, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	date, err := parseDate(req.DateStart)
	if err != nil {
		return nil, err
	}

	existing.Title = req.Title
	existing.Description = req.Description
	existing.DateStart = date
	existing.Price = req.Price

	err = s.repo.Update(ctx, existing)
	if err != nil {
		return nil, err
	}

	return existing, nil
}

func (s *TrainingService) DeleteTraining(ctx context.Context, id string) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	return s.repo.Delete(ctx, id)
}