const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

// Secreto para firmar los tokens (puedes cambiarlo)
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const registrarUsuario = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }

   const { nombre, email, password } = req.body;

   // Verificar si el correo electrónico ya está en uso
   const emailCheckQuery = 'SELECT * FROM usuarios WHERE correo = ?';
   db.query(emailCheckQuery, [email], (err, result) => {
      if (err) {
         console.error('Error al buscar usuario por correo electrónico:', err);
         return res.status(500).json({ error: 'Error al registrar usuario' });
      }

      if (result.length > 0) {
         return res.status(409).json({ error: 'El correo electrónico ya está en uso' });
      }

      // Hasheamos la contraseña antes de almacenarla
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Consulta SQL para insertar el nuevo usuario en la base de datos
      const insertUserQuery = 'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)';
      db.query(insertUserQuery, [nombre, email, hashedPassword], (err, result) => {
         if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({ error: 'Error al registrar usuario' });
         }

         // Si el registro es exitoso, generamos un token JWT
         const token = jwt.sign({ userId: result.insertId, email }, jwtSecret);

         // Enviamos el token como respuesta para que el usuario quede autenticado
         res.status(201).json({ message: 'Usuario registrado exitosamente', token });
      });
   });
};

const iniciarSesion = (req, res) => {
   const { email, password } = req.body;

   // Consulta SQL para obtener el usuario por correo electrónico
   const getUserQuery = 'SELECT * FROM usuarios WHERE correo = ?';
   db.query(getUserQuery, [email], (err, result) => {
      if (err) {
         console.error('Error al buscar usuario por correo electrónico:', err);
         return res.status(500).json({ error: 'Error al iniciar sesión' });
      }

      // Si no se encuentra ningún usuario con ese correo electrónico
      if (result.length === 0) {
         return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
      }

      const user = result[0];

      // Comparar la contraseña proporcionada con la almacenada en la base de datos
      const passwordMatch = bcrypt.compareSync(password, user.contraseña);

      if (!passwordMatch) {
         return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
      }

      // Generar un token JWT para autenticar al usuario
      const token = jwt.sign({ userId: user.id, email }, jwtSecret);

      res.status(200).json({ message: 'Inicio de sesión exitoso', token });
   });
};

const seguirUsuario = (req, res) => {
   const { usuario_seguido_id } = req.body;
   const usuarioActualId = req.usuario.userId; // Debes asegurarte de enviar el ID del usuario autenticado en el token

   // Verifica que el usuario no esté intentando seguirse a sí mismo
   if (usuarioActualId === usuario_seguido_id) {
      return res.status(400).json({ error: 'No puedes seguirte a ti mismo' });
   }

   // Consulta SQL para insertar una relación de seguimiento en la base de datos
   const seguirQuery = 'INSERT INTO seguidores (usuario_id, usuario_seguido_id) VALUES (?, ?)';
   db.query(seguirQuery, [usuarioActualId, usuario_seguido_id], (err) => {
      if (err) {
         console.error('Error al seguir al usuario:', err);
         return res.status(500).json({ error: 'Error al seguir al usuario' });
      }

      res.status(200).json({ message: 'Usuario seguido con éxito' });
   });
};

const dejarDeSeguirUsuario = (req, res) => {
   const { usuario_seguido_id } = req.body;
   const usuarioActualId = req.usuario.userId; // Debes asegurarte de enviar el ID del usuario autenticado en el token

   // Consulta SQL para eliminar una relación de seguimiento en la base de datos
   const dejarDeSeguirQuery = 'DELETE FROM seguidores WHERE usuario_id = ? AND usuario_seguido_id = ?';
   db.query(dejarDeSeguirQuery, [usuarioActualId, usuario_seguido_id], (err) => {
      if (err) {
         console.error('Error al dejar de seguir al usuario:', err);
         return res.status(500).json({ error: 'Error al dejar de seguir al usuario' });
      }

      res.status(200).json({ message: 'Dejaste de seguir al usuario con éxito' });
   });
};

const obtenerPublicacionesDeSeguidos = (req, res) => {
   const usuarioActualId = req.usuario.userId; // Debes asegurarte de enviar el ID del usuario autenticado en el token

   // Consulta SQL para obtener las publicaciones de los usuarios seguidos
   const sql = `
      SELECT p.* 
      FROM publicaciones p
      JOIN seguidores s ON p.usuario_id = s.usuario_seguido_id
      WHERE s.usuario_id = ?;
   `;

   db.query(sql, [usuarioActualId], (err, result) => {
      if (err) {
         console.error('Error al obtener las publicaciones de los usuarios seguidos:', err);
         return res.status(500).json({ error: 'Error al obtener las publicaciones de los usuarios seguidos' });
      }

      res.status(200).json(result);
   });
};

module.exports = {
   registrarUsuario,
   iniciarSesion,
   seguirUsuario,
   dejarDeSeguirUsuario,
   obtenerPublicacionesDeSeguidos,
};