-- ==========================================================
-- ฐานข้อมูลสำหรับร้าน TechHub (E-Commerce Store)
-- ระบบ: MySQL / MariaDB (AppServ)
-- ==========================================================

-- สร้างตัวแปรสำหรับการตั้งค่าภาษาไทย
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+07:00";
SET NAMES utf8mb4;

-- สร้างและข้ามไปใช้ฐานข้อมูล techhub_db
CREATE DATABASE IF NOT EXISTS techhub_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE techhub_db;

-- --------------------------------------------------------
-- โครงสร้างตาราง: categories
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `count` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `count`) VALUES
(1, 'CPU (ซีพียู)', 'cpu', '💻', 5),
(2, 'GPU (การ์ดจอ)', 'gpu', '🎮', 4),
(3, 'RAM (แรม)', 'ram', '🧠', 3),
(4, 'Storage (SSD/HDD)', 'storage', '💾', 3),
(5, 'Mainboard (เมนบอร์ด)', 'mainboard', '🖥️', 3),
(6, 'Power Supply (PSU)', 'psu', '⚡', 2),
(7, 'Case (เคส)', 'case', '📦', 2),
(8, 'Cooling (ระบายความร้อน)', 'cooling', '❄️', 2);

-- --------------------------------------------------------
-- โครงสร้างตาราง: brands
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `brands` (`id`, `name`, `logo`) VALUES
(1, 'AMD', 'https://placehold.co/120x40/0f0f0f/fff?text=AMD'),
(2, 'Intel', 'https://placehold.co/120x40/0f0f0f/fff?text=Intel'),
(3, 'NVIDIA', 'https://placehold.co/120x40/0f0f0f/fff?text=NVIDIA'),
(4, 'ASUS', 'https://placehold.co/120x40/0f0f0f/fff?text=ASUS'),
(5, 'Corsair', 'https://placehold.co/120x40/0f0f0f/fff?text=Corsair'),
(6, 'MSI', 'https://placehold.co/120x40/0f0f0f/fff?text=MSI'),
(7, 'Gigabyte', 'https://placehold.co/120x40/0f0f0f/fff?text=Gigabyte'),
(8, 'Seasonic', 'https://placehold.co/120x40/0f0f0f/fff?text=Seasonic'),
(9, 'NZXT', 'https://placehold.co/120x40/0f0f0f/fff?text=NZXT'),
(10, 'Lian Li', 'https://placehold.co/120x40/0f0f0f/fff?text=Lian+Li'),
(11, 'Noctua', 'https://placehold.co/120x40/0f0f0f/fff?text=Noctua'),
(12, 'Samsung', 'https://placehold.co/120x40/0f0f0f/fff?text=Samsung'),
(13, 'Western Digital', 'https://placehold.co/120x40/0f0f0f/fff?text=Western+Digital'),
(14, 'Seagate', 'https://placehold.co/120x40/0f0f0f/fff?text=Seagate');

-- --------------------------------------------------------
-- โครงสร้างตาราง: users
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `role`, `avatar`) VALUES
(1, 'สมชาย ใจดี', 'test@customer.com', 'test1234', '081-123-4567', 'customer', 'https://i.pravatar.cc/150?img=11'),
(2, 'แอดมิน ร้านค้า', 'admin@store.com', 'admin1234', '089-999-9999', 'admin', 'https://i.pravatar.cc/150?img=33');

-- --------------------------------------------------------
-- โครงสร้างตาราง: products
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `category` varchar(100) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
  `on_sale` tinyint(1) DEFAULT 0,
  `stock` int(11) DEFAULT 0,
  `sku` varchar(100) DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT 0.0,
  `review_count` int(11) DEFAULT 0,
  `is_featured` tinyint(1) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `images` json DEFAULT NULL,
  `specs` json DEFAULT NULL,
  `description` text,
  `created_at` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`id`, `name`, `slug`, `category`, `brand`, `price`, `sale_price`, `on_sale`, `stock`, `sku`, `rating`, `review_count`, `is_featured`, `image`, `images`, `specs`, `description`, `created_at`) VALUES
