package http

import (
	"encoding/json"
	"net/http"

	"github.com/helwiza/lapisbaja-api/internal/model"
	"github.com/helwiza/lapisbaja-api/internal/service"
	"github.com/helwiza/lapisbaja-api/pkg/utils"
)

type TrainingHandler struct {
	svc *service.TrainingService
}

func NewTrainingHandler(svc *service.TrainingService) *TrainingHandler {
	return &TrainingHandler{svc: svc}
}

// Create membuat data training baru
func (h *TrainingHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.CreateTrainingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	result, err := h.svc.CreateTraining(r.Context(), req)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal membuat training", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusCreated, "Training berhasil dibuat", result)
}

// List mengambil semua data training (Cache-enabled via Repo)
func (h *TrainingHandler) List(w http.ResponseWriter, r *http.Request) {
	trainings, err := h.svc.ListTrainings(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal mengambil data", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "Berhasil mengambil daftar training", trainings)
}

// GetByID mengambil detail satu training berdasarkan UUID di URL
func (h *TrainingHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id") // Fitur native Go 1.22+
	if id == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "ID training wajib disertakan", nil)
		return
	}

	result, err := h.svc.GetTrainingByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Training tidak ditemukan", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "Berhasil mengambil detail training", result)
}

// Update mengubah data training yang sudah ada
func (h *TrainingHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "ID training wajib disertakan", nil)
		return
	}

	var req model.CreateTrainingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	result, err := h.svc.UpdateTraining(r.Context(), id, req)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal memperbarui training", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "Training berhasil diperbarui", result)
}

// Delete menghapus data training
func (h *TrainingHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "ID training wajib disertakan", nil)
		return
	}

	err := h.svc.DeleteTraining(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Gagal menghapus training", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "Training berhasil dihapus", nil)
}