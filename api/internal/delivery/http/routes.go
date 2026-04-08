package http

import (
	"net/http"

	"github.com/helwiza/lapisbaja-api/internal/delivery/http/middleware"
	"github.com/helwiza/lapisbaja-api/pkg/utils"
)

func MapRoutes(
	mux *http.ServeMux,
	regHandler *RegistrationHandler,
	trainHandler *TrainingHandler,
	authHandler *AuthHandler,
	jwtSecret string,
) {
	// --- 1. Global/Public Routes ---
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		utils.SuccessResponse(w, http.StatusOK, "Server is healthy", nil)
	})

	// Auth & Pendaftaran (Public)
	mux.HandleFunc("POST /api/v1/login", authHandler.Login)
	mux.HandleFunc("POST /api/v1/register", regHandler.Register)
	mux.HandleFunc("GET /api/v1/trainings", trainHandler.List)
	mux.HandleFunc("GET /api/v1/trainings/{id}", trainHandler.GetByID)

	// --- 2. Admin Protected Routes (Sub-routing) ---
	// Kita buat middleware satpamnya dulu
	auth := middleware.AuthMiddleware(jwtSecret)

	// Route Admin: Training Management
	mux.Handle("POST /api/v1/trainings", auth(http.HandlerFunc(trainHandler.Create)))
	mux.Handle("PUT /api/v1/trainings/{id}", auth(http.HandlerFunc(trainHandler.Update)))
	mux.Handle("DELETE /api/v1/trainings/{id}", auth(http.HandlerFunc(trainHandler.Delete)))

	// Route Admin: Registration Management
	mux.Handle("GET /api/v1/registrations", auth(http.HandlerFunc(regHandler.List)))
	mux.Handle("GET /api/v1/registrations/{id}", auth(http.HandlerFunc(regHandler.GetByID)))
	mux.Handle("PATCH /api/v1/registrations/{id}/status", auth(http.HandlerFunc(regHandler.UpdateStatus)))
	mux.Handle("DELETE /api/v1/registrations/{id}", auth(http.HandlerFunc(regHandler.Delete)))
}

// LoadMiddlewares untuk CORS & Logging Global
func LoadMiddlewares(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Setup CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		// Handle Preflight
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}