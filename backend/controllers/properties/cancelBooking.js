// @ts-nocheck
const getDB = require('../../config/getDB');
const { sendMail, formatDate } = require('../..//libs/helpers');
const { format } = require('date-fns');

const cancelBooking = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    //Recuperamos los parametros de la reserva a cancelar
    const { bookingCode } = req.params;

    // Obtenemos el id del usuario que hace la request.
    const idUser = req.userAuth.idUser;

    //Verificamos que exista la solicitud de reserva en la BD
    const [booking] = await connection.query(
      `
            SELECT * FROM bookings WHERE bookingCode = ? AND idTenant = ? OR bookingCode = ? AND idRenter = ?
       `,
      [bookingCode, idUser, bookingCode, idUser]
    );

    if (booking.length === 0) {
      const error = new Error('No hay reservas pendientes con ese codigo');
      error.httpStatus = 400;
      throw error;
    }

    // const date = format(booking[0].modifiedAt, 'dd/MM/yyyy');
    // const time = format(booking[0].modifiedAt, 'HH:mm:ss');

    // Comprobamos que la reserva no esté en cancelada.
    if (booking[0].state.includes('cancelada')) {
      const error = new Error(
        `La reserva ya ha fue cancelada el ${booking[0].modifiedAt}.`
      );
      error.httpStatus = 400;
      throw error;
    }

    // Seleccionamos los datos de los usuarios.
    // INQUILINO
    const [userRenter] = await connection.query(
      `
          SELECT name, email FROM users WHERE idUser = ?
    `,
      [booking[0].idRenter]
    );
    // CASERO
    const [userTenant] = await connection.query(
      `
          SELECT name, email FROM users WHERE idUser = ?
    `,
      [booking[0].idTenant]
    );

    // Mensaje que enviaremos al usuario.
    let emailBodyRenter;
    let emailBodyTenant;

    // Definimos la fecha de modificación
    const modifiedAt = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
    //Verificamos si la cancelacion la hace el tenant o el renter y lo registramos
    if (idUser === booking[0].idRenter) {
      await connection.query(
        `
            UPDATE bookings SET state = "cancelada-renter", modifiedAt = ? WHERE bookingCode = ?
        `,
        [modifiedAt, bookingCode]
      );

      emailBodyRenter = `
      <table>
        <thead>
            <th>Confirmación de Cancelación Reserva ${booking[0].bookingCode}</th>
        </thead>
        <tbody>
            <td>
              Hola ${userRenter[0].name}
              Se ha registrado correctamente la cancelación de la reserva de ${userTenant[0].name}.
            </td>
            <br/>
            <td>
            La reserva ha sido cancelada el ${modifiedAt}.
            </td>
        </tbody>
        <tfoot>
        <td>
            Si tienes alguna pregunta no dudes en escribirnos.
        </td>
        </tfoot>
      </table>
    `;
      emailBodyTenant = `
      <table>
        <thead>
            <th>Confirmación de Cancelación Reserva ${booking[0].bookingCode}</th>
        </thead>
        <tbody>
            <td>
              Hola ${userTenant[0].name}
              Lamentamos informarte que el usuario ${userRenter[0].name} ha Anulado la reserva que tenías.
            </td>
            <br/>
            <td>
            La reserva ha sido cancelada el ${modifiedAt}.
            </td>
        </tbody>
        <tfoot>
        <td>
            Si tienes alguna pregunta no dudes en escribirnos.
        </td>
        </tfoot>
      </table>
    `;
    } else if (idUser === booking[0].idTenant) {
      await connection.query(
        `
            UPDATE bookings SET state = "cancelada-tenant", modifiedAt = ? WHERE bookingCode = ?
            `,
        [modifiedAt, bookingCode]
      );
      emailBodyRenter = `
      <table>
        <thead>
            <th>Confirmación de Cancelación Reserva ${booking[0].bookingCode}</th>
        </thead>
        <tbody>
            <td>
              Hola ${userRenter[0].name}
              Lamentamos informarte que el usuario ${userTenant[0].name} ha Anulado la reserva que tenias.
            </td>
            <br/>
            <td>
            La reserva ha sido cancelada el ${modifiedAt}.
            </td>
        </tbody>
        <tfoot>
        <td>
            Si tienes alguna pregunta no dudes en escribirnos.
        </td>
        </tfoot>
      </table>
    `;
      emailBodyTenant = `
      <table>
        <thead>
            <th>Confirmación de Cancelación Reserva ${booking[0].bookingCode}</th>
        </thead>
        <tbody>
            <td>
              Hola ${userTenant[0].name}
              Se ha registrado correctamente la cancelación de la reserva de la propiedad de ${userRenter[0].name}.
            </td>
            <br/>
            <td>
            La reserva ha sido cancelada el ${modifiedAt}.
            </td>
        </tbody>
        <tfoot>
        <td>
            Si tienes alguna pregunta no dudes en escribirnos.
        </td>
        </tfoot>
      </table>
    `;
    } else {
      const error = new Error('No hay reservas asociadas a su usuario');
      error.httpStatus = 400;
      throw error;
    }

    await sendMail({
      to: userRenter[0].email,
      subject: 'Cancelación de reserva',
      body: emailBodyRenter,
    });
    await sendMail({
      to: userTenant[0].email,
      subject: 'Cancelación de reserva',
      body: emailBodyTenant,
    });

    res.send({
      status: 'ok',
      message: 'La reserva ha sido cancelada Correctamente',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = cancelBooking;
