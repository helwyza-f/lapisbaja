// File: cmd/server/main.go
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/helwiza/lapisbaja-api/internal/config"
	"github.com/helwiza/lapisbaja-api/internal/database"
	delivery "github.com/helwiza/lapisbaja-api/internal/delivery/http"
	"github.com/helwiza/lapisbaja-api/internal/infra"
	"github.com/helwiza/lapisbaja-api/internal/repository"
	"github.com/helwiza/lapisbaja-api/internal/service"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// ensureAdminUser memastikan user admin ada dengan hash bcrypt yang valid dari Go
func ensureAdminUser(db *sqlx.DB) {
    var exists bool
    err := db.Get(&exists, "SELECT EXISTS(SELECT 1 FROM users WHERE username=$1)", "admin")
    if err != nil {
        log.Printf("⚠️ Gagal cek admin user: %v", err)
        return
    }

    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)

    if !exists {
        query := `INSERT INTO users (username, password, full_name) VALUES ($1, $2, $3)`
        _, err = db.Exec(query, "admin", string(hashedPassword), "Admin Lapis Baja")
        if err == nil {
            fmt.Println("🚀 SEED: Default admin user created (admin/admin123)")
        }
    } else {
        query := `UPDATE users SET password=$1 WHERE username=$2`
        _, err = db.Exec(query, string(hashedPassword), "admin")
        if err == nil {
            fmt.Println("🚀 RE-HASH: Admin password updated by Go Native!")
        }
    }
}

func main() {
    // 1. Load Configuration
    cfg := config.LoadConfig()

    // 2. Database Connection (Postgres)
    db, err := sqlx.Connect("postgres", cfg.DBURL)
    if err != nil {
        log.Fatalf("Gagal koneksi database: %v", err)
    }

    // Jalankan migrasi otomatis
    database.RunMigrations(cfg.DBURL)

    // --- EMERGENCY SEED ---
    ensureAdminUser(db)
    // ----------------------

    // 3. Initialize Infrastructure Services
    s3Svc, err := infra.NewS3Service(cfg.R2)
    if err != nil {
        log.Fatalf("Gagal init S3: %v", err)
    }

    redisSvc := infra.NewRedisService(cfg.RedisAddr, cfg.RedisPass)
    
    // Inisialisasi Fonnte WhatsApp Provider
    waSvc := infra.NewWhatsAppProvider()

    // 4. Initialize Repositories
    regRepo := repository.NewRegistrationRepository(db, redisSvc)
    trainRepo := repository.NewTrainingRepository(db, redisSvc)
    authRepo := repository.NewAuthRepository(db)

    // 5. Initialize Business Services
    // Sekarang regSvc menerima waSvc sebagai provider notifikasi
    regSvc := service.NewRegistrationService(regRepo, s3Svc, redisSvc, waSvc)
    trainSvc := service.NewTrainingService(trainRepo)
    authSvc := service.NewAuthService(authRepo, cfg.JWTSecret)

    // 6. Initialize HTTP Handlers
    regHandler := delivery.NewRegistrationHandler(regSvc)
    trainHandler := delivery.NewTrainingHandler(trainSvc)
    authHandler := delivery.NewAuthHandler(authSvc)

    // 7. Routing Setup
    mux := http.NewServeMux()
    delivery.MapRoutes(mux, regHandler, trainHandler, authHandler, cfg.JWTSecret)

    // 8. Global Middleware Wrap
    handlerStack := delivery.LoadMiddlewares(mux)

    log.Printf("✅ Server PT Lapis Baja berjalan di port %s", cfg.AppPort)

    // 9. Start Server
    server := &http.Server{
        Addr:    ":" + cfg.AppPort,
        Handler: handlerStack,
    }

    if err := server.ListenAndServe(); err != nil {
        log.Fatal(err)
    }
}