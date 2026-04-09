package http

import (
	"encoding/json"
	"net/http"
	"strconv"

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

// Create: Menangani pembuatan program pelatihan baru
func (h *TrainingHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.CreateTrainingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	result, err := h.svc.CreateTraining(r.Context(), req)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create industrial program", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusCreated, "SYSTEM: Training program deployed successfully", result)
}

// List: Mengambil daftar pelatihan dengan dukungan SEARCH & SMART PAGINATION
func (h *TrainingHandler) List(w http.ResponseWriter, r *http.Request) {
	// 1. Extract Query Parameters
	query := r.URL.Query()
	
	search := query.Get("search") // Ambil keyword pencarian
	limit, _ := strconv.Atoi(query.Get("limit"))
	page, _ := strconv.Atoi(query.Get("page"))

	// Default values (Optimize for 3x3 grid or 10-row table)
	if limit <= 0 { limit = 10 } 
	if page <= 0 { page = 1 }

	// 2. Execute Service Logic
	trainings, totalData, err := h.svc.ListTrainings(r.Context(), search, limit, page)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to synchronize registry", err.Error())
		return
	}

	// 3. Calculate Metadata
	totalPage := 0
	if totalData > 0 {
		totalPage = (totalData + limit - 1) / limit
	}

	// 4. Construct Structured Response
	// Dibungkus ke model.TrainingPaginationResponse agar Frontend Admin dapet Meta
	response := model.TrainingPaginationResponse{
		Items: trainings,
		Meta: model.Meta{
			TotalData:   totalData,
			TotalPage:   totalPage,
			CurrentPage: page,
			Limit:       limit,
		},
	}

	utils.SuccessResponse(w, http.StatusOK, "SYSTEM: Registry synchronized successfully", response)
}

// GetByID: Mengambil detail satu program secara mendalam
func (h *TrainingHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id") // Native Go 1.22+ Path Parameter
	if id == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Program ID is mandatory", nil)
		return
	}

	result, err := h.svc.GetTrainingByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Program not found in current sector", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "SYSTEM: Detail retrieved successfully", result)
}

// Update: Menyinkronkan perubahan data pada program yang sudah ada
func (h *TrainingHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Program ID is mandatory", nil)
		return
	}

	var req model.CreateTrainingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid data payload", err.Error())
		return
	}

	result, err := h.svc.UpdateTraining(r.Context(), id, req)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Update sequence failed", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "SYSTEM: Program updated and cache flushed", result)
}

// Delete: Menghapus program dari sistem (Permanent Action)
func (h *TrainingHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Program ID is mandatory", nil)
		return
	}

	err := h.svc.DeleteTraining(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Termination sequence failed", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "SYSTEM: Program purged from registry", nil)
}