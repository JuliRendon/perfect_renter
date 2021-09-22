const getDB = require('../../config/getDB');
/**
 * @module Properties
 */
/**
 * Middleware para listar propiedades
 * @param {*} req Puede tener parámetros de entrada como los orden o dirección
 * @param {*} res Como respuesta, se listan los datos básicos de todos las propiedades
 * @param {*} next Envía al siguiente middleware, si existe. O lanza errores si los hay
 * @returns {Promise} Devuelve una lista objetos con los datos
 */
const listProperties = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    // Obtenemos los queryParams en caso de que haya.
    const {
      order,
      direction,
      filtCity,
      filtProvince,
      filtType,
      filtPmax,
      filtPmin,
      filtRooms,
      filtGarage,
      filtToilets,
      filtMts,
    } = req.query;

    console.log(order, direction);

    // Establecemos opciones de validación de orden.
    const validOrderOptions = ['votes', 'createdAt', 'price'];

    // Establecemos opciones de valicadión de dirección
    const validDirectionOptions = ['DESC', 'ASC'];

    // Establecemos un orden por defecto
    const orderBy = validOrderOptions.includes(order) ? order : 'createdAt';

    // Establecemos una dirección por defecto
    const orderDirection = validDirectionOptions.includes(direction)
      ? direction
      : 'ASC';

    //Verificamos valores de los filtros y si no vienen les asignamos por defecto
    const city = filtCity ? filtCity : '%';
    const province = filtProvince ? filtProvince : '%';
    const type = filtType ? filtType : '%';
    const pmax = filtPmax ? filtPmax : 10000;
    const pmin = filtPmin ? filtPmin : 0;
    const rooms = filtRooms ? filtRooms : 1;
    const garage = filtGarage ? filtGarage : 1;
    const toilets = filtToilets ? filtToilets : 1;
    const mts = filtMts ? filtMts : 0;

    // Obtenemos los datos de todas las propiedades

    const [properties] = await connection.query(
      `SELECT properties.idProperty,
        properties.idUser,
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
        toilets,
        energyCertificate,
        availabilityDate,
        price,
        state, AVG(IFNULL(property_vote.voteValue, 0)) AS votes, properties.createdAt
        FROM properties
        LEFT JOIN votes AS property_vote ON (properties.idProperty = property_vote.idProperty)
        WHERE city LIKE ? AND province LIKE ? AND "type" LIKE ? AND (price BETWEEN ?
        AND ?) AND rooms >= ? AND garage >= ? AND toilets >= ?  AND mts >= ?
        group by properties.idProperty
        ORDER BY properties.${orderBy} ${orderDirection}
        `,
      [city, province, type, pmin, pmax, rooms, garage, toilets, mts]
    );

    //Si hay coincidencias para la query las devolvemos, sino mostramos mensaje de no encontrado
    if (properties.length === 0) {
      res.send({
        status: 'ok',
        message: 'No hay conicidencias para su busqueda',
      });
    } else {
      res.send({
        status: 'ok',
        properties,
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listProperties;
