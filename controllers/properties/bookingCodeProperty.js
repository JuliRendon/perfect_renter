// @ts-nocheck
const getDB = require('../../config/getDB');
const { sendMail } = require('../../libs/helpers');
/**
 * @module Entries */
/**
 * Middleware que valida una reserva
 * @param {*} req Como "requests", se requiere el código que viene en la URL
 * @param {*} res El servidor confirma la validación si no hay errores
 * @param {*} next Envía al siguiente middleware, si existe. O lanza errores si los hay
 */
const bookingCodeProperty = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos el codigo de registro de los path params.
    const { bookingCode: regCode } = req.params;

    //Verificamos que la propiedad y el inquilino existen
    const [property] = await connection.query(
      `SELECT b.idProperty, b.idRenter
      FROM bookings b
      WHERE bookingCode = ?`,
      [idProperty, idRenter]
    );

    // si la propiedad no existe enviamos error
    if (property.length < 1) {
      const error = new Error('La vivienda no existe');
      error.httpStatus = 404;
      throw error;
    }

    // Comprobamos que la reserva a validar, está pendiente de aceptar.
    const [booking] = await connection.query(
      `
      SELECT idBooking, b.state, properties.city, u1.email as RenterEmail, u1.name as RenterName, u2.email as TenantEmail, u2.name AS TenantName
      FROM bookings b
      LEFT JOIN properties ON b.idProperty = properties.idProperty
      LEFT JOIN users as u1 ON b.idRenter = u1.idUser
      LEFT JOIN users as u2 ON b.idTenant = u2.idUser
      WHERE bookingCode = ?
    `,
      [regCode]
    );

    // Si no hay reserva para aceptar, lanzamos error.
    if (booking.state !== 'peticion') {
      const error = new Error('No hay reserva pendiente de aceptar.');
      error.httpStatus = 404;
      throw error;
    }
    // Una vez aceptada enviammos email a ambos usuarios

    // Email para el inquilino
    let emailBody = `
    <table>
      <tbody>
        <td>
          Hola ${booking[0].RenterName},
          la reserva de la vivienda de ${booking[0].city} ha sido aceptada .
        </td>
      </tbody>
    </table>
    `;

    // Enviamos el correo al inquilino
    await sendMail({
      to: booking[0].RenterEmail,
      subject: 'Reserva de alquiler',
      body: emailBody,
    });

    //Email para el dueño que aceptó la reserva
    emailBody = `
    <table>
      <tbody>
        <td>
          Hola ${booking[0].TenantName},
          la reserva de la vivienda de ${booking[0].city} ha sido realizada .
        </td>
      </tbody>
    </table>
    `;

    // Enviamos el correo al dueño de la viviendo
    await sendMail({
      to: booking[0].TenantEmail,
      subject: 'Reserva de alquiler',
      body: emailBody,
    });

    // Aceptada la reserva, cambiamos el estado de la reserva de "petición" a "reservado"
    await connection.query(
      `
    UPDATE bookings SET state = "reservado" WHERE bookingCode = ?
    `,
      [regCode]
    );

    res.send({
      status: 'ok',
      message: 'Reserva aceptada',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = bookingCodeProperty;
