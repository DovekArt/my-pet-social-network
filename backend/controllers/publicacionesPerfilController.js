const mysql = require('mysql');
const db = require('./db'); // Importa la instancia de la base de datos

// Controlador para crear una nueva publicación en el perfil de un usuario
const crearPublicacionEnPerfil = (req, res) => {
   const { usuarioId, contenido, tipo, archivoAdjunto } = req.body;

   // Verifica que los datos necesarios se proporcionen en la solicitud
   if (!usuarioId || !contenido || !tipo) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
   }

   // Inserta la nueva publicación en el perfil de usuario en la base de datos
   const sql = 'INSERT INTO publicaciones_perfil (usuario_id, contenido, tipo, archivo_adjunto) VALUES (?, ?, ?, ?)';
   db.query(sql, [usuarioId, contenido, tipo, archivoAdjunto], (err, result) => {
      if (err) {
         console.error('Error al crear la publicación en el perfil:', err);
         return res.status(500).json({ error: 'Error al crear la publicación en el perfil' });
      }

      // La publicación se creó exitosamente en el perfil de usuario
      res.status(201).json({ message: 'Publicación en perfil creada exitosamente', publicacionId: result.insertId });
   });
};

// Controlador para obtener todas las publicaciones en el perfil de un usuario
const obtenerPublicacionesDePerfil = (req, res) => {
   const { usuarioId } = req.params;

   // Consulta SQL para obtener todas las publicaciones en el perfil de usuario
   const sql = 'SELECT * FROM publicaciones_perfil WHERE usuario_id = ?';
   db.query(sql, [usuarioId], (err, result) => {
      if (err) {
         console.error('Error al obtener las publicaciones del perfil:', err);
         return res.status(500).json({ error: 'Error al obtener las publicaciones del perfil' });
      }

      // Devuelve la lista de publicaciones en el perfil de usuario
      res.status(200).json(result);
   });
};

module.exports = {
   crearPublicacionEnPerfil,
   obtenerPublicacionesDePerfil,
};
