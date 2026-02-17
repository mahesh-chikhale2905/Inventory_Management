# Product Images Directory

This folder contains product images for the inventory management system.

## Image Naming Convention

Please name your images according to the product names in the database:

### Electronics
- `macbook-pro-16.jpg` - MacBook Pro 16"
- `iphone-15-pro.jpg` - iPhone 15 Pro
- `sony-wh-1000xm5.jpg` - Sony WH-1000XM5
- `ultrawide-monitor.jpg` - UltraWide Monitor
- `logitech-mx-master-3s.jpg` - Logitech MX Master 3S

### Furniture
- `ergonomic-desk-chair.jpg` - Ergonomic Desk Chair
- `standing-desk.jpg` - Standing Desk
- `minimalist-bookshelf.jpg` - Minimalist Bookshelf
- `velvet-accent-chair.jpg` - Velvet Accent Chair
- `floor-led-lamp.jpg` - Floor LED Lamp

### Groceries
- `organic-coffee-beans.jpg` - Organic Coffee Beans
- `almond-milk-1l.jpg` - Almond Milk 1L
- `quinoa-1kg.jpg` - Quinoa 1kg
- `dark-chocolate-85.jpg` - Dark Chocolate 85%
- `extra-virgin-olive-oil.jpg` - Extra Virgin Olive Oil

### Fashion
- `essential-white-tee.jpg` - Essential White Tee
- `leather-chelsea-boots.jpg` - Leather Chelsea Boots
- `denim-trucker-jacket.jpg` - Denim Trucker Jacket
- `aviator-sunglasses.jpg` - Aviator Sunglasses
- `canvas-backpack.jpg` - Canvas Backpack

### Stationery
- `dot-grid-notebook.jpg` - Dot Grid Notebook
- `fountain-pen-set.jpg` - Fountain Pen Set
- `desk-organizer.jpg` - Desk Organizer
- `mechanical-pencil.jpg` - Mechanical Pencil
- `acrylic-planner.jpg` - Acrylic Planner

## Image Guidelines

- **Format**: JPG, PNG, or WebP
- **Recommended Size**: 800x800 pixels (square)
- **Max File Size**: 500KB per image
- **Aspect Ratio**: 1:1 (square) preferred

## Usage

After adding images to this folder, update the database by running the SQL script or updating individual product records with the new image URLs:

```
http://localhost:8081/images/products/[filename]
```

Example:
```
http://localhost:8081/images/products/macbook-pro-16.jpg
```