(1, 'AMD Ryzen 7 7700X', 'amd-ryzen-7-7700x', 'cpu', 'AMD', 9990.00, 8990.00, 1, 15, 'CPU-AMD-7700X', 4.8, 124, 1, '/images/products/cpu_amd_ryzen7_1773810351582.png', '["/images/products/cpu_amd_ryzen7_1773810351582.png"]', '{"socket": "AM5", "cores": 8, "threads": 16, "base_clock": "4.5 GHz", "boost_clock": "5.4 GHz", "tdp": "105W", "memory_support": "DDR5"}', 'โปรเซสเซอร์ AMD Ryzen 7 7700X สถาปัตยกรรม Zen 4 ซ็อกเก็ต AM5 รองรับ DDR5 8 คอร์ 16 เธรด ประสิทธิภาพสูงสุดสำหรับเกมมิ่งและงานครีเอทีฟ', '2024-01-15'),
(2, 'Intel Core i9-14900K', 'intel-core-i9-14900k', 'cpu', 'Intel', 19990.00, 17490.00, 1, 8, 'CPU-INT-14900K', 4.9, 89, 1, '/images/products/cpu_intel_i9_1773810371481.png', '["/images/products/cpu_intel_i9_1773810371481.png"]', '{"socket": "LGA 1700", "cores": 24, "threads": 32, "base_clock": "3.2 GHz", "boost_clock": "6.0 GHz", "tdp": "125W", "memory_support": "DDR5/DDR4"}', 'โปรเซสเซอร์ Intel Core i9-14900K เจนเนอเรชัน 14 แรงที่สุดในตระกูล สำหรับเกมเมอร์และครีเอเตอร์มืออาชีพ 24 คอร์ 32 เธรด บูสต์ได้สูงสุด 6.0 GHz', '2024-01-10'),
(5, 'NVIDIA GeForce RTX 4090', 'nvidia-geforce-rtx-4090', 'gpu', 'NVIDIA', 69900.00, 64900.00, 1, 3, 'GPU-NV-4090', 4.9, 67, 1, '/images/products/gpu_rtx4090_1773810431159.png', '["/images/products/gpu_rtx4090_1773810431159.png"]', '{"gpu": "AD102", "vram": "24GB GDDR6X", "core_clock": "2520 MHz", "boost_clock": "2640 MHz", "tdp": "450W", "interface": "PCIe 4.0 x16"}', 'การ์ดจอ NVIDIA GeForce RTX 4090 สุดยอดแห่งวงการ 24GB GDDR6X ทรงพลังที่สุดสำหรับเกม 4K และงาน AI', '2024-01-05'),
(9, 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz', 'corsair-vengeance-ddr5-32gb-6000', 'ram', 'Corsair', 4590.00, 3890.00, 1, 55, 'RAM-COR-V32-6000', 4.8, 312, 1, '/images/products/ram_corsair_vengeance_1773810508637.png', '["/images/products/ram_corsair_vengeance_1773810508637.png"]', '{"type": "DDR5", "capacity": "32GB (2x16GB)", "speed": "6000MHz", "cas_latency": "CL30", "voltage": "1.35V", "rgb": false}', 'แรม Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz CL30 ประสิทธิภาพสูงสำหรับเกมมิ่งและงานหนัก', '2024-01-12'),
(12, 'Samsung 990 PRO 2TB NVMe M.2 SSD', 'samsung-990-pro-2tb', 'storage', 'Samsung', 6990.00, 5990.00, 1, 40, 'SSD-SAM-990P-2T', 4.9, 445, 1, '/images/products/ssd_samsung_990pro_1773810560993.png', '["/images/products/ssd_samsung_990pro_1773810560993.png"]', '{"type": "NVMe M.2", "capacity": "2TB", "interface": "PCIe Gen 4x4", "read_speed": "7450 MB/s", "write_speed": "6900 MB/s"}', 'SSD Samsung 990 PRO 2TB NVMe PCIe Gen4 ความเร็วอ่าน 7450 MB/s เขียน 6900 MB/s สำหรับเกมเมอร์และมืออาชีพ', '2024-01-08'),
(15, 'ASUS ROG STRIX Z790-E Gaming WiFi', 'asus-rog-strix-z790-e', 'mainboard', 'ASUS', 16990.00, 14990.00, 1, 6, 'MB-ASUS-Z790E', 4.8, 78, 1, '/images/products/mb_asus_z790_1773810635799.png', '["/images/products/mb_asus_z790_1773810635799.png"]', '{"socket": "LGA 1700", "chipset": "Z790", "form_factor": "ATX", "wifi": "WiFi 6E", "memory": "DDR5 7800MHz+", "m2_slots": 5}', 'เมนบอร์ด ASUS ROG STRIX Z790-E Gaming WiFi สำหรับ Intel Gen 12-14 DDR5 WiFi 6E ฟีเจอร์ครบครัน', '2024-01-18'),
(18, 'Corsair RM1000x 1000W 80+ Gold', 'corsair-rm1000x', 'psu', 'Corsair', 6490.00, 5790.00, 1, 14, 'PSU-COR-RM1000X', 4.9, 234, 1, 'https://placehold.co/600x600/1a1a2e/eab308?text=Corsair+RM1000x%0A1000W+80%2B+Gold&font=Inter', '["https://placehold.co/600x600/1a1a2e/eab308?text=Corsair+RM1000x%0A1000W+80%2B+Gold&font=Inter"]', '{"wattage": "1000W", "fan_size": "135mm", "modular": "Fully Modular", "efficiency": "80+ Gold"}', 'พาวเวอร์ซัพพลาย Corsair RM1000x 1000W 80+ Gold ATX 3.0 Fully Modular เงียบและเสถียร', '2024-01-22'),
(23, 'Corsair iCUE H150i Elite LCD 360mm XT', 'corsair-h150i-elite-lcd-xt', 'cooling', 'Corsair', 9990.00, 8990.00, 1, 4, 'COOL-COR-H150iLCD', 4.7, 90, 1, 'https://placehold.co/600x600/1a1a2e/06b6d4?text=Corsair+H150i%0ALCD+XT+360mm&font=Inter', '["https://placehold.co/600x600/1a1a2e/06b6d4?text=Corsair+H150i%0ALCD+XT+360mm&font=Inter"]', '{"fan_count": "3x 120mm", "type": "AIO Liquid Cooler", "radiator_size": "360mm"}', 'ชุดน้ำ Corsair iCUE H150i Elite LCD 360mm XT หน้าจอ LCD บนหัวปั๊ม พัดลม RGB ระบายความร้อนสูงสุด', '2024-03-08');

-- --------------------------------------------------------
-- โครงสร้างตาราง: promotions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `promotions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL UNIQUE,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_purchase` decimal(10,2) DEFAULT 0.00,
  `max_discount` decimal(10,2) DEFAULT 0.00,
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `promotions` (`id`, `code`, `discount_type`, `discount_value`, `min_purchase`, `max_discount`, `active`) VALUES
(1, 'WELCOME10', 'percentage', 10.00, 2000.00, 1000.00, 1),
(2, 'FREESHIP', 'fixed', 100.00, 500.00, 100.00, 1);

-- --------------------------------------------------------
-- โครงสร้างตาราง: orders
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `shipping_address` json DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) DEFAULT 0.00,
  `shipping_fee` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `orders` (`id`, `user_id`, `status`, `payment_method`, `shipping_address`, `subtotal`, `discount`, `shipping_fee`, `total`, `created_at`) VALUES
('ORD-1707542400000', 1, 'completed', 'promptpay', '{"name": "สมชาย ใจดี", "phone": "081-123-4567", "address": "123 สุขุมวิท", "sub_district": "คลองเตย", "district": "คลองเตย", "province": "กรุงเทพมหานคร", "zipcode": "10110"}', 8990.00, 0.00, 0.00, 8990.00, '2024-02-10 12:20:00');

-- --------------------------------------------------------
-- โครงสร้างตาราง: order_items
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(50) NOT NULL,
  `product_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `price`, `quantity`) VALUES
(1, 'ORD-1707542400000', 1, 8990.00, 1);

-- --------------------------------------------------------
-- โครงสร้างตาราง: reviews
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `body` text,
  `created_at` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `rating`, `title`, `body`, `created_at`) VALUES
(1, 1, 1, 5, 'แรงมาก', 'เล่นเกมลื่นสุดๆ อุณหภูมิไม่สูงอย่างที่คิด', '2024-02-15');

-- สิ้นสุดสคริปต์ Database
