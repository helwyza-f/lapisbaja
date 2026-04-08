package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"github.com/helwiza/lapisbaja-api/internal/config"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func main() {
	cfg := config.LoadConfig()
	db, err := sqlx.Connect("postgres", cfg.DBURL)
	if err != nil {
		log.Fatalf("Gagal koneksi DB: %v", err)
	}
	defer db.Close()

	ctx := context.Background()
	fmt.Println("🚀 Memulai proses seeding data...")

	// 1. Seed Trainings (10 Data)
	trainingIDs := []string{}
	for i := 1; i <= 100; i++ {
		var id string
		query := `INSERT INTO trainings (title, description, date_start, price) 
				  VALUES ($1, $2, $3, $4) RETURNING id`
		err := db.QueryRowContext(ctx, query, 
			fmt.Sprintf("Pelatihan Sertifikasi Baja Level %d", i),
			"Deskripsi pelatihan mendalam untuk inspeksi teknis baja.",
			time.Now().AddDate(0, i, 0),
			float64(1000000 * i),
		).Scan(&id)
		
		if err != nil {
			log.Printf("Gagal seed training %d: %v", i, err)
			continue
		}
		trainingIDs = append(trainingIDs, id)
	}
	fmt.Printf("✅ %d Training berhasil dibuat\n", len(trainingIDs))

	// 2. Seed Students & Registrations (1,000 Data)
	// Kita pakai transaksi agar kencang (Bulk Insert)
	tx, _ := db.Beginx()
	count := 10000
	for i := 1; i <= count; i++ {
		studentID := uuid.New().String()
		email := fmt.Sprintf("student%d@example.com", i)
		
		// Insert Student
		_, err := tx.Exec(`INSERT INTO students (id, name, email, phone, agency) 
						   VALUES ($1, $2, $3, $4, $5)`,
			studentID,
			fmt.Sprintf("Student Dummy %d", i),
			email,
			"08123456789",
			"PT Dummy Indonesia",
		)
		if err != nil {
			log.Printf("Gagal seed student %d: %v", i, err)
			continue
		}

		// Insert Registration (Randomize training_id)
		randomTrainingID := trainingIDs[rand.Intn(len(trainingIDs))]
		_, err = tx.Exec(`INSERT INTO registrations (student_id, training_id, status) 
						   VALUES ($1, $2, $3)`,
			studentID,
			randomTrainingID,
			"PENDING",
		)
		if err != nil {
			log.Printf("Gagal seed registration %d: %v", i, err)
			continue
		}

		if i%200 == 0 {
			fmt.Printf("⏳ Terproses %d data...\n", i)
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Fatalf("Gagal commit transaksi: %v", err)
	}

	fmt.Println("✨ Seeding selesai! Database sekarang penuh data dummy.")
}