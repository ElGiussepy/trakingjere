//upload.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const { ensureDatabaseAndTable } = require('../db/database');
const { parseExcelFile } = require('../utils/parseExcelFile'); // Actualiza la ruta según sea necesario
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
        const data = await parseExcelFile(filePath); // Asume que tienes una función para parsear el archivo Excel

        const headers = data[0]; // Encabezados
        const rows = data.slice(1); // Filas (sin encabezados)

        // Asegurar que la base de datos y tabla existan
        const db = await ensureDatabaseAndTable();

        // Comparar encabezados y subir datos
        const tableHeaders = [
            "CLIENTE", "ZONA", "GPO", "NOMBRE", "DIRECCION", "DIRECCION_REMITO",
            "LOCALIDAD", "CP", "TEL", "EMAIL", "COORDENADAS"
        ];
        if (JSON.stringify(headers) !== JSON.stringify(tableHeaders)) {
            throw new Error('Los encabezados del archivo no coinciden con los de la tabla.');
        }

        rows.forEach(row => {
            if (row[0]) { // Validar que la columna CLIENTE tenga datos
                db.run(
                    `INSERT INTO BD_tabla (CLIENTE, ZONA, GPO, NOMBRE, DIRECCION, DIRECCION_REMITO, LOCALIDAD, CP, TEL, EMAIL, COORDENADAS) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    row.map(cell => cell || null) // Insertar valores, dejando `null` si están vacíos
                );
            }
        });

        res.send('Datos cargados correctamente a la base de datos.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar el archivo.');
    }
});

module.exports = router;
