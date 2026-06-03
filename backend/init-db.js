const fs = require('fs');
const getDB = require('./db');

async function initializeDB() {
    try {
        const db = await getDB();
        const sql = fs.readFileSync('./init.sql', 'utf8');
        await db.exec(sql);
        console.log("Veritabanı (SQLite) başarıyla oluşturuldu ve örnek ürünler eklendi!");
    } catch (error) {
        console.error("Veritabanı oluşturulurken hata:", error.message);
    }
}

initializeDB();
