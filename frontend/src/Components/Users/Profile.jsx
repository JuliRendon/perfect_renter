import React, { useEffect, useState } from 'react';
import { del, get, parseJwt } from '../../Helpers/Api';
import { FaCamera, FaPencilAlt, FaTrash } from 'react-icons/fa';
import Register from '../Forms/Register';

export default function Profile({ token, setToken }) {
  const [User, setUser] = useState({});
  const [Overlay, setOverlay] = useState({ shown: false, userInfo: {} });
  // const [Deleted, setDeleted] = useState(false);

  const user = parseJwt(token);

  useEffect(() => {
    get(
      `http://localhost:4000/users/${user.idUser}`,
      (data) => {
        setUser(data.userInfo);
      },
      (error) => console.log(error),
      token
    );
  }, [token, user.idUser]);

  function onSubmitDeleted(body, e) {
    if (window.confirm('¿Desea eliminar la cuenta?')) {
      del(
        `http://localhost:4000/users/${user.idUser}`,
        body,
        (data) => {
          setToken('');
          alert(data.message);
          window.location.reload();
        },
        (error) => console.log(error),
        token
      );
    }
  }

  return (
    <>
      {Overlay.shown ? (
        <Register
          setOverlay={setOverlay}
          userInfo={Overlay.userInfo}
          usuario={User}
          Token={token}
        />
      ) : (
        ''
      )}

      <article className='pt-20 flex flex-col items-center justify-center'>
        <button
          className=''
          onClick={() => {
            setOverlay({ shown: true, userInfo: user });
          }}
        >
          <FaPencilAlt />
        </button>
        <div>
          <section>
            <img
              className='w-40'
              src={
                User.avatar
                  ? ''
                  : require('../../Images/defProfile.png').default
              }
              alt='perfil de usuario'
            />
            <button>
              <FaCamera />
            </button>
            <ul>
              <li className='font-bold'>Nombre:</li>
              {User.name}
              <li className='font-bold'>Apellidos:</li>
              {User.lastName}
              <li className='font-bold'>Email:</li>
              {User.email}
              <li className='font-bold'>Ciudad:</li>
              {User.ciudad}
              <li className='font-bold'>Teléfono:</li>
              {User.tel}
              <li className='font-bold'>Bio:</li>
              {User.bio}
              <li className='font-bold'>Fecha de nacimiento:</li>
              {new Date(User.birthDate).toLocaleDateString('es-ES')}
            </ul>
          </section>
          <button
            className='p-2 border-solid border-2 border-black'
            onClick={() => {
              onSubmitDeleted();
            }}
          >
            Eliminar cuenta <FaTrash />
          </button>
        </div>
      </article>
    </>
  );
}
