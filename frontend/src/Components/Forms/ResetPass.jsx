import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { put } from '../../Helpers/Api';
import Password from './Inputs/Password';
import { Message } from '../Properties/PropertyInfo';

export default function ResetPass({ match }) {
  const [ErrorRep, setError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formFunctions = { register, errors };
  const [message, setMessage] = useState({ message: '', status: '' });
  const error = 'Las contraseñas deben coincidir.';
  const buttonStyle =
    'select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer';

  return (
    <>
      <section className='flex flex-col items-center justify-center gap-6 pt-10'>
        {message.message && <Message message={message} setMessage={Message} />}
        <h1 className='border-b-4 border-gray-600 text-3xl'>
          Recuperación de contraseña:
        </h1>
        <form
          className='flex flex-col gap-5'
          onSubmit={handleSubmit((data) => {
            if (data.password !== data.passwordRepeat) {
              setError(true);
            } else {
              put(
                `http://192.168.1.16:4000/users/password/recover/${match.params.idUser}/${match.params.recoverCode}`,
                { password: data.password },
                (data) => {
                  setMessage({
                    message:
                      'Contraseña cambiada con éxito, se te redirigirá a la pantalla principal.',
                    status: 'ok',
                  });
                },
                (error) => {
                  setMessage({ message: error.message, status: 'error' });
                }
              );
            }
          })}
        >
          <Password {...formFunctions} />
          <input
            className='w-full p-2 pr-6'
            type={'password'}
            name='password'
            placeholder='Confirma la contraseña*'
            {...register('passwordRepeat', {
              required: `${error}`,
            })}
          />
          {errors.passwordRepeat && (
            <p className='text-red-500'>{errors.passwordRepeat.message}</p>
          )}
          {ErrorRep ? <p className='text-red-500'>{error}</p> : ''}
          <input
            className={buttonStyle}
            type='submit'
            value='Cambiar contraseña'
          />
        </form>
      </section>
    </>
  );
}
