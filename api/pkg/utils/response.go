package utils

import (
	"encoding/json"
	"net/http"
)

// BaseResponse adalah struktur standar untuk semua response API PT LBI
type BaseResponse struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   interface{} `json:"error,omitempty"`
}

// SuccessResponse mengirimkan response sukses (200 OK atau 201 Created)
func SuccessResponse(w http.ResponseWriter, code int, message string, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)

	response := BaseResponse{
		Status:  "success",
		Message: message,
		Data:    data,
	}

	json.NewEncoder(w).Encode(response)
}

// ErrorResponse mengirimkan response gagal (400, 401, 404, 500, dll)
func ErrorResponse(w http.ResponseWriter, code int, message string, err interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)

	// Ubah err menjadi string jika bukan nil untuk konsistensi
	var errMsg interface{}
	if err != nil {
		errMsg = err
	}

	response := BaseResponse{
		Status:  "error",
		Message: message,
		Error:   errMsg,
	}

	json.NewEncoder(w).Encode(response)
}