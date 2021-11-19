import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaStar } from 'react-icons/fa';
import { capitalizeFirstLetter, CreateFormData, post } from '../../Helpers/Api';
import { Message } from '../Properties/PropertyInfo';
export default function VoteForm({ setOverlay, info, Token }) {
  // Estados
  // Estado con el id de la propiedad a votar
  const [Property, setProperty] = useState({});
  // Estado con el mensaje de confirmación al votar
  const [message, setMessage] = useState({ message: '', status: '' });
  // Estado con la selección de la propiedad en caso de que haya más de una
  const [SelectProperty, setSelectProperty] = useState(false);
  // Valoración al hacer click
  const [Rating, setRating] = useState(null);
  // Valoración al hacer hover (para diseño)
  const [Hover, setHover] = useState(null);
  // Mensaje de error en caso de que haya
  const [Error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (info.relation.length > 1) {
      setSelectProperty(true);
    } else {
      setProperty(info.relation[0].idProperty);
    }
    return () => {
      setProperty('');
    };
  }, [info]);

  function onSubmit(body, e) {
    e.preventDefault();
    if (body.voteValueRenter && body.commentary && Property) {
      post(
        `http://192.168.1.16:4000/users/${info.idUser}/votes`,
        CreateFormData({ ...body, idProperty: Property }),
        (data) => {
          setMessage({ message: data.message, status: 'ok' });
        },
        (error) => {
          console.error(error);
          setError(error);
        },
        Token
      );
    } else {
      setError({ message: 'Debes rellenar los campos.' });
    }
  }
  const inpStyle =
    'px-3 py-3 placeholder-gray-400 text-gray-600 relative bg-white text-sm border border-gray-400 outline-none focus:outline-none focus:ring';
  const comentarios = watch('commentary');
  const buttonStyle =
    'select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer';

  return (
    <div className='overlay z-30 p-4 bg-white bg-opacity-75 fixed w-full h-full left-0 top-0 flex flex-col items-center pt-24 overflow-auto sm:overflow-hidden'>
      {message.message && <Message setMessage={setMessage} message={message} />}
      {SelectProperty && (
        <PropertiesToVote
          info={info}
          setProperty={setProperty}
          setSelectProperty={setSelectProperty}
          setOverlay={setOverlay}
        />
      )}
      <section className='contact p-4 filter drop-shadow-xl flex flex-col gap-5 bg-white relative text-principal-gris overflow-y-auto md:w-3/4'>
        <button
          className='close-overlay absolute top-3 p-5 right-2'
          onClick={() => {
            setOverlay({ shown: false, info: {}, form: '' });
          }}
        >
          <FaPlus className='transform scale-150 rotate-45' />
        </button>
        <h1 className='title text-3xl p-4 border-b-4 self-center border-gray-700 flex justify-center w-5/6 select-none'>
          Valorar
        </h1>
        <div className='contact-card-container flex justify-around flex-col gap-10 lg:flex-row-reverse '>
          <div className='perfil w-full self-center flex flex-col items-center justify-center'>
            <img
              className='w-60 h-60 object-cover rounded-circle'
              src={
                info.avatar
                  ? 'http://192.168.1.16:4000/photo/' + info.avatar
                  : require('../../Images/defProfile.png').default
              }
              alt=''
            />
            <div className='nombre w-5/6 bg-gray-Primary text-principal-1 text-center'>
              {info.name} {info.lastName}
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-10 md:gap-3 pl-2 font-medium w-full pb-4'
          >
            <label className='flex flex-col gap-3'>
              <div>
                Escoge la puntuación que creas oportuna. ¡Tu opinión es muy
                importante!
              </div>
              <div className='flex'>
                {[1, 2, 3, 4, 5].map((value, i) => {
                  const ratingValue = i + 1;
                  return (
                    <label key={i}>
                      <input
                        type='radio'
                        name='rating'
                        className='hidden'
                        value={ratingValue}
                        {...register('voteValueRenter')}
                        onClick={() => {
                          setRating(ratingValue);
                        }}
                      />
                      <FaStar
                        onMouseEnter={() => {
                          setHover(ratingValue);
                        }}
                        onMouseLeave={() => {
                          setHover(null);
                        }}
                        key={value}
                        className={`${
                          ratingValue <= (Hover || Rating)
                            ? 'text-principal-1'
                            : 'text-gray-400 opacity-30'
                        }  hover:text-principal-1 hover:opacity-100 duration-200 text-2xl cursor-pointer`}
                      />
                    </label>
                  );
                })}
              </div>
            </label>
            <label className='relative w-full'>
              <div>Escribe algún comentario:</div>
              <textarea
                {...register('commentary')}
                name='commentary'
                cols='20'
                rows='10'
                className={`${inpStyle} resize-none w-full h-40`}
                maxLength='250'
              ></textarea>
              <p className='absolute right-5 bottom-5'>
                {comentarios ? comentarios.length : 0}/250
              </p>
            </label>
            {errors.comentarios && (
              <p className='text-red-500'>{errors.comentarios.message}</p>
            )}
            {Error && <p className='text-red-500'>{Error.message}</p>}
            <input className={buttonStyle} type='submit' value='Enviar' />
          </form>
        </div>
      </section>
    </div>
  );
}

