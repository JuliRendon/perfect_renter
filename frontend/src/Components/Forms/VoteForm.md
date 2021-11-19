```jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaStar } from 'react-icons/fa';
import { capitalizeFirstLetter, CreateFormData, post } from '../../Helpers/Api';

// Estados
// Estado con el id de la propiedad a votar
const [Property, setProperty] = useState({});
// Estado con el mensaje de confirmación al votar
const [Message, setMessage] = useState();
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
  reset,
  formState: { errors },
} = useForm();

function onSubmit(body, e) {
  e.preventDefault();
  setMessage('¡Valoración creada con éxito!');
}
const inpStyle =
  'px-3 py-3 placeholder-gray-400 text-gray-600 relative bg-white text-sm border border-gray-400 outline-none focus:outline-none focus:ring';
const comentarios = watch('commentary');
const buttonStyle =
  'select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer';

const User = {
  avatar: 'manu.jpg',
  bio: 'Biografia',
  birthDate: '1996-07-14T00:00:00.000Z',
  ciudad: 'Barcelona',
  createdAt: '2021-11-10T19:26:11.000Z',
  email: 'manutorres1996@gmail.com',
  idUser: 12,
  lastName: 'Torres',
  name: 'Manu',
  role: 'renter',
  tel: '666 666 666',
};

function ConfirmMessage({ Message }) {
  return (
    <div className='flex-col z-20 absolute left-0 top-0 right-0 bottom-0 bg-gray-700 bg-opacity-30 h-screen  shadow-2xl p-20 flex items-center justify-between'>
      <section className='confirm-message m-auto font-medium p-4 border-2 border-gray-700 flex flex-col items-center gap-5 bg-gray-100 relative text-principal-gris overflow-y-scroll md:w-3/4'>
        <h1>{message.message && Message}</h1>
        <button
          onClick={() => {
            reset();
            setMessage('');
          }}
          className='btn-more text-xl bg-none p-2 border-yellow-400 border-2 max-w-max hover:bg-principal-1 hover:border-white hover:text-gray-600 duration-300'
        >
          Aceptar
        </button>
      </section>
    </div>
  );
}

<div className='overlay z-30 p-4 bg-white bg-opacity-75  w-full h-full left-0 top-0 flex flex-col items-center pt-24 overflow-auto sm:overflow-hidden'>
  {message.message && <ConfirmMessage Message={Message} />}
  <section className='contact p-4 filter drop-shadow-xl flex flex-col gap-5 bg-white relative text-principal-gris overflow-y-auto md:w-3/4'>
    <button className='close-overlay absolute top-3 p-5 right-2'>
      <FaPlus className='transform scale-150 rotate-45' />
    </button>
    <h1 className='title text-3xl p-4 border-b-4 self-center border-gray-700 flex justify-center w-5/6 select-none'>
      Valorar
    </h1>
    <div className='perfil w-full self-center flex flex-col items-center justify-center'>
      <img
        className='w-60 h-60 object-cover rounded-circle'
        src={User.avatar}
        alt=''
      />
      <div className='nombre w-5/6 bg-gray-Primary text-principal-1 text-center'>
        {User.name} {User.lastName}
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
              <label key={Math.random()}>
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
  </section>
</div>;
```
