const fs = require('fs');
const path = require('path');

try {
    // Copy db.json from src/db/db.json to backend/db.json
    const srcDb = path.join(__dirname, 'src', 'db', 'db.json');
    const destDb = path.join(__dirname, 'backend', 'db.json');

    if (fs.existsSync(srcDb)) {
        fs.copyFileSync(srcDb, destDb);
        console.log('✅ Successfully restored db.json to backend folder.');
    } else {
        console.log('⚠️ Could not find src/db/db.json');
    }

    // Attempt to delete backend_php
    const phpDir = path.join(__dirname, 'backend_php');
    if (fs.existsSync(phpDir)) {
        fs.rmSync(phpDir, { recursive: true, force: true });
        console.log('✅ Successfully removed backend_php folder.');
    } else {
        console.log('✅ backend_php folder does not exist or already removed.');
    }

    console.log('\n✅ Cleanup complete! Now you can run: cd backend && npm start');
} catch (error) {
    console.error('❌ Error during cleanup:', error.message);
}
