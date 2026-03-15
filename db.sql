CREATE DATABASE IF NOT EXISTS pos_db;
USE pos_db;

-- Drop tables if they exist to allow clean initialization (order matters due to foreign keys)
DROP TABLE IF EXISTS detail_transaksi;
DROP TABLE IF EXISTS transaksi;
DROP TABLE IF EXISTS detail_pembelian;
DROP TABLE IF EXISTS pembelian;
DROP TABLE IF EXISTS barang;
DROP TABLE IF EXISTS supplier;
DROP TABLE IF EXISTS kategori;
DROP TABLE IF EXISTS users;

-- Table for users/cashiers
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'kasir') DEFAULT 'kasir',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for categories
CREATE TABLE kategori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for suppliers
CREATE TABLE supplier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_supplier VARCHAR(150) NOT NULL,
    kontak VARCHAR(100),
    alamat TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for items (barang)
CREATE TABLE barang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barcode VARCHAR(100) UNIQUE,
    nama_barang VARCHAR(255) NOT NULL,
    kategori_id INT,
    supplier_id INT,
    harga_beli DECIMAL(15, 2) NOT NULL DEFAULT 0,
    harga_jual DECIMAL(15, 2) NOT NULL,
    stok INT NOT NULL DEFAULT 0,
    satuan VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES supplier(id) ON DELETE SET NULL
);

-- Table for purchases (pembelian)
CREATE TABLE pembelian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    supplier_id INT,
    total_harga DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES supplier(id) ON DELETE SET NULL
);

-- Table for purchase details (detail_pembelian)
CREATE TABLE detail_pembelian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pembelian_id INT,
    barang_id INT,
    harga_beli DECIMAL(15, 2) NOT NULL,
    qty INT NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (pembelian_id) REFERENCES pembelian(id) ON DELETE CASCADE,
    FOREIGN KEY (barang_id) REFERENCES barang(id) ON DELETE CASCADE
);

-- Table for sales transactions (transaksi)
CREATE TABLE transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_harga DECIMAL(15, 2) NOT NULL,
    bayar DECIMAL(15, 2) NOT NULL,
    kembalian DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table for sales transaction details (detail_transaksi)
CREATE TABLE detail_transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaksi_id INT,
    barang_id INT,
    harga_jual DECIMAL(15, 2) NOT NULL,
    qty INT NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (transaksi_id) REFERENCES transaksi(id) ON DELETE CASCADE,
    FOREIGN KEY (barang_id) REFERENCES barang(id) ON DELETE CASCADE
);

-- Initial data
INSERT IGNORE INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin');
