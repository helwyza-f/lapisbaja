package http

import (
	"encoding/json"
	"net/http"

	"github.com/helwiza/lapisbaja-api/internal/model"
	"github.com/helwiza/lapisbaja-api/internal/service"
	"github.com/helwiza/lapisbaja-api/pkg/utils"
)

type AuthHandler struct {
	svc *service.AuthService
}

func NewAuthHandler(svc *service.AuthService) *AuthHandler {
	return &AuthHandler{svc: svc}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req model.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	result, err := h.svc.Login(r.Context(), req)
	if err != nil {
		utils.ErrorResponse(w, http.StatusUnauthorized, "Login gagal", err.Error())
		return
	}

	utils.SuccessResponse(w, http.StatusOK, "Login berhasil", result)
}