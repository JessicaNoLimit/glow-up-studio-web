-- ============================================================================
-- Migration: 008_create_appointment_blocks
-- ============================================================================

-- UP
CREATE TABLE appointment_blocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NOT NULL,
  service_id INT NOT NULL,
  professional_id INT NOT NULL,
  resource_id INT NOT NULL,
  start_at DATETIME NOT NULL COMMENT 'Block start datetime',
  end_at DATETIME NOT NULL COMMENT 'Block end datetime',
  duration_minutes INT NOT NULL COMMENT 'Duration in minutes',
  sort_order INT NOT NULL COMMENT 'Order within appointment (1, 2, 3...)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
  FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE RESTRICT,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE RESTRICT,

  INDEX idx_appointment_id (appointment_id),
  INDEX idx_professional_id (professional_id),
  INDEX idx_resource_id (resource_id),
  INDEX idx_professional_time (professional_id, start_at, end_at),
  INDEX idx_resource_time (resource_id, start_at, end_at),

  CONSTRAINT chk_block_end_after_start CHECK (end_at > start_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOWN
-- ============================================================================
DROP TABLE IF EXISTS appointment_blocks;
