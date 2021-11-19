const supertest = require('supertest');
const { main } = require('../config/initDB');
const path = require('path');
const fs = require('fs').promises;
const { app, server } = require('../app');
const api = supertest(app);
const { getToken, getToken2, getToken3, createProperty } = require('./helpers');
const { deletePhoto } = require('../libs/helpers');

beforeAll(async () => {
  // connection = await getDB();
  await main();
});

describe('User POST Endpoints', () => {
  test('Registro un usuario.', async () => {
    const body = {
      name: 'Manu',
      lastName: 'Torres Torres',
      email: 'testEmail1@gmail.com',
      password: 'manuTorres1',
      bio: 'Empezando los tests con jest.',
      city: 'Barcelona',
      birthDate: '1996-07-14',
    };
    const res = await api.post('/users').send(body);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe(
      'Usuario registrado, comprueba tu email para activarlo.'
    );
  });

  test('Registro un usuario sin email.', async () => {
    const body = {
      name: 'Manu',
      lastName: 'Torres Torres',
      email: '',
      password: 'manuTorres1',
      bio: 'Empezando los tests con jest.',
      city: 'Barcelona',
      birthDate: '1996-07-14',
    };
    const res = await api.post('/users').send(body);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Se requiere un email.');
  });

  test('Registro un usuario sin contraseña.', async () => {
    const body = {
      name: 'Manu',
      lastName: 'Torres Torres',
      email: 'manutorres96@gmail.com',
      password: '',
      bio: 'Empezando los tests con jest.',
      city: 'Barcelona',
      birthDate: '1996-07-14',
    };
    const res = await api.post('/users').send(body);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Se requiere una contraseña.');
  });

  test('Registro un usuario con un correo existente.', async () => {
    const body = {
      name: 'Manu',
      lastName: 'Torres Torres',
      email: 'testEmail1@gmail.com',
      password: 'manuTorres1',
      bio: 'Empezando los tests con jest.',
      city: 'Barcelona',
      birthDate: '1996-07-14',
    };
    const res = await api.post('/users').send(body);
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toBe(
      'Ya existe un usuario registrado con ese email.'
    );
  });

  test('Registro un usuario sin nombre.', async () => {
    const body = {
      name: '',
      lastName: 'Torres Torres',
      email: 'manutorres96@gmail.com',
      password: 'manuTorres1',
      bio: 'Empezando los tests con jest.',
      city: 'Barcelona',
      birthDate: '1996-07-14',
    };
    const res = await api.post('/users').send(body);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Se requiere un nombre para el usuario.');
  });

  test('Registro un usuario sin algun campo obligatorio.', async () => {
    const body = {
      name: 'Manu',
      lastName: 'Torres Torres',
      email: 'manutorres96@gmail.com',
      password: 'manuTorres1',
      bio: 'Empezando los tests con jest.',
      city: '',
      birthDate: '1996-07-14',
    };
    const res = await api.post('/users').send(body);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Debes escribir una ciudad.');
  });

  test('Registro un usuario sin datos.', async () => {
    const body = {};
    const res = await api.post('/users').send(body);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Se requiere un email.');
  });

  test('Registro un usuario y se valida.', async () => {
    const body = {
      name: 'Manu',
      lastName: 'Torres Torres',
      email: 'testEmail@gmail.com',
      password: 'manuTorres1',
      bio: 'Empezando los tests con jest.',
      city: 'Barcelona',
      birthDate: '1996-07-14',
    };
    const res = await api.post('/users').send(body);
    const resVal = await api.get(
      `/users/validate/${res.body.registrationCode}`
    );
    expect(resVal.statusCode).toEqual(200);
    expect(resVal.body.message).toBe('Verificación completada');
  });

  test('Login de un usuario.', async () => {
    const body = {
      email: 'testEmail@gmail.com',
      password: 'manuTorres1',
    };
    const res = await api.post('/users/login').send(body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe(
      'Sesión iniciada con éxito, se te redirigirá a la pantalla principal.'
    );
  });

  test('Login de un usuario sin validar.', async () => {
    const body = {
      email: 'testEmail1@gmail.com',
      password: 'manuTorres1',
    };
    const res = await api.post('/users/login').send(body);
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Usuario pendiente de validar.');
  });

  test('Login de un usuario sin algun campo obligatorio.', async () => {
    const body = {
      email: 'testEmail@gmail.com',
      password: '',
    };
    const res = await api.post('/users/login').send(body);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Faltan campos.');
  });

  test('Contactar a un usuario.', async () => {
    const token = await getToken();

    const body = {
      email: 'testEmail@gmail.com',
      name: 'Manu',
      lastName: 'Torres',
      comentarios:
        'Hola, veo que vives por A Coruña, te interesaría ver un piso de estas propiedades: etc etc etc',
    };

    const resContact = await api
      .post(`/users/12/contact`)
      .set({ Authorization: token })
      .send(body);
    expect(resContact.statusCode).toEqual(200);
    expect(resContact.body.message).toBe(
      'Correo electrónico enviado con éxito.'
    );
  });

  test('Contactar a un usuario con el mismo id del que solicita.', async () => {
    const token = await getToken();
    const body = {
      email: 'testEmail@gmail.com',
      name: 'Manu',
      lastName: 'Torres',
      comentarios:
        'Hola, veo que vives por A Coruña, te interesaría ver un piso de estas propiedades: etc etc etc',
    };
    const resContact = await api
      .post(`/users/13/contact`)
      .set({ Authorization: token })
      .send(body);
    expect(resContact.statusCode).toEqual(403);
    expect(resContact.body.message).toBe('No puedes contactar contigo mismo.');
  });

  test('Contactar a un usuario sin algun campo obligatorio.', async () => {
    const token = await getToken();

    const body = {
      email: '',
      name: 'Manu',
      lastName: 'Torres',
      comentarios:
        'Hola, veo que vives por A Coruña, te interesaría ver un piso de estas propiedades: etc etc etc',
    };

    const resContact = await api
      .post(`/users/12/contact`)
      .set({ Authorization: token })
      .send(body);
    expect(resContact.statusCode).toEqual(400);
    expect(resContact.body.message).toBe('Faltan campos obligatorios.');
  });

  test('Votar un usuario con valores erróneos.', async () => {
    // token
    const token = await getToken();
    const idProperty = await createProperty(6, 'Zaragoza', 'Zaragoza');
    // token3
    const { id: idUser, token: token3 } = await getToken3();

    const resBook = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token3 })
      .send({
        comentarios:
          'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
        startDate: '2022-10-03',
        endDate: '2022-10-29',
      });

    const res = await api
      .post(`/users/${idUser}/votes`)
      .set({ authorization: token })
      .send({
        voteValueRenter: 6,
        commentary: 'Es muy sucio la verdad',
        idProperty: idProperty,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe(
      'El voto debe ser un valor entero entre 1 y 5.'
    );
  });

  test('Votar un usuario sin relación entre ambos.', async () => {
    // token
    const token = await getToken();
    const idProperty = await createProperty(8, 'Zaragoza', 'Zaragoza');
    // token3
    const { id: idUser, token: token3 } = await getToken3();

    const res = await api
      .post(`/users/${idUser}/votes`)
      .set({ authorization: token })
      .send({
        voteValueRenter: 6,
        commentary: 'Es muy sucio la verdad',
        idProperty: idProperty,
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toBe(
      'No puedes votar un usuario con el que no has tenido relación.'
    );
  });

  test('Votar un usuario.', async () => {
    // token
    const token = await getToken();
    const idProperty = await createProperty(8, 'Cadiz', 'Cadiz');
    // token3
    const { id: idUser, token: token3 } = await getToken3();

    const resBook = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token3 })
      .send({
        comentarios:
          'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
        startDate: '2022-12-03',
        endDate: '2022-12-29',
      });

    const res = await api
      .post(`/users/${idUser}/votes`)
      .set({ authorization: token })
      .send({
        voteValueRenter: 1,
        commentary: 'Es muy sucio la verdad',
        idProperty: idProperty,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('El voto ha sido creado con éxito.');
  });
});

describe('User GET endpoints', () => {
  test('Obtener una lista de usuarios.', async () => {
    const token = await getToken();
    const resList = await api.get('/users').set({ Authorization: token });
    expect(resList.statusCode).toEqual(200);
    expect(resList.body).toHaveProperty('users');
    expect(resList.body.users).toHaveLength(resList.body.users.length);
  });

  test('Obtener una lista de usuarios sin autorización.', async () => {
    const resList = await api.get('/users').set({ Authorization: '' });
    expect(resList.statusCode).toEqual(401);
    expect(resList.body.message).toBe('Falta la cabecera de autorización');
  });

  test('Obtener un usuario en concreto.', async () => {
    const token = await getToken();

    const resGetUser = await api.get('/users/3').set({ Authorization: token });
    expect(resGetUser.statusCode).toEqual(200);
    expect(resGetUser.body).toHaveProperty('userInfo');
    expect(resGetUser.body.userInfo).toHaveProperty('idUser');
    expect(resGetUser.body.userInfo.idUser).toBe(3);
  });

  test('Obtener un usuario inexistente.', async () => {
    const token = await getToken();

    const resGetUser = await api
      .get('/users/100')
      .set({ Authorization: token });
    expect(resGetUser.statusCode).toEqual(404);
    expect(resGetUser.body.message).toBe('El usuario no existe.');
  });

  test('Obtener un usuario sin autorización.', async () => {
    const resList = await api.get('/users/3').set({ Authorization: '' });
    expect(resList.statusCode).toEqual(401);
    expect(resList.body.message).toBe('Falta la cabecera de autorización');
  });

  test('Obtener un usuario en concreto, el mismo que el token.', async () => {
    const token = await getToken();
    const resGetUser = await api.get('/users/13').set({ Authorization: token });
    expect(resGetUser.statusCode).toEqual(200);
    expect(resGetUser.body).toHaveProperty('userInfo');
    expect(resGetUser.body.userInfo).toHaveProperty('idUser');
    expect(resGetUser.body.userInfo.idUser).toBe(13);
    expect(resGetUser.body.userInfo).toHaveProperty('email');
  });

  test('Listar valoraciones de un usuario.', async () => {
    const token = await getToken();
    const resListVotes = await api
      .get('/users/3/votes')
      .set({ Authorization: token });
    expect(resListVotes.statusCode).toEqual(200);
    expect(resListVotes.body).toHaveProperty('Valoraciones');
  });

  test('Listar valoraciones de un usuario sin autorización.', async () => {
    const body = {
      email: 'testEmail@gmail.com',
      password: 'manuTorres1',
    };
    const res = await api.post('/users/login').send(body);

    const resListVotes = await api
      .get('/users/3/votes')
      .set({ Authorization: '' });
    expect(resListVotes.statusCode).toEqual(401);
    expect(resListVotes.body.message).toBe('Falta la cabecera de autorización');
  });

  test('Listar valoraciones de un usuario que no tiene ninguna.', async () => {
    const { id: idUser, token: token3 } = await getToken3();
    const idProperty = await createProperty(5, 'Madrid', 'Fuenlabrada');
    const resBook = await api
      .post(`/properties/${idProperty}/contact`)
      .set({ authorization: token3 })
      .send({
        comentarios:
          'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
        startDate: '2022-10-03',
        endDate: '2022-10-29',
      });

    const res = await api.get(`/users/1/votes`).set({ authorization: token3 });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('Valoraciones');
  });

  test('Listar reservas de un usuario.', async () => {
    const { id: idUser, token: token3 } = await getToken3();
    const idProperty = await createProperty(12, 'Madrid', 'Fuenlabrada');
    const resBook = await api
      .post(`/properties/${idProperty}/contact`)
      .set({ authorization: token3 })
      .send({
        comentarios:
          'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
        startDate: '2022-10-03',
        endDate: '2022-10-29',
      });
    const res = await api
      .get(`/users/${idUser}/bookings`)
      .set({ authorization: token3 });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('bookings');
    expect(res.body.bookings).toHaveLength(res.body.bookings.length);
  });

  test('Listar reservas de un usuario con otro id.', async () => {
    const { id: idUser, token: token3 } = await getToken3();
    const idProperty = await createProperty(18, 'Madrid', 'Fuenlabrada');
    const resBook = await api
      .post(`/properties/${idProperty}/contact`)
      .set({ authorization: token3 })
      .send({
        comentarios:
          'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
        startDate: '2022-10-03',
        endDate: '2022-10-29',
      });

    const res = await api
      .get(`/users/1/bookings`)
      .set({ authorization: token3 });

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toBe('No tienes permisos.');
  });
});

describe('User PUT Endpoints', () => {
  test('Reset contraseña usuario.', async () => {
    const body = {
      email: 'testEmail@gmail.com',
    };
    const res = await api.put('/users/password/recover').send(body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('info');
    expect(res.body.info.recoverCode).toHaveLength(40);
  });

  test('Reset contraseña usuario con email erróneo.', async () => {
    const body = {
      email: 'testEmail@gmail.co',
    };
    const res = await api.put('/users/password/recover').send(body);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe(
      'No existe ningún usuario con ese email, por favor, comprueba que el email sea correcto.'
    );
  });

  test('Reset contraseña usuario con email vacío.', async () => {
    const body = {
      email: '',
    };
    const res = await api.put('/users/password/recover').send(body);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Escribe un correo electrónico válido.');
  });

  test('Reset contraseña usuario y cambio contraseña.', async () => {
    const body = {
      email: 'testEmail@gmail.com',
    };
    const res = await api.put('/users/password/recover').send(body);

    const resPassChange = await api
      .put(
        `/users/password/recover/${res.body.info.idUser}/${res.body.info.recoverCode}`
      )
      .send({ password: 'manuTorres1' });

    expect(resPassChange.statusCode).toEqual(200);
    expect(resPassChange.body.message).toBe('Contraseña cambiada con éxito.');
  });

  test('Reset contraseña usuario y cambio contraseña con código de recuperación erróneo.', async () => {
    const body = {
      email: 'testEmail@gmail.com',
    };
    const res = await api.put('/users/password/recover').send(body);

    const resPassChange = await api
      .put(`/users/password/recover/${res.body.info.idUser}/1234`)
      .send({ password: 'manuTorres1' });

    expect(resPassChange.statusCode).toEqual(404);
    expect(resPassChange.body.message).toBe('El enlace no existe.');
  });

  test('Cambio de contraseña de usuario y se valida.', async () => {
    const token = await getToken();
    const passBody = {
      oldPass: 'manuTorres1',
      newPass: 'manuTorres1',
    };
    const res = await api
      .put(`/users/13/password`)
      .set({ authorization: token })
      .send(passBody);

    const resVal = await api.get(`/users/validate/${res.body.regCode}`);
    expect(resVal.statusCode).toEqual(200);
    expect(resVal.body.message).toBe('Verificación completada');
  });

  test('Cambio de contraseña de usuario sin autorización.', async () => {
    const passBody = {
      oldPass: 'manuTorres1',
      newPass: 'manuTorres2',
    };
    const res = await api
      .put(`/users/13/password`)
      .set({ authorization: '' })
      .send(passBody);
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Falta la cabecera de autorización');
  });

  test('Cambio de contraseña de usuario sin uno de los campos obligatorios.', async () => {
    const token = await getToken();
    const passBody = {
      oldPass: 'manuTorres1',
      newPass: '',
    };
    const res = await api
      .put(`/users/13/password`)
      .set({ authorization: token })
      .send(passBody);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Se requiere una contraseña.');
  });

  test('Cambio de contraseña de usuario con la contraseña antigua errónea.', async () => {
    const token = await getToken();
    const passBody = {
      oldPass: 'manuTorres',
      newPass: 'manuTorres2',
    };
    const res = await api
      .put(`/users/13/password`)
      .set({ authorization: token })
      .send(passBody);
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Contraseña incorrecta.');
  });

  test('Cambio de algún dato del usuario.', async () => {
    const { id: idUser, token: token3 } = await getToken3();

    const res = await api
      .put(`/users/${idUser}`)
      .set({ authorization: token3 })
      .send({ name: 'Juan José' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Datos de usuario actualizados.');
  });

  test('Cambio de algún dato del usuario.', async () => {
    const { id: idUser, token: token3 } = await getToken3();

    const res = await api
      .put(`/users/${idUser}`)
      .set({ authorization: token3 })
      .send({ birthDate: '1995-07-14' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Datos de usuario actualizados.');
  });
});

describe('User DELETE Endpoints', () => {
  test('Borrar usuario.', async () => {
    // Crear usuario y validar
    const body = {
      name: 'Manu',
      lastName: 'Torres Torres',
      email: 'testEmail2@gmail.com',
      password: 'manuTorres1',
      bio: 'Empezando los tests con jest.',
      city: 'Barcelona',
      birthDate: '1996-07-14',
    };
    const resReg = await api.post('/users').send(body);
    const resVal = await api.get(
      `/users/validate/${resReg.body.registrationCode}`
    );
    // Loguear usuario
    const res = await api
      .post('/users/login')
      .send({ email: body.email, password: body.password });
    const { token, idUser } = res.body;
    //Borrar usuario
    const resDel = await api
      .delete(`/users/${idUser}`)
      .set({ authorization: token });

    expect(resDel.statusCode).toEqual(200);
    expect(resDel.body.message).toBe('Usuario eliminado');
  });

  test('Borrar usuario con id diferente.', async () => {
    // Crear usuario y validar
    const body = {
      name: 'Manu',
      lastName: 'Torres Torres',
      email: 'testEmail4@gmail.com',
      password: 'manuTorres1',
      bio: 'Empezando los tests con jest.',
      city: 'Barcelona',
      birthDate: '1996-07-14',
    };
    const resReg = await api.post('/users').send(body);

    const resVal = await api.get(
      `/users/validate/${resReg.body.registrationCode}`
    );
    // Loguear usuario
    const token = await getToken();

    //Borrar usuario
    const resDel = await api.delete('/users/3').set({ authorization: token });

    expect(resDel.statusCode).toEqual(403);
    expect(resDel.body.message).toBe('No tienes permisos.');
  });

  test('Borrar usuario administrador.', async () => {
    const token = await getToken();

    const resDel = await api.delete(`/users/1`).set({ authorization: token });

    expect(resDel.statusCode).toEqual(403);
    expect(resDel.body.message).toBe(
      'El administrador principal no se puede eliminar.'
    );
  });
});

describe('Properties POST Endpoints', () => {
  afterEach(async () => {
    const uploadsDir = path.join(__dirname, '../static/uploads');
    const files = await fs.readdir(uploadsDir);
    files.forEach(async (file) => {
      await deletePhoto(file);
    });
  });

  test('Subir un alquiler sin fotos.', async () => {
    const token = await getToken();
    const body = {
      city: "Ametlla del valles, L'",
      province: 'Barcelona',
      address: 'carrer del riu mogent',
      zipCode: '08320',
      number: '9',
      type: 'piso',
      stair: '0',
      flat: '1',
      gate: '3',
      mts: '70',
      rooms: '3',
      garage: '0',
      terrace: '0',
      toilets: '1',
      energyCertificate: '0',
      //availabilityDate:2021-10-20
      description: 'Piso en',
      price: '650',
      state: 'reservado',
    };
    const res = await api
      .post('/properties')
      .set({ authorization: token })
      .send(body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('El piso se ha creado correctamente');
  });

  test('Subir un alquiler repetido sin fotos.', async () => {
    const token = await getToken();
    const body = {
      city: "Ametlla del valles, L'",
      province: 'Barcelona',
      address: 'carrer del riu mogent',
      zipCode: '08320',
      number: '9',
      type: 'piso',
      stair: '0',
      flat: '1',
      gate: '3',
      mts: '70',
      rooms: '3',
      garage: '0',
      terrace: '0',
      toilets: '1',
      energyCertificate: '0',
      //availabilityDate:2021-10-20
      description: 'si',
      price: '650',
      state: 'reservado',
    };
    const res = await api
      .post('/properties')
      .set({ authorization: token })
      .send(body);
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toBe('Ya existe un piso con los datos ingresados');
  });

  test('Subir un alquiler sin fotos ni autorización.', async () => {
    const body = {
      city: "Ametlla del valles, L'",
      province: 'Barcelona',
      address: 'carrer del riu mogent',
      zipCode: '08320',
      number: '9',
      type: 'piso',
      stair: '0',
      flat: '1',
      gate: '3',
      mts: '70',
      rooms: '3',
      garage: '0',
      terrace: '0',
      toilets: '1',
      energyCertificate: '0',
      //availabilityDate:2021-10-20
      description: 'si',
      price: '650',
      state: 'reservado',
    };
    const res = await api
      .post('/properties')
      .set({ authorization: '' })
      .send(body);
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Falta la cabecera de autorización');
  });

  test('Subir un alquiler sin fotos ni algún dato obligatorio.', async () => {
    const token = await getToken();
    const body = {
      city: "Ametlla del valles, L'",
      province: 'Barcelona',
      address: 'carrer del riu mogent',
      zipCode: '08320',
      number: '9',
      type: 'piso',
      stair: '0',
      flat: '',
      gate: '',
      mts: '70',
      rooms: '3',
      garage: '0',
      terrace: '0',
      toilets: '1',
      energyCertificate: '0',
      //availabilityDate:2021-10-20
      description: 'si',
      price: '650',
      state: 'reservado',
    };
    const res = await api
      .post('/properties')
      .set({ authorization: token })
      .send(body);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('El piso no es válido.');
  });

  test('Subir un alquiler sin fotos y sin datos.', async () => {
    const token = await getToken();
    const body = {};
    const res = await api
      .post('/properties')
      .set({ authorization: token })
      .send(body);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Se requiere una provincia.');
  });

  test('Subir foto a un alquiler.', async () => {
    const token = await getToken();
    const idProperty = await createProperty(2);
    const resUplPhoto = await api
      .post(`/properties/${idProperty}/photos`)
      .set({ authorization: token })
      .attach('photo', 'tests/images/piso1.jpeg');
    expect(resUplPhoto.statusCode).toEqual(200);
    expect(resUplPhoto.body.message).toBe('Las fotos han sido subidas.');
  });

  test('Subir fotos a un alquiler.', async () => {
    const token = await getToken();
    const idProperty = await createProperty(3);
    const files = [
      'tests/images/piso1.jpeg',
      'tests/images/piso2.jpeg',
      'tests/images/piso3.jpeg',
    ];
    for (const file of files) {
      const resUplPhoto = await api
        .post(`/properties/${idProperty}/photos`)
        .set({ authorization: token })
        .attach('photo', file);
      expect(resUplPhoto.statusCode).toEqual(200);
      expect(resUplPhoto.body.message).toBe('Las fotos han sido subidas.');
    }
  });

  test('Hacer una reserva', async () => {
    // Body registro usuario3
    const body = {
      name: 'Manu',
      lastName: 'Torres Torres',
      email: 'testEmail3@gmail.com',
      password: 'manuTorres1',
      bio: 'Empezando los tests con jest.',
      city: 'Barcelona',
      birthDate: '1996-07-14',
    };
    // Registro user3
    const resReg = await api.post('/users').send(body);
    // Validación user3
    const resVal = await api.get(
      `/users/validate/${resReg.body.registrationCode}`
    );
    const token2 = await getToken2();
    const idProperty = await createProperty(4);
    const resBook = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token2 })
      .send({
        comentarios:
          'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
        startDate: '2022-10-01',
        endDate: '2022-10-02',
      });

    expect(resBook.statusCode).toEqual(200);
    expect(resBook.body.message).toBe('Correo electrónico enviado con éxito.');
  });

  test('Hacer una reserva sin autorización', async () => {
    const idProperty = await createProperty(5);
    const resBook = await api.post(`/properties/${idProperty}/book`).send({
      comentarios:
        'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
      startDate: '2021-09-29',
      endDate: '2021-10-03',
    });
    expect(resBook.statusCode).toEqual(401);
    expect(resBook.body.message).toBe('Falta la cabecera de autorización');
  });

  test('Hacer una reserva ya existente.', async () => {
    const token2 = await getToken2();
    const idProperty = await createProperty(6);
    const resBook = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token2 })
      .send({
        comentarios:
          'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
        startDate: '2022-10-03',
        endDate: '2022-10-29',
      });

    const resBook2 = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token2 })
      .send({
        comentarios:
          'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
        startDate: '2022-10-03',
        endDate: '2022-10-29',
      });

    expect(resBook2.statusCode).toEqual(200);
    expect(resBook2.body.message).toBe(
      'Las fechas seleccionadas no estan disponibles para esta propiedad'
    );
  });

  test('Hacer una reserva con fechas no disponibles.', async () => {
    // token
    const token = await getToken();
    const idProperty = await createProperty(19, 'Cadiz', 'Cadiz');
    // token3
    const { id: idUser, token: token3 } = await getToken3();

    const resBook = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token3 })
      .send({
        comentarios:
          'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
        startDate: '2022-10-01',
        endDate: '2022-10-02',
      });

    const resBook2 = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token3 })
      .send({
        comentarios:
          'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
        startDate: '2022-10-01',
        endDate: '2022-10-02',
      });

    expect(resBook2.statusCode).toEqual(200);
    expect(resBook2.body.message).toBe(
      'Las fechas seleccionadas no estan disponibles para esta propiedad'
    );
  });

  test('Hacer una reserva sin algún dato obligatorio.', async () => {
    const token2 = await getToken2();
    const idProperty = await createProperty(7);
    const resBook = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token2 })
      .send({
        comentarios: '',
        startDate: '2021-09-29',
        endDate: '2021-10-03',
      });
    expect(resBook.statusCode).toEqual(400);
    expect(resBook.body.message).toBe(
      'Debes añadir un comentario. EJM: Estoy interesado en su vivienda, me vendría bien contactar con usted.'
    );
  });

  test('Usuario vota una propiedad.', async () => {
    const idProperty = await createProperty(1, 'Zaragoza', 'Zaragoza');
    const token2 = await getToken2();

    const resBook = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token2 })
      .send({
        comentarios:
          'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
        startDate: '2022-10-11',
        endDate: '2022-10-12',
      });

    const res = await api
      .post(`/properties/${idProperty}/votes`)
      .set({ authorization: token2 })
      .send({ voteValue: 1, commentary: 'Hola que bonita casa tienes' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('El voto ha sido creado con éxito.');
  });

  test('Usuario vota una propiedad en la que no ha tenido relación.', async () => {
    const idProperty = await createProperty(2, 'Zaragoza', 'Zaragoza');
    const token2 = await getToken2();
    const res = await api
      .post(`/properties/${idProperty}/votes`)
      .set({ authorization: token2 })
      .send({ voteValue: 1, commentary: 'Hola que bonita casa tienes' });
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toBe(
      'No puedes votar un alquiler en el que no has estado.'
    );
  });

  test('Usuario vota una propiedad con valores incorrectos.', async () => {
    const idProperty = await createProperty(3, 'Zaragoza', 'Zaragoza');
    const token2 = await getToken2();
    const resBook = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token2 })
      .send({
        comentarios:
          'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
        startDate: '2022-11-03',
        endDate: '2022-11-04',
      });
    const res = await api
      .post(`/properties/${idProperty}/votes`)
      .set({ authorization: token2 })
      .send({ voteValue: 6, commentary: 'Hola que bonita casa tienes' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe(
      'El voto debe ser un valor entero entre 1 y 5.'
    );
  });
});

