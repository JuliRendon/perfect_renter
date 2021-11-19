import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  capitalizeFirstLetter,
  CreateFormData,
  parseJwt,
  post,
} from '../../Helpers/Api';
import Email from './Inputs/Email';
import FirstName from './Inputs/FirstName';
import { FaPlus } from 'react-icons/fa';
import useProperties from '../../Helpers/Hooks/useProperties';
import { Message } from '../Properties/PropertyInfo';

export default function ContactTenant({ info, setOverlay, Token, properties }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm();
  const [Properties] = useProperties();
  const [message, setMessage] = useState({ message: '', status: '' });
  const [userProperties, setUserProperties] = useState([]);

  function onSubmit(body, e) {
    e.preventDefault();
    post(
      `http://192.168.1.16:4000/users/${info.idUser}/contact`,
      CreateFormData(body),
      (data) => {
        setMessage({ message: data.message, status: 'ok' });
      },
      (error) => {
        setMessage({ message: error.message, status: 'error' });
      },
      Token
    );
  }

  useEffect(() => {
    if (Properties) {
      const newArray = Properties.filter((property) => {
        return property.idUser === parseJwt(Token).idUser;
      });
      setUserProperties(newArray);
    }

    return () => {
      setUserProperties([]);
    };
  }, [Properties, Token]);

  // Styles
  const inpStyle =
    'px-3 py-3 w-full placeholder-gray-400 text-gray-600 relative bg-white text-sm border border-gray-400 outline-none focus:outline-none focus:ring';
  const comentarios = watch('comentarios');
  const buttonStyle =
    'select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer';

  return (
    <div className='overlay z-30 bg-white bg-opacity-75 fixed w-full h-full left-0 top-0 flex flex-col items-center pt-24 overscroll-scroll sm:overflow-hidden'>
      {message.message && <Message message={message} setMessage={Message} />}
      <section className='contact drop-shadow-2xl filter pt-2 flex flex-col gap-5 bg-white relative text-principal-gris overflow-y-auto sm:w-3/4 w-11/12'>
        <button
          className='close-overlay absolute top-3 p-5 right-2'
          onClick={() => {
            setOverlay({ shown: false, info: {} });
          }}
        >
          <FaPlus className='transform scale-150 rotate-45' />
        </button>
        <h1 className='title text-3xl p-4 border-b-4 self-center border-gray-700 flex justify-center w-5/6 select-none'>
          Contacto
        </h1>
        <div className='contact-card-container flex justify-around flex-col-reverse gap-10 lg:flex-row '>
          <form
            className='flex flex-col gap-10 md:gap-3 pl-2 font-medium w-full pb-4'
            onSubmit={handleSubmit(onSubmit)}
          >
            <label>
              <div className='select-none'> Nombre Completo*</div>

              <Controller
                name='name'
                control={control}
                rules={{
                  required: 'Debes escribir un nombre.',
                  pattern: {
                    value:
                      /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
                    message:
                      'El nombre no puede contener caracteres especiales ni números.',
                  },
                  minLength: {
                    value: 3,
                    message:
                      'El nombre debe contener como mínimo 3 caracteres.',
                  },
                  maxLength: {
                    value: 30,
                    message: 'El nombre no puede tener más de 30 caracteres.',
                  },
                }}
                render={({ field: { onChange, name, ref } }) => {
                  return (
                    <FirstName
                      onChange={onChange}
                      inputRef={ref}
                      name={name}
                      className={inpStyle}
                    />
                  );
                }}
              />
              {errors.name && (
                <p className='text-red-500'>{errors.name.message}</p>
              )}
            </label>
            <label>
              <div className='select-none'> Correo electrónico*</div>
              <Controller
                name='email'
                control={control}
                rules={{
                  required: 'Debes escribir un email.',
                  maxLength: {
                    value: 200,
                    message:
                      'El email no puede contener más de 200 caracteres.',
                  },
                }}
                render={({ field: { onChange, name, ref } }) => {
                  return (
                    <Email
                      onChange={onChange}
                      inputRef={ref}
                      name={name}
                      className={`${inpStyle} pr-20`}
                    />
                  );
                }}
              />
              {errors.email && (
                <p className='text-red-500'>{errors.email.message}</p>
              )}
            </label>
            <label>
              <div className='select-none'>Escoge el alquiler a ofrecer:</div>
              <select
                name='properties'
                defaultValue='Ninguno'
                className={inpStyle}
                {...register('property')}
              >
                <option default value='Ninguno' disabled>
                  Ninguno
                </option>
                {userProperties.length > 0 &&
                  userProperties.map((property) => {
                    return (
                      <option
                        key={property.idProperty}
                        value={`${property.idProperty}`}
                      >
                        {capitalizeFirstLetter(property.type)} en{' '}
                        {property.city}, {property.address} {property.number}{' '}
                      </option>
                    );
                  })}
              </select>
            </label>
            <label>
              <div className='select-none'>Teléfono</div>
              <input
                type='tel'
                className={inpStyle}
                name='phone'
                {...register('tel', {
                  pattern: {
                    value: /^\s?\+?\s?([0-9][\s]*){9,}$/,
                    message: 'Debes introducir un número de teléfono válido.',
                  },
                })}
              />
            </label>
            {errors.tel && <p className='text-red-500'>{errors.tel.message}</p>}
            <label className='relative'>
              <div className='select-none'>Comentarios</div>
              <textarea
                className={`${inpStyle} resize-none`}
                name='comentarios'
                id='comentarios'
                cols='30'
                maxLength='250'
                rows='10'
                {...register('comentarios', {
                  required: 'Debes añadir algún comentario.',
                  maxLength: {
                    value: 250,
                    message: 'No puedes escribir más de 250 caracteres.',
                  },
                })}
              ></textarea>
              <p className='absolute right-5 bottom-5'>
                {comentarios ? comentarios.length : 0}/250
              </p>
            </label>
            {errors.comentarios && (
              <p className='text-red-500'>{errors.comentarios.message}</p>
            )}

            <input className={buttonStyle} type='submit' value='Contactar' />
          </form>

          <div className='perfil w-full self-center flex flex-col items-center justify-center'>
            <img
              className='w-60 h-60 object-cover rounded-circle'
              src={
                info.avatar
                  ? `http://192.168.1.16:4000/photo/${info.avatar}`
                  : require('../../Images/defProfile.png').default
              }
              alt='imagen de perfil'
            />
            <h2 className='informacion w-5/6 bg-gray-Primary bg-opacity-25 text-2xl text-principal-1 flex justify-center'>
              {info.name ? info.name + ' ' + info.lastName : 'Nombre de tenant'}
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
