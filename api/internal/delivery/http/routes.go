// File: api/internal/delivery/http/routes.go
package http

import (
	"log"
	"net/http"
	"time"

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
    // Health check untuk monitoring Mac Mini
    mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
        utils.SuccessResponse(w, http.StatusOK, "Server is healthy", nil)
    })

    // Auth & Pendaftaran Awal
    mux.HandleFunc("POST /api/v1/login", authHandler.Login)
    mux.HandleFunc("POST /api/v1/register", regHandler.Register)
    
    // Fitur Tracking & Re-upload Bukti (Public)
    // Pendaftar bisa akses ini menggunakan identifier (Email/WA) tanpa login admin
    mux.HandleFunc("GET /api/v1/register/check", regHandler.CheckStatus)
    mux.HandleFunc("PATCH /api/v1/registrations/{id}/proof", regHandler.UploadProof) 
    
    // Informasi Pelatihan
    mux.HandleFunc("GET /api/v1/trainings", trainHandler.List)
    mux.HandleFunc("GET /api/v1/trainings/{id}", trainHandler.GetByID)

    // --- 2. Admin Protected Routes ---
    // Menggunakan middleware JWT untuk membatasi akses ke dashboard admin
    auth := middleware.AuthMiddleware(jwtSecret)

    // Route Admin: Management Pelatihan
    mux.Handle("POST /api/v1/trainings", auth(http.HandlerFunc(trainHandler.Create)))
    mux.Handle("PUT /api/v1/trainings/{id}", auth(http.HandlerFunc(trainHandler.Update)))
    mux.Handle("DELETE /api/v1/trainings/{id}", auth(http.HandlerFunc(trainHandler.Delete)))

    // Route Admin: Management Pendaftaran & Verifikasi Status
    // PATCH /status di sini khusus digunakan Admin untuk Approve atau Reject
    mux.Handle("GET /api/v1/registrations", auth(http.HandlerFunc(regHandler.List)))
    mux.Handle("GET /api/v1/registrations/{id}", auth(http.HandlerFunc(regHandler.GetByID)))
    mux.Handle("PATCH /api/v1/registrations/{id}/status", auth(http.HandlerFunc(regHandler.UpdateStatus)))
    mux.Handle("DELETE /api/v1/registrations/{id}", auth(http.HandlerFunc(regHandler.Delete)))
}

// LoadMiddlewares untuk CORS & Logging Global
func LoadMiddlewares(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()

        // 1. Setup CORS
        // Mengizinkan frontend Next.js untuk berinteraksi dengan API Go
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
        w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

        // 2. Handle Preflight Request
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        // 3. Industrial Logging
        // Memantau durasi request untuk memastikan performa Mac Mini tetap optimal
        log.Printf("📥 [%s] %s | From: %s | Duration: %v", 
            r.Method, 
            r.URL.Path, 
            r.RemoteAddr,
            time.Since(start),
        )

        next.ServeHTTP(w, r)
    })
}