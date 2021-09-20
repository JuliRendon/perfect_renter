console.clear();
require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

const app = express();
const { PORT } = process.env;

// LOGGER
app.use(morgan('dev'));
// BODY DESERIALIZER
app.use(express.json());
// FORM-DATA DESERIALIZER
app.use(fileUpload());

/**
 * @module Routes
 */

/**
 *
 * ######################
 * ## LIBS MIDDLEWARES ##
 * ######################
 *
 * @private
 */
const { authUser, userExists, canEdit } = require('./libs/middlewares/index');

/**
 * ############################
 * ## PROPERTIES CONTROLLERS ##
 * ############################
 */
const {
  addPropertyPhoto,
  contactProperty,
  editProperty,
  deleteProperty,
  deletePropertyPhoto,
} = require('./controllers/properties/index');

/**
 * ##########################
 * ## PROPERTIES ENDPOINTS ##
 * ##########################
 */

/**
 * Agregar foto a los inmuebles
 *
 * @name addPropertyPhoto
 * @path {POST} /property/:idProperty/photos
 * @params {number} idProperty Número del inmueble a mostrar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {404} Si el usuario no existe
 * @code {400} Si no hay archivo o es incorrecto
 * @code {403} Si supera el máximo de archivos permitidos
 * @response {Object} Response guardando la foto en el servidor y el nombre en la base de datos
 *
 */
app.post('/properties/:idProperty/photos', authUser, canEdit, addPropertyPhoto);
/**
 * Solicitud a un inmueble
 *
 * @name contactProperty
 * @path {POST} /property/:idProperty/contact
 * @params {number} idProperty Número del inmueble a contactar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {400} Si falta algún dato a insertar
 * @code {403} Si es el dueño de la vivienda
 * @response {Object} Response El servidor envía un correo electrónico con los datos de la solicitud.
 *
 */
app.post('/properties/:idProperty/contact', authUser, contactProperty);
/**
 * Editar información de un inmueble
 *
 * @name editProperty
 * @path {PUT} /properties/:idProperty
 * @params {number} idProperty Número del inmueble a editar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {404} Si el inmueble no existe
 * @code {400} Si el archivo es de un formato incorrecto
 * @code {403} Si supera el máximo de archivos permitidos
 * @response {Object} Response Guarda la información cambiada en el servidor y base de datos
 *
 */
app.put('/properties/:idProperty', authUser, canEdit, editProperty);
/**
 * Eliminar un inmueble
 *
 * @name deleteProperty
 * @path {DELETE} /properties/:idProperty
 * @params {number} idProperty Número del inmueble a eliminar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @response {Object} Response Elimina el inmueble del servidor (y sus fotos) y la base de datos
 *
 */
app.delete('/properties/:idProperty', authUser, canEdit, deleteProperty);
/**
 * Eliminar una foto de un inmueble
 *
 * @name deletePropertyPhoto
 * @path {DELETE} /properties/:idProperty/photos/:idPhoto
 * @params {number} idProperty Número del inmueble del que se quiere eliminar una foto
 * @params {number} idPhoto Número de la foto a eliminar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {404} Si la foto no existe
 * @response {Object} Response Elimina la foto del servidor y la base de datos
 *
 */
app.delete(
  '/properties/:idProperty/photos/:idPhoto',
  authUser,
  canEdit,
  deletePropertyPhoto
);
/**
 * ######################
 * ## USER CONTROLLERS ##
 * ######################
 */

const {
  recoverUserPass,
  newUser,
  getUser,
  loginUser,
  passUserRecover,
  editUserPass,
  validateUser,
  deleteUser,
  listUsers,
  editUser,
  contactUser,
} = require('./controllers/users/index');

/**
 * ####################
 * ## USER ENDPOINTS ##
 * ####################
 */

/**
 * Obtener usuario.
 *
 * @name getUser
 * @path {GET} /users/:idUser
 * @params {number} idUser Número de usuario a mostrar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {404} Si el usuario no existe
 * @response {Object} Response Datos de usuario
 */
app.get('/users/:idUser', authUser, userExists, getUser);

/**
 * Listar todos los usuarios
 *
 * @name getUsers
 * @path {GET} /users
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @query {string} OrderBy Orden en el cual se listan los usuarios. (city o birthDate o votes(por defecto) )
 * @query {string} Direction Dirección en la cual se listan los usuarios. (ASC o DESC)
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {404} Si el usuario no existe
 * @response {Array} Response Array de datos de todos los usuarios
 */
