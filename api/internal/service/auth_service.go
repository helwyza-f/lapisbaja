package service

import (
	"context"
	"errors"
	"log"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/helwiza/lapisbaja-api/internal/model"
	"github.com/helwiza/lapisbaja-api/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo      *repository.AuthRepository
	jwtSecret string
}

func NewAuthService(repo *repository.AuthRepository, secret string) *AuthService {
	return &AuthService{repo: repo, jwtSecret: secret}
}

func (s *AuthService) Login(ctx context.Context, req model.LoginRequest) (*model.LoginResponse, error) {
	
	log.Printf("DEBUG: Login attempt for username: [%s]", req.Username)
    log.Printf("DEBUG: Password length: %d", len(req.Password))
	// 1. Cari user
	inputUser := strings.TrimSpace(req.Username)
    inputPass := strings.TrimSpace(req.Password)

    user, err := s.repo.GetByUsername(ctx, inputUser)
    if err != nil || user == nil {
        return nil, errors.New("username atau password salah")
    }

    // Compare hasil trim
    err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(inputPass))
    if err != nil {
        log.Printf("DEBUG: Bcrypt match failed: %v", err)
        return nil, errors.New("username atau password salah")
    }

	// 3. Generate JWT Token 
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  user.ID,
		"username": user.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // Berlaku 24 jam
	})

	tokenString, err := token.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return nil, err
	}

	return &model.LoginResponse{
		Token: tokenString,
		User:  *user,
	}, nil
}