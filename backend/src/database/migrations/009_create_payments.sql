-- ============================================================================
-- Migration: 009_create_payments
-- ============================================================================

-- UP
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NOT NULL UNIQUE,
  total_amount DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2) NOT NULL,
  pending_amount DECIMAL(10, 2) NOT NULL,
  payment_status ENUM('pending', 'deposit_paid', 'fully_paid', 'refunded') NOT NULL DEFAULT 'pending',
  payment_method ENUM('online', 'in_person') NULL COMMENT 'NULL until payment is made',
  payment_reference VARCHAR(255) UNIQUE NULL COMMENT 'Payment gateway transaction ID',
  paid_at TIMESTAMP NULL,
  refunded_at TIMESTAMP NULL,
  refund_reason VARCHAR(255) NULL,
  is_retained BOOLEAN DEFAULT FALSE COMMENT 'True if deposit is retained due to policy',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  INDEX idx_appointment_id (appointment_id),
  INDEX idx_payment_status (payment_status),
  INDEX idx_payment_reference (payment_reference),

  CONSTRAINT chk_total_amount_positive CHECK (total_amount >= 0),
  CONSTRAINT chk_deposit_amount_positive CHECK (deposit_amount >= 0),
  CONSTRAINT chk_pending_amount_positive CHECK (pending_amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOWN
-- ============================================================================
DROP TABLE IF EXISTS payments;
