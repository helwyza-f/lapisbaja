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
	wa        *infra.WhatsAppProvider // Infra WhatsApp (Fonnte)
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

// RegisterStudent menangani pendaftaran awal (Public side)
func (s *RegistrationService) RegisterStudent(ctx context.Context, reg model.Registration, fileBody []byte) (*model.Registration, error) {
	// 1. Validasi Nomor WA via Fonnte (Mencegah Typo)
	isValid, err := s.wa.ValidateNumber(reg.Phone)
	if err != nil || !isValid {
		return nil, fmt.Errorf("nomor WhatsApp tidak valid atau tidak terdaftar")
	}

	if reg.TrainingID == "" {
		return nil, fmt.Errorf("ID Pelatihan tidak boleh kosong")
	}

	// 2. Handling Upload Bukti Bayar (Jika ada di awal)
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

	// 4. Notifikasi Async (Customer & Admin)
	go s.notifyNewRegistration(reg)

	// 5. Alert Dashboard
	_ = s.redis.Set(ctx, "new_registration_alert", "true", 24*time.Hour)

	return &reg, nil
}

// ReuploadProof menangani pendaftar yang upload ulang bukti (Public side)
func (s *RegistrationService) ReuploadProof(ctx context.Context, id string, fileBody []byte) error {
	// 1. Cari data pendaftaran
	reg, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("pendaftaran tidak ditemukan")
	}

	// 2. Upload file baru ke R2
	safeName := strings.ReplaceAll(reg.Name, " ", "-")
	fileName := fmt.Sprintf("proofs/%s/RE-%d-%s.jpg", 
		time.Now().Format("2006/01"), 
		time.Now().UnixMicro(), 
		safeName)
	
	proofURL, err := s.s3Service.UploadSingle(ctx, fileName, fileBody, "image/jpeg")
	if err != nil {
		return fmt.Errorf("failed to upload new proof: %w", err)
	}

	// 3. Update Database: Status balik ke PENDING agar admin verifikasi lagi
	err = s.repo.UpdateProofAndStatus(ctx, id, proofURL, "PENDING")
	if err != nil {
		return fmt.Errorf("failed to update db: %w", err)
	}

	// 4. Notify Admin
	go func() {
		adminWA := os.Getenv("ADMIN_WA_NUMBER")
		msg := fmt.Sprintf("🔄 *RE-UPLOAD BUKTI*\n\nNama: %s\nID: %s\n\nPendaftar telah mengunggah ulang bukti bayar. Mohon segera dicek.", reg.Name, id)
		_ = s.wa.SendMessage(adminWA, msg)
	}()

	return nil
}

// UpdateRegistrationStatus untuk verifikasi admin (Approve/Reject)
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

// --- HELPER NOTIFIKASI ---

func (s *RegistrationService) notifyNewRegistration(reg model.Registration) {
	frontendURL := os.Getenv("FRONTEND_URL") // Pastikan di .env isinya http://localhost:3000
	adminWA := os.Getenv("ADMIN_WA_NUMBER")

	// Link Redirect Otomatis ke Halaman Status
	statusLink := fmt.Sprintf("%s/trainings/status?identifier=%s", frontendURL, reg.Email)

	// Ke Customer
	customerMsg := fmt.Sprintf(
		"Halo *%s*,\n\nTerima kasih telah mendaftar di PT Lapis Baja Inspektindo.\n\nSilakan lakukan pembayaran dan unggah bukti bayar melalui tautan berikut untuk memverifikasi pendaftaran Anda:\n\n🔗 %s\n\nAdmin kami akan segera menghubungi Anda setelah verifikasi selesai.",
		reg.Name, statusLink,
	)
	_ = s.wa.SendMessage(reg.Phone, customerMsg)

	// Ke Admin
	adminMsg := fmt.Sprintf(
		"🔔 *PENDAFTAR BARU*\n\nNama: %s\nEmail: %s\nWA: %s\nInstansi: %s\n\nCek segera di Dashboard Admin.",
		reg.Name, reg.Email, reg.Phone, reg.Agency,
	)
	_ = s.wa.SendMessage(adminWA, adminMsg)
}

func (s *RegistrationService) notifyStatusChange(phone, name, status string) {
	frontendURL := os.Getenv("FRONTEND_URL")
	// Kita gunakan nomor phone sebagai identifier cadangan di link
	statusLink := fmt.Sprintf("%s/trainings/status?identifier=%s", frontendURL, phone)
	
	var msg string
	switch status {
	case "APPROVED":
		msg = fmt.Sprintf(
			"Selamat *%s*!\n\nPendaftaran Anda telah *DISETUJUI*. Pembayaran telah kami verifikasi.\n\nDetail pendaftaran:\n🔗 %s\n\nSampai jumpa di lokasi pelatihan!", 
			name, statusLink,
		)
	case "REJECTED":
		msg = fmt.Sprintf(
			"Halo *%s*,\n\nMohon maaf, pendaftaran Anda belum dapat kami setujui karena bukti pembayaran tidak valid/tidak terbaca.\n\nSilakan unggah ulang bukti pembayaran yang sah melalui tautan berikut:\n🔗 %s", 
			name, statusLink,
		)
	}

	if msg != "" {
		_ = s.wa.SendMessage(phone, msg)
	}
}

// --- ADMIN & GENERAL METHODS ---

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

func (s *RegistrationService) ListRegistrations(ctx context.Context, page, limit int, trainingID string) (*model.RegistrationPagedResponse, error) {
	if limit <= 0 { limit = 10 }
	if page <= 0 { page = 1 }
	return s.repo.GetAll(ctx, page, limit, trainingID)
}

func (s *RegistrationService) GetRegistrationByID(ctx context.Context, id string) (*model.Registration, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *RegistrationService) DeleteRegistration(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}