import axios from 'axios';

const API_URL = 'http://localhost:3001';

const categories = [
    { id: "101", name: "เมาส์ (Mouse)", slug: "mouse", icon: "🖱️", count: 5 },
    { id: "102", name: "คีย์บอร์ด (Keyboard)", slug: "keyboard", icon: "⌨️", count: 5 },
    { id: "103", name: "คอมพิวเตอร์ประกอบ (Pre-built PC)", slug: "prebuilt-pc", icon: "🖥️", count: 5 }
];

const products = [
    // Mice
    {
        id: "1011", name: "Logitech G Pro X Superlight", slug: "logitech-g-pro-x-superlight", category: "mouse", brand: "Logitech",
        price: 4990, sale_price: 4590, on_sale: true, stock: 25, sku: "MOU-LOGI-GPX", rating: 4.8, review_count: 512, is_featured: false,
        image: "https://placehold.co/600x600/1a1a2e/f97316?text=G+Pro+X&font=Inter", images: [],
        specs: { sensor: "HERO 25K", weight: "63g", wireless: true, dpi: "25600" },
        description: "เมาส์เกมมิ่งไร้สายน้ำหนักเบาสุดๆ เพียง 63 กรัม เซ็นเซอร์ HERO 25K แม่นยำระดับโปร", created_at: "2024-03-10"
    },
    {
        id: "1012", name: "Razer DeathAdder V3 Pro", slug: "razer-deathadder-v3-pro", category: "mouse", brand: "Razer",
        price: 5490, sale_price: null, on_sale: false, stock: 15, sku: "MOU-RAZ-DAV3", rating: 4.9, review_count: 341, is_featured: false,
        image: "https://placehold.co/600x600/1a1a2e/22c55e?text=DeathAdder+V3&font=Inter", images: [],
        specs: { sensor: "Focus Pro 30K", weight: "63g", wireless: true, dpi: "30000" },
        description: "เมาส์ไร้สายทรง Ergonomic ที่เกมเมอร์ระดับโลกเลือกใช้", created_at: "2024-03-11"
    },
    {
        id: "1013", name: "SteelSeries Aerox 3 Wireless", slug: "steelseries-aerox-3-wireless", category: "mouse", brand: "SteelSeries",
        price: 3690, sale_price: 2990, on_sale: true, stock: 40, sku: "MOU-STE-AER3", rating: 4.5, review_count: 189, is_featured: false,
        image: "https://placehold.co/600x600/1a1a2e/ef4444?text=Aerox+3&font=Inter", images: [],
        specs: { sensor: "TrueMove Air", weight: "66g", wireless: true, dpi: "18000" },
        description: "เมาส์รูระบายอากาศ น้ำหนักเบา กันน้ำและฝุ่น IP54", created_at: "2024-03-12"
    },
    {
        id: "1014", name: "Zowie EC2-CW Wireless", slug: "zowie-ec2-cw", category: "mouse", brand: "Zowie",
        price: 5990, sale_price: null, on_sale: false, stock: 10, sku: "MOU-ZOW-EC2C", rating: 4.7, review_count: 215, is_featured: false,
        image: "https://placehold.co/600x600/1a1a2e/94a3b8?text=Zowie+EC2-CW&font=Inter", images: [],
        specs: { sensor: "3370", weight: "77g", wireless: true, dpi: "3200" },
        description: "เมาส์สำหรับนักแข่ง FPS ทรงเข้ามือที่สุดพร้อมการเชื่อมต่อไร้สายที่เสถียร", created_at: "2024-03-13"
    },
    {
        id: "1015", name: "Glorious Model O Wireless", slug: "glorious-model-o-wireless", category: "mouse", brand: "Glorious",
        price: 3190, sale_price: 2690, on_sale: true, stock: 35, sku: "MOU-GLO-MOW", rating: 4.6, review_count: 432, is_featured: false,
        image: "https://placehold.co/600x600/1a1a2e/d946ef?text=Model+O&font=Inter", images: [],
        specs: { sensor: "BAMF", weight: "69g", wireless: true, dpi: "19000" },
        description: "เมาส์เกมมิ่งสมรรถนะสูง ดีไซน์รังผึ้งยอดฮิต", created_at: "2024-03-14"
    },
    
    // Keyboards
    {
        id: "1021", name: "Keychron Q1 Pro Wireless", slug: "keychron-q1-pro", category: "keyboard", brand: "Keychron",
        price: 7490, sale_price: 6990, on_sale: true, stock: 20, sku: "KB-KEY-Q1P", rating: 4.9, review_count: 142, is_featured: false,
        image: "https://placehold.co/600x600/1a1a2e/64748b?text=Keychron+Q1&font=Inter", images: [],
        specs: { size: "75%", switches: "K Pro Banana", wireless: true, material: "Aluminum" },
        description: "คีย์บอร์ดคัสตอมตัวจบ 75% บอดี้อลูมิเนียม พร้อมการเชื่อมต่อไร้สาย", created_at: "2024-03-10"
    },
    {
        id: "1022", name: "Wooting 60HE", slug: "wooting-60he", category: "keyboard", brand: "Wooting",
        price: 8990, sale_price: null, on_sale: false, stock: 5, sku: "KB-WOO-60HE", rating: 5.0, review_count: 256, is_featured: true,
        image: "https://placehold.co/600x600/1a1a2e/eab308?text=Wooting+60HE&font=Inter", images: [],
        specs: { size: "60%", switches: "Lekker (Magnetic)", wireless: false, feature: "Rapid Trigger" },
        description: "คีย์บอร์ดเกมมิ่งที่เร็วที่สุดในโลกด้วยระบบ Rapid Trigger สวิตช์แม่เหล็ก", created_at: "2024-03-11"
    },
    {
        id: "1023", name: "Razer Huntsman V3 Pro TKL", slug: "razer-huntsman-v3-pro-tkl", category: "keyboard", brand: "Razer",
        price: 8490, sale_price: 7990, on_sale: true, stock: 12, sku: "KB-RAZ-HUNT3", rating: 4.7, review_count: 89, is_featured: false,
        image: "https://placehold.co/600x600/1a1a2e/22c55e?text=Huntsman+V3&font=Inter", images: [],
        specs: { size: "TKL", switches: "Analog Optical", wireless: false, feature: "Rapid Trigger" },
        description: "คีย์บอร์ด Optical Analog พร้อมฟีเจอร์ปรับ Actuation Point ได้ดั่งใจ", created_at: "2024-03-12"
    },
    {
        id: "1024", name: "Corsair K70 MAX RGB", slug: "corsair-k70-max", category: "keyboard", brand: "Corsair",
        price: 7990, sale_price: null, on_sale: false, stock: 18, sku: "KB-COR-K70M", rating: 4.6, review_count: 112, is_featured: false,
        image: "https://placehold.co/600x600/1a1a2e/f97316?text=K70+MAX&font=Inter", images: [],
        specs: { size: "100%", switches: "MGX Magnetic", wireless: false, feature: "Rapid Trigger" },
        description: "คีย์บอร์ดฟูลไซส์สุดพรีเมียม สวิตช์แม่เหล็กปรับระยะกดได้", created_at: "2024-03-13"
    },
    {
        id: "1025", name: "Logitech G915 TKL Lightspeed", slug: "logitech-g915-tkl", category: "keyboard", brand: "Logitech",
        price: 6990, sale_price: 6490, on_sale: true, stock: 22, sku: "KB-LOGI-G915T", rating: 4.8, review_count: 324, is_featured: false,
        image: "https://placehold.co/600x600/1a1a2e/0ea5e9?text=G915+TKL&font=Inter", images: [],
        specs: { size: "TKL", switches: "GL Tactile (Low Profile)", wireless: true, material: "Aluminum" },
        description: "คีย์บอร์ดไร้สาย Low-Profile สวยงาม หรูหรา แบตเตอรี่อึดทน", created_at: "2024-03-14"
    },

    // Pre-built PCs
    {
        id: "1031", name: "TechHub TITAN - Core i9 14900K + RTX 4090", slug: "techhub-titan-i9-4090", category: "prebuilt-pc", brand: "TechHub Custom",
        price: 159900, sale_price: 149900, on_sale: true, stock: 3, sku: "PC-TITAN-001", rating: 5.0, review_count: 12, is_featured: true,
        image: "https://placehold.co/600x600/1a1a2e/ef4444?text=TITAN+i9+4090&font=Inter", images: [],
        specs: { cpu: "Intel Core i9 14900K", gpu: "RTX 4090 24GB", ram: "64GB DDR5 6000MHz", storage: "2TB Gen4 NVMe" },
        description: "สุดยอดคอมพิวเตอร์ประกอบสำหรับสตรีมเมอร์และงาน 3D ระดับท็อป ชิ้นส่วนระดับพรีเมียมทั้งหมด จัดสายไฟสวยงาม เนี๊ยบทุกจุด", created_at: "2024-03-15"
    },
    {
        id: "1032", name: "TechHub PHANTOM - Ryzen 7 7800X3D + RTX 4080 SUPER", slug: "techhub-phantom-r7-4080s", category: "prebuilt-pc", brand: "TechHub Custom",
        price: 99900, sale_price: null, on_sale: false, stock: 5, sku: "PC-PHAN-002", rating: 4.9, review_count: 28, is_featured: true,
        image: "https://placehold.co/600x600/1a1a2e/f97316?text=PHANTOM+R7+4080S&font=Inter", images: [],
        specs: { cpu: "AMD Ryzen 7 7800X3D", gpu: "RTX 4080 SUPER 16GB", ram: "32GB DDR5 6000MHz", storage: "2TB Gen4 NVMe" },
        description: "คอมพิวเตอร์สำหรับการเล่นเกมที่สมบูรณ์แบบที่สุด CPU เกมมิ่งอันดับหนึ่งจับคู่กับ RTX 4080 SUPER เล่นมิดหลอดได้ทุกเกม", created_at: "2024-03-15"
    },
    {
        id: "1033", name: "TechHub STRIKE - Core i5 13400F + RTX 4060", slug: "techhub-strike-i5-4060", category: "prebuilt-pc", brand: "TechHub Custom",
        price: 32900, sale_price: 29900, on_sale: true, stock: 15, sku: "PC-STRIKE-003", rating: 4.7, review_count: 85, is_featured: true,
        image: "https://placehold.co/600x600/1a1a2e/3b82f6?text=STRIKE+i5+4060&font=Inter", images: [],
        specs: { cpu: "Intel Core i5 13400F", gpu: "RTX 4060 8GB", ram: "16GB DDR4 3200MHz", storage: "500GB Gen4 NVMe" },
        description: "คอมประกอบสายสุดคุ้ม รันเกม 1080p แบบจัดเต็มด้วยเทคโนโลยี DLSS 3 ครบจบในตัว", created_at: "2024-03-16"
    },
    {
        id: "1034", name: "TechHub ECLIPSE - Ryzen 5 7600 + RTX 4070 SUPER", slug: "techhub-eclipse-r5-4070s", category: "prebuilt-pc", brand: "TechHub Custom",
        price: 54900, sale_price: 51900, on_sale: true, stock: 8, sku: "PC-ECLIPSE-004", rating: 4.8, review_count: 42, is_featured: true,
        image: "https://placehold.co/600x600/1a1a2e/a855f7?text=ECLIPSE+R5+4070S&font=Inter", images: [],
        specs: { cpu: "AMD Ryzen 5 7600", gpu: "RTX 4070 SUPER 12GB", ram: "32GB DDR5 5200MHz", storage: "1TB Gen4 NVMe" },
        description: "ขุมพลังระดับกลางที่สเปคเกินตัว เล่นเกม 1440p ได้สบายๆ พร้อมสถาปัตยกรรมใหม่ล่าสุด", created_at: "2024-03-16"
    },
    {
        id: "1035", name: "TechHub VANGUARD - Core i7 14700K + RX 7900 XTX", slug: "techhub-vanguard-i7-7900xtx", category: "prebuilt-pc", brand: "TechHub Custom",
        price: 89900, sale_price: null, on_sale: false, stock: 4, sku: "PC-VANG-005", rating: 4.9, review_count: 19, is_featured: true,
        image: "https://placehold.co/600x600/1a1a2e/14b8a6?text=VANGUARD+i7+7900&font=Inter", images: [],
        specs: { cpu: "Intel Core i7 14700K", gpu: "Radeon RX 7900 XTX 24GB", ram: "32GB DDR5 6400MHz", storage: "2TB Gen4 NVMe" },
        description: "เซ็ตคอมตัวเลือกสำหรับคนรักค่ายแดง พลังดิบสูงสุด VRAM ล้นๆ ตัดต่อวิดีโอระดับโปรได้แบบไร้รอยต่อ", created_at: "2024-03-17"
    }
];

const seed = async () => {
    try {
        console.log('Seeding categories...');
        for (const cat of categories) {
            await axios.post(`${API_URL}/categories`, cat);
        }
        
        console.log('Seeding products...');
        for (const p of products) {
            await axios.post(`${API_URL}/products`, p);
        }
        
        console.log('Seed completed successfully!');
    } catch (e) {
        console.error('Error seeding data:', e.message);
    }
};

seed();
