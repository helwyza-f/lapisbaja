package config

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	AppPort     string
	DBURL       string
	RedisAddr   string
	RedisPass   string
	R2          R2Config
	JWTSecret   string
}

type R2Config struct {
	Endpoint  string
	Bucket    string
	AccessKey string
	SecretKey string
	PublicURL string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("Peringatan: .env tidak ditemukan, menggunakan env system")
	}

	// Memastikan semua data bersih dari spasi liar
	return &Config{
		AppPort:   getEnv("PORT", "8080"),
		DBURL:     fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
			getEnv("DB_USER", ""), getEnv("DB_PASSWORD", ""), getEnv("DB_HOST", "localhost"),
			getEnv("DB_PORT", "5432"), getEnv("DB_NAME", ""), getEnv("DB_SSLMODE", "disable")),
		RedisAddr: getEnv("REDIS_HOST", "localhost:6379"),
		RedisPass: getEnv("REDIS_PASSWORD", ""),
		JWTSecret: getEnv("JWT_SECRET", "secret"),
		R2: R2Config{
			Endpoint:  getEnv("R2_ENDPOINT", ""),
			Bucket:    getEnv("R2_BUCKET_NAME", ""),
			AccessKey: getEnv("R2_ACCESS_KEY_ID", ""),
			SecretKey: getEnv("R2_SECRET_ACCESS_KEY", ""),
			PublicURL: getEnv("R2_PUBLIC_URL", ""),
		},
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return strings.TrimSpace(value)
	}
	return fallback
}