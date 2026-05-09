-- ============================================================================
-- Migration: 002_create_resources
-- ============================================================================

-- UP
CREATE TABLE resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('booth', 'table', 'machine') NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  notes TEXT,

  INDEX idx_type (type),
  INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOWN
-- ============================================================================
DROP TABLE IF EXISTS resources;
