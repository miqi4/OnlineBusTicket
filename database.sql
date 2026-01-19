-- Create Database
CREATE DATABASE IF NOT EXISTS db_bus;
USE db_bus;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer', 'company') NOT NULL DEFAULT 'customer',
    nama_perusahaan VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Cities Table
CREATE TABLE IF NOT EXISTS cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kota VARCHAR(255) NOT NULL UNIQUE
);

-- Create Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    alamat TEXT NOT NULL,
    telepon VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255)
);

-- Create Bus Table
CREATE TABLE IF NOT EXISTS bus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_bus VARCHAR(255) NOT NULL,
    company_id INT,
    origin_city_id INT,
    destination_city_id INT,
    jam VARCHAR(50) NOT NULL,
    estimasi_sampai VARCHAR(50) NOT NULL,
    total_seats INT NOT NULL,
    harga DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (origin_city_id) REFERENCES cities(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- Create Pesanan Table
CREATE TABLE IF NOT EXISTS pesanan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_penumpang VARCHAR(255) NOT NULL,
    bus_id INT,
    kursi INT NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES bus(id) ON DELETE CASCADE
);

-- Insert Dummy Data for Cities
INSERT INTO cities (nama_kota) VALUES 
('Jakarta'),
('Bandung'),
('Surabaya'),
('Yogyakarta'),
('Semarang')
ON DUPLICATE KEY UPDATE nama_kota=nama_kota;

-- Insert Dummy Data for Companies
INSERT INTO companies (nama, alamat, telepon, email, password) VALUES 
('PO Haryanto', 'Jl. Raya Kudus', '08123456789', 'haryanto@mail.com', '12345'),
('Sinar Jaya', 'Jl. Raya Bekasi', '08198765432', 'sinarjaya@mail.com', '12345')
ON DUPLICATE KEY UPDATE nama=nama;

-- Insert Dummy Data for Users
INSERT INTO users (nama, email, password, role, nama_perusahaan) VALUES 
('Admin System', 'admin@mail.com', 'admin123', 'admin', NULL),
('User Customer', 'customer@mail.com', 'user123', 'customer', NULL),
('Admin Haryanto', 'admin@haryanto.com', 'haryanto123', 'company', 'PO Haryanto');
