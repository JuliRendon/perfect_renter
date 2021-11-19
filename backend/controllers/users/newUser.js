// @ts-nocheck
const getDB = require('../../config/getDB');
const {
  generateRandomString,
  formatDate,
  sendMail,
  validate,
} = require('../../libs/helpers');

const { userSchema } = require('../../models/userSchema');
/**
 * @module Users
 */
/**
 * Middleware para generar un nuevo usuario en la base de datos.
 * @param {*} req Como "requests", se requieren cinco datos del usuario.
 * @param {*} res El servidor lanza como respuesta la confirmación de la creación de un nuevo usuario con el envío del email para validarlo.
 * @param {*} next Envía al siguiente middleware, si existe. O lanza errores si los hay.
 */
const newUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Validamos los datos recibidos.
    await validate(userSchema, req.body);

    // Obtenemos los campos necesarios.
    const { name, lastName, email, password, bio, city, birthDate } = req.body;

    // Comprobamos que no faltan campos a rellenar.
    if (!name || !lastName || !email || !password || !city || !birthDate) {
      const error = new Error('Debes rellenar todos los campos.');
      error.httpStatus = 400;
      throw error;
    }

    // Comprobamos si el email existe en la base de datos.
    const [user] = await connection.query(
      `SELECT idUser FROM users WHERE email = ?`,
      [email]
    );

    // Si el email existe lanzamos un error.
    if (user.length > 0) {
      const error = new Error('Ya existe un usuario registrado con ese email.');
      error.httpStatus = 409;
      throw error;
    }

    // Creamos un código de registro de un solo uso.
    const registrationCode = generateRandomString(20);

    // Guardamos al usuario en la base de datos junto al código de registro.
    await connection.query(
      `INSERT INTO users (name, lastName, email, password, bio, registrationCode, createdAt, renterActive, birthDate, city) VALUES (?, ?, ?, SHA2(?, 512), ?, ?, ?, false, ?, ?)`,
      [
        name,
        lastName,
        email,
        password,
        bio,
        registrationCode,
        formatDate(new Date()),
        birthDate,
        city,
      ]
    );

    // Mensaje que enviaremos al usuario.
    const emailBody = `
      <table>
        <thead>
            <th>Verificación de usuario</th>
        </thead>
        <tbody>
            <td>
              Bienvenido/a ${name},
              te acabas de registrar en Perfect Renter
              ¡Pulsa el botón para verificar tu cuenta!
            </td>
        </tbody>
        <tfoot>
            <th>
              <button>
              <a href="http://192.168.1.16:3000/verificar/${registrationCode}">VERIFICAR</a>
              </button>
            </th>
        </tfoot>
      </table>
    `;

    // Enviamos el mensaje al correo del usuario.
    if (process.env.NODE_ENV !== 'test') {
      try {
        await sendMail({
          to: email,
          subject: 'Activa tu usuario de Perfect Renter.',
          body: emailBody,
        });
      } catch (error) {
        throw new Error('Error enviando el mensaje de verificación.');
      }
    }

    res.send({
      status: 'ok',
      message: 'Usuario registrado, comprueba tu email para activarlo.',
      registrationCode,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUser;
