-- ============================================================================
-- Migration: 007_create_appointments
-- ============================================================================

-- UP
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  total_duration_minutes INT NOT NULL COMMENT 'Total duration in minutes',
  status ENUM('pending_payment', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending_payment',
  origin ENUM('web', 'phone', 'in_person', 'admin') NOT NULL,
  notes TEXT,
  expires_at TIMESTAMP NULL COMMENT 'Only for pending_payment, 15 min to pay',
  cancellation_reason VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT,
  INDEX idx_client_id (client_id),
  INDEX idx_start_at (start_at),
  INDEX idx_status (status),
  INDEX idx_origin (origin),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOWN
-- ============================================================================
DROP TABLE IF EXISTS appointments;
