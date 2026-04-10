package http

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"strings"

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

// Register: Public pendaftaran
func (h *RegistrationHandler) Register(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(5 << 20); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "File terlalu besar atau form tidak valid", err.Error())
		return
	}

	var fileBody []byte
	file, _, err := r.FormFile("proof")
	if err == nil {
		defer file.Close()
		fileBody, _ = io.ReadAll(file)
	}

	reg := model.Registration{
		TrainingID: r.FormValue("training_id"),
		Name:       r.FormValue("name"),
		Email:      strings.TrimSpace(r.FormValue("email")),
		Phone:      strings.TrimSpace(r.FormValue("phone")),
		Agency:     r.FormValue("agency"),
	}

	result, err := h.svc.RegisterStudent(r.Context(), reg, fileBody)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal melakukan pendaftaran", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusCreated, "Pendaftaran berhasil dikirim", result)
}

// CheckStatus: Public status check (FIXED WITH SANITIZATION)
func (h *RegistrationHandler) CheckStatus(w http.ResponseWriter, r *http.Request) {
	identifier := r.URL.Query().Get("identifier")
	
	// SAKTI: Hapus %20 atau spasi hantu yang bikin SQL zonk
	identifier = strings.TrimSpace(identifier)

	if identifier == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Identifier (Email/Phone) diperlukan", "")
		return
	}

	result, err := h.svc.GetLatestStatus(r.Context(), identifier)
	if err != nil {
		// Jika tidak ketemu, kita kasih 404 tapi message-nya user friendly
		utils.ErrorResponse(w, http.StatusNotFound, "Data pendaftaran tidak ditemukan. Pastikan Email/Nomor WA sudah benar.", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "Status ditemukan", result)
}

// List: Admin pendaftaran list
func (h *RegistrationHandler) List(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	
	page, _ := strconv.Atoi(query.Get("page"))
	if page <= 0 { page = 1 }

	limit, _ := strconv.Atoi(query.Get("limit"))
	if limit <= 0 { limit = 10 }

	search := query.Get("search")
	status := query.Get("status")
	trainingID := query.Get("training_id")
	date := query.Get("date")

	results, err := h.svc.ListRegistrations(r.Context(), page, limit, search, status, trainingID, date)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal sinkronisasi daftar pendaftaran", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "SYSTEM: Registry data synchronized successfully", results)
}

// GetByID: Admin detail
func (h *RegistrationHandler) GetByID(w http.ResponseWriter, r *http.Request) {
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

// UpdateStatus: Admin action
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

// Delete: Admin delete
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

// UploadProof: Public re-upload
func (h *RegistrationHandler) UploadProof(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "ID pendaftaran diperlukan", "")
		return
	}

	if err := r.ParseMultipartForm(5 << 20); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "File terlalu besar atau form tidak valid", err.Error())
		return
	}

	file, _, err := r.FormFile("proof")
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Bukti bayar tidak ditemukan dalam request", err.Error())
		return
	}
	defer file.Close()

	fileBody, err := io.ReadAll(file)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal membaca file", err.Error())
		return
	}

	err = h.svc.ReuploadProof(r.Context(), id, fileBody)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal memproses unggah ulang", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "Bukti bayar berhasil diperbarui, menunggu verifikasi admin", nil)
}