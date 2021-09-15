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
 * ######################
 * ## LIBS MIDDLEWARES ##
 * ######################
 */
/**
 * @private
 */
const userExists = require('./libs/middlewares/userExists');
/**
 * @private
 */
const authUser = require('./libs/middlewares/authUser');

/**
 * #######################
 * ## FLATS CONTROLLERS ##
 * #######################
 */

/**
 * #####################
 * ## FLATS ENDPOINTS ##
 * #####################
 */
/**
 * @module Routes
 */

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
 * @path {PUT} /users/:idUser/pass
 * @params {Number} idUser Número de usuario a mostrar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {403} Si se intenta cambiar la contraseña de otro usuario
 * @code {401} Si la contraseña introducida es incorrecta
 * @response {Object} Response Edita la contraseña del usuario y envía un email para verificar.
 */
app.put('/users/:idUser/pass', authUser, userExists, editUserPass);

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
