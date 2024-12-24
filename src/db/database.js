//database.js

const sqlite3 = require('sqlite3').verbose();

async function ensureDatabaseAndTable() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('BD_Tupperware.db', (err) => {
            if (err) reject(err);

            db.run(
                `CREATE TABLE IF NOT EXISTS BD_tabla (
                    CLIENTE TEXT, ZONA TEXT, GPO TEXT, NOMBRE TEXT,
                    DIRECCION TEXT, DIRECCION_REMITO TEXT, LOCALIDAD TEXT, CP TEXT, 
                    TEL TEXT, EMAIL TEXT, COORDENADAS TEXT
                )`,
                (err) => {
                    if (err) reject(err);
                    resolve(db);
                }
            );
        });
    });
}

async function getAllData() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('BD_Tupperware.db', (err) => {
            if (err) reject(err);

            db.all('SELECT * FROM BD_tabla', [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    });
}

module.exports = { ensureDatabaseAndTable, getAllData };
