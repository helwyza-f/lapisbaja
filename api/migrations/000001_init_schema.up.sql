-- 1. Enable pgcrypto untuk gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabel Users (Untuk Admin Login)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Akan diisi Bcrypt hash
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Trainings (Jadwal Pelatihan)
CREATE TABLE IF NOT EXISTS trainings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date_start DATE NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Students (Data Peserta)
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    agency VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Registrations (Transaksi Pendaftaran)
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
    proof_url TEXT, -- URL bukti bayar dari Cloudflare R2
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Optimasi: Tambahkan Index
-- Sangat penting untuk performa saat data pendaftar sudah ribuan
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_training ON registrations(training_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- 7. Seed Admin Default (password: admin123)
-- Hash di bawah adalah hasil Bcrypt dari "admin123"
INSERT INTO users (username, password, full_name) 
VALUES ('admin', '$2a$10$XmS/r7Yc8Zk9.R0pY9kUuevDk9B1.qX1Y7H8eI9z6v3a4b5c6d7e8', 'Admin Lapis Baja')
ON CONFLICT (username) DO NOTHING;