# 🚀 StockGenius: Smart Inventory Management System

**StockGenius** is a premium, full-stack inventory management solution designed for modern businesses. It combines a powerful Spring Boot backend with a stunning, high-performance React frontend to provide real-time control over your products, categories, and stock levels.

![Dashboard Preview](https://img.shields.io/badge/UI-Premium_Glassmorphism-6366f1)
![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3.x-green)
![React](https://img.shields.io/badge/Frontend-React_18-blue)

---

## ✨ Key Features

### 📊 Intelligence Dashboard
*   **Real-time Metrics**: Track total products, categories, and inventory value at a glance.
*   **Dynamic Analytics**: Visualized sales distribution and category performance using Recharts.
*   **Low Stock Alerts**: Intelligent monitoring with a specialized view for items with a quantity `< 10`.

### 📦 Interactive Inventory Management
*   **Direct Stock Control**: Update stock levels instantly using dedicated Up/Down increment buttons directly in the product list.
*   **Visual Status Badges**: Quick visual cues for "In Stock", "Low Stock", and "Out of Stock" items.
*   **Product Insights**: Deep-dive analysis for individual products, showing sales comparison and inventory dominance.

### 🏷️ Group & Category Organization
*   **Unified Aesthetic**: All category cards follow a cohesive, premium purple-indigo brand identity.
*   **Bulk Management**: Organized views to manage products by their specific groups.

### 🎨 Premium User Experience (UX)
*   **Glassmorphic Design**: Modern transparent cards with backdrop blur and subtle animations.
*   **Minimalist Sidebar**: A clean, light-themed navigation system for effortless multitasking.
*   **Custom Toast Notifications**: Professional, non-intrusive feedback for every action (success/error).

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 + Vite (for lightning-fast HMR)
- **Styling**: Modern CSS3 with Flexbox/Grid and Glassmorphism
- **Icons**: Lucide-React
- **Charts**: Recharts (High-quality data visualization)
- **API Client**: Axios

### **Backend**
- **Framework**: Spring Boot 3.x
- **Persistence**: Spring Data JPA + Hibernate
- **Database**: MySQL
- **Data Handling**: Project Lombok (Auto-generated boilerplate)

---

## 🚀 Getting Started

### Prerequisites
*   **Java 17** or higher
*   **Node.js 18** or higher
*   **MySQL Server**

### 1. Database Configuration
Create a database named `inventory_db` in MySQL and update `src/main/resources/application.properties` with your credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### 2. Run the Backend
```bash
./mvnw spring-boot:run
```

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Recent Updates
*   ✅ **Interactive Stock Control**: Added custom buttons for instant +/- inventory updates.
*   ✅ **Visual Refresh**: Switched to a clean white sidebar and unified category gradients.
*   ✅ **Optimized Logic**: Updated "Low Stock" threshold to strictly less than 10.
*   ✅ **Notifications**: Replaced standard alerts with a custom, slide-in Toast system.

---

Built with ❤️ by [StockGenius Team]
