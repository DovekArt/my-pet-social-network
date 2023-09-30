// mensajesController.js

const db = require('./db');

// Controlador para enviar un mensaje
const enviarMensaje = (req, res) => {
   const { contenido, usuarioEmisor, usuarioReceptor } = req.body;

   // Verifica que los datos necesarios se proporcionen en la solicitud
   if (!contenido || !usuarioEmisor || !usuarioReceptor) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
   }

   // Inserta el nuevo mensaje en la base de datos
   const sql = 'INSERT INTO mensajes (contenido, usuario_emisor, usuario_receptor, fecha_envio) VALUES (?, ?, ?, NOW())';
   db.query(sql, [contenido, usuarioEmisor, usuarioReceptor], (err, result) => {
      if (err) {
         console.error('Error al enviar el mensaje:', err);
         return res.status(500).json({ error: 'Error al enviar el mensaje' });
      }

      // El mensaje se envió exitosamente
      res.status(201).json({ message: 'Mensaje enviado exitosamente', mensajeId: result.insertId });
   });
};

// Controlador para obtener mensajes entre dos usuarios
const obtenerMensajesEntreUsuarios = (req, res) => {
   const { usuarioEmisor, usuarioReceptor } = req.params;

   // Consulta SQL para obtener los mensajes entre los dos usuarios
   const sql = 'SELECT * FROM mensajes WHERE (usuario_emisor = ? AND usuario_receptor = ?) OR (usuario_emisor = ? AND usuario_receptor = ?) ORDER BY fecha_envio';
   db.query(sql, [usuarioEmisor, usuarioReceptor, usuarioReceptor, usuarioEmisor], (err, result) => {
      if (err) {
         console.error('Error al obtener los mensajes:', err);
         return res.status(500).json({ error: 'Error al obtener los mensajes' });
      }

      // Devuelve la lista de mensajes
      res.status(200).json(result);
   });
};

module.exports = {
   enviarMensaje,
   obtenerMensajesEntreUsuarios,
};
