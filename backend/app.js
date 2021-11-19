console.clear();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const { uploadsDir } = require('../backend/libs/helpers');

const app = express();
const { PORT } = process.env;

// CORS
app.use(cors());
// LOGGER
app.use(morgan('dev'));
// BODY DESERIALIZER
app.use(express.json());
// FORM-DATA DESERIALIZER
app.use(fileUpload());
// PHOTOS MIDDLEWARE
app.use('/photo', express.static(uploadsDir));

/**
 * @module Routes
 */

/**
 *
 * ######################
 * ## LIBS MIDDLEWARES ##
 * ######################
 *
 */
const {
  authUser,
  userExists,
  canEdit,
  propertyExists,
} = require('./libs/middlewares/index');

/**
 * ############################
 * ## PROPERTIES CONTROLLERS ##
 * ############################
 */
const {
  newProperty,
  getProperty,
  addPropertyPhoto,
  bookProperty,
  contactProperty,
  editProperty,
  deleteProperty,
  deletePropertyPhoto,
  listProperties,
  newVote,
  acceptBooking,
  cancelBooking,
  listPropertyVotes,
  getBookings,
  getLocations,
  editBooking,
  getPhotos,
} = require('./controllers/properties/index');

/**
 * ##########################
 * ## PROPERTIES ENDPOINTS ##
 * ##########################
 */
/**
 * Obtener nombres de fotos de una propiedad
 *
 * @name getPhotos
 * @path {GET} /properties/:idProperty/photos
 * @params {idProperty} Número del inmueble del que se quiere obtener las fotos
 * @code {200} Si la respuesta es correcta
 * @response {Object} Response Lista de nombres de fotos
 */
app.get('/properties/:idProperty/photos', propertyExists, getPhotos);
/**
 * Añadir un nuevo alquiler
 *
 * @name newProperty
 * @path {POST} /properties
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {404} Si el usuario no existe
 * @code {400} Si no hay archivo o es incorrecto
 * @code {403} Si supera el máximo de archivos permitidos
 * @response {Object} Response Guarda los datos en la base de datos
 */
app.post('/properties', authUser, newProperty);

/**
 * Lista las provincias/ciudades
 *
 * @name getLocations
 * @path {GET} /properties/locations
 * @code {200} Si la respuesta es correcta
 * @response {Object} Response Lista de ciudades
 */
app.get('/properties/location', getLocations);

/**
 * Obtener información de una propiedad en concreto
 *
 * @name getProperty
 * @path {GET} /properties/:idProperty
 * @params {number} idProperty Número del inmueble a mostrar
 * @code {200} Si la respuesta es correcta
 * @code {404} Si la propiedad no existe
 * @response {Object} devuelve la propiedad en concreto o error de existir
 */
app.get('/properties/:idProperty', propertyExists, getProperty);
/**
 * Obtener información de todas las propiedades disponibles
 *
 * @name listProperties
 * @path {GET} /properties
 * @code {200} Si la respuesta es correcta
 * @response {Object} Response listando las propiedades disponibles
 */
app.get('/properties', listProperties);

/**
 * Agregar foto a los inmuebles
 *
 * @name addPropertyPhoto
 * @path {POST} /properties/:idProperty/photos
 * @params {number} idProperty Número del inmueble a mostrar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {404} Si el usuario no existe
 * @code {400} Si no hay archivo o es incorrecto
 * @code {403} Si supera el máximo de archivos permitidos
 * @response {Object} Response guardando la foto en el servidor y el nombre en la base de datos
 */
app.post(
  '/properties/:idProperty/photos',
  authUser,
  propertyExists,
  canEdit,
  addPropertyPhoto
);

/**
 * Solicitud de alquiler a un inmueble
 *
 * @name contactProperty
 * @path {get} /properties/:idProperty/contact
 * @params {number} idProperty Número del inmueble a contactar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {403} Si es el dueño de la vivienda
 * @response {Object} Response El servidor envía un correo electrónico con los datos de la solicitud.
 */
app.post('/properties/:idProperty/contact', propertyExists, contactProperty);

/**
 * Solicitud de alquiler a un inmueble
 *
 * @name bookProperty
 * @path {POST} /properties/:idProperty/contact
 * @params {number} idProperty Número del inmueble a contactar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {400} Si falta algún dato a insertar
 * @code {403} Si es el dueño de la vivienda
 * @response {Object} Response El servidor envía un correo electrónico con los datos de la solicitud.
 */
app.post(
  '/properties/:idProperty/book',
  authUser,
  propertyExists,
  bookProperty
);

/**
 * Cancelar una reserva
 *
 * @name cancelBooking
 * @path {POST} /properties/:bookingCode/cancel
 * @params {string} bookingCode Codigo de reserva
 * @params {number} idReqUser Id de quien realiza la cancelación
 * @response {Object} Response - Se notifica por pantalla y email que la reserva se cancela
 */
app.get('/properties/:bookingCode/cancel', authUser, cancelBooking);

/**
 * Aceptar reserva.
 *
 * @name acceptBooking
 * @path {PUT} /properties/:bookingCode
 * @params {String} bookingCode Código de la reserva
 * @code {200} Si la respuesta es correcta
 * @code {404} Si no hay reserva pendiente de aceptar o si no existe la viviendo o el inquilino
 * @response {Object} Response El servidor envía un correo electrónico al inquilino y al dueño de la vivienda conforme la reserva se ha realizado con éxito
 */
app.get('/properties/:bookingCode/accept', authUser, acceptBooking);

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
 */
app.put(
  '/properties/:idProperty',
  authUser,
  propertyExists,
  canEdit,
  editProperty
);
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
 */
