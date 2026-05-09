-- ============================================================================
-- Seed: 006_update_services_to_spanish
-- Description: Update existing services names and categories to Spanish
-- ============================================================================

-- UP
UPDATE services
SET
  name = CASE id
    WHEN 1 THEN 'Diseño de cejas'
    WHEN 2 THEN 'Microblading pelo a pelo'
    WHEN 3 THEN 'Retoque de microblading'
    WHEN 4 THEN 'Micropigmentación de cejas'
    WHEN 5 THEN 'Micropigmentación de labios'
    WHEN 6 THEN 'Delineado semipermanente'
    WHEN 7 THEN 'Retoque de micropigmentación'
    WHEN 8 THEN 'Lifting de pestañas'
    WHEN 9 THEN 'Tinte de pestañas'
    WHEN 10 THEN 'Extensiones pelo a pelo'
    WHEN 11 THEN 'Relleno de extensiones'
    WHEN 12 THEN 'Limpieza facial profunda'
    WHEN 13 THEN 'Tratamiento hidratante'
    WHEN 14 THEN 'Tratamiento iluminador'
    WHEN 15 THEN 'Tratamiento antiedad'
    WHEN 16 THEN 'Tratamiento para piel sensible'
    WHEN 17 THEN 'Maderoterapia'
    WHEN 18 THEN 'Presoterapia'
    WHEN 19 THEN 'Tratamiento reductor'
    WHEN 20 THEN 'Tratamiento reafirmante'
    WHEN 21 THEN 'Manicura básica'
    WHEN 22 THEN 'Manicura semipermanente'
    WHEN 23 THEN 'Refuerzo de uñas'
    WHEN 24 THEN 'Retirada de semipermanente'
    ELSE name
  END,
  category = CASE id
    WHEN 1 THEN 'Microblading'
    WHEN 2 THEN 'Microblading'
    WHEN 3 THEN 'Microblading'
    WHEN 4 THEN 'Micropigmentación'
    WHEN 5 THEN 'Micropigmentación'
    WHEN 6 THEN 'Micropigmentación'
    WHEN 7 THEN 'Micropigmentación'
    WHEN 8 THEN 'Pestañas'
    WHEN 9 THEN 'Pestañas'
    WHEN 10 THEN 'Pestañas'
    WHEN 11 THEN 'Pestañas'
    WHEN 12 THEN 'Faciales'
    WHEN 13 THEN 'Faciales'
    WHEN 14 THEN 'Faciales'
    WHEN 15 THEN 'Faciales'
    WHEN 16 THEN 'Faciales'
    WHEN 17 THEN 'Corporal'
    WHEN 18 THEN 'Corporal'
    WHEN 19 THEN 'Corporal'
    WHEN 20 THEN 'Corporal'
    WHEN 21 THEN 'Manicura'
    WHEN 22 THEN 'Manicura'
    WHEN 23 THEN 'Manicura'
    WHEN 24 THEN 'Manicura'
    ELSE category
  END
WHERE id IN (
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
);
