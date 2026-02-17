-- Update product image URLs to use local images
-- Run this script AFTER you've added the images to src/main/resources/static/images/products/

-- Electronics
UPDATE products SET image_url = 'http://localhost:8081/images/products/macbook-pro-16.jpg' WHERE id = 1;
UPDATE products SET image_url = 'http://localhost:8081/images/products/iphone-15-pro.jpg' WHERE id = 2;
UPDATE products SET image_url = 'http://localhost:8081/images/products/sony-wh-1000xm5.jpg' WHERE id = 3;
UPDATE products SET image_url = 'http://localhost:8081/images/products/ultrawide-monitor.jpg' WHERE id = 4;
UPDATE products SET image_url = 'http://localhost:8081/images/products/logitech-mx-master-3s.jpg' WHERE id = 5;

-- Furniture
UPDATE products SET image_url = 'http://localhost:8081/images/products/ergonomic-desk-chair.jpg' WHERE id = 6;
UPDATE products SET image_url = 'http://localhost:8081/images/products/standing-desk.jpg' WHERE id = 7;
UPDATE products SET image_url = 'http://localhost:8081/images/products/minimalist-bookshelf.jpg' WHERE id = 8;
UPDATE products SET image_url = 'http://localhost:8081/images/products/velvet-accent-chair.jpg' WHERE id = 9;
UPDATE products SET image_url = 'http://localhost:8081/images/products/floor-led-lamp.jpg' WHERE id = 10;

-- Groceries
UPDATE products SET image_url = 'http://localhost:8081/images/products/organic-coffee-beans.jpg' WHERE id = 11;
UPDATE products SET image_url = 'http://localhost:8081/images/products/almond-milk-1l.jpg' WHERE id = 12;
UPDATE products SET image_url = 'http://localhost:8081/images/products/quinoa-1kg.jpg' WHERE id = 13;
UPDATE products SET image_url = 'http://localhost:8081/images/products/dark-chocolate-85.jpg' WHERE id = 14;
UPDATE products SET image_url = 'http://localhost:8081/images/products/extra-virgin-olive-oil.jpg' WHERE id = 15;

-- Fashion
UPDATE products SET image_url = 'http://localhost:8081/images/products/essential-white-tee.jpg' WHERE id = 16;
UPDATE products SET image_url = 'http://localhost:8081/images/products/leather-chelsea-boots.jpg' WHERE id = 17;
UPDATE products SET image_url = 'http://localhost:8081/images/products/denim-trucker-jacket.jpg' WHERE id = 18;
UPDATE products SET image_url = 'http://localhost:8081/images/products/aviator-sunglasses.jpg' WHERE id = 19;
UPDATE products SET image_url = 'http://localhost:8081/images/products/canvas-backpack.jpg' WHERE id = 20;

-- Stationery
UPDATE products SET image_url = 'http://localhost:8081/images/products/dot-grid-notebook.jpg' WHERE id = 21;
UPDATE products SET image_url = 'http://localhost:8081/images/products/fountain-pen-set.jpg' WHERE id = 22;
UPDATE products SET image_url = 'http://localhost:8081/images/products/desk-organizer.jpg' WHERE id = 23;
UPDATE products SET image_url = 'http://localhost:8081/images/products/mechanical-pencil.jpg' WHERE id = 24;
UPDATE products SET image_url = 'http://localhost:8081/images/products/acrylic-planner.jpg' WHERE id = 25;
