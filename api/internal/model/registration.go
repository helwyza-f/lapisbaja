// internal/model/registration.go
package model

import "time"

type Registration struct {
    ID            string    `json:"id" db:"id"`
    StudentID     string    `json:"student_id" db:"student_id"`
    TrainingID    string    `json:"training_id" db:"training_id"`
    TrainingTitle string    `json:"training_title,omitempty" db:"training_title"`
    Name          string    `json:"name" db:"name"`
    Email         string    `json:"email" db:"email"`
    Phone         string    `json:"phone" db:"phone"`
    Agency        string    `json:"agency" db:"agency"`
    ProofURL      string    `json:"proof_url" db:"proof_url"`
    Status        string    `json:"status" db:"status"`
    CreatedAt     time.Time `json:"created_at" db:"created_at"`
    UpdatedAt     time.Time `json:"updated_at" db:"updated_at"` // Tambahkan ini, Boy!
}

type PaginationMeta struct {
    TotalData   int `json:"total_data"`
    TotalPage   int `json:"total_page"`
    CurrentPage int `json:"current_page"`
    Limit       int `json:"limit"`
}

type RegistrationPagedResponse struct {
    Items []Registration `json:"items"`
    Meta  PaginationMeta `json:"meta"`
}