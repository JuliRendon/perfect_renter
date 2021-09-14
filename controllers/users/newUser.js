// @ts-nocheck
const getDB = require('../../config/getDB');

const {
  generateRandomString,
  formatDate,
  sendMail,
  validate,
} = require('../../libs/helpers');

const userSchema = require('../../models/userSchema');

const newUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    console.log(req.body.email);
    //validamos los datos del body
    await validate(userSchema, req.body);

    // Obtenemos los campos necesarios.
    const { name, lastname, email, password, bio } = req.body;

    // Comprobamos si el email existe en la base de datos.
    const [user] = await connection.query(
      `SELECT idUser FROM users WHERE email = ?`,
      [email]
    );

    // Si el email existe lanzamos un error.
    if (user.length > 0) {
      const error = new Error('Ya existe un usuario registrado con ese email');
      error.httpStatus = 409;
      throw error;
    }

    // Creamos un código de registro de un solo uso.
    const registrationCode = generateRandomString(40);

    // Guardamos al usuario en la base de datos junto al código de registro.
    await connection.query(
      `INSERT INTO users (name, lastname, email, password, bio, registrationCode, createdAt) VALUES (?, ?, ?, SHA2(?, 512), ?, ?, ?)`,
      [
        name,
        lastname,
        email,
        password,
        bio,
        registrationCode,
        formatDate(new Date()),
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
              Bienvenido/a ${name}
              Te acabas de registrar en Perfect Renter
              ¡Pulsa el botón para verificar tu cuenta!
            </td>
        </tbody>
        <tfoot>
            <td>
              <button>
              <a
              href="http://localhost:4000/${process.env.PUBLIC_HOST}/users/validate/${registrationCode}"
              ></a
              >VERIFICAR
              </button>
            </td>
        </tfoot>
      </table>
    `;

    try {
      // Enviamos el mensaje al correo del usuario.
      await sendMail({
        to: email,
        subject: 'Activa tu usuario de Perfect Renter',
        body: emailBody,
      });
    } catch (error) {
      console.log(error.code);
      console.log(error);
      throw new Error('Error enviando el mensaje de verificación');
    }

    res.send({
      status: 'ok',
      message: 'Usuario registrado, comprueba tu email para activarlo',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUser;
