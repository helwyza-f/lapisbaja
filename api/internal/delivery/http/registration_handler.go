package http

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"

	"github.com/helwiza/lapisbaja-api/internal/model"
	"github.com/helwiza/lapisbaja-api/internal/service"
	"github.com/helwiza/lapisbaja-api/pkg/utils"
)

type RegistrationHandler struct {
	svc *service.RegistrationService
}

func NewRegistrationHandler(svc *service.RegistrationService) *RegistrationHandler {
	return &RegistrationHandler{svc: svc}
}

// Register menangani pendaftaran dari sisi pendaftar (Public)
func (h *RegistrationHandler) Register(w http.ResponseWriter, r *http.Request) {
	// 1. Batasi ukuran file (5MB) agar Mac Mini tidak keberatan proses buffer
	if err := r.ParseMultipartForm(5 << 20); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "File terlalu besar atau form tidak valid", err.Error())
		return
	}

	var fileBody []byte
	// 2. Ambil file bukti bayar (Opsional)
	file, _, err := r.FormFile("proof")
	if err == nil {
		defer file.Close()
		fileBody, _ = io.ReadAll(file)
	}

	// 3. Mapping data dari multipart form
	reg := model.Registration{
		TrainingID: r.FormValue("training_id"),
		Name:       r.FormValue("name"),
		Email:      r.FormValue("email"),
		Phone:      r.FormValue("phone"),
		Agency:     r.FormValue("agency"),
	}

	// 4. Panggil Service
	result, err := h.svc.RegisterStudent(r.Context(), reg, fileBody)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal melakukan pendaftaran", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusCreated, "Pendaftaran berhasil dikirim", result)
}

// List mengambil data pendaftar dengan dukungan Pagination & Filter (Sisi Admin)
func (h *RegistrationHandler) List(w http.ResponseWriter, r *http.Request) {
	// 1. Ambil Query Params
	query := r.URL.Query()
	
	page, _ := strconv.Atoi(query.Get("page"))
	if page <= 0 {
		page = 1
	}

	limit, _ := strconv.Atoi(query.Get("limit"))
	if limit <= 0 {
		limit = 10 // Sesuaikan dengan limit default frontend
	}

	// FLAWLESS SYNC: Ambil training_id dari query param
	trainingID := query.Get("training_id")

	// 2. Panggil Service dengan parameter lengkap
	results, err := h.svc.ListRegistrations(r.Context(), page, limit, trainingID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal mengambil daftar pendaftaran", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "Berhasil mengambil daftar pendaftaran", results)
}

// GetByID mengambil detail satu pendaftaran
func (h *RegistrationHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	// Menggunakan r.PathValue untuk Go 1.22+
	id := r.PathValue("id")
	if id == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "ID pendaftaran wajib disertakan", nil)
		return
	}

	result, err := h.svc.GetRegistrationByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Data pendaftaran tidak ditemukan", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "Berhasil mengambil detail pendaftaran", result)
}

// UpdateStatus mengubah status pendaftaran (APPROVED, REJECTED)
func (h *RegistrationHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "ID pendaftaran wajib disertakan", nil)
		return
	}

	var body struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Format JSON salah", err.Error())
		return
	}

	err := h.svc.UpdateRegistrationStatus(r.Context(), id, body.Status)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal memperbarui status", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "Status pendaftaran berhasil diperbarui", nil)
}

// Delete menghapus data pendaftaran
func (h *RegistrationHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "ID pendaftaran wajib disertakan", nil)
		return
	}

	err := h.svc.DeleteRegistration(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal menghapus pendaftaran", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "Pendaftaran berhasil dihapus", nil)
}

func (h *RegistrationHandler) CheckStatus(w http.ResponseWriter, r *http.Request) {
    identifier := r.URL.Query().Get("identifier")
    if identifier == "" {
        utils.ErrorResponse(w, http.StatusBadRequest, "Identifier (Email/Phone) diperlukan", "")
        return
    }

    // Panggil service untuk cari data pendaftaran terakhir
    result, err := h.svc.GetLatestStatus(r.Context(), identifier)
    if err != nil {
        utils.ErrorResponse(w, http.StatusNotFound, "Data pendaftaran tidak ditemukan", err.Error())
        return
    }

    utils.SuccessResponse(w, http.StatusOK, "Status ditemukan", result)
}
// internal/delivery/http/registration_handler.go

// UploadProof menangani pendaftar yang mengunggah ulang bukti bayar (Public)
func (h *RegistrationHandler) UploadProof(w http.ResponseWriter, r *http.Request) {
    // 1. Ambil ID pendaftaran dari URL path
    id := r.PathValue("id")
    if id == "" {
        utils.ErrorResponse(w, http.StatusBadRequest, "ID pendaftaran diperlukan", "")
        return
    }

    // 2. Parse Multipart Form (Maksimal 5MB)
    if err := r.ParseMultipartForm(5 << 20); err != nil {
        utils.ErrorResponse(w, http.StatusBadRequest, "File terlalu besar atau form tidak valid", err.Error())
        return
    }

    // 3. Ambil file "proof" dari form
    file, _, err := r.FormFile("proof")
    if err != nil {
        utils.ErrorResponse(w, http.StatusBadRequest, "Bukti bayar tidak ditemukan dalam request", err.Error())
        return
    }
    defer file.Close()

    // 4. Baca konten file
    fileBody, err := io.ReadAll(file)
    if err != nil {
        utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal membaca file", err.Error())
        return
    }

    // 5. Panggil service untuk proses re-upload (Logic: ganti file R2 & set status PENDING)
    err = h.svc.ReuploadProof(r.Context(), id, fileBody)
    if err != nil {
        utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal memproses unggah ulang", err.Error())
        return
    }

    utils.SuccessResponse(w, http.StatusOK, "Bukti bayar berhasil diperbarui, menunggu verifikasi admin", nil)
}