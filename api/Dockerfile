# STAGE 1: Build binary
FROM golang:1.22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git

WORKDIR /app

# Copy go mod dan sum dulu buat caching layer dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy seluruh source code
COPY . .

# Build aplikasi jadi binary static (tanpa ketergantungan library luar)
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/server/main.go

# STAGE 2: Runner (Final Image)
FROM alpine:latest

# Install ca-certificates buat koneksi HTTPS (penting buat S3/R2)
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

# Copy binary dari stage builder
COPY --from=builder /app/main .
# Copy .env jika perlu (tapi lebih baik via docker-compose environment)
# COPY --from=builder /app/.env . 

# Ekspos port aplikasi
EXPOSE 8080

# Jalankan aplikasi
CMD ["./main"]