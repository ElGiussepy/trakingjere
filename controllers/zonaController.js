// controllers/zonaController.js

const Zona = require('../models/zona');

// Crear una nueva zona
const crearZona = (req, res) => {
    const { nombre, limites, punto_partida, localidad } = req.body;
    Zona.crearZona(nombre, limites, punto_partida, localidad, (err) => {
        if (err) {
            return res.status(500).send('Error al crear la zona');
        }
        res.send('Zona creada con éxito');
    });
};

// Obtener todas las zonas
const obtenerZonas = (req, res) => {
    Zona.obtenerZonas((err, zonas) => {
        if (err) {
            return res.status(500).send('Error al obtener las zonas');
        }
        res.json(zonas);
    });
};

module.exports = { crearZona, obtenerZonas };
