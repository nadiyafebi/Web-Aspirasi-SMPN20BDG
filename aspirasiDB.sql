-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for aspirasi_smpn2
CREATE DATABASE IF NOT EXISTS `aspirasi_smpn2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `aspirasi_smpn2`;

-- Dumping structure for table aspirasi_smpn2.admin
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `kelas` enum('7','8','9') DEFAULT NULL,
  `peran` enum('guru','pimpinan') NOT NULL DEFAULT 'guru',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aspirasi_smpn2.admin: ~4 rows (approximately)
INSERT INTO `admin` (`id`, `username`, `password`, `nama`, `kelas`, `peran`, `created_at`) VALUES
	(1, 'gurubk', '$2b$10$Pz/nqeNCxcwVCQKxMkJQ4ejZiqJVLBbcQsd1rt.RPlJ7E76BIp1fq', 'Guru BK', NULL, 'guru', '2026-10-07 08:37:14'),
	(2, 'bk7', '$2b$10$iohnt9RHPUqml1612YAFyOtGdwxgKXZkPJ0xLpyAE1GF7Na12n/.K', 'Guru BK Kelas 7', '7', 'guru', '2026-11-01 13:58:30'),
	(3, 'bk8', '$2b$10$ol2gnbh13m0C7ebZ6uOUJez.zFoJNDcssxC2TOfFuX8gFecQJnyti', 'Guru BK Kelas 8', '8', 'guru', '2026-11-01 13:58:30'),
	(4, 'bk9', '$2b$10$Zb2ZAAQ0ELD4bR0H9opqAutenEDBT89sAcmJcuJlSiGnrc5WqyXYG', 'Guru BK Kelas 9', '9', 'guru', '2026-11-01 13:58:30');

-- Dumping structure for table aspirasi_smpn2.aspirasi
CREATE TABLE IF NOT EXISTS `aspirasi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kode_tiket` varchar(20) NOT NULL,
  `inisial` varchar(5) NOT NULL,
  `kelas` enum('7','8','9') NOT NULL,
  `kategori` varchar(50) NOT NULL,
  `judul` varchar(150) NOT NULL,
  `isi` text NOT NULL,
  `status` enum('baru','dibaca','diproses','selesai') DEFAULT 'baru',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `kode_hash` varchar(255) NOT NULL,
  `skor_prioritas` int DEFAULT '0',
  `level_prioritas` varchar(50) DEFAULT 'biasa',
  `alasan_prioritas` text,
  `level_guru` enum('biasa','tinggi','mendesak') DEFAULT NULL,
  `dibalas_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode_tiket` (`kode_tiket`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aspirasi_smpn2.aspirasi: ~5 rows (approximately)
INSERT INTO `aspirasi` (`id`, `kode_tiket`, `inisial`, `kelas`, `kategori`, `judul`, `isi`, `status`, `created_at`, `kode_hash`, `skor_prioritas`, `level_prioritas`, `alasan_prioritas`, `level_guru`, `dibalas_at`) VALUES
	(1, 'ASP-C78EB4', 'AR', '8', 'Fasilitas Sekolah', 'Toilet rusak', 'Toilet lantai 2 tidak bisa dipakai', 'diproses', '2026-10-07 08:41:34', '', 0, 'biasa', NULL, NULL, NULL),
	(2, 'ASP-CA5A6552', 'RGDGD', '7', 'Sarana & Lingkungan', 'gdfd', 'dfgd', 'baru', '2026-11-01 12:47:57', '2e7eadd57f387e2a89c08991ebe46e044d749dba8f72031ae77fd49f9ef46737', 0, 'biasa', '', NULL, NULL),
	(3, 'ASP-CFA1FCA9', 'ASDAS', '7', 'Sarana & Lingkungan', 'sda', 'sda', 'baru', '2026-11-01 13:25:45', '4d99a6b404cb19db1b5d7a5337f26eb4899dceb85ed2cc9e84abb626459590f7', 0, 'biasa', '', NULL, NULL),
	(4, 'ASP-F9AA69F8', 'DSA', '7', 'Sarana & Lingkungan', 'ads', 'ads', 'baru', '2026-11-01 13:29:24', 'c4fd94e9534fa96773ee76da67cb257ff451f81588a1c62004da17f05c703010', 0, 'biasa', '', NULL, NULL),
	(5, 'ASP-6CBC7AAE', 'TTYUY', '7', 'Sarana & Lingkungan', 'rrtrtgr', 'rrtrtgr', 'baru', '2026-11-23 07:24:20', '0a240c258f305f0c18dfd5ed5f995b0541ba41aafc0ffabad46ea6e33d281c6f', 0, 'biasa', '', NULL, NULL);

-- Dumping structure for table aspirasi_smpn2.balasan
CREATE TABLE IF NOT EXISTS `balasan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aspirasi_id` int NOT NULL,
  `admin_id` int NOT NULL,
  `isi` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `aspirasi_id` (`aspirasi_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `balasan_ibfk_1` FOREIGN KEY (`aspirasi_id`) REFERENCES `aspirasi` (`id`) ON DELETE CASCADE,
  CONSTRAINT `balasan_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aspirasi_smpn2.balasan: ~2 rows (approximately)
INSERT INTO `balasan` (`id`, `aspirasi_id`, `admin_id`, `isi`, `created_at`) VALUES
	(1, 1, 1, 'Terima kasih, akan kami tindaklanjuti', '2026-10-07 08:48:48'),
	(2, 5, 2, 'gfgf', '2026-11-23 07:28:43');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
