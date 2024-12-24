//app.js

const express = require('express');
const dotenv = require('dotenv');
const { engine } = require('express-handlebars');
const path = require('path');

const uploadRoutes = require('./src/routes/upload'); // Importar las rutas de carga
const { ensureDatabaseAndTable, getAllData } = require('./src/db/database');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const port = process.env.PORT; // Usa el puerto definido en .env
const saludos = process.env.SALUDOS; // Usa la variable definida en .env
// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
// Configuración Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views')); // Configurar el directorio de vistas

// Ruta principal
app.get('/', (req, res) => {
    res.render('home', { title: 'Gestión Tupperware' });
});

app.get('/ver-datos', async (req, res) => {
    try {
        await ensureDatabaseAndTable();
        const data = await getAllData();
        res.render('ver-datos', { title: 'Datos Cargados', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los datos.');
    }
});

// Usar las rutas de carga
app.use(uploadRoutes);
app.listen(port, () => {
    console.log(`Escuchando en http://localhost:${port}`);
});