app.get('/users', authUser, listUsers);

/**
 * Obtener enlace de recuperación de contraseña.
 *
 * @name recoverUserPass
 * @path {PUT} /users/password/recover
 * @code {200} Si la respuesta es correcta
 * @code {400} Si el correo electrónico no es valido
 * @code {404} Si el usuario no existe
 * @response {Object} Response Confirmación recuperación contraseña
 */
app.put('/users/password/recover', recoverUserPass);

/**
 * Agregar usuario.
 *
 * @name newUser
 * @path {POST} /users
 * @body {String} name Nombre del usuario
 * @body {String} lastname Apellidos del usuario
 * @body {String} email Correo electrónico del usuario
 * @body {String} password Contraseña del usuario
 * @body {String} bio Breve descripción del usuario
 * @code {200} Si la respuesta es correcta
 * @code {409} Si el correo electrónico ya existe en la base de datos
 * @response {Object} Response Confirmación registro
 */
app.post('/users', newUser);

/**
 * Loguear usuario.
 *
 * @name loginUser
 * @path {POST} /users/login
 * @body {String} email Correo electrónico del usuario
 * @body {String} password Contraseña del usuario
 * @code {200} Si la respuesta es correcta
 * @code {400} Si faltan campos a rellenar
 * @code {401} Si el email o la contraseña son incorrectos
 * @response {Object} Response Devuelve un token
 */
app.post('/users/login', loginUser);

/**
 * Validar usuario.
 *
 * @name validateUser
 * @path {GET} /users/validate/:registrationCode
 * @body {String} email Correo electrónico del usuario
 * @body {String} password Contraseña del usuario
 * @code {200} Si la respuesta es correcta
 * @code {404} Si no hay usuarios pendientes a validar
 * @response {Object} Response Envía un correo electrónico para la validación del usuario.
 */
app.get('/users/validate/:registrationCode', validateUser);

/**
 * Recuperar contraseña de usuario.
 *
 * @name passUserRecover
 * @path {PUT} /users/password/recover/:idUser/:recoverCode
 * @params {Number} idUser Número de usuario a mostrar
 * @params {String} recoverCode Código de recuperación de contraseña
 * @body {String} password Contraseña del usuario
 * @code {200} Si la respuesta es correcta
 * @code {404} Si el enlace es erróneo
 * @response {Object} Response Cambia la contraseña del usuario
 */
app.put('/users/password/recover/:idUser/:recoverCode', passUserRecover);

/**
 * Editar contraseña del usuario.
 *
 * @name editUserPass
 * @path {PUT} /users/:idUser/password
 * @params {Number} idUser Número de usuario a mostrar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {403} Si se intenta cambiar la contraseña de otro usuario
 * @code {401} Si la contraseña introducida es incorrecta
 * @response {Object} Response Edita la contraseña del usuario y envía un email para verificar
 */
app.put('/users/:idUser/password', authUser, userExists, editUserPass);
/**
 * Editar usuario.
 *
 * @name editUser
 * @path {PUT} /users/:idUser
 * @params {Number} idUser Número de usuario a mostrar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {403} Si se intenta cambiar la contraseña de otro usuario
 * @code {401} Si la contraseña introducida es incorrecta
 * @response {Object} Response Edita la contraseña del usuario y envía un email para verificar
 */
app.put('/users/:idUser/', authUser, userExists, editUser);

/**
 * Eliminar usuario.
 *
 * @name deleteUser
 * @path {DELETE} /users/:idUser
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {403} Si se intenta eliminar al administrador
 * @code {403} Si el usuario que hace la petición no es el registrado en esa cuenta
 * @response {Object} Response Confirmación de usuario eliminado.
 */
app.delete('/users/:idUser', authUser, userExists, deleteUser);
/**
 * Contacto a un usuario.
 *
 * @name contactUser
 * @path {POST} /users/:idUser/contact
 * @params {number} idUser Número del usuario a contactar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {400} Si falta algún dato a insertar
 * @code {403} Si el usuario a contactar y el usuario que solicita el contacto, son el mismo
 * @response {Object} Response El servidor envía un correo electrónico con los datos de la solicitud.
 *
 */
app.post('/users/:idUser/contact', authUser, userExists, contactUser);
/**
 * ####################
 * ## ERROR LISTENER ##
 * ####################
 */

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

/**
 * ##########################
 * ## NOT FOUND MIDDLEWARE ##
 * ##########################
 */
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

/**
 * ####################
 * ## SERVER ON PORT ##
 * ####################
 */
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
