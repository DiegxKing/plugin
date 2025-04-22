const express = require('express');
const bodyParser = require('body-parser');

// Importar la conexión desde 'conexionbd.js'
const db = require('./conexionbd');

const app = express();
const port = 3000;

// Middleware para analizar JSON
app.use(bodyParser.json());

// Ruta para recibir las URLs y su estado
app.post('/registrar-url', (req, res) => {
    const { url, estado } = req.body;
    const query = 'INSERT INTO url_maliciosas (url, estado) VALUES (?, ?)';
    db.query(query, [url, estado], (err, results) => {
        if (err) {
            res.status(500).send('Error al registrar la URL');
            return;
        }
        res.status(200).send('URL registrada correctamente');
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
