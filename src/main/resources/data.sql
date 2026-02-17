-- 1. Sync Categories (Ensures IDs are clean and sequential)
SET FOREIGN_KEY_CHECKS = 0;
INSERT INTO categories (id, name, description) VALUES 
(1, 'Electronics', 'Latest gadgets, premium laptops, and smart devices'),
(2, 'Furniture', 'Modern ergonomic home and office furniture'),
(3, 'Groceries', 'Fresh organic food, beverages, and daily essentials'),
(4, 'Fashion', 'Trendy clothing, sustainable fabrics, and accessories'),
(5, 'Stationery', 'Premium notebooks, office supplies, and desk decor'),
(6, 'Food', 'All kind of food'),
(7, 'Hardware', 'All kind of hardware'),
(8, 'Medicinal', 'all medicines'),
(9, 'Fruits', 'all type of fruits')
ON DUPLICATE KEY UPDATE id = VALUES(id);
SET FOREIGN_KEY_CHECKS = 1;

-- 2. Link existing products to new Category IDs if they were on high IDs
UPDATE products SET category_id = 6 WHERE category_id = 50;
UPDATE products SET category_id = 7 WHERE category_id = 51;
UPDATE products SET category_id = 8 WHERE category_id = 52;
UPDATE products SET category_id = 9 WHERE category_id = 53;

-- 3. Reset Auto Increment to the next logical number
ALTER TABLE categories AUTO_INCREMENT = 10;

