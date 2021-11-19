import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { CreateFormData, post } from '../../Helpers/Api';
import useLocalStorage from '../../Helpers/Hooks/useLocalStorage';
import Email from './Inputs/Email';
import Password from './Inputs/Password';

export default function Login() {
  const [, setToken] = useLocalStorage('Token', '');

  // States
  const { handleSubmit, register, formState: errors, control } = useForm();
  const formFunctions = { register, errors };
  const [Error, setError] = useState('');

  // Enviar datos a backend
  function onSubmit(body) {
    post(
      'http://192.168.1.16:4000/users/login',
      CreateFormData(body),
      (data) => {
        setToken(data.token);
        window.location.reload();
      },
      (data) => {
        setError(data.message);
      }
    );
  }

  return (
    <>
      <section className='pt-24 flex flex-col items-center text-principal-gris gap-5 m-0 p-0 bg-white bg-opacity-50 h-full'>
        <div className='title text-3xl p-4 flex justify-center w-3/6 select-none'>
          <h2 className='border-b-4 border-gray-600 w-3/4 text-center pb-2'>
            ACCESO
          </h2>
        </div>
        <form
          className='flex flex-col gap-3 sm:w-96 w-3/4'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name='email'
            control={control}
            rules={{
              required: 'Debes escribir un email.',
              maxLength: {
                value: 200,
                message: 'El email no puede contener más de 200 caracteres.',
              },
            }}
            render={({ field: { onChange, name, ref } }) => {
              return (
                <Email
                  onChange={onChange}
                  inputRef={ref}
                  name={name}
                  className='px-3 py-3 placeholder-gray-400 text-gray-600 relative bg-white text-sm border border-gray-400 outline-none focus:outline-none focus:ring w-full cursor-pointer'
                />
              );
            }}
          />
          {errors.email && (
            <p className='text-red-500'>{errors.email.message}</p>
          )}
          <Password {...formFunctions} />
          {Error ? (
            <div className='text-red-500 font-medium text-center'>{Error}</div>
          ) : (
            ''
          )}
          <input
            className='select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
            type='submit'
            value='Entrar'
          />
        </form>
        <Link
          className='p-4 font-medium hover:text-blue-900 hover:underline duration-200'
          to='/recuperar'
        >
          Recuperar contraseña
        </Link>
        <div className='flex gap-1'>
          ¿Aún no tienes cuenta? RegÍstrate
          <Link
            className='hover:text-blue-900 font-medium hover:underline duration-200'
            to='/registro'
          >
            aquí
          </Link>
        </div>
      </section>
    </>
  );
}
