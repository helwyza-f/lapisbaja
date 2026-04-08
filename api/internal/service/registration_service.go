package service

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/helwiza/lapisbaja-api/internal/infra"
	"github.com/helwiza/lapisbaja-api/internal/model"
	"github.com/helwiza/lapisbaja-api/internal/repository"
)

type RegistrationService struct {
	repo      *repository.RegistrationRepository
	s3Service *infra.S3Service
	redis     *infra.RedisService
}

func NewRegistrationService(repo *repository.RegistrationRepository, s3 *infra.S3Service, redis *infra.RedisService) *RegistrationService {
	return &RegistrationService{
		repo:      repo,
		s3Service: s3,
		redis:     redis,
	}
}

// RegisterStudent menangani pendaftaran awal (Public side)
func (s *RegistrationService) RegisterStudent(ctx context.Context, reg model.Registration, fileBody []byte) (*model.Registration, error) {
	// 1. Validasi Input Dasar
	if reg.TrainingID == "" {
		return nil, fmt.Errorf("ID Pelatihan tidak boleh kosong")
	}

	// 2. Handling Upload Bukti Bayar ke Cloudflare R2
	if len(fileBody) > 0 {
		safeName := strings.ReplaceAll(reg.Name, " ", "-")
		// Gunakan folder dinamis berdasarkan tahun/bulan
		fileName := fmt.Sprintf("proofs/%s/%d-%s.jpg", 
			time.Now().Format("2006/01"), 
			time.Now().UnixMicro(), 
			safeName)
		
		proofURL, err := s.s3Service.UploadSingle(ctx, fileName, fileBody, "image/jpeg")
		if err != nil {
			return nil, fmt.Errorf("failed to upload proof: %w", err)
		}
		reg.ProofURL = proofURL
	}

	// 3. Simpan ke Database via Repo
	err := s.repo.CreateRegistration(ctx, &reg)
	if err != nil {
		return nil, fmt.Errorf("failed to save registration: %w", err)
	}

	// 4. Set Alert di Redis (Opsional, buat dashboard real-time nanti)
	_ = s.redis.Set(ctx, "new_registration_alert", "true", 24*time.Hour)

	return &reg, nil
}

// ListRegistrations Sinkron dengan Pagination & Filter TrainingID (Admin side)
func (s *RegistrationService) ListRegistrations(ctx context.Context, page, limit int, trainingID string) (*model.RegistrationPagedResponse, error) {
	// Proteksi: RAM Mac Mini aman, limit kita batasi
	if limit <= 0 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}
	if page <= 0 {
		page = 1
	}

	// Kirim parameter trainingID ke Repo untuk filter JOIN
	return s.repo.GetAll(ctx, page, limit, trainingID)
}

// GetRegistrationByID mengambil detail satu pendaftar
func (s *RegistrationService) GetRegistrationByID(ctx context.Context, id string) (*model.Registration, error) {
	return s.repo.GetByID(ctx, id)
}

// UpdateRegistrationStatus untuk verifikasi admin (Approve/Reject)
func (s *RegistrationService) UpdateRegistrationStatus(ctx context.Context, id string, status string) error {
	statusUpper := strings.ToUpper(strings.TrimSpace(status))
	
	// Validasi status yang diizinkan
	validStatus := map[string]bool{"PENDING": true, "APPROVED": true, "REJECTED": true}
	if !validStatus[statusUpper] {
		return fmt.Errorf("status tidak valid: %s", status)
	}

	// Pastikan data ada sebelum update
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("pendaftaran tidak ditemukan: %w", err)
	}

	return s.repo.UpdateStatus(ctx, id, statusUpper)
}

// DeleteRegistration menghapus pendaftaran
func (s *RegistrationService) DeleteRegistration(ctx context.Context, id string) error {
	// Cek keberadaan data
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("pendaftaran tidak ditemukan: %w", err)
	}

	return s.repo.Delete(ctx, id)
}