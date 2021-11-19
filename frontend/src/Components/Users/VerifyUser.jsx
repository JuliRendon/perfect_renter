import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../Helpers/Api';

export default function VerifyUser({ match }) {
  const [Message, setMessage] = useState('');

  useEffect(() => {
    // const controller = new AbortController();
    get(
      `http://192.168.1.16:4000/users/validate/${match.params.registrationCode}`,
      (data) => {
        setMessage(data.message);
      },
      (error) => {
        setMessage(error.message);
      },
      null,
      null
    );
    return () => {
      // controller.abort();
    };
  }, [match.params.registrationCode]);

  return (
    <>
      <section className=' flex-col  absolute left-0 top-0 right-0 bottom-0 m-auto h-1/3 w-4/12 shadow-2xl p-20 flex items-center justify-between'>
        <h1>{Message ?? ''}</h1>
        <Link
          to='/'
          className='btn-more text-xl bg-none p-2 border-yellow-400 border-2 max-w-max hover:bg-principal-1 hover:border-white hover:text-gray-600 duration-300'
        >
          Aceptar
        </Link>
      </section>
    </>
  );
}
