import React, { useContext, useEffect, useState } from 'react';
import { get, parseJwt } from '../../Helpers/Api';
import { TokenContext } from '../../Helpers/Hooks/TokenProvider';
import ContactTenant from '../Forms/ContactTenant';
import LoadingSkeleton from './LoadingSkeleton';
import Tenant from './Tenant';
import VoteForm from '../Forms/VoteForm';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router';
import { FaPlus } from 'react-icons/fa';

export default function UsersList() {
  const [Token] = useContext(TokenContext);
  const [Overlay, setOverlay] = useState({
    shown: false,
    form: '',
    info: {},
  });

  const [Bookings, setBookings] = useState([]);
  const [Users, setUsers] = useState([]);
  const [Loaded, setLoaded] = useState(false);
  const location = useLocation();

  // Necesario estar logueado
  useEffect(() => {
    if (location.search) {
      get(
        `http://localhost:4000/users${location.search}`,
        (data) => {
          if (data.message !== 'No hay conicidencias para su busqueda') {
            setUsers(data.users);
            setLoaded(true);
          } else {
            setUsers([]);
          }
        },
        (error) => console.log(error),
        Token
      );
    } else {
      get(
        'http://localhost:4000/users',
        (data) => {
          if (data.message !== 'No hay conicidencias para su busqueda') {
            setUsers(data.users);
            console.log(data.users);
            setLoaded(true);
          } else {
            setUsers([]);
          }
        },
        (error) => console.log(error),
        Token
      );
      get(
        `http://localhost:4000/users/${parseJwt(Token).idUser}/bookings/renter`,
        (data) => {
          setBookings(data.bookings);
        },
        (error) => {
          console.log(error);
        },
        Token
      );
    }
  }, [Token, location.search]);

  return (
    <main className='pb-36 pt-20 flex w-full'>
      {Overlay.form === 'contact' && (
        <ContactTenant
          setOverlay={setOverlay}
          info={Overlay.info}
          Token={Token}
        />
      )}
      {Overlay.form === 'vote' && (
        <VoteForm setOverlay={setOverlay} info={Overlay.info} Token={Token} />
      )}
      <aside
        className={`bg-gray-Primary w-min sm:bg-transparent flex-grow-0 sm:static fixed right-0 top-20 mt-5 sm:top-0 ${
          Overlay.form ? 'z-0' : 'z-20'
        }`}
      >
        <button
          className='text-white text-xl w-10 min-w-min h-full p-2 sm:hidden'
          onClick={() => {
            setOverlay({ show: true });
          }}
        >
          Filtros
        </button>
        <Filters setOverlay={setOverlay} Overlay={Overlay} />
      </aside>
      <section className='users-cont flex flex-col flex-grow'>
        <h1 className='text-4xl text-principal-gris shadow-lg pt-10 md:pt-10 bg-principal-1 w-full p-10 font-semibold'>
          Inquilinos
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 grid-rows-auto gap-5 justify-items-center items-center pt-2'>
          {!Loaded &&
            Array(10)
              .fill(null)
              .map((el, i) => <LoadingSkeleton key={i} />)}
          {Users.length ? (
            Users.map((user) => {
              if (user.idUser === parseJwt(Token).idUser) {
                return null;
              } else {
                return (
                  <Tenant
                    relation={Bookings.filter(
                      (bookings) => bookings.idTenant === user.idUser
                    )}
                    user={user}
                    key={user.idUser}
                    setOverlay={setOverlay}
                  />
                );
              }
            })
          ) : (
            <div className='p-5 font-medium'>
              No hay inquilinos que mostrar.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Filters({ setOverlay, Overlay }) {
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      orden: '',
      direccion: '',
      ciudad: '',
    },
  });

  function onSubmit(body, e) {
    e.preventDefault();

    const queryString = Object.keys(body)
      .filter((val) => body[val].length > 1)
      .map((key) => {
        return `${key}=${body[key]}`;
      })
      .join('&');

    if (history.location.pathname.length > 12) {
      history.replace('/inquilinos?' + queryString);
    }
    history.push('?' + queryString);

    if (window.innerWidth <= 650) {
      setOverlay({ show: false });
    }
  }

  const inputsLabelStyle = 'text-lg duration-200';
  const inputStyle =
    'bg-black bg-opacity-70 w-48 px-2 placeholder-yellow-300  mix-blend-multiply text-principal-1 font-light text-lg';
  return (
    <div
      className={`transform ${
        Overlay.show
          ? 'translate-y-0 opacity-100 '
          : '-translate-y-full opacity-0'
      }  sm:translate-y-0 bg-yellow-300 justify-center sm:justify-start sm:bg-white sm:opacity-100 bg-opacity-70 overlay z-20 w-full h-full fixed left-0 top-0 flex flex-col items-center pt-24 pb-14 overflow-scroll duration-300 sm:overflow-hidden sm:z-0 sm:mt-0 sm:static sm:py-10`}
    >
      <section className='filtros overflow-scroll overflow-x-hidden sm:overflow-hidden p-2  flex flex-col gap-5 w-10/12 sm:w-full bg-white sm:bg-none relative'>
        <button
          className='close-overlay absolute top-3 right-3 sm:hidden'
          onClick={() => {
            setOverlay({ show: false, form: '' });
          }}
        >
          <FaPlus className='transform rotate-45 ' />
        </button>
        <h1 className='title self-center select-none  font-semibold sm:text-principal-gris text-2xl underline'>
          Filtros
        </h1>
        <div className='ilters-card-container flex justify-around flex-col-reverse gap-10 sm:flex-row'>
          <form
            className='flex flex-col gap-y-3 p-2 justify-start items-center'
            onSubmit={handleSubmit(onSubmit)}
          >
            <label>
              <select
                name='orden'
                defaultValue=''
                {...register('orden')}
                className={inputStyle}
              >
                <option value='' disabled>
                  Filtrar por
                </option>
                <option value='edad' className='font-medium'>
                  Edad
                </option>
                <option value='creacion' className='font-medium'>
                  Mas recientes
                </option>
                <option value='valoraciones' className='font-medium'>
                  Valoraciones
                </option>
              </select>
            </label>
            <label>
              <select
                name='direccion'
                {...register('direccion')}
                className={inputStyle}
              >
                <option value='' disabled>
                  Orden
                </option>
                <option value='ASC' className='font-medium'>
                  Asc
                </option>
                <option value='DESC' className='font-medium'>
                  Desc
                </option>
              </select>
            </label>
            <div className='flex flex-col gap-2 text-l'>
              <div className={inputsLabelStyle}>Ciudad:</div>
              <label className='city'>
                <input
                  defaultValue={Filters.ciudad ?? ''}
                  {...register('ciudad', {
                    pattern: {
                      value:
                        /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
                      message:
                        'La ciudad no puede contener carácteres especiales ni números.',
                    },
                    maxLength: {
                      value: 30,
                      message: 'La ciudad no puede tener más de 50 carácteres.',
                    },
                  })}
                  type='text'
                  name='ciudad'
                  className={inputStyle}
                  placeholder='Ciudad...'
                />
                {errors.city && (
                  <p className='text-red-500'>{errors.city.message}</p>
                )}
              </label>
            </div>
            <div className='flex justify-center items-center self-center sticky bottom-0 w-full h-28 bg-white sm:bg-transparent'>
              <input
                type='submit'
                value='Buscar'
                className='btn-submit text-lg bg-none px-4  font-medium text-principal-gris border-yellow-300 border-2 h-1/3 hover:bg-gray-Primary bg-principal-1 hover:border-white hover:text-principal-1 duration-300'
              />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
