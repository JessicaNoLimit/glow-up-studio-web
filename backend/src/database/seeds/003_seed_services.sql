-- ============================================================================
-- Seed: 003_seed_services
-- Description: Seed master services for V1 (24 services)
-- ============================================================================

-- UP
INSERT IGNORE INTO services (id, name, category, price, duration_minutes, margin_minutes, active) VALUES
-- Microblading (1-3)
(1, 'Diseño de cejas', 'Microblading', 25.00, 30, 5, true),
(2, 'Microblading pelo a pelo', 'Microblading', 180.00, 120, 5, true),
(3, 'Retoque de microblading', 'Microblading', 60.00, 60, 5, true),

-- Micropigmentación (4-7)
(4, 'Micropigmentación de cejas', 'Micropigmentación', 220.00, 120, 5, true),
(5, 'Micropigmentación de labios', 'Micropigmentación', 250.00, 120, 5, true),
(6, 'Delineado semipermanente', 'Micropigmentación', 180.00, 90, 5, true),
(7, 'Retoque de micropigmentación', 'Micropigmentación', 70.00, 60, 5, true),

-- Pestañas (8-11)
(8, 'Lifting de pestañas', 'Pestañas', 39.00, 45, 5, true),
(9, 'Tinte de pestañas', 'Pestañas', 15.00, 20, 5, true),
(10, 'Extensiones pelo a pelo', 'Pestañas', 65.00, 90, 5, true),
(11, 'Relleno de extensiones', 'Pestañas', 40.00, 60, 5, true),

-- Faciales (12-16)
(12, 'Limpieza facial profunda', 'Faciales', 50.00, 60, 5, true),
(13, 'Tratamiento hidratante', 'Faciales', 55.00, 60, 5, true),
(14, 'Tratamiento iluminador', 'Faciales', 60.00, 60, 5, true),
(15, 'Tratamiento antiedad', 'Faciales', 75.00, 75, 5, true),
(16, 'Tratamiento para piel sensible', 'Faciales', 55.00, 60, 5, true),

-- Corporal (17-20)
(17, 'Maderoterapia', 'Corporal', 45.00, 50, 5, true),
(18, 'Presoterapia', 'Corporal', 30.00, 30, 5, true),
(19, 'Tratamiento reductor', 'Corporal', 60.00, 60, 5, true),
(20, 'Tratamiento reafirmante', 'Corporal', 65.00, 60, 5, true),

-- Manicura (21-24)
(21, 'Manicura básica', 'Manicura', 15.00, 30, 5, true),
(22, 'Manicura semipermanente', 'Manicura', 25.00, 60, 5, true),
(23, 'Refuerzo de uñas', 'Manicura', 30.00, 60, 5, true),
(24, 'Retirada de semipermanente', 'Manicura', 10.00, 20, 5, true);
