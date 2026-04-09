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

// Tambahkan ini Boy, untuk response yang rapi
type TrainingPaginationResponse struct {
	Items []Training `json:"items"`
	Meta  Meta       `json:"meta"`
}

type Meta struct {
	TotalData   int `json:"total_data"`
	TotalPage   int `json:"total_page"`
	CurrentPage int `json:"current_page"`
	Limit       int `json:"limit"`
}