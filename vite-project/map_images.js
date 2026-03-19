import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDbPath = path.join(__dirname, 'src', 'db', 'db.json');
const backendDbPath = path.join(__dirname, 'backend', 'db.json');
const imagesBaseDir = path.join(__dirname, 'public', 'images', 'products');

if (!fs.existsSync(srcDbPath)) {
    console.error('❌ ไม่พบไฟล์ src/db/db.json');
    process.exit(1);
}

const db = JSON.parse(fs.readFileSync(srcDbPath, 'utf8'));

// อ่านโฟลเดอร์รูปภาพทั้งหมด และจับคู่ชื่อไฟล์กับพาธ
const imageMap = {}; 
function scanDir(dir, prefix) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath, prefix + '/' + f);
        } else {
            const ext = path.extname(f);
            const name = path.basename(f, ext);
            const normalized = name.toLowerCase().trim();
            imageMap[normalized] = `/images/products${prefix}/${f}`;
        }
    }
}

console.log('🔍 กำลังสแกนหาไฟล์รูปภาพใน public/images/products...');
scanDir(imagesBaseDir, '');

let matchCount = 0;
db.products = db.products.map(p => {
    const normName = p.name.toLowerCase().trim();
    if (imageMap[normName]) {
        p.image = imageMap[normName];
        p.images = [p.image];
        matchCount++;
    }
    return p;
});

// อัปเดตกลับไปที่ไฟล์ db.json ทั้งใน frontend และ backend
fs.writeFileSync(srcDbPath, JSON.stringify(db, null, 2));
if (fs.existsSync(backendDbPath)) {
    fs.writeFileSync(backendDbPath, JSON.stringify(db, null, 2));
}

console.log(`✅ อัปเดตผูกรูปภาพสินค้าเข้ากับฐานข้อมูลสำเร็จจำนวน ${matchCount} รายการ!`);
