const mysql = require('mysql');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const dbConfig = {
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
};

// Crear la conexión a la base de datos
const db = mysql.createConnection(dbConfig);

// Conectar a la base de datos
db.connect((err) => {
   if (err) {
         console.error('Error de conexión a la base de datos:', err);
         return;
   }
   console.log('Conexión a la base de datos MySQL establecida.');
});

module.exports = db;