const express = require('express');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 5000;

// Configuración del middleware para procesar solicitudes JSON
app.use(express.json());

// Usa las rutas como middleware
app.use('/api', routes);

// Inicio del servidor Express
app.listen(port, () => {
   console.log(`Servidor Express en ejecución en el puerto ${port}`);
});
