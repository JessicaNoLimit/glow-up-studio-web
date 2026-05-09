-- ============================================================================
-- Migration: 005_create_professional_service_compat
-- ============================================================================

-- UP
CREATE TABLE professional_service_compat (
  professional_id INT NOT NULL,
  service_id INT NOT NULL,
  PRIMARY KEY (professional_id, service_id),

  FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,

  INDEX idx_professional_id (professional_id),
  INDEX idx_service_id (service_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOWN
-- ============================================================================
DROP TABLE IF EXISTS professional_service_compat;
