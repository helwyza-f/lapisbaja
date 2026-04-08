package model

import "time"

type User struct {
	ID        string    `json:"id" db:"id"`
	Username  string    `json:"username" db:"username"`
	Password  string    `json:"-" db:"password"` // Password tidak boleh keluar di JSON
	FullName  string    `json:"full_name" db:"full_name"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}