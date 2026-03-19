# 🛒 TechHub E-Commerce Web Application

โปรเจกต์เว็บแอปพลิเคชัน E-Commerce ที่พัฒนาด้วย **React 19** ควบคู่กับ **Vite** พร้อมใช้ **TailwindCSS** ในการออกแบบ UI และใช้ **Zustand** จัดการ State ภายในแอปพลิเคชัน 
ระบบ Backend รองรับการใช้งานผ่าน **JSON Server** เป็นหลัก (และมีโครงสร้าง PHP สำรอง)

---

## 🚀 เทคโนโลยีหลัก (Tech Stack)

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **State Management:** Zustand
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios

### Backend / Database
- **Primary:** JSON Server (Mock REST API) จัดการข้อมูลผ่าน `src/db/db.json`
- **Secondary:** โครงสร้างสำหรับรันเซิร์ฟเวอร์ PHP (`backend_php`) 

---

## ⚙️ การติดตั้งและรันโปรเจกต์ (Installation)

**1. ติดตั้ง Dependencies ในโปรเจกต์:**

```bash
npm install
```

**2. รันระบบ Backend (JSON Server):**

ระบบข้อมูลหลักถูกจำลองผ่าน JSON Server ให้เปิด Terminal อันแรกแล้วใช้คำสั่งดังนี้:

```bash
npm run db
```

*(เซิร์ฟเวอร์ฐานข้อมูลจะทำงานที่พอร์ต `3001` โดยอิงจากไฟล์ `src/db/db.json`)*

**3. รันระบบ Frontend (Vite):**

เปิด Terminal แยกอีกหน้าต่างหนึ่ง แล้วใช้คำสั่งดังนี้:

```bash
npm run dev
```

*(หน้าเว็บแอปจะทำงานที่พอร์ตเริ่มต้นของ Vite เช่น `localhost:5173`)*

> **💡 เคล็ดลับ:** คุณสามารถรันทั้ง Frontend (Vite) และ Backend (PHP) พร้อมกันได้ด้วยคำสั่ง `npm run start` (สำหรับสภาพแวดล้อมที่ตั้งค่า PHP ไว้)

---

## 📜 คำสั่ง Scripts ที่มีให้ใช้งาน (NPM Scripts)

- `npm run dev` : รัน Frontend ด้วย Vite
- `npm run db` : รัน JSON Server เสิร์ฟ API จาก `src/db/db.json`
- `npm run api` : รัน PHP Server จากโฟลเดอร์ `backend_php` (หากต้องการใช้งาน PHP Backend)
- `npm run start` : รันคำสั่ง `api` และ `dev` พร้อมกัน
- `npm run build` : สร้าง Production Build
- `npm run lint` : ตรวจสอบโค้ดตระกูล JS/JSX ด้วย ESLint
- `npm run preview` : พรีวิว Production Build ในเครื่อง

---

## 🏗 โครงสร้างระบบ (Architecture Overview)

โปรเจกต์นี้ใช้ **React (Vite)** เป็นหน้าบ้าน (Frontend) โดยสื่อสารกับ RESTful API ซึ่งปัจจุบันตั้งค่าให้ทำงานร่วมกับ **JSON Server** ผ่านพอร์ต `3001` 
และมีโครงสร้างโฟลเดอร์เบื้องต้นดังนี้:

- `src/` : โค้ดส่วน Frontend ทั้งหมด รวมไปถึง Components, Pages, State management (Zustand) และ Services (Axios)
- `src/services/api.js` : ไฟล์ควบคุมเส้นทางการเรียก API (Endpoints) ทั้งหมดของระบบ
- `src/db/db.json` : ไฟล์ฐานข้อมูลหลักของเนื้อหาอิงจาก JSON Server (Products, Categories, Users, ฯลฯ)
- `backend/` และ `backend_php/` : ล็อจิกและโครงสร้างฐานข้อมูล MySQL ของ Backend ฝั่ง PHP 
- `public/images/` : ที่จัดเก็บไฟล์สื่อและระบบรูปภาพสินค้าต่างๆ ในระบบ

---

## 🔌 ฟังก์ชันการทำงานของ API (API Services)

ไฟล์ศูนย์กลางที่เชื่อมต่อระหว่าง Frontend และ Backend คือ `src/services/api.js` มีการใช้ **Axios** เป็นตัวส่ง Request. ฟังก์ชันหลักๆ มีดังนี้:

