-- 1. Disable foreign key checks to allow primary key updates
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Update Categories and their related products to restore sequence (6, 7, 8, 9)
-- Fix Category 50 -> 6 (Food)
UPDATE products SET category_id = 6 WHERE category_id = 50;
UPDATE categories SET id = 6 WHERE id = 50;

-- Fix Category 51 -> 7 (Hardware)
UPDATE products SET category_id = 7 WHERE category_id = 51;
UPDATE categories SET id = 7 WHERE id = 51;

-- Fix Category 52 -> 8 (Medicinal)
UPDATE products SET category_id = 8 WHERE category_id = 52;
UPDATE categories SET id = 8 WHERE id = 52;

-- Fix Category 53 -> 9 (Fruits)
UPDATE products SET category_id = 9 WHERE category_id = 53;
UPDATE categories SET id = 9 WHERE id = 53;

-- 3. Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- 4. Reset the auto-increment counter to the next logical number (10)
ALTER TABLE categories AUTO_INCREMENT = 10;

-- 5. Verify the results
SELECT * FROM categories ORDER BY id;
