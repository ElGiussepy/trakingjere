const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

require('./db/database'); // Conexión a la base de datos
const zonaController = require('./controllers/zonaController'); // Importa el controlador de zona

// Middleware para parsear JSON
app.use(express.json());
app.use(express.static('public')); // Esto permite servir archivos estáticos

// Ruta principal
app.get('/', (req, res) => {
    res.send('Aplicación de Ruteo Logístico Iniciada');
});

// Rutas para las zonas de reparto
app.post('/zonas', zonaController.crearZona); // Crear una zona
app.get('/zonas', zonaController.obtenerZonas); // Obtener todas las zonas

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
