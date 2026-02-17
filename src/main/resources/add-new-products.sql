-- Insert 25 additional products (IDs 26-50)
INSERT INTO products (id, name, description, price, stock_quantity, units_sold, image_url, category_id, created_at, updated_at) VALUES 
-- Electronics (10 new products)
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

-- Furniture (5 new products)
(36, 'L-Shaped Gaming Desk', 'Carbon fiber texture, cable management, LED strip', 399.00, 12, 38, 'https://images.unsplash.com/photo-1593062096033-9a26b09da705', 2, NOW(), NOW()),
(37, 'Leather Office Chair', 'Executive high-back, memory foam, black', 350.00, 18, 45, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8', 2, NOW(), NOW()),
(38, 'Monitor Stand Dual', 'Adjustable height, holds 2x 32" monitors', 120.00, 25, 82, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', 2, NOW(), NOW()),
(39, 'Filing Cabinet 3-Drawer', 'Steel construction, lockable, white finish', 199.00, 14, 28, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2', 2, NOW(), NOW()),
(40, 'Footrest Ergonomic', 'Adjustable angle, massage surface, non-slip', 45.00, 40, 120, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', 2, NOW(), NOW()),

-- Groceries (5 new products)
(41, 'Organic Green Tea', 'Japanese matcha powder, ceremonial grade 100g', 24.00, 70, 280, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9', 3, NOW(), NOW()),
(42, 'Protein Powder Vanilla', 'Whey isolate, 2kg, grass-fed, no additives', 49.99, 35, 165, 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f', 3, NOW(), NOW()),
(43, 'Chia Seeds 500g', 'Organic, omega-3 rich, black chia seeds', 8.99, 90, 380, 'https://images.unsplash.com/photo-1610832958506-aa56368176cf', 3, NOW(), NOW()),
(44, 'Honey Raw Organic', 'Wildflower honey, unfiltered, 500g jar', 16.50, 55, 220, 'https://images.unsplash.com/photo-1587049352846-4a222e784720', 3, NOW(), NOW()),
(45, 'Coconut Oil Virgin', 'Cold-pressed, organic, 500ml glass jar', 14.00, 65, 295, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5', 3, NOW(), NOW()),

-- Fashion (3 new products)
(46, 'Wool Blend Sweater', 'Crew neck, charcoal gray, merino wool', 78.00, 45, 185, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27', 4, NOW(), NOW()),
(47, 'Running Shoes Pro', 'Lightweight mesh, cushioned sole, black/white', 135.00, 60, 240, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 4, NOW(), NOW()),
(48, 'Leather Belt Classic', 'Full-grain leather, brass buckle, brown', 42.00, 75, 310, 'https://images.unsplash.com/photo-1624222247344-550fb60583bb', 4, NOW(), NOW()),

-- Stationery (2 new products)
(49, 'Highlighter Set 6-Pack', 'Pastel colors, chisel tip, no bleed', 12.00, 100, 520, 'https://images.unsplash.com/photo-1587467512961-120760940315', 5, NOW(), NOW()),
(50, 'Sticky Notes Bundle', 'Assorted sizes and colors, 12 pads total', 18.00, 85, 445, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4', 5, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  price = VALUES(price),
  stock_quantity = VALUES(stock_quantity),
  units_sold = VALUES(units_sold),
  image_url = VALUES(image_url),
  updated_at = NOW();
