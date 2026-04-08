package repository

import (
	"context"
	"database/sql"

	"github.com/helwiza/lapisbaja-api/internal/model"
	"github.com/jmoiron/sqlx"
)

type AuthRepository struct {
	db *sqlx.DB
}

func NewAuthRepository(db *sqlx.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

func (r *AuthRepository) GetByUsername(ctx context.Context, username string) (*model.User, error) {
	var user model.User
	query := `SELECT id, username, password, full_name, created_at FROM users WHERE username = $1`
	
	err := r.db.GetContext(ctx, &user, query, username)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // User tidak ditemukan
		}
		return nil, err
	}
	return &user, nil
}