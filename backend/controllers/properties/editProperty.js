// @ts-nocheck
const getDB = require('../../config/getDB');
const { savePhoto, formatDate, validate } = require('../../libs/helpers');
const { editPropertySchema } = require('../../models/propertySchema');

/**
 * @module Entries
 */
/**
 * Middleware para editar los datos de un alquiler
 * @param {*} req Como "requests", se requiere el id del usuario que solicita la petición y el id del usuario que se quiere editar, si no coincide se lanza un error
 * @param {*} res El servidor lanza como respuesta que los datos han sido actualizados
 * @param {*} next Envía al siguiente middleware, si existe. O lanza errores si los hay
 */

const editProperty = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos el id de la propiedad que queremos modificar.
    const { idProperty } = req.params;

    // Obtenemos el id del usuario que hace la request.
    const idReqUser = req.userAuth.idUser;

    // Obtenemos los datos editables
    let {
      city,
      province,
      address,
      zipCode,
      number,
      type,
      stair,
      flat,
      gate,
      mts,
      rooms,
      garage,
      terrace,
      elevator,
      toilets,
      energyCertificate,
      availabilityDate,
      price,
      description,
      state: state,
    } = req.body;

    // Obtenemos los datos de la vivienda a editar.
    const [property] = await connection.query(
      `
      SELECT * FROM properties
      WHERE idProperty = ?
      `,
      [idProperty]
    );

    let validateData;
    // Obtenemos la fecha de modificación.
    const modifiedAt = formatDate(new Date());

    /**
     * ###########
     * ## FOTOS ##
     * ###########
     *
     * Actualizamos Fotos.
     *
     */

    if (req.files && req.files.photo) {
      // Recorremos las fotos recibidas para subirlas.
      for (const photo of Object.values(req.files.photo)) {
        // Obtenemos la cantidad de fotos que tiene esa propiedad.
        const [photos] = await connection.query(
          `
      SELECT idPhoto FROM photos WHERE idProperty = ?
      `,
          [idProperty]
        );

        // Comprobamos que no haya más de 30 fotos.

        if (photos.length > 29) {
          const error = new Error('Solo puedes subir un máximo de 30 fotos.');
          error.httpStatus = 403;
          throw error;
        }
        let photoName;
        try {
          photoName = await savePhoto(photo);
        } catch (_) {
          const error = new Error('Formato incorrecto.');
          error.httpStatus = 400;
          throw error;
        }
        await connection.query(
          `
      INSERT INTO photos (name,idProperty,createdAt)
      VALUES (?,?,?)
      `,
          [photoName, idProperty, formatDate(new Date())]
        );
      }
    }
    /**
     * ##########
     * ## City ##
     * ##########
     *
     * Actualizamos el nombre de la ciudad.
     *
     */
    if (city && property[0].city !== city) {
      // Validamos la información recibida.
      validateData = { city };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET city = ?, modifiedAt = ? WHERE idProperty = ?`,
        [city, modifiedAt, idProperty]
      );
    }
    /**
     * ##############
     * ## PROVINCE ##
     * ##############
     *
     * Actualizamos el nombre de la provincia.
     *
     */
    if (province && property[0].province !== province) {
      // Validamos la información recibida.
      validateData = { province };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET province = ?, modifiedAt = ? WHERE idProperty = ?`,
        [province, modifiedAt, idProperty]
      );
    }
    /**
     * ############
     * ## ADRESS ##
     * ############
     *
     * Actualizamos la dirección de la vivienda.
     *
     */
    if (address && property[0].address !== address) {
      // Validamos la información recibida.
      validateData = { address };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET address = ?, modifiedAt = ? WHERE idProperty = ?`,
        [address, modifiedAt, idProperty]
      );
    }
    /**
     * #############
     * ## ZIPCODE ##
     * #############
     *
     * Actualizamos el codigo postal de la vivienda.
     *
     */
    if (zipCode && property[0].zipCode !== zipCode) {
      // Validamos la información recibida.
      validateData = { zipCode };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET zipCode = ?, modifiedAt = ? WHERE idProperty = ?`,
        [zipCode, modifiedAt, idProperty]
      );
    }
    /**
     * ############
     * ## NUMBER ##
     * ############
     *
     * Actualizamos el número de la vivienda.
     *
     */
    if (number && property[0].number !== number) {
      // Validamos la información recibida.
      validateData = { number };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET number = ?, modifiedAt = ? WHERE idProperty = ?`,
        [number, modifiedAt, idProperty]
      );
    }
    /**
     * ##########
     * ## TYPE ##
     * ##########
     *
     * Actualizamos el tipo de vivienda.
     *
     */
    if (type && property[0].type !== type) {
      // Validamos que el tipo sea los especificados en la base de datos. Si no, lanzamos error.
      if (type !== 'duplex' && type !== 'casa' && type !== 'piso') {
        const error = new Error('El tipo de vivienda no es válido.');
        error.httpStatus = 403;
        throw error;
      }

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET type = ?, modifiedAt = ? WHERE idProperty = ?`,
        [type, modifiedAt, idProperty]
      );
    }
    /**
     * ###########
     * ## STAIR ##
     * ###########
     *
     * Actualizamos la escalera de la vivienda.
     *
     */
    if (stair && property[0].stair !== stair) {
      // Validamos la información recibida.
      validateData = { stair };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET stair = ?, modifiedAt = ? WHERE idProperty = ?`,
        [stair, modifiedAt, idProperty]
      );
    }
    /**
     * ##########
     * ## FLAT ##
     * ##########
     *
     * Actualizamos el numero de piso de la vivienda.
     *
     */
    if (flat && property[0].flat !== flat) {
      // Validamos la información recibida.
      validateData = { flat };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET flat = ?, modifiedAt = ? WHERE idProperty = ?`,
        [flat, modifiedAt, idProperty]
      );
    }
    /**
     * ##########
     * ## GATE ##
     * ##########
     *
     * Actualizamos el numero de puerta de la vivienda.
     *
     */
    if (gate && property[0].gate !== gate) {
      // Validamos la información recibida.
      validateData = { gate };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET gate = ?, modifiedAt = ? WHERE idProperty = ?`,
        [gate, modifiedAt, idProperty]
      );
    }
    /**
     * ########
     * ## M2 ##
     * ########
     *
     * Actualizamos los metros al cuadrado de la vivienda.
     *
     */
    if (mts && property[0].mts !== mts) {
      // Validamos la información recibida.
      validateData = { mts };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET mts = ?, modifiedAt = ? WHERE idProperty = ?`,
        [mts, modifiedAt, idProperty]
      );
    }
    /**
     * ###############
     * ## BEEDROOMS ##
     * ###############
     *
     * Actualizamos las habitaciones de la vivienda.
     *
     */
    if (rooms && property[0].rooms !== rooms) {
      // Validamos la información recibida.
      validateData = { rooms };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET rooms = ?, modifiedAt = ? WHERE idProperty = ?`,
        [rooms, modifiedAt, idProperty]
      );
    }
    /**
     * ############
     * ## GARAGE ##
     * ############
     *
     * Actualizamos si la vivienda tiene garaje.
     *
     */

    //convertimos en número el dato booleanos
    if (garage === 'true') {
      garage = 1;
    } else {
      garage = 0;
    }

    if (garage && property[0].garage !== garage) {
      // Validamos la información recibida.
      validateData = { garage };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET garage = ?, modifiedAt = ? WHERE idProperty = ?`,
        [garage, modifiedAt, idProperty]
      );
    }
    /**
     * ##############
     * ## ELEVATOR ##
     * ##############
     *
     * Actualizamos si la vivienda tiene ascensor.
     *
     */

    //convertimos en número el dato booleanos
    if (elevator === 'true') {
      elevator = 1;
    } else {
      elevator = 0;
    }

    if (elevator && property[0].elevator !== elevator) {
      // Validamos la información recibida.
      validateData = { elevator };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET elevator = ?, modifiedAt = ? WHERE idProperty = ?`,
        [elevator, modifiedAt, idProperty]
      );
    }
    /**
     * #############
     * ## TERRACE ##
     * #############
     *
     * Actualizamos si la vivienda tiene terraza.
     *
     */
    //convertimos en número el dato booleanos

    if (terrace === 'true') {
      terrace = 1;
    } else {
      terrace = 0;
    }

    if (terrace && property[0].terrace !== terrace) {
      // Validamos la información recibida.
      validateData = { terrace };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET terrace = ?, modifiedAt = ? WHERE idProperty = ?`,
        [terrace, modifiedAt, idProperty]
      );
    }
    /**
     * #############
     * ## TOILETS ##
     * #############
     *
     * Actualizamos cuantos baños tiene la vivienda.
     *
     */
    if (toilets && property[0].toilets !== toilets) {
      // Validamos la información recibida.
      validateData = { toilets };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET toilets = ?, modifiedAt = ? WHERE idProperty = ?`,
        [toilets, modifiedAt, idProperty]
      );
    }
    /**
     * #######################
     * ## energyCertificate ##
     * #######################
     *
     * Actualizamos si la vivienda tiene certificado energético.
     *
     */
    //convertimos en número el dato booleanos
    if (energyCertificate === 'true') {
      energyCertificate = 1;
    } else {
      energyCertificate = 0;
    }
    if (
      energyCertificate &&
      property[0].energyCertificate !== energyCertificate
    ) {
      // Validamos la información recibida.
      validateData = { energyCertificate };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET energyCertificate = ?, modifiedAt = ? WHERE idProperty = ?`,
        [energyCertificate, modifiedAt, idProperty]
      );
    }
    /**
     * ######################
     * ## AVAILABILITYDATE ##
     * ######################
     *
     * Actualizamos la disponibilidad de la vivienda.
     *
     */
    if (availabilityDate && property[0].availabilityDate !== availabilityDate) {
      // Validamos la información recibida.

      const date = format(availabilityDate, 'yyyy-MM-dd');

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET availabilityDate = ?, modifiedAt = ? WHERE idProperty = ?`,
        [date, modifiedAt, idProperty]
      );
    }
    /**
     * ###########
     * ## PRICE ##
     * ###########
     *
     * Actualizamos el precio de la vivienda.
     *
     */
    if (price && property[0].price !== price) {
      // Validamos la información recibida.
      validateData = { price };
      await validate(editPropertySchema, validateData);

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET price = ?, modifiedAt = ? WHERE idProperty = ?`,
        [price, modifiedAt, idProperty]
      );
    }
    /**
     * #################
     * ## DESCRIPTION ##
     * #################
     *
     * Actualizamos la descripction de la vivienda.
     *
     */
    if (description && property[0].description !== description) {
      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET description = ?, modifiedAt = ? WHERE idProperty = ?`,
        [description, modifiedAt, idProperty]
      );
    }
    /**
     * ###########
     * ## STATE ##
     * ###########
     *
     * Actualizamos el estado de la vivienda.
     *
     */
    if (state && property[0].state !== state) {
      // Validamos que el tipo sea los especificados en la base de datos. Si no, lanzamos error.
      if (
        state !== 'reservado' &&
        state !== 'alquilado' &&
        state !== 'disponible'
      ) {
        const error = new Error('El estado de la vivienda no es válido.');
        error.httpStatus = 403;
        throw error;
      }

      // Actualizamos la información en la base de datos.
      await connection.query(
        `UPDATE properties SET state = ?, modifiedAt = ? WHERE idProperty = ?`,
        [state, modifiedAt, idProperty]
      );
    }
    res.send({
      status: 'ok',
      message: 'Vivienda actualizada.',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editProperty;
