//upload.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const { ensureDatabaseAndTable } = require('../db/database');
const { parseExcelFile } = require('../utils/parseExcelFile');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Ruta para subir el archivo
router.post('/upload', upload.single('excelFile'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const data = await parseExcelFile(filePath); // Parsear el archivo Excel

        const headers = data[0]; // Encabezados
        const rows = data.slice(1); // Filas (sin encabezados)

        // Asegurar que la base de datos y tabla existan
        const db = await ensureDatabaseAndTable();

        // Comparar encabezados
        const tableHeaders = [
            "CLIENTE", "ZONA", "GPO", "NOMBRE", "DIRECCION", "DIRECCION_REMITO",
            "LOCALIDAD", "CP", "TEL", "EMAIL", "COORDENADAS"
        ];
        if (JSON.stringify(headers) !== JSON.stringify(tableHeaders)) {
            throw new Error('Los encabezados del archivo no coinciden con los de la tabla.');
        }

        let totalRows = rows.length;
        let insertedRows = 0;

        for (const [index, row] of rows.entries()) {
            if (!row[0]) continue; // Saltar filas sin cliente

            // Verificar si el cliente ya existe
            const clienteExists = await new Promise((resolve, reject) => {
                db.get(`SELECT 1 FROM BD_tabla WHERE CLIENTE = ?`, [row[0]], (err, result) => {
                    if (err) reject(err);
                    resolve(!!result);
                });
            });

            if (!clienteExists) {
                // Insertar fila
                await new Promise((resolve, reject) => {
                    db.run(
                        `INSERT INTO BD_tabla (CLIENTE, ZONA, GPO, NOMBRE, DIRECCION, DIRECCION_REMITO, LOCALIDAD, CP, TEL, EMAIL, COORDENADAS) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        row.map(cell => cell || null), // Reemplazar valores vacíos con null
                        (err) => {
                            if (err) reject(err);
                            insertedRows++;
                            resolve();
                        }
                    );
                });
            }

            // Calcular progreso
            const progress = Math.round(((index + 1) / totalRows) * 100);
            console.log(`Progreso: ${progress}%`);
        }

        res.send(`Datos procesados. Filas totales: ${totalRows}. Nuevas filas insertadas: ${insertedRows}.`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar el archivo.');
    }
});

module.exports = router;
