package main

import (
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
)

func main() {
	// 1. Load Configuration (PORT, DB_URL, R2, REDIS, JWT_SECRET)
	cfg := config.LoadConfig()

	// 2. Database Connection (Postgres)
	db, err := sqlx.Connect("postgres", cfg.DBURL)
	if err != nil {
		log.Fatalf("Gagal koneksi database: %v", err)
	}
	
	// Jalankan migrasi otomatis (UUID Schema, Tables, & Seed Admin)
	database.RunMigrations(cfg.DBURL)
	
	// 3. Initialize Infrastructure Services
	// S3/R2 Service untuk upload bukti bayar
	s3Svc, err := infra.NewS3Service(cfg.R2)
	if err != nil {
		log.Fatalf("Gagal init S3: %v", err)
	}
	
	// Redis Service untuk caching dan notifikasi
	redisSvc := infra.NewRedisService(cfg.RedisAddr, cfg.RedisPass)
	
	// 4. Initialize Repositories
	regRepo := repository.NewRegistrationRepository(db, redisSvc)
	trainRepo := repository.NewTrainingRepository(db, redisSvc)
	authRepo := repository.NewAuthRepository(db) // Repository baru untuk Auth
	
	// 5. Initialize Business Services
	regSvc := service.NewRegistrationService(regRepo, s3Svc, redisSvc)
	trainSvc := service.NewTrainingService(trainRepo)
	// Service baru untuk Auth dengan JWT Secret dari Config
	authSvc := service.NewAuthService(authRepo, cfg.JWTSecret)

	// 6. Initialize HTTP Handlers
	regHandler := delivery.NewRegistrationHandler(regSvc)
	trainHandler := delivery.NewTrainingHandler(trainSvc)
	authHandler := delivery.NewAuthHandler(authSvc) // Handler baru untuk Login

	// 7. Routing Setup
	mux := http.NewServeMux()
	// Inject semua handler dan JWT Secret ke routes
	delivery.MapRoutes(mux, regHandler, trainHandler, authHandler, cfg.JWTSecret)

	// 8. Global Middleware Wrap
	// Mengaktifkan CORS agar Next.js bisa berkomunikasi dengan Backend
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