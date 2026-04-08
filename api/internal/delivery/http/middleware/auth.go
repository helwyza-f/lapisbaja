package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/helwiza/lapisbaja-api/pkg/utils"
)

// AuthMiddleware menerima secret key untuk memvalidasi token
func AuthMiddleware(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// 1. Ambil header Authorization
			authHeader := r.Header.Get("Authorization")
			
			// 2. Cek apakah formatnya "Bearer <token>"
			if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
				utils.ErrorResponse(w, http.StatusUnauthorized, "Unauthorized", "Token tidak ditemukan atau format salah")
				return
			}

			// 3. Ekstrak token string
			tokenString := strings.TrimPrefix(authHeader, "Bearer ")

			// 4. Parse dan validasi token
			token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
				// Pastikan algoritma signing-nya sesuai (HS256)
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(secret), nil
			})

			// 5. Jika error atau token tidak valid, tendang!
			if err != nil || !token.Valid {
				utils.ErrorResponse(w, http.StatusUnauthorized, "Unauthorized", "Token kedaluwarsa atau tidak valid")
				return
			}

			// 6. (Opsional) Ambil data dari claims jika perlu (misal user_id)
			if claims, ok := token.Claims.(jwt.MapClaims); ok {
				// Masukkan user_id ke dalam context jika handler butuh tahu siapa yang login
				ctx := context.WithValue(r.Context(), "user_id", claims["user_id"])
				r = r.WithContext(ctx)
			}

			// 7. Lolos verifikasi, lanjut ke handler tujuan
			next.ServeHTTP(w, r)
		})
	}
}