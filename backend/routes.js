const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
   registrarUsuario,
   iniciarSesion,
   seguirUsuario,
   dejarDeSeguirUsuario,
   obtenerPublicacionesDeSeguidos,
} = require('./controllers/usuariosController');
const {
   crearPublicacion,
   obtenerTodasLasPublicaciones,
   obtenerPublicacionesDeUsuario,
} = require('./controllers/publicacionesController');
const {
   enviarMensaje, 
   obtenerMensajesEntreUsuarios
} = require('./controllers/mensajesController');
const {
   crearPublicacionEnPerfil,
   obtenerPublicacionesDePerfil
} = require('./controllers/publicacionesPerfilController');

// Rutas de usuarios
router.post('/register', [
   body('email').isEmail().withMessage('El correo electrónico no es válido'),
   body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], usuariosController.registrarUsuario);
router.post('/login', iniciarSesion);

// Ruta para serguir a un usuario
router.get('/usuarios/seguir', usuariosController.seguirUsuario);
// Ruta para dejar de seguir a un usuario
router.get('/usuarios/dejar-de-seguir', usuariosController.dejarDeSeguirUsuario);

// Ruta para obtener las publicaciones de los usuarios seguidos por un usuario
router.get('/usuarios/:usuarioId/publicaciones-seguidos', usuariosController.obtenerPublicacionesDeSeguidos);

// Rutas de publicaciones
router.post('/publicaciones', crearPublicacion);
router.get('/publicaciones', obtenerTodasLasPublicaciones);
router.get('/usuarios/:usuarioId/publicaciones', obtenerPublicacionesDeUsuario);

// Rutas de publicaciones en el perfil de un usuario
router.post('/publicaciones-perfil/crear', crearPublicacionEnPerfil);
router.get('/publicaciones-perfil/:usuarioId', obtenerPublicacionesDePerfil);

// Rutas de mensajes
router.post('/mensajes/enviar', enviarMensaje);
router.get('/mensajes/:usuarioEmisor/:usuarioReceptor', obtenerMensajesEntreUsuarios);

module.exports = router;