function PropertiesToVote({
  info,
  setProperty,
  setSelectProperty,
  setOverlay,
}) {
  return (
    <div className='z-50 p-2 bg-gray-400 bg-opacity-75 fixed w-full h-full left-0 top-0 flex flex-col items-center py-24 overscroll-scroll sm:overflow-hidden'>
      <div className='contact border-2 border-gray-700 flex flex-col gap-5 bg-gray-100 relative text-principal-gris overflow-y-scroll md:w-3/4 font-medium'>
        <div className='p-4'>
          <p>
            Este inquilino tiene varias reservas en viviendas de tu posesión.
          </p>
          <p>Por favor, escoge la reserva de la cual deseas valorarlo:</p>
          <div className='flex flex-col gap-5 pt-5'>
            {info.relation.map((booking) => {
              return (
                <button
                  onClick={() => {
                    setProperty(booking.idProperty);
                    setSelectProperty(false);
                  }}
                  key={booking.bookingCode}
                >
                  <article
                    className={`border border-black h-1/3 flex md:w-4/12 md:max-w-md sm:w-7/12 justify-between shadow-2xl`}
                  >
                    <div className='flex flex-col flex-grow w-5/12'>
                      <h2 className='bg-gray-Primary text-principal-1 text-lg w-full'>
                        {capitalizeFirstLetter(booking.type)} en {booking.city}
                      </h2>
                      <p>
                        {booking.address}, {booking.number}
                      </p>
                      <p>
                        Entrada:{' '}
                        {new Date(
                          booking.startBookingDate
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        Salida:{' '}
                        {new Date(booking.endBookingDate).toLocaleDateString()}
                      </p>
                      {booking.state === 'finalizada' && (
                        <p className='w-full bg-red-600 font-medium text-white'>
                          Finalizada
                        </p>
                      )}
                      {booking.state === 'reservado' && (
                        <p className='w-full bg-green-600 font-medium text-white'>
                          Reservada
                        </p>
                      )}
                    </div>
                    <div className='border-r-2 border-opacity-75 border-gray-700'></div>
                    <div className='w-4/12 relative flex flex-col justify-between'>
                      <img
                        className='w-60 h-60 object-cover rounded-circle'
                        src={
                          info.avatar
                            ? `http://192.168.1.16:4000/photo/${info.avatar}`
                            : require('../../Images/defProfile.png').default
                        }
                        alt='imagen de perfil'
                      />
                    </div>
                  </article>
                </button>
              );
            })}
          </div>
        </div>
        <button
          onClick={() => {
            setSelectProperty(false);
            setOverlay({ shown: false, info: {}, form: '' });
          }}
          className='p-2 bg-principal-1 text-principal-gris font-medium'
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export function ConfirmMessage({ Message }) {
  return (
    <div className='flex-col z-20 absolute left-0 top-0 right-0 bottom-0 bg-gray-700 bg-opacity-30 h-screen w-screen shadow-2xl p-20 flex items-center justify-between'>
      <section className='confirm-message m-auto font-medium p-4 border-2 border-gray-700 flex flex-col items-center gap-5 bg-gray-100 relative text-principal-gris overflow-y-scroll md:w-3/4'>
        <h1>{Message ?? ''}</h1>
        <button
          onClick={() => {
            window.location.reload();
          }}
          className='btn-more text-xl bg-none p-2 border-yellow-400 border-2 max-w-max hover:bg-principal-1 hover:border-white hover:text-gray-600 duration-300'
        >
          Aceptar
        </button>
      </section>
    </div>
  );
}