app.delete(
  '/properties/:idProperty',
  propertyExists,
  authUser,
  canEdit,
  deleteProperty
);
/**
 * Eliminar una foto de un inmueble
 *
 * @name deletePropertyPhoto
 * @path {DELETE} /properties/:idProperty/photos/:idPhoto
 * @params {number} idProperty Número del inmueble del que se quiere eliminar una foto
 * @params {string} photoName Nombre de la foto a eliminar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {404} Si la foto no existe
 * @response {Object} Response Elimina la foto del servidor y la base de datos
 */
app.delete(
  '/properties/:idProperty/photos/:photoName',
  authUser,
  canEdit,
  deletePropertyPhoto
);
/**
 * Votar un inmueble
 *
 * @name newVote
 * @path {POST} /properties/:idProperty/votes
 * @params {number} idProperty Número del inmueble del que se quiere votar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {403} Si se intenta votar a uno mismo
 * @response {Object} Response Cambia el valor del voto y el comentario en la base de datos
 */
app.post('/properties/:idProperty/votes', authUser, propertyExists, newVote);
/**
 * Listar las valoraciones de un alquiler
 *
 * @name listPropertyVotes
 * @path {GET} /properties/:idProperty/votes
 * @params {number} idProperty Número del inmueble del que se quiere visualizar las valoraciones
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @response {Object} Response Lista de las valoraciones
 */
app.get('/properties/:idProperty/votes', propertyExists, listPropertyVotes);
/**
 * Listar las reservas de un alquiler
 *
 * @name getBookings
 * @path {GET} /properties/:idProperty/bookings
 * @params {number} idProperty Número del inmueble del que se quiere visualizar las reservas
 * @code {200} Si la respuesta es correcta
 * @response {Object} Response Lista de reservas
 */
app.get('/properties/:idProperty/bookings', propertyExists, getBookings);
/**
 * Editar fecha de reserva
 *
 * @name editBooking
 * @path {PUT} /properties/:idProperty/:bookingCode
 * @params {idProperty} Número del inmueble del que se quiere cambiar la reserva
 * @params {bookingCode} Código de reserva del cual se quieren cambiar las fechas
 * @code {200} Si la respuesta es correcta
 * @response {Object} Response Lista de reservas
 */
app.put(
  '/properties/:idProperty/:bookingCode',
  propertyExists,
  authUser,
  editBooking
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
  listBookedProperties,
  listUserVotes,
} = require('./controllers/users/index');
const contactUs = require('./controllers/contactUs');
const getPhoto = require('./controllers/getPhoto');

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
 * @name listUsers
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
 * Votar un usuario
 *
 * @name newUserVote
 * @path {POST} /users/:idUser/votes
 * @params {number} idUser Número del usuario del que se quiere votar
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {403} Si se intenta votar a uno mismo
 * @response {Object} Response Cambia el valor del voto y el comentario en la base de datos
 *
 */
app.post('/users/:idUser/votes', authUser, userExists, newVote);
/**
 * Listar alquileres en reserva, en petición o alquilados.
 *
 * @name listBookedProperties
 * @path {GET} /users/:idUser/bookings
 * @params {number} idUser Número del usuario del que se quiere visualizar las reservas
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {403} Si no se tienen los permisos suficientes
 * @response {Object} Response Lista de los alquileres reservados/alquilados
 *
 */
app.get('/users/:idUser/bookings', authUser, listBookedProperties);
/**
 * Listar las valoraciones de un usuario
 *
 * @name listUserVotes
 * @path {GET} /users/:idUser/votes
 * @params {number} idUser Número del usuario del que se quiere visualizar las valoraciones
 * @header Authorization Es la identificación utlizada para llevar a cabo la request
 * @code {200} Si la respuesta es correcta
 * @code {401} Si la autorización del usuario es errónea
 * @code {403} Si no se tienen los permisos suficientes
 * @response {Object} Response Lista de los alquileres reservados/alquilados
 *
 */
app.get('/users/:idUser/votes', authUser, userExists, listUserVotes);

/**
 * Obtener información de todas las propiedades de un usuario en concreto
 *
 * @name listProperties
 * @path {GET} /users/:idUser/properties
 * @code {200} Si la respuesta es correcta
 * @response {Object} Response listando las propiedades de ese renter
 */
app.get('/users/:idUser/properties', userExists, listProperties);
/**
 * Listar las reservas finalizadas de un usuario
 *
 * @name getBookings
 * @path {GET} /properties/:idProperty/bookings
 * @params {number} idProperty Número del inmueble del que se quiere visualizar las reservas
 * @code {200} Si la respuesta es correcta
 * @response {Object} Response Lista de reservas
 */
app.get('/users/:idUser/bookings/renter', authUser, getBookings);

/**
 * Contacto a nuestra empresa.
 *
 * @name contactUs
 * @path {POST} /contact
 * @code {200} Si la respuesta es correcta
 * @code {400} Si falta algún dato a insertar
 * @response {Object} Response El servidor envía un correo electrónico con los datos de la solicitud.
 *
 */
app.post('/contact', contactUs);

/**
 * Middleware que muestra una foto guardada en el servidor.
 *
 * @name getPhoto
 * @path {GET} /photo/:photoName
 * @code {200} Si la respuesta es correcta
 * @response {Object} Respones El servidor envía un objeto con un mensaje de confirmación y la foto cargada.
 */

app.get('/photo/:pictureName', getPhoto);

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
const server = app.listen(PORT, () => {
  console.log(`Server listening at http://192.168.1.16:${PORT}`);
});

module.exports = { server, app };
