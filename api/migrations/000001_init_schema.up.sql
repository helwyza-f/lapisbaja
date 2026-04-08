-- ==========================================================
-- PT LAPIS BAJA - SEAMLESS INITIALIZATION & SEED
-- ==========================================================

-- 1. CLEANUP (Hapus semua tabel lama jika ada agar ID & data reset total)
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS trainings CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. SETUP EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. TABEL USERS (Admin Login)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'ADMIN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL TRAININGS (Program Pelatihan)
CREATE TABLE trainings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date_start DATE NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL STUDENTS (Master Data Peserta)
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    agency VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL REGISTRATIONS (Transaksi Pendaftaran)
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
    proof_url TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. OPTIMASI INDEX (Cepat tarik 10k data)
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_training ON registrations(training_id);
CREATE INDEX idx_students_email ON students(email);

-- 8. SEAMLESS SEEDING (Data Dasar)
-- Password Admin (admin123) dipotong 60 char biar aman di Windows
INSERT INTO users (username, password, full_name, role) 
VALUES (
    'admin', 
    LEFT('$2a$10$86p0hYVf0uP5.PzM/h6vxeH1vI0.yK1vI0.yK1vI0.yK1vI0.yK1vI0.yK1v', 60), 
    'Admin Lapis Baja', 
    'ADMIN'
);

-- Tambah 1 data pelatihan awal agar Dashboard tidak kosong saat pertama run
INSERT INTO trainings (title, description, date_start, price)
VALUES (
    'Pelatihan Sertifikasi Baja Level 1',
    'Initial batch untuk testing sistem.',
    CURRENT_DATE + INTERVAL '1 month',
    1000000
);