// @ts-nocheck
require('dotenv').config();
const getDB = require('../../config/getDB');
const {
  validate,
  formatDate,
  sendMail,
  generateRandomString,
} = require('../../libs/helpers');
const { passSchema } = require('../../models/passSchema');
/**
 * @module Users
 */
/**
 * Middleware para editar la contraseña de un usuario
 * @param {*} req Como "requests", se requiere el id del usuario a editar id obtenido por el token.
 * @param {*} res El servidor lanza como respuesta el cambio correcto de contraseña y la confirmación por email.
 * @param {*} next Envía al siguiente middleware, si existe. O lanza errores si los hay
 */
const editUserPass = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos id del usuario a cambiar la contraseña.
    const { idUser } = req.params;

    // Obtenemos la antigua contraseña y la nueva.
    const { oldPass, newPass } = req.body;

    // Validamos la contraseña.
    const verify = { password: newPass };
    await validate(passSchema, verify);

    // Si el usuario a editar no coincide con el usuario editando, mandamos error.
    if (req.userAuth.idUser !== Number(idUser)) {
      const error = new Error(
        'No puedes cambiar la contraseña de otro usuario.'
      );
      error.httpStatus = 403;
      throw error;
    }

    // Comprobamos que la contraseña antigua sea correcta.
    const [user] = await connection.query(
      `
    SELECT idUser, email FROM users WHERE idUser = ? AND password = SHA2(?,512)
    `,
      [idUser, oldPass]
    );

    // Lanzamos error si la contrasña no es la misma.
    if (user.length < 1) {
      const error = new Error('Contraseña incorrecta.');
      error.httpStatus = 401;
      throw error;
    }

    // Generamos un código de verificación
    const regCode = generateRandomString(20);

    // Cambiamos la contraseña en la base de datos y "desactivamos" al usuario hasta que lo verifique.
    await connection.query(
      `
    UPDATE users SET password = SHA2(?,512), modifiedAt = ?, renterActive = false, registrationCode = ? WHERE idUser = ?
    `,
      [newPass, formatDate(new Date()), regCode, idUser]
    );

    // Creamos el cuerpo del email.
    const emailBody = `
    <table>
        <thead>
            <th>Cambio de contraseña</th>
        </thead>
        <tbody>
            <td>
                Se ha solicitado un cambio de contraseña para el usuario registrado
                con este email en Perfect Renter.
                <br />
                Haz click en el botón para verificar el cambio.
                <br />
            </td>
        </tbody>
        <tfoot>
            <th>
                <button>
                <a href="http://192.168.1.16:4000/users/validate/${regCode}"
                >VERIFICAR CONTRASEÑA</a></button>
            </th>
        </tfoot>
    </table>
    `;

    // Envío de email.
    if (process.env.NODE_ENV !== 'test') {
      await sendMail({
        to: user[0].email,
        subject: 'Cambio de contraseña Perfect Renter',
        body: emailBody,
      });
    }

    res.send({
      status: 'ok',
      regCode,
      message:
        'Contraseña cambiada con éxito. Confirma el cambio haciendo click en el enlace que te hemos enviado al correo electónico.',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUserPass;
