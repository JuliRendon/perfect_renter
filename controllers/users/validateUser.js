// @ts-nocheck
const getDB = require('../../config/getDB');

const validateUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos el codigo de registro de los path params.
    const { registrationCode: regCode } = req.params;

    // Comprobamos que el usuario a validar, esté pendiente de validar.
    const [user] = await connection.query(
      `
    SELECT idUser FROM users WHERE registrationCode = ?
    `,
      [regCode]
    );

    // Si no hay usuario a validar, lanzamos error.
    if (user.length < 1) {
      const error = new Error('No hay usuarios pendientes de validar.');
      error.httpStatus = 404;
      throw error;
    }

    // Editamos el valor de activo/inactivo del usuario y cambiamos el codigo de registro a NULL
    await connection.query(
      `
    UPDATE users SET renterActive = true, registrationCode = NULL WHERE registrationCode = ?
    `,
      [regCode]
    );

    res.send({
      status: 'ok',
      message: 'Verificación completada',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = validateUser;