-- 2. Insert 50 Professional Products
INSERT INTO products (id, name, description, price, stock_quantity, units_sold, image_url, category_id, created_at, updated_at) VALUES 
-- Electronics (Category 1) - 15 products
(1, 'MacBook Pro 16"', 'M3 Max chip, 32GB RAM, 1TB SSD Space Gray', 2499.99, 12, 45, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', 1, NOW(), NOW()),
(2, 'iPhone 15 Pro', 'Natural Titanium, 256GB, Super Retina XDR', 1099.00, 25, 120, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba3f21', 1, NOW(), NOW()),
(3, 'Sony WH-1000XM5', 'Wireless Noise Canceling Headphones, Silver', 398.00, 15, 85, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 1, NOW(), NOW()),
(4, 'UltraWide Monitor', '34-inch curved gaming monitor 144Hz', 550.00, 8, 30, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', 1, NOW(), NOW()),
(5, 'Logitech MX Master 3S', 'Performance wireless mouse, bolt receiver', 99.00, 40, 200, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', 1, NOW(), NOW()),
(26, 'iPad Pro 12.9"', 'M2 chip, 256GB, Space Gray with Magic Keyboard', 1299.00, 18, 75, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0', 1, NOW(), NOW()),
(27, 'Samsung Galaxy S24 Ultra', '512GB Titanium Black, S Pen included', 1199.00, 22, 95, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c', 1, NOW(), NOW()),
(28, 'Apple Watch Ultra 2', 'Titanium case, Ocean Band, GPS + Cellular', 799.00, 30, 140, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d', 1, NOW(), NOW()),
(29, 'AirPods Pro 2nd Gen', 'Active Noise Cancellation, USB-C charging', 249.00, 60, 320, 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7', 1, NOW(), NOW()),
(30, 'Mechanical Keyboard RGB', 'Cherry MX switches, aluminum frame, wireless', 159.00, 35, 180, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3', 1, NOW(), NOW()),
(31, 'Webcam 4K Pro', 'Auto-focus, HDR, dual microphones, USB-C', 129.00, 45, 210, 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d', 1, NOW(), NOW()),
(32, 'Portable SSD 2TB', 'Thunderbolt 3, 2800MB/s read speed', 299.00, 28, 95, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b', 1, NOW(), NOW()),
(33, 'Wireless Charger 3-in-1', 'Fast charging for iPhone, Watch, AirPods', 89.00, 55, 275, 'https://images.unsplash.com/photo-1591290619762-c588f8ab7e8b', 1, NOW(), NOW()),
(34, 'Smart Speaker HomePod', 'Spatial audio, Siri integration, mesh fabric', 299.00, 20, 68, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1', 1, NOW(), NOW()),
(35, 'Gaming Headset Pro', '7.1 surround sound, RGB lighting, detachable mic', 179.00, 32, 145, 'https://images.unsplash.com/photo-1599669454699-248893623440', 1, NOW(), NOW()),

-- Furniture (Category 2) - 10 products
(6, 'Ergonomic Desk Chair', 'Breathable mesh with adjustable lumbar support', 280.00, 20, 55, 'https://images.unsplash.com/photo-1505797149-43b00fe3ee2e', 2, NOW(), NOW()),
(7, 'Standing Desk', 'Electric height adjustable bamboo desk', 450.00, 10, 25, 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c', 2, NOW(), NOW()),
(8, 'Minimalist Bookshelf', 'Oak wood 5-tier open shelving unit', 180.00, 15, 40, 'https://images.unsplash.com/photo-1594620302200-9a762244a156', 2, NOW(), NOW()),
(9, 'Velvet Accent Chair', 'Mid-century modern navy blue lounge chair', 320.00, 5, 12, 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c', 2, NOW(), NOW()),
(10, 'Floor LED Lamp', 'Dimmable smart lamp with warm white light', 85.00, 30, 95, 'https://images.unsplash.com/photo-1507473885765-e6ed028f8815', 2, NOW(), NOW()),
(36, 'L-Shaped Gaming Desk', 'Carbon fiber texture, cable management, LED strip', 399.00, 12, 38, 'https://images.unsplash.com/photo-1593062096033-9a26b09da705', 2, NOW(), NOW()),
(37, 'Leather Office Chair', 'Executive high-back, memory foam, black', 350.00, 18, 45, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8', 2, NOW(), NOW()),
(38, 'Monitor Stand Dual', 'Adjustable height, holds 2x 32" monitors', 120.00, 25, 82, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', 2, NOW(), NOW()),
(39, 'Filing Cabinet 3-Drawer', 'Steel construction, lockable, white finish', 199.00, 14, 28, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2', 2, NOW(), NOW()),
(40, 'Footrest Ergonomic', 'Adjustable angle, massage surface, non-slip', 45.00, 40, 120, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', 2, NOW(), NOW()),

-- Groceries (Category 3) - 10 products
(11, 'Organic Coffee Beans', 'Medium roast Arabica, fair trade certified', 18.50, 50, 350, 'https://images.unsplash.com/photo-1559056191-7417f245237b', 3, NOW(), NOW()),
(12, 'Almond Milk 1L', 'Unsweetened, fortified with Vitamin D and E', 3.99, 100, 500, 'https://images.unsplash.com/photo-1563636619-e91000935bfa', 3, NOW(), NOW()),
(13, 'Quinoa 1kg', 'Organic white quinoa, gluten-free superfood', 12.00, 60, 180, 'https://images.unsplash.com/photo-1586201375761-83865001e31c', 3, NOW(), NOW()),
(14, 'Dark Chocolate 85%', 'Artisan crafted cocoa with sea salt', 5.50, 80, 420, 'https://images.unsplash.com/photo-1548907040-4baa42d10919', 3, NOW(), NOW()),
(15, 'Extra Virgin Olive Oil', 'Cold-pressed 500ml, harvested from Italy', 22.00, 45, 150, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5', 3, NOW(), NOW()),
(41, 'Organic Green Tea', 'Japanese matcha powder, ceremonial grade 100g', 24.00, 70, 280, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9', 3, NOW(), NOW()),
(42, 'Protein Powder Vanilla', 'Whey isolate, 2kg, grass-fed, no additives', 49.99, 35, 165, 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f', 3, NOW(), NOW()),
(43, 'Chia Seeds 500g', 'Organic, omega-3 rich, black chia seeds', 8.99, 90, 380, 'https://images.unsplash.com/photo-1610832958506-aa56368176cf', 3, NOW(), NOW()),
(44, 'Honey Raw Organic', 'Wildflower honey, unfiltered, 500g jar', 16.50, 55, 220, 'https://images.unsplash.com/photo-1587049352846-4a222e784720', 3, NOW(), NOW()),
(45, 'Coconut Oil Virgin', 'Cold-pressed, organic, 500ml glass jar', 14.00, 65, 295, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5', 3, NOW(), NOW()),

-- Fashion (Category 4) - 8 products
(16, 'Essential White Tee', '100% organic cotton, slim fit, mid-weight', 25.00, 150, 800, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 4, NOW(), NOW()),
(17, 'Leather Chelsea Boots', 'Handcrafted genuine leather, durable sole', 145.00, 20, 65, 'https://images.unsplash.com/photo-1635467472270-4370af0f196e', 4, NOW(), NOW()),
(18, 'Denim Trucker Jacket', 'Classic indigo blue, vintage wash finish', 89.00, 35, 120, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf027', 4, NOW(), NOW()),
(19, 'Aviator Sunglasses', 'Polarized lenses with gold metal frame', 120.00, 40, 95, 'https://images.unsplash.com/photo-1511499767390-9ef21bf8114a', 4, NOW(), NOW()),
(20, 'Canvas Backpack', 'Water-resistant travel pack with laptop sleeve', 65.00, 50, 210, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 4, NOW(), NOW()),
(46, 'Wool Blend Sweater', 'Crew neck, charcoal gray, merino wool', 78.00, 45, 185, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27', 4, NOW(), NOW()),
(47, 'Running Shoes Pro', 'Lightweight mesh, cushioned sole, black/white', 135.00, 60, 240, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 4, NOW(), NOW()),
(48, 'Leather Belt Classic', 'Full-grain leather, brass buckle, brown', 42.00, 75, 310, 'https://images.unsplash.com/photo-1624222247344-550fb60583bb', 4, NOW(), NOW()),

-- Stationery (Category 5) - 7 products
(21, 'Dot Grid Notebook', 'A5 hardcover, 160gsm bleed-proof paper', 22.00, 75, 450, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57', 5, NOW(), NOW()),
(22, 'Fountain Pen Set', 'Calligraphy nibs with premium black ink', 45.00, 30, 85, 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a', 5, NOW(), NOW()),
(23, 'Desk Organizer', 'Aluminum minimalist storage for stationery', 35.00, 40, 110, 'https://images.unsplash.com/photo-151978914362d-c24734892c23', 5, NOW(), NOW()),
(24, 'Mechanical Pencil', '0.5mm lead, brushed steel body, ergonomic', 15.00, 120, 600, 'http://localhost:8081/images/products/mechanical_pencil.jpg', 5, NOW(), NOW()),
(25, 'Acrylic Planner', 'Dry-erase weekly wall calendar, clear', 28.00, 25, 75, 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b', 5, NOW(), NOW()),
(49, 'Highlighter Set 6-Pack', 'Pastel colors, chisel tip, no bleed', 12.00, 100, 520, 'https://images.unsplash.com/photo-1587467512961-120760940315', 5, NOW(), NOW()),
(50, 'Sticky Notes Bundle', 'Assorted sizes and colors, 12 pads total', 18.00, 85, 445, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4', 5, NOW(), NOW());
