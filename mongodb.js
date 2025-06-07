const { MongoClient } = require('mongodb');
const colors = require('./UI/colors/colors');
const config = require("./config.js");
require('dotenv').config();

// --- BẮT ĐẦU PHẦN DEBUG ---

// In ra giá trị của mongodbUri ngay khi đọc từ config để xem nó là gì
console.log("[DEBUG] Giá trị của config.mongodbUri là:", config.mongodbUri);

// Nếu không có URI, hãy làm sập ứng dụng với lỗi rõ ràng
if (!config.mongodbUri) {
    throw new Error("LỖI NGHIÊM TRỌNG: config.mongodbUri là RỖNG (undefined/null). Vui lòng kiểm tra lại biến môi trường trên Render và trong file config.js!");
}

// --- KẾT THÚC PHẦN DEBUG ---

let client;

// Logic của bạn giữ nguyên
if (config.mongodbUri) {
    const uri = config.mongodbUri;
    client = new MongoClient(uri);
} else {
    console.warn("\x1b[33m[ WARNING ]\x1b[0m MongoDB URI is not defined in the configuration.");
}

async function connectToDatabase() {
    if (!client) {
        console.warn("\x1b[33m[ WARNING ]\x1b[0m Skipping MongoDB connection as URI is not provided.");
        return;
    }

    try {
        await client.connect();
        console.log('\n' + '─'.repeat(40));
        console.log(`${colors.magenta}${colors.bright}🕸️  DATABASE CONNECTION${colors.reset}`);
        console.log('─'.repeat(40));
        console.log('\x1b[36m[ DATABASE ]\x1b[0m', '\x1b[32mConnected to MongoDB ✅\x1b[0m');
    } catch (err) {
        // --- BẮT ĐẦU PHẦN DEBUG ---
        // Nếu kết nối thất bại, in ra lỗi chi tiết và làm sập ứng dụng
        console.error("\x1b[31m[DATABASE ERROR]\x1b[0m Không thể kết nối tới MongoDB. URI có thể sai hoặc IP chưa được whitelist.");
        console.error("Lỗi chi tiết:", err);
        throw new Error("Sập ứng dụng do không kết nối được database.");
        // --- KẾT THÚC PHẦN DEBUG ---
    }
}

const db = client ? client.db("PrimeMusicKaylin") : null;
const playlistCollection = db ? db.collection("SongPlayLists") : null;
const autoplayCollection = db ? db.collection("AutoplaySettings") : null;

module.exports = {
    connectToDatabase,
    playlistCollection,
    autoplayCollection,
};
