// @ts-nocheck
const getDB = require('../../config/getDB');
const {
  sendMail,
  generateRandomString,
  formatDate,
} = require('../../libs/helpers');
/**
 * @module Users
 */
/**
 * Middleware que genera un enlace de cambio de contraseña y lo envía al correo
 * @param {*} req Como "requests", se requiere un email válido, de no ser así, se lanza un error
 * @param {*} res El servidor lanza como respuesta un correo para el correcto cambio de la contraseña
 * @param {*} next Envía al siguiente middleware, si existe. O lanza errores si los hay
 */
const recoverUserPass = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    // Obtenemos el email del usuario.
    const { email } = req.body;

    // Si el campo de email está vacío, lanzamos un error.
    if (!email) {
      const error = new Error('Escribe un correo electrónico válido.');
      error.httpStatus = 400;
      throw error;
    }

    // Obtenemos el usuario
    const [user] = await connection.query(
      `
      SELECT idUser FROM users WHERE email = ?
      `,
      [email]
    );

    // Comprobamos que exista el usuario con el email proporcionado. Si no existe, lanzamos error.
    if (user.length < 1) {
      const error = new Error(
        'No existe ningún usuario con ese email, por favor, comprueba que el email sea correcto.'
      );
      error.httpStatus = 404;
      throw error;
    }

    // Generamos el recoverCode,
    const recoverCode = generateRandomString(20);

    // Creamos el cuerpo del email.
    const emailBody = `
        <table>
            <thead>
                <th>Recuperación de contraseña</th>
            </thead>
            <tbody>
                <td>
                    Se ha solicitado un cambio de contraseña para el usuario registrado
                    con este email en Perfect Renter.
                    <br />
                    Haz click en el botón recuperar contraseña para cambiarla.
                    <br />
                    Si no has sido tú, por favor, ignora este email.
                </td>
            </tbody>
            <tfoot>
                <td>
                    <button>
                    <a href="http://192.168.1.16:3000/recuperar/${user[0].idUser}/${recoverCode}"
                    >RECUPERAR CONTRASEÑA</a></button>
               </td>
            </tfoot>
        </table>
    `;

    // Envío de email.
    if (process.env.NODE_ENV !== 'test') {
      await sendMail({
        to: email,
        subject: 'Cambio de contraseña Perfect Renter',
        body: emailBody,
      });
    }

    // Agregamos el código de recuperación al usuario en la base de datos.
    await connection.query(
      `
    UPDATE users SET recoverCode = ?, modifiedAt = ? WHERE email = ?
    `,
      [recoverCode, formatDate(new Date()), email]
    );

    res.send({
      status: 'ok',
      message: 'Email enviado con éxito.',
      info: { recoverCode, idUser: user[0].idUser },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = recoverUserPass;
