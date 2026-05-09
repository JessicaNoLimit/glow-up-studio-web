-- ============================================================================
-- Migration: 004_create_professionals
-- ============================================================================

-- UP
CREATE TABLE professionals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  calendar_color CHAR(7) COMMENT 'Hex color for calendar, e.g. #FF5733',
  default_resource_id INT,
  active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (default_resource_id) REFERENCES resources(id) ON DELETE SET NULL,
  INDEX idx_active (active),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOWN
-- ============================================================================
DROP TABLE IF EXISTS professionals;
