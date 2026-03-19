const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'db', 'db.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Change prebuilt-pc products to 'คอมพิวเตอร์ประกอบ'
data.products = data.products.map(p => {
    if (p.category === 'prebuilt-pc') {
        p.category = 'คอมพิวเตอร์ประกอบ';
    }
    return p;
});

// 2. Remove duplicate categories 100, 101, 102
data.categories = data.categories.filter(c => !['100', '101', '102'].includes(c.id));

// 3. Add 5 Monitor products
const monitors = [
    {
        id: "2011", name: "LG UltraGear 27GP850-B", slug: "lg-ultragear-27gp850", category: "จอมอนิเตอร์", brand: "LG",
        price: 12900, sale_price: 11500, on_sale: true, stock: 10, sku: "MON-LG-27GP850", rating: 4.8, review_count: 150, is_featured: true,
        image: "https://placehold.co/600x600/1a1a2e/3b82f6?text=LG+27GP850&font=Inter", images: [],
        specs: { size: "27 นิ้ว", panel: "Nano IPS", resolution: "2560x1440", refresh_rate: "165Hz" },
        description: "จอมอนิเตอร์สำหรับเกมเมอร์ อัตรารีเฟรช 165Hz ตอบสนอง 1ms สีสันสวยงามสมจริง", created_at: "2024-03-18"
    },
    {
        id: "2012", name: "Samsung Odyssey G7", slug: "samsung-odyssey-g7", category: "จอมอนิเตอร์", brand: "Samsung",
        price: 18900, sale_price: 17900, on_sale: true, stock: 5, sku: "MON-SAM-G7", rating: 4.7, review_count: 90, is_featured: false,
        image: "https://placehold.co/600x600/1a1a2e/ef4444?text=Odyssey+G7&font=Inter", images: [],
        specs: { size: "27 นิ้ว", panel: "VA Curved", resolution: "2560x1440", refresh_rate: "240Hz" },
        description: "จอโค้ง 1000R สุดยอดประสบการณ์การเล่นเกม รีเฟรชเรทถึง 240Hz", created_at: "2024-03-18"
    },
    {
        id: "2013", name: "AOC 24G2SP", slug: "aoc-24g2sp", category: "จอมอนิเตอร์", brand: "AOC",
        price: 4990, sale_price: 4500, on_sale: true, stock: 30, sku: "MON-AOC-24G2SP", rating: 4.6, review_count: 210, is_featured: false,
        image: "https://placehold.co/600x600/1a1a2e/10b981?text=AOC+24G2SP&font=Inter", images: [],
        specs: { size: "24 นิ้ว", panel: "IPS", resolution: "1920x1080", refresh_rate: "165Hz" },
        description: "จอเกมมิ่งราคาคุ้มค่า ภาพคมชัด รีเฟรชเรท 165Hz", created_at: "2024-03-18"
    },
    {
        id: "2014", name: "ASUS ROG Swift PG279QM", slug: "asus-rog-pg279qm", category: "จอมอนิเตอร์", brand: "ASUS",
        price: 26900, sale_price: null, on_sale: false, stock: 2, sku: "MON-ASUS-PG279QM", rating: 4.9, review_count: 55, is_featured: true,
        image: "https://placehold.co/600x600/1a1a2e/f59e0b?text=ROG+Swift&font=Inter", images: [],
        specs: { size: "27 นิ้ว", panel: "Fast IPS", resolution: "2560x1440", refresh_rate: "240Hz" },
        description: "ที่สุดของจอมอนิเตอร์ระดับพรีเมียม ตอบสนองเร็วที่สุด สีสันแม่นยำที่สุด", created_at: "2024-03-18"
    },
    {
        id: "2015", name: "Dell S2722DGM", slug: "dell-s2722dgm", category: "จอมอนิเตอร์", brand: "Dell",
        price: 8900, sale_price: null, on_sale: false, stock: 15, sku: "MON-DELL-S2722", rating: 4.5, review_count: 120, is_featured: false,
        image: "https://placehold.co/600x600/1a1a2e/6366f1?text=Dell+S2722&font=Inter", images: [],
        specs: { size: "27 นิ้ว", panel: "VA Curved", resolution: "2560x1440", refresh_rate: "165Hz" },
        description: "จอโค้งดีไซน์สวย เหมาะสำหรับดูหนังและเล่นเกม", created_at: "2024-03-18"
    }
];

data.products.push(...monitors);

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Database updated successfully');
