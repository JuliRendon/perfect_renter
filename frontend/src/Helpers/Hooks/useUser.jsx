import { useContext, useEffect, useState } from 'react';
import { get, parseJwt } from '../Api';
import { TokenContext } from './TokenProvider';

export default function useUser() {
  const [token] = useContext(TokenContext);
  const [User, setUser] = useState({});

  useEffect(() => {
    // const controller = new AbortController();
    if (token) {
      get(
        `http://192.168.1.16:4000/users/${parseJwt(token).idUser}`,
        (data) => {
          if (data.message !== 'No hay conicidencias para su busqueda') {
            setUser(data.userInfo);
          } else {
            setUser({});
          }
        },
        (error) => console.error(error),
        token,
        null
      );
    }
    return () => {
      // controller.abort();
    };
  }, [token]);

  return [User, setUser];
}
