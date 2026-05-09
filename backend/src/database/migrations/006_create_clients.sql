-- ============================================================================
-- Migration: 006_create_clients
-- ============================================================================

-- UP
CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_phone (phone),
  INDEX idx_email (email),
  INDEX idx_full_name (first_name, last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOWN
-- ============================================================================
DROP TABLE IF EXISTS clients;
