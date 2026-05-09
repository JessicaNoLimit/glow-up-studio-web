-- ============================================================================
-- Seed: 004_seed_professionals
-- ============================================================================

-- UP
INSERT IGNORE INTO professionals (id, name, phone, email, calendar_color, default_resource_id, active) VALUES
(1, 'Lucía', NULL, NULL, '#FF6B9D', 6, true),
(2, 'Pablo', NULL, NULL, '#4ECDC4', 1, true),
(3, 'Rosa', NULL, NULL, '#95E1D3', 3, true),
(4, 'Tiago', NULL, NULL, '#F38181', 4, true),
(5, 'Marina', NULL, NULL, '#AA96DA', 5, true),
(6, 'Evelin', NULL, NULL, '#FCBAD3', 7, true);
