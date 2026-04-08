package model

import "time"

type Training struct {
	ID          string    `json:"id" db:"id"`
	Title       string    `json:"title" db:"title"`
	Description string    `json:"description" db:"description"`
	DateStart   time.Time `json:"date_start" db:"date_start"`
	Price       float64   `json:"price" db:"price"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
}

type CreateTrainingRequest struct {
	Title       string  `json:"title" validate:"required"`
	Description string  `json:"description"`
	DateStart   string  `json:"date_start" validate:"required"` // Format: YYYY-MM-DD
	Price       float64 `json:"price" validate:"required"`
}