// @ts-nocheck
const getDB = require('../../config/getDB');
const { formatDate, sendMail } = require('../../libs/helpers');
/**
 * @module Users
 */
/**
 * Middleware que pide unos datos al usuario para enviarle la solicitud de contacto a otro usuario.
 * @param {*} req Como "requests", se requiere el id del usuario y los datos de contacto del usuario que contacta.
 * @param {*} res El servidor lanza como respuesta un correo al usuario a contactar.
 * @param {*} next Envía al siguiente middleware, si existe. O lanza errores si los hay
 */
const contactUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    // Obtenemos el id del usuario a contactar.
    const { idUser } = req.params;

    // Obtenemos los datos del usuario que contacta.
    const { name, lastName, email, tel, comentarios, property } = req.body;

    // Si el usuario a contactar y el usuario contactado son el mismo, devolvemos error.
    if (Number(idUser) === req.userAuth.idUser) {
      const error = new Error('No puedes contactar contigo mismo.');
      error.httpStatus = 403;
      throw error;
    }

    // Si no están los datos obligatorios, lanzamos error.
    if (!name || !email || !comentarios) {
      const error = new Error('Faltan campos obligatorios.');
      error.httpStatus = 400;
      throw error;
    }

    // Seleccionamos la imagen, el nombre completo y el email del usuario a contactar. (PARA EL FRONTEND)
    const [user] = await connection.query(
      `
    SELECT name,lastName,avatar,email FROM users WHERE idUser = ?
    `,
      [idUser]
    );

    // Seleccionamos el nombre completo, el email, el teléfono del usuario que contacta. (PARA EL FRONTEND)
    const [contactUser] = await connection.query(
      `
      SELECT name,lastName,tel,email FROM users WHERE idUser = ?
      `,
      [req.userAuth.idUser]
    );

    // Definimos el body del email
    const emailBody = `
    <table>
      <tbody>
        <td>
          Hola ${user[0].name},
          un propietario ha contactado contigo.
          <br/>
          Datos del usuario:
          <ul>
            <li><b>Nombre completo:</b> ${name} ${lastName}</li>
            <li><b>Email:</b> ${email}</li>
            <li><b>Teléfono:</b> ${tel}</li>
            <li><b>Propiedad:</b><a href="http://192.168.1.16:3000/alquileres/${property}">Vivienda ofrecida</a></li>
          </ul>
          <br/>
          ${comentarios}
          <br/>
            Tienes a tu disposición el teléfono y el correo electrónico del usuario si deseas responder.
        </td>
      </tbody>
    </table>
    `;

    // Enviamos el correo del usuario que contacta, al usuario a contactar.
    if (process.env.NODE_ENV !== 'test') {
      await sendMail({
        to: user[0].email,
        subject: 'Contacto de propietario.',
        body: emailBody,
      });
    }

    res.send({
      status: 'ok',
      message: 'Correo electrónico enviado con éxito.',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = contactUser;