describe('Properties GET Endpoints', () => {
  test('Hacer una reserva y acepta la reserva el dueño de la propiedad', async () => {
    const token2 = await getToken2();
    const token = await getToken();
    const idProperty = await createProperty(8);
    const resBook = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token2 })
      .send({
        comentarios: 'Hola',
        startDate: '2022-07-03',
        endDate: '2022-07-29',
      });
    const resAccept = await api
      .get(`/properties/${resBook.body.bookingCode}/accept`)
      .set({ authorization: token });
    expect(resAccept.statusCode).toEqual(200);
    expect(resAccept.body.message).toBe('Reserva aceptada');
  });
  test('Hacer una reserva y cancela la reserva el dueño de la propiedad', async () => {
    const token2 = await getToken2();
    const token = await getToken();
    const idProperty = await createProperty(9);

    const resBook = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token2 })
      .send({
        comentarios: 'Hola',
        startDate: '2022-12-09',
        endDate: '2022-12-12',
      });
    const resCancel = await api
      .get(`/properties/${resBook.body.bookingCode}/cancel`)
      .set({ authorization: token });
    expect(resCancel.statusCode).toEqual(200);
    expect(resCancel.body.message).toBe(
      'La reserva ha sido cancelada correctamente.'
    );
  });
  test('Hacer una reserva y cancela la reserva el inquilino', async () => {
    const token2 = await getToken2();
    const token = await getToken();
    const idProperty = await createProperty(10);
    const resBook = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token2 })
      .send({
        comentarios: 'Hola',
        startDate: '2022-09-27',
        endDate: '2022-09-29',
      });
    const resAccept = await api
      .get(`/properties/${resBook.body.bookingCode}/cancel`)
      .set({ authorization: token2 });
    expect(resAccept.statusCode).toEqual(200);
    expect(resAccept.body.message).toBe(
      'La reserva ha sido cancelada correctamente.'
    );
  });
  test('Hacer una reserva y dueño e inquilino la cancelan.', async () => {
    const token2 = await getToken2();
    const token = await getToken();
    const idProperty = await createProperty(11);
    const resBook = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token2 })
      .send({
        comentarios: 'Hola',
        startDate: '2022-01-11',
        endDate: '2022-01-12',
      });
    const resCancelOwner = await api
      .get(`/properties/${resBook.body.bookingCode}/cancel`)
      .set({ authorization: token });
    const resCancelTenant = await api
      .get(`/properties/${resBook.body.bookingCode}/cancel`)
      .set({ authorization: token2 });
    expect(resCancelTenant.statusCode).toEqual(400);
    expect(resCancelTenant.body).toHaveProperty('message');
  });
  test('Obtener una lista de alquileres', async () => {
    const res = await api.get('/properties');
    expect(res.statusCode).toEqual(200);
    expect(res.body.properties).toHaveLength(res.body.properties.length);
  });
  test('Obtener una lista de alquileres con filtro de ciudad', async () => {
    const res = await api
      .get('/properties')
      .query({ ciudad: 'Montornes_del_valles' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.properties).toHaveLength(10);
    expect(res.body.properties[0].city).toBe('Montornes del valles');
  });
  test('Obtener una lista de alquileres con filtro de provincia', async () => {
    const resProp = await createProperty(12, 'Girona', 'Girona');
    const res = await api.get('/properties').query({ provincia: 'Girona' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.properties).toHaveLength(1);
  });
  test('Obtener una propiedad en concreto.', async () => {
    const resProp = await createProperty(1, 'Girona', 'Girona');
    const res = await api.get(`/properties/${resProp}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.property.idProperty).toEqual(resProp);
  });
  test('Obtener votos de una propiedad.', async () => {
    const idProperty = await createProperty(4, 'Zaragoza', 'Zaragoza');
    const token2 = await getToken2();
    const resBook = await api
      .post(`/properties/${idProperty}/book`)
      .set({ authorization: token2 })
      .send({
        comentarios:
          'Hola, veo que tienes disponibilidad en estas fechas, ¿podemos cuadrar la hora de llegada?',
        startDate: '2022-10-03',
        endDate: '2022-10-29',
      });
    const resVote = await api
      .post(`/properties/${idProperty}/votes`)
      .set({ authorization: token2 })
      .send({ voteValue: 1, commentary: 'Hola que bonita casa tienes' });
    const res = await api
      .get(`/properties/${idProperty}/votes`)
      .set({ authorization: token2 });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('Valoraciones');
  });
});

describe('Properties PUT Endpoints', () => {
  test('Editar información de un alquiler.', async () => {
    const token = await getToken();
    const idProp = await createProperty(2, 'Madrid', 'Fuenlabrada');

    const res = await api
      .put(`/properties/${idProp}`)
      .set({ authorization: token })
      .send({ city: 'Madrid' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Vivienda actualizada.');
  });

  test('Editar información de un alquiler sin ser el dueño del mismo.', async () => {
    const token2 = await getToken2();
    const idProp = await createProperty(3, 'Madrid', 'Fuenlabrada');

    const res = await api
      .put(`/properties/${idProp}`)
      .set({ authorization: token2 })
      .send({ city: 'Madrid' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('No tienes suficientes permisos.');
  });

  test('Editar información de un alquiler sin autorización.', async () => {
    const idProp = await createProperty(4, 'Madrid', 'Fuenlabrada');

    const res = await api
      .put(`/properties/${idProp}`)
      .set({ authorization: '' })
      .send({ city: 'Madrid' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Falta la cabecera de autorización');
  });
});

describe('Properties DELETE Endpoints', () => {
  test('Borrar una propiedad.', async () => {
    const token = await getToken();
    const idProp = await createProperty(4, 'Barcelona', 'Barcelona');

    const res = await api
      .delete(`/properties/${idProp}`)
      .set({ authorization: token });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Propiedad eliminada.');
  });

  test('Borrar una propiedad sin ser dueño de la misma.', async () => {
    const token2 = await getToken2();
    const idProp = await createProperty(5, 'Barcelona', 'Barcelona');

    const res = await api
      .delete(`/properties/${idProp}`)
      .set({ authorization: token2 });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('No tienes suficientes permisos.');
  });
});

afterAll(async () => {
  try {
    server.close();
  } catch (error) {
    console.log(error);
  }
});
