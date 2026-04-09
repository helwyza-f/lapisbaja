// internal/infra/whatsapp.go
package infra

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"strings"
	"time"
)

type WhatsAppProvider struct {
	apiKey  string
	baseURL string
}

func NewWhatsAppProvider() *WhatsAppProvider {
	return &WhatsAppProvider{
		apiKey:  os.Getenv("FONNTE_API_KEY"),
		baseURL: "https://api.fonnte.com",
	}
}

type FonnteResponse struct {
	Status bool   `json:"status"`
	Reason string `json:"reason"`
	Detail string `json:"detail"`
}

type FonnteValidateResponse struct {
	Status     bool     `json:"status"`
	Registered []string `json:"registered"`
	Reason     string   `json:"reason"`
}

// SendMessage mengirim pesan teks ke target (bisa grup atau personal)
func (w *WhatsAppProvider) SendMessage(target, message string) error {
	apiUrl := fmt.Sprintf("%s/send", w.baseURL)

	// Normalisasi nomor ke format 62
	cleanTarget := strings.ReplaceAll(target, " ", "")
	cleanTarget = strings.ReplaceAll(cleanTarget, "-", "")
	if strings.HasPrefix(cleanTarget, "0") {
		cleanTarget = "62" + cleanTarget[1:]
	}

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	_ = writer.WriteField("target", cleanTarget)
	_ = writer.WriteField("message", message)
	_ = writer.WriteField("countryCode", "62")
	_ = writer.Close()

	req, _ := http.NewRequest("POST", apiUrl, body)
	req.Header.Set("Authorization", w.apiKey)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	var result FonnteResponse
	bodyBytes, _ := io.ReadAll(resp.Body)
	if err := json.Unmarshal(bodyBytes, &result); err != nil {
		return err
	}

	if !result.Status {
		return fmt.Errorf("fonnte: %s", result.Reason)
	}

	return nil
}

// ValidateNumber mengecek apakah nomor memiliki WhatsApp aktif
func (w *WhatsAppProvider) ValidateNumber(target string) (bool, error) {
	apiUrl := fmt.Sprintf("%s/validate", w.baseURL)

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	_ = writer.WriteField("target", target)
	_ = writer.WriteField("countryCode", "62")
	_ = writer.Close()

	req, _ := http.NewRequest("POST", apiUrl, body)
	req.Header.Set("Authorization", w.apiKey)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	var result FonnteValidateResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false, err
	}

	// Status true dan target ada di list 'registered'
	if result.Status && len(result.Registered) > 0 {
		return true, nil
	}

	return false, nil
}