### 📦 Products (สินค้า)
- `getProducts(params)`: ดึงข้อมูลสินค้าทั้งหมด (สามารถส่ง parameters ไปช่วยทำ Filter ได้)
- `getProductBySlug(slug)`: ค้นหาสินค้าจาก Slug สำหรับเปิดหน้ารายละเอียดสินค้า
- `getProductById(id)`: ค้นหาสินค้าเจาะจงราย ID
- `createProduct(data)`: เพิ่มสินค้าใหม่ลงระบบ (สำหรับฝั่ง Admin)
- `updateProduct(id, data)`: อัปเดตข้อมูลสินค้าเดิม (ฝั่ง Admin)
- `deleteProduct(id)`: ลบสินค้าออกตาม ID (ฝั่ง Admin)

### 🏷️ Categories (หมวดหมู่สินค้า)
- `getCategories()`: ดึงรายการหมวดหมู่สินค้าทั้งหมด
- `getCategoryBySlug(slug)`: ดึงข้อมูลของหมวดหมู่นั้นๆ 
- `createCategory(data)`, `updateCategory(id, data)`, `deleteCategory(id)`: ฟังก์ชันเพื่อจัดการหมวดหมู่

### 🏢 Brands (แบรนด์สินค้า)
- `getBrands()`: ดึงรายชื่อแบรนด์ทั้งหมดมาแสดง

### 👤 Users (ผู้ใช้งานระบบ)
- `getUsers()`: ดึงข้อมูลผู้ใช้งานทั้งหมด (ฝั่ง Admin)
- `getUserByEmail(email)`: ดึงข้อมูลผู้ใช้งานอิงตามอีเมล 
- `createUser(data)`: สมัครสมาชิกและสร้างผู้ใช้งานใหม่
- `updateUser(id, data)`: แก้ไขโปรไฟล์ผู้ใช้งาน

### 🛒 Orders (ระบบออเดอร์/การสั่งซื้อ)
- `getOrders(params)`: ดึงออเดอร์ทั้งหมด หรือค้นหาตามเงื่อนไข
- `getOrderById(id)`: ดึงรายละเอียดบิล/ใบเสร็จ
- `createOrder(data)`: ประมวลผลและสร้างคำสั่งซื้อสลิป
- `updateOrder(id, data)`: อัปเดตสถานะออเดอร์

### ⭐ Reviews (รีวิวสินค้า) และ 🎟️ Promotions (โค้ดส่วนลด)
- `getReviews(params)`: โหลดคอมเม้นต์รีวิวของสินค้า
- `createReview(data)`: สร้างคอมเม้นต์รีวิวใหม่
- `getPromotions()`: ดึงรายการโค้ดส่วนลดในระบบ
- `getPromotionByCode(code)`: ตรวจสอบความถูกต้องโค้ดส่วนลด

---

## 🛠️ Utility Scripts (ฟังก์ชันจัดการฐานข้อมูล / ไฟล์ภาพ)

ในโฟลเดอร์หลักของโปรเจกต์มีไฟล์สคริปต์เสริมเพื่อช่วยดูแลรักษาระบบฐานข้อมูล `db.json` ให้มีความถูกต้องอยู่เสมอ:

- **`map_images.js`** : สแกนโฟลเดอร์ภาพทั้งหมดใน `public/images/products` นำไปแปลงเป็นรูปแบบพิมพ์เล็ก แล้วดึงไปเทียบและอัปเดตฟิลด์ภาพอัตโนมัติใน `db.json` หากตรงกับชื่อสินค้า (รันด้วย `node map_images.js`)
- **`seed.js`** : เตรียมและนำเข้าตารางข้อมูลหลักที่สำคัญ (Dummy Data) ลงไปใน `db.json` และ PHP
- **`update_images.js`** : ควบคุมการปรับแต่งหรือรีมูฟภาพในฐานข้อมูล
- **`fix.js` / `clean_db.js` / `restore.js`** : ไฟล์อรรถประโยชน์สำหรับซ่อมโครงสร้าง JSON ที่อาจพัง, ลบขยะตกค้าง หรือรีสโตร์ระบบข้อมูลเดิมกลับมาตั้งแต่ต้น

---
*Developed & Maintained by the TechHub Team.*
