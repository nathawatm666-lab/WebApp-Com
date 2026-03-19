const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'db', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const imageFiles = [
    { id: "1", file: "cpu_amd_ryzen7_1773810351582.png" },
    { id: "2", file: "cpu_intel_i9_1773810371481.png" },
    { id: "3", file: "cpu_amd_ryzen5_1773810387402.png" },
    { id: "4", file: "cpu_intel_i5_1773810402435.png" },
    { id: "5", file: "gpu_rtx4090_1773810431159.png" },
    { id: "6", file: "gpu_rtx4070s_1773810449684.png" },
    { id: "7", file: "gpu_rx7900xtx_1773810467079.png" },
    { id: "8", file: "gpu_rtx4060ti_1773810483148.png" },
    { id: "9", file: "ram_corsair_vengeance_1773810508637.png" },
    { id: "10", file: "ram_corsair_dominator_1773810525401.png" },
    { id: "11", file: "ram_gskill_trident_1773810543439.png" },
    { id: "12", file: "ssd_samsung_990pro_1773810560993.png" },
    { id: "13", file: "ssd_wd_sn850x_1773810599990.png" },
    { id: "14", file: "hdd_seagate_barracuda_1773810617713.png" },
    { id: "15", file: "mb_asus_z790_1773810635799.png" },
    { id: "16", file: "mb_msi_b650_1773810652721.png" },
    { id: "17", file: "mb_asus_b650m_1773810680610.png" }
];

db.products = db.products.map(p => {
    const imgMapping = imageFiles.find(img => img.id === String(p.id));
    if (imgMapping) {
        p.image = `/images/products/${imgMapping.file}`;
        p.images = [p.image];
    }
    return p;
});

// For other products without local images, keep placeholders or assign something better.
// The user said "Product data is not complete".
// Let's add more products if needed or just fix the ones we have.

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Updated db.json with local image paths!');
