// @ts-nocheck
const { format } = require('date-fns');
const getDB = require('../../config/getDB');
const {
  sendMail,
  generateRandomString,
  formatDate,
} = require('../../libs/helpers');
/**
 * @module Entries
 */
/**
 * Middleware que pide unos datos al usuario para enviarle la solicitud de contacto a un alquiler.
 * @param {*} req Como "requests", se requiere el id de la vivienda y los datos de contacto del usuario que contacta.
 * @param {*} res El servidor lanza como respuesta un correo al usuario a contactar.
 * @param {*} next Envía al siguiente middleware, si existe. O lanza errores si los hay
 */
const bookProperty = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    // Obtenemos el id de la vivienda a contactar.
    const { idProperty } = req.params;

    // Obtenemos el id del usuario que contacta.
    const { idUser: idReqUser } = req.userAuth;

    // Obtenemos los datos del usuario que contacta.
    let { name, lastName, email, tel, comentarios, startDate, endDate } =
      req.body;

    const now = formatDate(new Date());

    // Comprobamos que los campos obligatorios tengan contenido.

    if (!comentarios) {
      const error = new Error(
        'Debes añadir un comentario. EJM: Estoy interesado en su vivienda, me vendría bien contactar con usted.'
      );
      error.httpStatus = 400;
      throw error;
    }
    if (!startDate || !endDate) {
      const error = new Error('Falta definir la fecha de la reserva.');
      error.httpStatus = 400;
      throw error;
    }
    // Si la fecha reservada es menor a la fecha actual, lanzamos error.
    if (startDate < now) {
      const error = new Error('No puedes reservar en el pasado.');
      error.httpStatus = 403;
      throw error;
    }

    // Si la fecha end es menor a la fecha start, lanzamos error.
    if (endDate < startDate) {
      const error = new Error(
        'Fecha de salida debe ser mayor a la fecha de inicio'
      );
      error.httpStatus = 403;
      throw error;
    }

    // Seleccionamos la imagen, el nombre y la ciudad del alquiler contactar. (PARA EL FRONTEND)
    const [property] = await connection.query(
      `
        SELECT photos.name,properties.city, users.name AS ownerName, properties.idUser, users.email
        FROM properties
        LEFT JOIN photos ON properties.idProperty = photos.idProperty
        LEFT JOIN users ON users.idUser = properties.idUser
        WHERE properties.idProperty = ?
        `,
      [idProperty]
    );

    //  Comprobamos que no haya una solicitud en proceso de aceptar.
    const [valiDate] = await connection.query(
      `
      SELECT * FROM bookings WHERE ((startBookingDate BETWEEN ? AND ?)  OR (endBookingDate BETWEEN ? AND ?)) AND idProperty = ?
        `,
      [startDate, endDate, startDate, endDate, idProperty]
    );

    if (valiDate.length > 0) {
      res.send({
        status: 'ok',
        message:
          'Las fechas seleccionadas no estan disponibles para esta propiedad',
      });
    } else {
      const [petition] = await connection.query(
        `
      SELECT state FROM bookings WHERE idRenter = ? AND idTenant = ? AND idProperty = ? AND startBookingDate = ? AND endBookingDate = ?
        `,
        [property[0].idUser, idReqUser, idProperty, startDate, endDate]
      );

      // Si hay petición en proceso, lanzamos error y mostramos en que proceso está.
      if (petition.length > 0) {
        res.send({
          status: 'ok',
          Estado_de_la_peticion: `${petition[0].state}`,
          message:
            'Ya tienes petición en proceso para este alquiler. Si hay algún error, ponte en contacto con nosotros.',
        });
      } else {
        // Si el usuario es el dueño de la vivienda, lanzamos error.
        if (idReqUser === Number(property[0].idUser)) {
          const error = new Error(
            'No puedes contactar con una vivienda de tu propiedad.'
          );
          error.httpStatus = 403;
          throw error;
        }

        // Seleccionamos el nombre completo, el email, el teléfono del usuario que contacta. (PARA EL FRONTEND)
        const [contactUser] = await connection.query(
          `
      SELECT name,lastName,tel,email FROM users WHERE idUser = ?
      `,
          [idReqUser]
        );

        if (!name) {
          name = contactUser[0].name;
          if (!name) {
            const error = new Error('Falta el nombre.');
            error.httpStatus = 400;
            throw error;
          }
        }
        if (!lastName) {
          lastName = contactUser[0].lastName;
          if (!lastName) {
            const error = new Error('Falta el apellido.');
            error.httpStatus = 400;
            throw error;
          }
        }
        if (!email) {
          email = contactUser[0].email;
          if (!email) {
            const error = new Error('Falta el email.');
            error.httpStatus = 400;
            throw error;
          }
        }
        if (!tel) {
          tel = contactUser[0].tel;
          if (!tel) {
            tel = 'No especificado.';
          }
        }

        // Generamos el codigo de reserva,
        const bookingCode = generateRandomString(10);
        // Definimos el body del email
        const emailBody = `
      <style>
      table {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: sans-serif;
          font-size: calc((60% + 0.25vw));
          width: 100%;
          max-width: 50vw;
          height: 100%;
          box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
      }
      thead {
          height: 20vh;
          width: 100%;
          background: linear-gradient(rgba(16, 16, 16, 0.3),rgba(16, 16, 16, 0.9)),url('http://192.168.1.16:4000/photo/portada-nosotros.jpg');
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          position: relative;
      }
      .thead-tr {
          color: rgba(237,203,84,1);
          top: 0px;
          bottom: 0px;
          left: 0px;
          right: 0px;
          padding-left: 10%;
          padding-top: 10%;
          position: absolute;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 0px;
          opacity: 95%;
      }
      .thead-tr a {
          text-decoration: none;
          color: rgba(237,203,84,1);
      }
      .thead-tr a h3 {
          opacity: 90%;
          padding-left: 20px;
      }
      tbody {
          display: flex;
          flex-direction: column;
          align-items: center;
      }
      @media screen and (min-width: 600px){
          table {
              font-size: calc((100% + 0.25vw));
              max-width: 100vw;
              }
      }
  </style>
   <table>
     <thead>
          <tr class="thead-tr">
              <td>
                  <a href="http://192.168.1.16:3000/home" target="__blank" rel="noreferer"><h1 style="margin-bottom: -10px;">Perfect Renter</h1></a>
                  <h3>El lugar para encontrar tu hogar</h3>
              </td>
          </tr>
      </thead>
      <tbody style="width:100%; background-color: rgba(16, 16, 16, 0.02);">
          <td style="padding: 1rem;">
          <p>
              Hola <span style="font-weight: bold;">${property[0].ownerName}</span>,
              <br />
             un inquilino está interesado en tu vivienda de <span style="font-weight: bold;">${property[0].city}</span>.
          </p>
          <tr style="background-color: rgba(16, 16, 16, 0.05); width: 100%;">
              <td>
                  Datos del inquilino:
                  <ul>
                    <li><b>Nombre completo:</b> ${name} ${lastName}</li>
                    <li><b>Email:</b> ${email}</li>
                    <li><b>Teléfono:</b> ${tel}</li>
                    <li><b>Fecha de reserva:</b> Entrada: ${startDate} | Salida: ${endDate}</li>
                  </ul>
                  <br/>
                  <b>Información adicional:</b>
                  ${comentarios}
              </td>
          </tr>
          <tr>
              <td>
                <br/>
                Tienes a tu disposición el teléfono y el correo electrónico del interesado si deseas responder.
                <br/>
                Si quieres aceptar su solicitud de reserva, pulsa en el botón de aceptar reserva.
                <br/>
                Si por el contrario no está interesado, pulse el botón de cancelar.
              </td>
          </tr>
          </tbody>
          <tfoot>
            <th>
                <button>
                  <a href="http://192.168.1.16:3000/alquileres/${bookingCode}/accept"
                >ACEPTAR RESERVA</a></button>
                <span><span/>
                <span><span/>
                <button>
                  <a href="http://192.168.1.16:3000/alquileres/${bookingCode}/cancel"
                >CANCELAR RESERVA</a></button>
            </th>
          </tfoot>
        </table>
    `;

        const emailBodyReq = `
    <table>
      <tbody>
        <td>
          Hola ${contactUser[0].name},
          Se ha solicitado con éxito la reserva de la vivienda en ${property[0].city}
          <br/>
          Datos de la reserva:
          <ul>
          <li><b>Código de reserva:</b> ${bookingCode}</li>
            <li><b>Nombre completo:</b> ${name} ${lastName}</li>
            <li><b>Email:</b> ${email}</li>
            <li><b>Teléfono:</b> ${tel}</li>
            <li><b>Fecha de reserva:</b> Entrada: ${startDate} | Salida: ${endDate}</li>
          </ul>
          <br/>
          <b>Información adicional:</b>
          ${comentarios}
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
            <a href="http://192.168.1.16:3000/alquileres/${bookingCode}/cancel">CANCELAR RESERVA</a>
        </button>
        </th>
      </tfoot>
    </table>
    `;
        // Enviamos el correo del usuario que contacta, al usuario a contactar.
        if (process.env.NODE_ENV !== 'test') {
          await sendMail({
            to: property[0].email,
            subject: 'Solicitud de reserva.',
            body: emailBody,
          });

          // VALIDAR CORREO USUARIO QUE RESERVA
          await sendMail({
            to: email,
            subject: 'Solicitud de reserva.',
            body: emailBodyReq,
          });
        }

        //   // Agregamos el código de reserva en la base de datos junto a la posible reserva.
        await connection.query(
          `
        INSERT INTO bookings(bookingCode,idRenter,idTenant,createdAt,idProperty,startBookingDate,endBookingDate) VALUES (?,?,?,?,?,?,?);
        `,
          [
            bookingCode,
            property[0].idUser,
            idReqUser,
            formatDate(new Date()),
            idProperty,
            startDate,
            endDate,
          ]
        );

        res.send({
          status: 'ok',
          message: 'Correo electrónico enviado con éxito.',
          bookingCode,
        });
      }
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = bookProperty;
