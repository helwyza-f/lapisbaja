// internal/service/registration_service.go
package service

import (
	"context"
	"fmt"
	"os"
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
	wa        *infra.WhatsAppProvider
}

func NewRegistrationService(
	repo *repository.RegistrationRepository,
	s3 *infra.S3Service,
	redis *infra.RedisService,
	wa *infra.WhatsAppProvider,
) *RegistrationService {
	return &RegistrationService{
		repo:      repo,
		s3Service: s3,
		redis:     redis,
		wa:        wa,
	}
}

// RegisterStudent: Menangani pendaftaran awal dari sisi publik
func (s *RegistrationService) RegisterStudent(ctx context.Context, reg model.Registration, fileBody []byte) (*model.Registration, error) {
	// 1. Validasi Nomor WA via Fonnte
	isValid, err := s.wa.ValidateNumber(reg.Phone)
	if err != nil || !isValid {
		return nil, fmt.Errorf("nomor WhatsApp tidak valid atau tidak terdaftar")
	}

	if reg.TrainingID == "" {
		return nil, fmt.Errorf("ID Pelatihan tidak boleh kosong")
	}

	// 2. Handling Upload Bukti Bayar
	if len(fileBody) > 0 {
		safeName := strings.ReplaceAll(reg.Name, " ", "-")
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

	// 3. Simpan ke Database
	err = s.repo.CreateRegistration(ctx, &reg)
	if err != nil {
		return nil, fmt.Errorf("failed to save registration: %w", err)
	}

	// 4. Notifikasi Async
	go s.notifyNewRegistration(reg)

	// 5. Alert Dashboard via Redis
	_ = s.redis.Set(ctx, "new_registration_alert", "true", 24*time.Hour)

	return &reg, nil
}

// ListRegistrations: FIXED - Sekarang mendukung pencarian, status, training_id, dan date filter
func (s *RegistrationService) ListRegistrations(ctx context.Context, page, limit int, search, status, trainingID, date string) (*model.RegistrationPagedResponse, error) {
	if limit <= 0 { limit = 10 }
	if page <= 0 { page = 1 }

	// Normalisasi status ke Uppercase agar match dengan DB
	if status != "" && status != "ALL" {
		status = strings.ToUpper(status)
	} else {
		status = "" // Kosongkan jika ALL agar repository tidak filter status
	}

	// Teruskan ke repository untuk eksekusi SQL
	return s.repo.GetAll(ctx, page, limit, search, status, trainingID, date)
}

// UpdateRegistrationStatus: Verifikasi admin untuk mengubah status
func (s *RegistrationService) UpdateRegistrationStatus(ctx context.Context, id string, status string) error {
	statusUpper := strings.ToUpper(strings.TrimSpace(status))
	validStatus := map[string]bool{"PENDING": true, "APPROVED": true, "REJECTED": true}
	
	if !validStatus[statusUpper] {
		return fmt.Errorf("status tidak valid: %s", status)
	}

	reg, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("pendaftaran tidak ditemukan: %w", err)
	}

	err = s.repo.UpdateStatus(ctx, id, statusUpper)
	if err != nil {
		return err
	}

	// Kirim Notifikasi Perubahan Status
	go s.notifyStatusChange(reg.Phone, reg.Name, statusUpper)

	return nil
}

// ReuploadProof: Menangani alur upload ulang jika ditolak admin
func (s *RegistrationService) ReuploadProof(ctx context.Context, id string, fileBody []byte) error {
	reg, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("pendaftaran tidak ditemukan")
	}

	safeName := strings.ReplaceAll(reg.Name, " ", "-")
	fileName := fmt.Sprintf("proofs/%s/RE-%d-%s.jpg", 
		time.Now().Format("2006/01"), 
		time.Now().UnixMicro(), 
		safeName)
	
	proofURL, err := s.s3Service.UploadSingle(ctx, fileName, fileBody, "image/jpeg")
	if err != nil {
		return fmt.Errorf("failed to upload new proof: %w", err)
	}

	// Update DB: Status balik ke PENDING
	err = s.repo.UpdateProofAndStatus(ctx, id, proofURL, "PENDING")
	if err != nil {
		return fmt.Errorf("failed to update db: %w", err)
	}

	// Notify Admin Async
	go func() {
		adminWA := os.Getenv("ADMIN_WA_NUMBER")
		msg := fmt.Sprintf("🔄 *RE-UPLOAD BUKTI*\n\nNama: %s\nID: %s\n\nPendaftar telah mengunggah ulang bukti bayar. Mohon segera dicek.", reg.Name, id)
		_ = s.wa.SendMessage(adminWA, msg)
	}()

	return nil
}

// GetLatestStatus: Cek status pendaftaran terakhir oleh user publik
func (s *RegistrationService) GetLatestStatus(ctx context.Context, identifier string) (map[string]interface{}, error) {
	reg, trainingTitle, err := s.repo.FindByContact(ctx, identifier)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"registration_id": reg.ID,
		"name":            reg.Name,
		"training_title":  trainingTitle,
		"status":          reg.Status,
		"proof_url":       reg.ProofURL,
		"created_at":      reg.CreatedAt,
	}, nil
}

// GetRegistrationByID: Fetch detail pendaftaran tunggal
func (s *RegistrationService) GetRegistrationByID(ctx context.Context, id string) (*model.Registration, error) {
	return s.repo.GetByID(ctx, id)
}

// DeleteRegistration: Hapus record pendaftaran
func (s *RegistrationService) DeleteRegistration(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

// --- HELPER NOTIFIKASI ---

func (s *RegistrationService) notifyNewRegistration(reg model.Registration) {
	frontendURL := os.Getenv("FRONTEND_URL")
	adminWA := os.Getenv("ADMIN_WA_NUMBER")

	statusLink := fmt.Sprintf("%s/trainings/status?identifier=%s", frontendURL, reg.Email)

	customerMsg := fmt.Sprintf(
		"Halo *%s*,\n\nTerima kasih telah mendaftar di PT Lapis Baja Inspektindo.\n\nSilakan lakukan pembayaran dan unggah bukti bayar melalui tautan berikut:\n\n🔗 %s\n\nAdmin kami akan memverifikasi dalam 1x24 jam.",
		reg.Name, statusLink,
	)
	_ = s.wa.SendMessage(reg.Phone, customerMsg)

	adminMsg := fmt.Sprintf(
		"🔔 *PENDAFTAR BARU*\n\nNama: %s\nEmail: %s\nWA: %s\n\nCek Dashboard Admin sekarang.",
		reg.Name, reg.Email, reg.Phone,
	)
	_ = s.wa.SendMessage(adminWA, adminMsg)
}

func (s *RegistrationService) notifyStatusChange(phone, name, status string) {
	frontendURL := os.Getenv("FRONTEND_URL")
	statusLink := fmt.Sprintf("%s/trainings/status?identifier=%s", frontendURL, phone)
	
	var msg string
	switch status {
	case "APPROVED":
		msg = fmt.Sprintf(
			"Selamat *%s*!\n\nPendaftaran Anda telah *DISETUJUI*.\n\nDetail:\n🔗 %s", 
			name, statusLink,
		)
	case "REJECTED":
		msg = fmt.Sprintf(
			"Halo *%s*,\n\nMohon maaf, bukti pembayaran Anda belum valid.\n\nUnggah ulang di sini:\n🔗 %s", 
			name, statusLink,
		)
	}

	if msg != "" {
		_ = s.wa.SendMessage(phone, msg)
	}
}