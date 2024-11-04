const db = require('../db/database');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS zonas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        limites TEXT NOT NULL,
        punto_partida TEXT,
        localidad TEXT
    )`);
});

const Zona = {
    crearZona: (nombre, limites, punto_partida, localidad, callback) => {
        const sql = `INSERT INTO zonas (nombre, limites, punto_partida, localidad) VALUES (?, ?, ?, ?)`;
        db.run(sql, [nombre, limites, punto_partida, localidad], callback);
    },

    obtenerZonas: (callback) => {
        const sql = `SELECT * FROM zonas`;
        db.all(sql, [], (err, rows) => {
            callback(err, rows);
        });
    },
};

module.exports = Zona;
