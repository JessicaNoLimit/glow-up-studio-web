-- ============================================================================
-- Migration: 003_create_services
-- ============================================================================

-- UP
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INT NOT NULL COMMENT 'Duration in minutes',
  margin_minutes INT DEFAULT 5 COMMENT 'Margin time in minutes',
  active BOOLEAN DEFAULT TRUE,

  INDEX idx_category (category),
  INDEX idx_active (active),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOWN
-- ============================================================================
DROP TABLE IF EXISTS services;
