const getDB = require('./getDB');
const faker = require('faker/locale/es');
const { format } = require('date-fns');
const fs = require('fs').promises;
const mysql = require('mysql2');
const path = require('path');

const { NODE_ENV, MYSQL_DATABASE, MYSQL_DATABASE_TEST } = process.env;
let connection;

/**
 * @module Database
 */
/**
 * Creación base de datos
 * @name InitDataBase
 * @returns {Promise} Crea la base de datos con los datos proporcionados por la dependencia Faker.
 */
async function main() {
  try {
    connection = await getDB();

    //Eliminación de tablas existentes
    await connection.query('DROP TABLE IF EXISTS photos');
    await connection.query('DROP TABLE IF EXISTS votes');
    await connection.query('DROP TABLE IF EXISTS bookings');
    await connection.query('DROP TABLE IF EXISTS properties');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS municipios');
    await connection.query('DROP TABLE IF EXISTS provincias');
    console.log('Tablas Eliminadas');

    /* Crearemos las tablas necesarias */

    /* Creamos la tabla provincias */
    await connection.query(
      `
    CREATE TABLE provincias (
      provinciaid decimal(2, 0) unsigned NOT NULL,
      provincia varchar(50) NOT NULL,
      PRIMARY KEY (provinciaid)
      );
      `
    );

    /* Creamos la tabla municipios */
    await connection.query(
      `
      CREATE TABLE municipios (
        internalid int unsigned NOT NULL,
        cp decimal(5,0) unsigned NOT NULL,
        calle varchar(100) DEFAULT NULL,
        poblacion varchar(100) NOT NULL,
        provinciaid decimal(2,0) unsigned NOT NULL,
        provincia varchar(100) DEFAULT NULL,
        paisid char(2) NOT NULL,
        pais varchar(100) DEFAULT NULL
        );
        `
    );

    /* Creamos la tabla users */
    await connection.query(`
        CREATE TABLE users (
            idUser INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100),
            lastName VARCHAR(100),
            tel VARCHAR(20),
            birthDate DATE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(512) NOT NULL,
            avatar VARCHAR(50),
            bio TEXT,
            city VARCHAR(50) NOT NULL,
            renterActive BOOLEAN DEFAULT false,
            deleted BOOLEAN DEFAULT false,
            role ENUM("admin", "renter", "tenant") DEFAULT "tenant" NOT NULL,
            registrationCode VARCHAR(100),
            recoverCode VARCHAR(100),
            createdAt DATETIME NOT NULL,
            modifiedAt DATETIME
        )
        `);

    // Creamos la tabla property  "Pisos en alquiler"
    await connection.query(`
        CREATE TABLE properties(
            idProperty INT PRIMARY KEY AUTO_INCREMENT,
            idUser INT NOT NULL,
            FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
            city VARCHAR(100),
            description VARCHAR(3000),
            province VARCHAR(100),
            address VARCHAR(100),
            zipCode VARCHAR(5),
            number INT,
            type ENUM("dúplex","casa","piso"),
            stair VARCHAR(50),
            flat INT,
            gate VARCHAR(20),
            mts DECIMAL(5,2),
            rooms INT,
            garage BOOLEAN,
            terrace BOOLEAN,
            elevator BOOLEAN,
            toilets INT,
            energyCertificate BOOLEAN,
            availabilityDate DATE,
            price DECIMAL(6,2),
            state ENUM("reservado", "alquilado", "disponible") NOT NULL DEFAULT "disponible",
            modifiedAt DATETIME,
            createdAt DATETIME NOT NULL
        )
    `);

    // Creamos la tabla votes.
    //   ---idVoted hace referencia a quien esta siendo calificado.
    //   ---idUser hace referencia a quien realiza el voto.
    await connection.query(`
        CREATE TABLE votes (
            idVote INT PRIMARY KEY AUTO_INCREMENT,
            voteValue TINYINT NOT NULL DEFAULT 3,
            voteValueRenter TINYINT NOT NULL DEFAULT 3,
            commentProperty VARCHAR(250),
            commentRenter VARCHAR(250),
            idTenant INT,
            FOREIGN KEY (idTenant) REFERENCES users(idUser) ON DELETE CASCADE,
            idProperty INT,
            idRenter INT NOT NULL,
            FOREIGN KEY (idRenter) REFERENCES users(idUser),
            CONSTRAINT votes_CK1 CHECK (voteValue IN(1, 2, 3, 4, 5)),
            createdAt DATETIME NOT NULL,
            modifiedAt DATETIME
        )
    `);

    // Creamos la tabla de reservas.
    await connection.query(`
        CREATE TABLE bookings (
            idBooking INT PRIMARY KEY AUTO_INCREMENT,
            idRenter INT,
            FOREIGN KEY (idRenter) REFERENCES users(idUser) ON DELETE CASCADE,
            idTenant INT,
            FOREIGN KEY (idTenant) REFERENCES users(idUser) ON DELETE CASCADE,
            idProperty INT,
            FOREIGN KEY (idProperty) REFERENCES properties(idProperty) ON DELETE CASCADE,
            createdAt DATETIME NOT NULL,
            modifiedAt DATETIME,
            startBookingDate DATE,
            endBookingDate DATE,
            state ENUM("reservado", "alquilada", "finalizada", "peticion", "cancelada-renter", "cancelada-tenant") NOT NULL DEFAULT "peticion",
            bookingCode VARCHAR(20)
            )
    `);

    // Creamos la tabla fotos
    await connection.query(`
        CREATE TABLE photos (
            idPhoto INT PRIMARY KEY AUTO_INCREMENT,
            idProperty INT NOT NULL,
            FOREIGN KEY (idProperty) REFERENCES properties(idProperty) ON DELETE CASCADE,
            name VARCHAR(100),
            createdAt DATETIME NOT NULL
        )
    `);

    // Obtenemos los datos de provincias y municipios
    const municipiosPath = path.join(__dirname, 'municipios.sql');
    const municipios = fs.readFile(municipiosPath, 'utf-8');
    const provinciasPath = path.join(__dirname, 'provincias.sql');
    const provincias = fs.readFile(provinciasPath, 'utf-8');
    // Insertamos datos
    await connection.query(`
    ${await municipios}
    `);
    await connection.query(`
    ${await provincias}
    `);
    console.log('Tablas creadas');

    // Insertamos el usuario administrador.
    await connection.query(`
    INSERT INTO users ( name, lastName, tel, email, password, role, createdAt, city, birthDate,avatar, bio)
    VALUES (
        "david",
        "losas",
        "123456789",
        "projectionseo@gmail.com",
        SHA2("Pr1234567", 512),
        "admin",
        "${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}",
        "A coruña",
        "1900-01-30",
        "davidlosas.jpg",
        "Solo acepto ofertas de viviendas procedentes de Guijuelo. Municipio y localidad española de la provincia de Salamanca, en la comunidad autónoma de Castilla y León."
    )
`);
    // Nº de usuarios que queremos introducir.
    const USERS = 10;
    const pictures = [
      'fotoperfil1.jpg',
      'fotoperfil2.jpg',
      'fotoperfil3.jpg',
      'fotoperfil4.jpg',
      'fotoperfil5.jpg',
      'fotoperfil6.jpg',
      'fotoperfil7.jpg',
      'fotoperfil8.jpg',
      'fotoperfil9.jpg',
      'fotoperfil10.jpg',
    ];
    // Insertamos los usuarios.
    for (let i = 0; i < USERS; i++) {
      // Datos de faker.
      const name = faker.name.findName();
      const lastName = faker.name.lastName();
      const phone = faker.phone.phoneNumber();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const city = faker.address.cityName();
      const birthDate = format(
        faker.date.between('1970-01-01', '2001-12-31'),
        'yyyy/MM/dd'
      );
      const bio =
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum amet natus eaque rem ad, minima iure.';
      const picture = pictures[i];
      // Fecha de creación.
      const createdAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      await connection.query(`
        INSERT INTO users ( name, lastName, tel, email, password, createdAt, city, birthDate, avatar, bio)
        VALUES ( "${name}", "${lastName}", "${phone}", "${email}", "${password}", "${createdAt}", "${city}", "${birthDate}", "${picture}", "${bio}" )
    `);
    }
    console.log('Usuarios creados');

    // Borramos los eventos de la base de datos en caso de que haya.
    const [events] = await connection.query(`
        SELECT * FROM INFORMATION_SCHEMA.EVENTS WHERE EVENT_SCHEMA ="${
          NODE_ENV === 'test' ? MYSQL_DATABASE_TEST : MYSQL_DATABASE
        }";
        `);
    events.forEach(async (event) => {
      await connection.query(
        `
      DROP EVENT ${event.EVENT_NAME};
      `
      );
    });
    // Habilitamos la creación de eventos en el servidor.
    await connection.query(`
        SET GLOBAL event_scheduler = ON;
        `);

    // Obtenemos los datos a introducir a la BBDD
    const CustomDataDatabasePath = path.join(__dirname, 'DatosBBDD.sql');
    const CustomDataDatabase = fs.readFile(CustomDataDatabasePath, 'utf-8');
    if (NODE_ENV !== 'test') {
      await connection.query(
        `
      ${await CustomDataDatabase}
      `
      );
    }
    console.log('Datos de prueba creados');
  } catch (error) {
    console.error(error.message);
    if (error.message === "Unknown database 'perfect_renter'") {
      return console.log(
        'La base de datos perfect_renter no existe, debes crearla previamente.'
      );
    }
  } finally {
    if (connection) connection.release();
    if (NODE_ENV !== 'test') {
      process.exit(0);
    }
  }
}

if (NODE_ENV !== 'test') {
  main();
}

module.exports = { main };
