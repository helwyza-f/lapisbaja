package database

import (
	"errors"
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func RunMigrations(databaseURL string) {
	m, err := migrate.New(
		"file://migrations", // Path ke folder migrations kamu
		databaseURL,
	)
	if err != nil {
		log.Fatal("Gagal inisialisasi migrasi: ", err)
	}

	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		log.Fatal("Gagal menjalankan migrasi up: ", err)
	}

	log.Println("Migrasi database berhasil dijalankan!")
}