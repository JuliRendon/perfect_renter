// @ts-nocheck
const { format } = require('date-fns');
const getDB = require('../../config/getDB');
const {
  sendMail,
  formatDate,
  generateRandomString,
} = require('../../libs/helpers');
/**
 * @module Entries */
/**
 * Middleware que valida una reserva
 * @param {*} req Como "requests", se requiere el código que viene en la URL
 * @param {*} res El servidor confirma la validación si no hay errores
 * @param {*} next Envía al siguiente middleware, si existe. O lanza errores si los hay
 */
const editBooking = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    // Obtenemos el codigo de reserva de los path params.
    const { idProperty, bookingCode } = req.params;

    // Obtenemos las nuevas fechas
    const { startDate, endDate, city, name, lastName, tel, email } = req.body;
    // Obtenemos el id del usuario que cambia la reserva (INQUILINO)
    const { idUser } = req.userAuth;

    // Obtenemos los datos de la reserva
    const [booking] = await connection.query(
      `SELECT *
      FROM bookings b
      WHERE idProperty = ? AND bookingCode = ? AND idTenant = ?
      `,
      [idProperty, bookingCode, idUser]
    );

    // Obtenemos los datos del usuario propietario
    const [owner] = await connection.query(
      `
    SELECT email,name
    FROM users
    WHERE idUser = ?
    `,
      [booking[0].idRenter]
    );

    // Si la reserva no existe enviamos error
    if (booking.length < 1) {
      const error = new Error('La reserva no existe.');
      error.httpStatus = 404;
      throw error;
    }
    // Si no se han enviado fechas de reserva, lanzamos error
    if (!startDate || !endDate) {
      const error = new Error('Falta definir la fecha de la reserva.');
      error.httpStatus = 400;
      throw error;
    }

    // Generamos el nuevo codigo de reserva, al ser una nueva reserva
    const newBookingCode = generateRandomString(10);
    // Formateamos las fechas para insertarlas en la base de datos
    const modifiedAt = formatDate(new Date());
    // Definimos el body del email
    const emailBody = `
    <table>
      <tbody>
        <td>
          Hola ${owner[0].name},
          tu inquilino ha solicitado un cambio de fechas en tu vivienda de ${city}.
          <br/>
          Datos del inquilino:
          <ul>
            <li><b>Nombre completo:</b> ${name} ${lastName}</li>
            <li><b>Email:</b> ${email}</li>
            <li><b>Teléfono:</b> ${tel}</li>
            <li><b>Fecha de reserva:</b> Entrada: ${startDate} | Salida: ${endDate}</li>
          </ul>
      </tbody>
      <tbody>
          <td>
            <br/>
            Tienes a tu disposición el teléfono y el correo electrónico del interesado si deseas responder.
            <br/>
            Si quieres aceptar su solicitud de reserva, pulsa en el botón de aceptar reserva.
            <br/>
            Si por el contrario no está interesado en el cambio, pulse el botón de cancelar.
          </td>
      </tbody>
      <tfoot>
        <th>
            <button>
              <a href="http://192.168.1.16:3000/alquileres/${newBookingCode}/accept"
            >ACEPTAR RESERVA</a></button>
            <span><span/>
            <span><span/>
            <button>
              <a href="http://192.168.1.16:3000/alquileres/${newBookingCode}/cancel"
            >CANCELAR RESERVA</a></button>
        </th>
      </tfoot>
    </table>
    `;

    const emailBodyReq = `
    <table>
      <tbody>
        <td>
          Hola ${name},
          Se ha solicitado con éxito la nueva reserva de la vivienda en ${city}
          <br/>
          Datos de la reserva:
          <ul>
          <li><b>Código de reserva:</b> ${newBookingCode}</li>
        <li><b>Nombre completo:</b> ${name} ${lastName}</li>
            <li><b>Email:</b> ${email}</li>
            <li><b>Teléfono:</b> ${tel}</li>
            <li><b>Fecha de reserva:</b> Entrada: ${startDate} | Salida: ${endDate}</li>
          </ul>
      </tbody>
      <tbody>
          <td>
            <br/>
            Si quieres cancelar la solicitud de reserva, pulsa en el botón de cancelar reserva.
            <br/>
          </td>
      </tbody>
      <tfoot>
        <th>
        <button>
            <a href="http://192.168.1.16:3000/alquileres/${newBookingCode}/cancel">CANCELAR RESERVA</a>
        </button>
        </th>
      </tfoot>
    </table>
    `;

    // Enviamos el correo a ambos.
    if (process.env.NODE_ENV !== 'test') {
      await sendMail({
        to: owner[0].email,
        subject: 'Cambio de reserva.',
        body: emailBody,
      });
      // VALIDAR CORREO USUARIO QUE RESERVA
      await sendMail({
        to: email,
        subject: 'Copia cambio de reserva.',
        body: emailBodyReq,
      });
    }
    // Editamos los eventos SQL
    await connection.query(
      `
    DROP EVENT ${bookingCode}_event_start
    `
    );

    await connection.query(
      `
    DROP EVENT ${bookingCode}_event_end
    `
    );
    // Editamos los datos de la reserva a la nueva reserva
    await connection.query(
      `
    UPDATE bookings SET bookingCode = ?, modifiedAt = ?, startBookingDate = ?, endBookingDate = ?, state = "peticion" WHERE idBooking = ?
      `,
      [newBookingCode, modifiedAt, startDate, endDate, booking[0].idBooking]
    );

    res.send({
      status: 'ok',
      message: 'Reserva editada con éxito.',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editBooking;
