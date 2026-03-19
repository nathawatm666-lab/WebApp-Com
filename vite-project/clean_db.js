const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'db', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Standardized Categories
const standardCategories = [
    { "id": "1", "name": "CPU (ซีพียู)", "slug": "cpu", "icon": "💻" },
    { "id": "2", "name": "GPU (การ์ดจอ)", "slug": "gpu", "icon": "🎮" },
    { "id": "3", "name": "RAM (แรม)", "slug": "ram", "icon": "🧠" },
    { "id": "4", "name": "Storage (SSD/HDD)", "slug": "storage", "icon": "💾" },
    { "id": "5", "name": "Mainboard (เมนบอร์ด)", "slug": "mainboard", "icon": "🖥️" },
    { "id": "6", "name": "Power Supply (PSU)", "slug": "psu", "icon": "⚡" },
    { "id": "7", "name": "Case (เคส)", "slug": "case", "icon": "📦" },
    { "id": "8", "name": "Cooling (ระบายความร้อน)", "slug": "cooling", "icon": "❄️" },
    { "id": "100", "name": "คอมพิวเตอร์ประกอบ", "slug": "prebuilt-pc", "icon": "🖥️" },
    { "id": "101", "name": "เมาส์", "slug": "mouse", "icon": "🖱️" },
    { "id": "102", "name": "คีย์บอร์ด", "slug": "keyboard", "icon": "⌨️" },
    { "id": "103", "name": "จอมอนิเตอร์", "slug": "monitor", "icon": "🖥️" }
];

// Mapping old category values to new slugs
const categoryMapping = {
    'cpu': 'cpu',
    'gpu': 'gpu',
    'ram': 'ram',
    'storage': 'storage',
    'mainboard': 'mainboard',
    'psu': 'psu',
    'case': 'case',
    'cooling': 'cooling',
    'mouse': 'mouse',
    'keyboard': 'keyboard',
    'prebuilt-pc': 'prebuilt-pc',
    'คอมพิวเตอร์ประกอบ': 'prebuilt-pc',
    'จอมอนิเตอร์': 'monitor',
    'Mouse': 'mouse',
    'Keyboard': 'keyboard'
};

// 2. Update Products
db.products = db.products.map(p => {
    // Standardize category slug
    const oldCat = p.category;
    p.category = categoryMapping[oldCat] || oldCat;

    // Ensure numeric fields are numbers
    p.price = Number(p.price);
    if (p.sale_price !== null) p.sale_price = Number(p.sale_price);
    p.stock = Number(p.stock);
    
    // Ensure id is a string
    p.id = String(p.id);

    return p;
});

// 3. Update Categories in DB
db.categories = standardCategories;

// 4. Save
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Database cleaned and categories standardized!');
