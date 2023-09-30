// publicacionesController.js

const mysql = require('mysql');
const db = require('./db'); // Importa la instancia de la base de datos

// Controlador para crear una nueva publicación
const crearPublicacion = (req, res) => {
   const { usuarioId, contenido, tipo, archivoAdjunto } = req.body;

   // Verifica que los datos necesarios se proporcionen en la solicitud
   if (!usuarioId || !contenido || !tipo) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
   }

   // Inserta la nueva publicación en la base de datos
   const sql = 'INSERT INTO publicaciones (usuario_id, contenido, tipo, archivo_adjunto) VALUES (?, ?, ?, ?)';
   db.query(sql, [usuarioId, contenido, tipo, archivoAdjunto], (err, result) => {
      if (err) {
         console.error('Error al crear la publicación:', err);
         return res.status(500).json({ error: 'Error al crear la publicación' });
      }

      // La publicación se creó exitosamente
      res.status(201).json({ message: 'Publicación creada exitosamente', publicacionId: result.insertId });
   });
};

// Controlador para obtener todas las publicaciones
const obtenerTodasLasPublicaciones = (req, res) => {
   // Consulta SQL para obtener todas las publicaciones
   const sql = 'SELECT * FROM publicaciones';
   db.query(sql, (err, result) => {
      if (err) {
         console.error('Error al obtener las publicaciones:', err);
         return res.status(500).json({ error: 'Error al obtener las publicaciones' });
      }

      // Devuelve la lista de publicaciones
      res.status(200).json(result);
   });
};

// Controlador para obtener todas las publicaciones de un usuario
const obtenerPublicacionesDeUsuario = (req, res) => {
   const { usuarioId } = req.params;

   // Consulta SQL para obtener las publicaciones del usuario especificado
   const sql = 'SELECT * FROM publicaciones WHERE usuario_id = ?';
   db.query(sql, [usuarioId], (err, result) => {
      if (err) {
         console.error('Error al obtener las publicaciones del usuario:', err);
         return res.status(500).json({ error: 'Error al obtener las publicaciones del usuario' });
      }

      // Devuelve la lista de publicaciones del usuario
      res.status(200).json(result);
   });
};

module.exports = {
   crearPublicacion,
   obtenerTodasLasPublicaciones,
   obtenerPublicacionesDeUsuario,
};
