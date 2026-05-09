-- ============================================================================
-- Seed: 005_seed_professional_service_compat
-- ============================================================================

-- UP
INSERT IGNORE INTO professional_service_compat (professional_id, service_id) VALUES
-- Lucía: Microblading + Manicure
(1, 1), (1, 2), (1, 3),
(1, 21), (1, 22), (1, 23), (1, 24),

-- Pablo: Micropigmentation
(2, 4), (2, 5), (2, 6), (2, 7),

-- Rosa: Eyelashes
(3, 8), (3, 9), (3, 10), (3, 11),

-- Tiago: Facials + Body
(4, 12), (4, 13), (4, 14), (4, 15), (4, 16),
(4, 17), (4, 18), (4, 19), (4, 20),

-- Marina: Facials + Body
(5, 12), (5, 13), (5, 14), (5, 15), (5, 16),
(5, 17), (5, 18), (5, 19), (5, 20),

-- Evelin: Manicure
(6, 21), (6, 22), (6, 23), (6, 24);
