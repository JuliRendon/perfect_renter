import React, { useEffect, useState } from 'react';
import {
  capitalizeFirstLetter,
  CreateFormData,
  del,
  get,
  parseJwt,
  post,
  put,
} from '../../Helpers/Api';
import {
  FaCamera,
  FaHome,
  FaPencilAlt,
  FaPlus,
  FaPlusSquare,
  FaStar,
  FaUser,
} from 'react-icons/fa';
import Register from '../Forms/Register';
import useProperties from '../../Helpers/Hooks/useProperties';
import Property from '../Properties/Property';
import Avatar from '../Users/avatar';
import NewProperty from '../Properties/NewProperty';
import { Link } from 'react-router-dom';
import { ConfirmMessage } from '../Forms/VoteForm';
import { useForm } from 'react-hook-form';
import Password from '../Forms/Inputs/Password';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { format } from 'date-fns';
import esEsLocale from 'date-fns/locale/es';
import { Box } from '@mui/system';
import { Message } from '../Properties/PropertyInfo';

export default function Profile({ token, setToken }) {
  const [User, setUser] = useState({});
  const [Overlay, setOverlay] = useState({
    shown: false,
    info: {},
    form: '',
  });
  const [Bookings, setBookings] = useState([]);
  const [ShownBookings, setShownBookings] = useState('proximas');
  const [properties] = useProperties([]);
  const [Votes, setVotes] = useState([]);

  useEffect(() => {
    // const controller = new AbortController(null);
    // const controllerBookings = new AbortController();
    // const controllerVotes = new AbortController();
    get(
      `http://192.168.1.16:4000/users/${parseJwt(token).idUser}`,
      (data) => {
        setUser(data.userInfo);
      },
      (error) => console.error(error),
      token,
      null
    );
    if (User.idUser) {
      get(
        `http://192.168.1.16:4000/users/${User.idUser}/bookings`,
        (data) => {
          setBookings(data.bookings);
        },
        (error) => {
          console.error(error);
        },
        token,
        null
      );
      get(
        `http://192.168.1.16:4000/users/${User.idUser}/votes`,
        (data) => {
          if (data.status === 'ok') {
            setVotes(data.Valoraciones);
          }
        },
        (error) => {
          console.error(error);
        },
        token,
        null
      );
    }
    return () => {
      // controller.abort();
      // controllerBookings.abort();
      // controllerVotes.abort();
    };
  }, [token, User.avatar, User.idUser]);

  function onSubmitDeleted(body, e) {
    del(
      `http://192.168.1.16:4000/users/${User.idUser}`,
      body,
      (data) => {
        setToken('');
        window.location.reload();
      },
      (error) => console.log(error),
      token
    );
  }

  const propiedadUsuario = properties.filter(
    (property) => property.idUser === User.idUser
  );

  return (
    <article className='pt-24 pb-32 flex flex-col w-full justify-center max-w-5xl m-auto relative'>
      {Overlay.form === 'deleteProperty' && (
        <Delete
          setOverlay={setOverlay}
          Overlay={Overlay}
          usuario={User}
          Token={token}
        />
      )}
      {Overlay.form === 'deleteAccount' && (
        <Delete
          setOverlay={setOverlay}
          Overlay={Overlay}
          usuario={User}
          Token={token}
        />
      )}
      {Overlay.form === 'register' && (
        <Register
          setOverlay={setOverlay}
          userInfo={Overlay.info}
          usuario={User}
          Token={token}
          onSubmitDeleted={onSubmitDeleted}
        />
      )}
      {Overlay.form === 'avatar' && (
        <Avatar
          setOverlay={setOverlay}
          avatar={User.avatar}
          usuario={User}
          Token={token}
        />
      )}
      {Overlay.form === 'property' && (
        <NewProperty
          setOverlay={setOverlay}
          Overlay={Overlay}
          idProperty={propiedadUsuario}
          Token={token}
        />
      )}
      {Overlay.form === 'cancelBooking' && (
        <CancelBooking
          setOverlay={setOverlay}
          info={Overlay.info}
          Token={token}
        />
      )}
      {Overlay.form === 'editBooking' && (
        <EditBooking
          setOverlay={setOverlay}
          info={Overlay.info}
          Token={token}
        />
      )}
      <div className='bg-principal-1 text-principal-gris font-medium text-3xl pl-5 bg-opacity-25  '>
        SOBRE TI
      </div>
      <div className='grid grid-cols-1 justify-items-center items-center sm:grid-cols-2 p-10 gap-10 sm:gap-32 '>
        <section className='w-52 h-52 max-h-xs max-w-xs relative'>
          <img
            className='w-full h-full rounded-full'
            src={
              User.avatar
                ? `http://192.168.1.16:4000/photo/${User.avatar}`
                : require('../../Images/defProfile.png').default
            }
            alt='perfil de usuario'
          />
          <button
            onClick={() => {
              setOverlay({ shown: true, userInfo: User, form: 'avatar' });
            }}
            className='bg-white bg-opacity-50 h-full w-full absolute top-0 right-0 left-0 bottom-0'
          >
            <FaCamera className='text-4xl m-auto' />
          </button>
        </section>
        <section className='w-auto'>
          <div className=' px-4 text-2xl bg-gray-Primary text-principal-1 font-normal flex flex-col-2 justify-between'>
            <h1>
              {User.name} {User.lastName}
            </h1>
            <button
              className='text-2xl '
              onClick={() => {
                setOverlay({ shown: true, userInfo: User, form: 'register' });
              }}
            >
              <FaPencilAlt />
            </button>
          </div>
          <br />
          <ul className='bg-gray-200 grid grid-cols-1 gap-4 '>
            <li className='bg-gray-400 text-lg px-2'>Email</li>
            <span className='pl-2  py-2 overflow-x-auto'>{User.email}</span>
            <li className='bg-gray-400 text-lg px-2 '>Ciudad</li>
            <span className='pl-2  py-2 overflow-x-auto'>{User.ciudad}</span>
            <li className='bg-gray-400 text-lg px-2'>Teléfono</li>
            <span className='pl-2  py-2 overflow-x-auto'>{User.tel}</span>
            <li className='bg-gray-400 text-lg px-2'>Fecha de nacimiento</li>
            <span className='pl-2 py-2 overflow-x-auto'>
              {new Date(User.birthDate).toLocaleDateString('es-ES')}
            </span>
            <li className='bg-gray-400 text-lg px-2'>Biografía</li>
            <span className='pl-2 pb-4 overflow-x-auto'>{User.bio}</span>
          </ul>
        </section>
      </div>
      <div className='bg-principal-1 text-principal-gris font-medium text-3xl pl-5 bg-opacity-25'>
        ALQUILERES
      </div>
      <div className='flex flex-col'>
        <section className='alquileres flex-grow'>
          <div className='flex flex-col sm:flex-row'>
            <div className='contenedor-alquileres flex flex-wrap justify-center gap-5 sm:max-w-none sm:justify-start sm:pl-2 px-2 pb-10 '>
              {propiedadUsuario.length > 0 ? (
                propiedadUsuario.map((property) => (
                  <Property
                    setProfileOverlay={setOverlay}
                    profileOverlay={Overlay}
                    key={property.idProperty}
                    property={property}
                    token={token}
                    mountOn={'profile'}
                  />
                ))
              ) : (
                <div>No hay ningún inmueble</div>
              )}
            </div>
            <div className='text-gray-400 flex flex-col items-center gap-2 m-auto pb-5 lg:flex-grow'>
              <button
                onClick={() => {
                  setOverlay({
                    shown: true,
                    userInfo: User,
                    form: 'property',
                  });
                }}
                className='flex flex-col items-center gap-2'
              >
                <span>Añade un inmueble</span>
                <FaPlusSquare className='text-4xl' />
              </button>
            </div>
          </div>
        </section>
        <section className='reservas'>
          <div className='w-full bg-principal-1 text-principal-gris font-medium text-3xl pl-5'>
            RESERVAS
          </div>
          <div className='flex gap-5 justify-around bg-gray-Primary text-principal-1 font-medium'>
            <button
              className='py-2 px-10 border-opacity-5 hover:text-white '
              onClick={() => {
                !(ShownBookings === 'proximas') && setShownBookings('proximas');
              }}
            >
              Próximas
            </button>
            <button
              onClick={() => {
                !(ShownBookings === 'finalizada') &&
                  setShownBookings('finalizada');
              }}
              className='py-2 px-10 border-opacity-5 hover:text-white '
            >
              Finalizadas
            </button>
          </div>
          <BookingsComp
            User={User}
            setOverlay={setOverlay}
            Bookings={Bookings}
            ShownBookings={ShownBookings}
          />
        </section>
      </div>
      <section className='w-full'>
        <h2 className='bg-principal-1 text-principal-gris font-medium text-3xl pl-5 bg-opacity-25  '>
          OPINIONES
        </h2>
        <div className='votes-cont pt-5 flex flex-col sm:flex-row sm:flex-wrap gap-5 w-full items-center justify-center'>
          {Votes.length ? (
            Votes.map((vote) => {
              return (
                <article
                  className='flex w-10/12 shadow-xl max-w-xs'
                  key={vote.idVote}
                >
                  <img
                    className='w-14 h-14 rounded-full m-2'
                    src={
                      vote.avatar
                        ? 'http://192.168.1.16:4000/photo/' + vote.avatar
                        : require('../../Images/defProfile.png').default
                    }
                    alt='imagen de perfil'
                  />
                  <section className=''>
                    <h1 className='font-bold'>
                      {vote.name} {vote.lastName}
                    </h1>
                    <p className=''>{vote.commentRenter}</p>
                    <div className='flex text-xs self-center py-2'>
                      {vote.voteValueRenter > 0 ? (
                        Array(parseInt(vote.voteValueRenter))
                          .fill(null)
                          .map((value, i) => {
                            return (
                              <FaStar
                                key={i}
                                className='text-principal-1 text-xl'
                              ></FaStar>
                            );
                          })
                      ) : (
                        <div className='h-4'>
                          <FaStar className='text-gray-200' />
                        </div>
                      )}
                    </div>
                  </section>
                </article>
              );
            })
          ) : (
            <p className='font-medium p-2'>Aún no tiene valoraciones</p>
          )}
        </div>
      </section>
    </article>
  );
}
/*
 * ##########################
 * ## COMPONENTE ELIMINAR  ##
 * ##########################
 *
 */
function Delete({ setOverlay, Overlay, usuario }) {
  const [CanDelete, setCanDelete] = useState(false);
  const [Error, setError] = useState('');

  const {
    setValue,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('email', usuario.email);
  }, [usuario, setValue]);

  function onSubmit(body) {
    post(
      'http://192.168.1.16:4000/users/login',
      CreateFormData(body),
      (data) => {
        data.status === 'ok' && setCanDelete(true);
      },
      (data) => {
        setError('Contraseña incorrecta');
      }
    );
  }

  return (
    <div className='overlay z-20 bg-white bg-opacity-75  justify-center fixed w-full h-full left-0 top-0 flex flex-col items-center sm:px-12 sm:py-24 pt-24 px-2 overscroll-scroll sm:overflow-hidden'>
      <section className='delete p-4 filter drop-shadow-xl  flex flex-col items-center gap-5 bg-white relative text-principal-gris overflow-y-auto md:w-3/4'>
        <button
          className='close-overlay absolute top-3 p-5 right-2'
          onClick={(e) => {
            e.stopPropagation();
            setOverlay({ shown: false, info: {} });
          }}
        >
          <FaPlus className='transform scale-150 rotate-45' />
        </button>
        <h1 className='title text-3xl p-4 border-b-4 self-center border-gray-700 flex justify-center w-5/6 select-none'>
          {Overlay.form === 'deleteAccount' ? (
            <span className='flex items-center gap-2'>
              <FaUser /> Eliminar cuenta
            </span>
          ) : (
            <span className='flex items-center gap-2'>
              <FaHome /> Eliminar propiedad
            </span>
          )}
        </h1>
        <p>
          {Overlay.form === 'deleteAccount'
            ? 'Para eliminar su cuenta definitivamente, por favor, introduzca su contraseña:'
            : 'Para eliminar la propiedad, por favor, inserte la contraseña de su cuenta:'}
        </p>
        {!CanDelete && (
          <form
            className='flex flex-col gap-3 max-w-sm'
            onSubmit={handleSubmit(onSubmit)}
          >
            <Password register={register} errors={errors} />
            {Error ? (
              <div className='text-red-600 font-medium text-center'>
                {Error}
              </div>
            ) : (
              ''
            )}
            <input
              className='select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
              type='submit'
              value='Validar'
            />
          </form>
        )}
        <button
          className={`${
            CanDelete
              ? 'bg-red-600'
              : 'bg-gray-500 text-gray-400 select-none pointer-events-none cursor-default'
          } button select-none w-5/12 self-center text-center  text-white border border-gray-400 font-medium p-2 hover:bg-gray-200 hover:text-gray-600 transform ease-in duration-200 cursor-pointer`}
          onClick={(e) => {
            Overlay.form === 'deleteAccount'
              ? Overlay.onSubmitDeleted()
              : Overlay.onSubmitDeleted();
          }}
        >
          Eliminar
        </button>
      </section>
    </div>
  );
}
/*
 * #########################
 * ## COMPONENTE RESERVAS ##
 * #########################
 *
 */
function BookingsComp({ Bookings, ShownBookings, User, setOverlay }) {
  function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }
  return (
    <div
      className='
      bookings-cont p-5 flex flex-col items-center  gap-5
      sm:justify-start sm:flex-row sm:flex-wrap lg:justify-start'
    >
      {Bookings.length ? (
        Bookings.filter((booking) => {
          if (ShownBookings === 'proximas') {
            return booking.state !== 'finalizada';
          } else {
            return booking.state === 'finalizada';
          }
        }).map((booking) => {
          return (
            <span key={booking.idBooking} className='max-w-xs'>
              <article
                className={`animate-fadeIn filter drop-shadow-xl h-1/3 max-w-xs flex flex-col items-start justify-between
                sm:w- sm:max-w-xs
                lg:flex-row lg:max-w-md lg:w-full`}
              >
                <div className='flex flex-col flex-grow lg:w-5/12 w-full'>
                  <h2 className='bg-gray-Primary text-principal-1 text-lg w-full pl-2'>
                    {capitalizeFirstLetter(booking.type)} en {booking.city}
                  </h2>
                  <p>
                    {booking.address}, {booking.number}
                  </p>
                  <p>Precio: {Number(booking.price)}€</p>
                  <p>
                    Entrada:{' '}
                    {new Date(booking.startBookingDate).toLocaleDateString()}
                  </p>
                  <p>
                    Salida:{' '}
                    {new Date(booking.endBookingDate).toLocaleDateString()}
                  </p>
                  {booking.state !== 'finalizada' && (
                    <div className='flex pt-1'>
                      <button
                        onClick={() => {
                          setOverlay({
                            form: 'editBooking',
                            info: { ...User, ...booking },
                            shown: true,
                          });
                        }}
                        className='bg-gray-200 text-principal-gris font-medium flex items-center justify-between p-1 w-full'
                      >
                        {' '}
                        <FaPencilAlt />
                        <span className='flex-grow'>Editar</span>
                      </button>
                      <button
                        onClick={() => {
                          setOverlay({
                            form: 'cancelBooking',
                            info: { ...User, ...booking },
                            shown: true,
                          });
                        }}
                        className='bg-gray-100 font-medium text-principal-gris p-1 w-full'
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
                <div className='border-r-2 border-opacity-75 border-gray-700'></div>
                <Link
                  to={`/alquileres/${booking.idProperty}`}
                  className='lg:h-40 w-full relative flex flex-col flex-grow justify-between lg:w-4/12'
                >
                  <img
                    className={
                      booking.photo
                        ? 'h-32 w-44 object-cover'
                        : 'flex-grow object-cover w-full h-full'
                    }
                    src={
                      booking.photo
                        ? 'http://192.168.1.16:4000/photo/' + booking.photo
                        : require('../../Images/defPicture.jpg').default
                    }
                    alt='alquiler'
                  />
                  <div className='flex justify-end bg-gray-Primary w-full p-2'>
                    {booking.votes > 0 ? (
                      Array(parseInt(booking.votes))
                        .fill(null)
                        .map((value, i) => {
                          return (
                            <FaStar
                              key={i}
                              className='text-principal-1'
                            ></FaStar>
                          );
                        })
                    ) : (
                      <div className='h-4'></div>
                    )}
                  </div>
                </Link>
              </article>
              <div className='separador bg-principal-1 h-4 mt-5 w-full sm:w-0 max-w-xs'></div>
            </span>
          );
        })
      ) : (
        <h2>No hay reservas.</h2>
      )}
    </div>
  );
}

/*
 * ######################
 * ## CANCELAR RESERVA ##
 * ######################
 *
 */
function CancelBooking({ setOverlay, info, Token }) {
  const [message, setMessage] = useState({ message: '', status: 'ok' });

  function Confirm(bookingCode) {
    get(
      `http://192.168.1.16:4000/properties/${bookingCode}/cancel`,
      (data) => {
        setMessage(data.message);
        setOverlay({ shown: false, info: {}, form: '' });
        window.location.reload();
      },
      (error) => {
        setMessage(error.message);
      },
      Token
    );
  }

  return (
    <div className='z-10 bg-white bg-opacity-75 justify-center fixed w-full h-full left-0 top-0 flex flex-col items-center py-20 overflow-scroll sm:overflow-hidden'>
      {message.message && <Message message={message} setMessage={setMessage} />}
      <section className='cancel-booking filter drop-shadow-xl w-full p-4 flex flex-col gap-5 bg-white relative text-principal-gris overflow-y-auto md:w-3/4'>
        <button
          className='close-overlay absolute top-3 p-5 right-2'
          onClick={() => {
            setOverlay({ shown: false, info: {}, form: '' });
          }}
        >
          <FaPlus className='transform scale-150 rotate-45' />
        </button>
        <h1 className='title text-3xl p-4 border-b-4 self-center border-gray-600 flex justify-center w-5/6 select-none'>
          Cancelar reserva
        </h1>
        <div className='perfil flex flex-col items-center gap-5'>
          <article
            className={`animate-fadeIn border border-black w-full md:w-4/12 md:max-w-md sm:w-7/12 shadow-2xl`}
          >
            <h2 className='bg-gray-Primary text-principal-1 text-lg w-full font-medium'>
              {capitalizeFirstLetter(info.type)} en {info.city}
            </h2>
            <p>
              {info.address}, {info.number}
            </p>
            <p>Precio: {Number(info.price)}€</p>
            <p>
              Entrada: {new Date(info.startBookingDate).toLocaleDateString()}
            </p>
            <p>Salida: {new Date(info.endBookingDate).toLocaleDateString()}</p>
            {/* <img
              className='object-cover flex-grow'
              src={require('../../Images/defPicture.jpg').default}
              alt=''
            /> */}
            <div className='flex bg-gray-Primary w-min  pr-2 gap-1'>
              {info.votes > 0 ? (
                Array(parseInt(info.votes))
                  .fill(null)
                  .map((value, i) => {
                    return (
                      <FaStar key={i} className='text-principal-1'></FaStar>
                    );
                  })
              ) : (
                <div className='h-4'></div>
              )}
            </div>
          </article>
          <h3 className='text-base font-medium'>
            ¿Desea cancelar la reserva de {info.city}?
          </h3>
          <div className='flex justify-evenly w-11/12 gap-x-5 '>
            <button
              onClick={() => Confirm(info.bookingCode)}
              className='select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
            >
              Confirmar
            </button>
            <button
              onClick={() => {
                setOverlay({ shown: false, form: '', info: {} });
              }}
              className='select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
            >
              Salir
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/*
 * ####################
 * ## EDITAR RESERVA ##
 * ####################
 *
 */
function EditBooking({ setOverlay, info, Token }) {
  const [Message, setMessage] = useState({ status: '', message: '' });
  const [pickerValue, setPickerValue] = useState([null, null]);
  const [newDates, setNewDates] = useState([null, null]);

  function Confirm(bookingCode, dates) {
    // Fechas a comparar
    const startBookingDate = new Date(
      info.startBookingDate
    ).toLocaleDateString();
    const newStartBookingDate = new Date(dates[0]).toLocaleDateString();
    const endBookingDate = new Date(info.endBookingDate).toLocaleDateString();
    const newEndBookingDate = new Date(dates[1]).toLocaleDateString();
    // Si hay nuevas fechas seleccionadas, entra
    if (!newDates[0] && !newDates[1]) {
      console.warn('Debes seleccionar fechas nuevas');
    } else {
      // Si las nuevas seleccionadas son iguales a las existentes, error
      if (
        startBookingDate !== newStartBookingDate ||
        endBookingDate !== newEndBookingDate
      ) {
        const body = {
          startDate: format(dates[0], 'yyyy/MM/dd'),
          endDate: format(dates[1], 'yyyy/MM/dd'),
          city: info.city,

          name: info.name,
          lastName: info.lastName,
          tel: info.tel,
          email: info.email,
        };
        put(
          `http://192.168.1.16:4000/properties/${info.idProperty}/${bookingCode}`,
          CreateFormData(body),
          (data) => {
            if (data.status === 'ok') {
              setMessage({
                status: 'ok',
                message:
                  'Reserva editada con éxito. Tu casero confirmará la reserva.',
              });
            }
          },
          (error) => {
            setMessage({ status: 'error', message: error.message });
          },
          Token
        );
      } else {
        setMessage({
          status: 'error',
          message: 'Debes escoger fechas diferentes',
        });
      }
    }
  }

  const inpStyle =
    'px-3 py-3 placeholder-gray-400 text-gray-600 relative bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:ring';
  return (
    <div className='overlay z-20 p-4 bg-white justify-center bg-opacity-75 fixed w-full h-full left-0 top-0 flex flex-col items-center py-24 overscroll-scroll sm:overflow-hidden'>
      {Message.status === 'ok' && <ConfirmMessage Message={Message.message} />}
      <article className='filter drop-shadow-xl cancel-booking w-full p-4  flex flex-col gap-5 bg-white relative text-principal-gris overflow-y-auto md:w-3/4 '>
        <button
          className='close-overlay absolute top-3 p-5 right-2'
          onClick={() => {
            setOverlay({ shown: false, info: {}, form: '' });
          }}
        >
          <FaPlus className='transform scale-150 rotate-45' />
        </button>
        <h1 className='title text-3xl p-4 border-b-4 self-center border-gray-600 flex justify-center w-5/6 select-none'>
          Editar reserva
        </h1>
        <div className='perfil flex flex-col items-center gap-5'>
          <section
            className={`animate-fadeIn bg-white border text-center filter drop-shadow-xl w-full md:w-4/12 md:max-w-md sm:w-7/12`}
          >
            <h2 className='bg-gray-Primary text-principal-1 text-lg w-full font-medium'>
              {capitalizeFirstLetter(info.type)} en {info.city}
            </h2>
            <p>
              {info.address}, {info.number}
            </p>
            <p>Precio: {Number(info.price)}€</p>
            <p>
              Entrada: {new Date(info.startBookingDate).toLocaleDateString()}
            </p>
            <p>Salida: {new Date(info.endBookingDate).toLocaleDateString()}</p>
            {/* <img
              className='object-cover flex-grow'
              src={require('../../Images/defPicture.jpg').default}
              alt=''
            /> */}
            <div className='flex bg-gray-Primary w-min rounded-tr pr-2 gap-1'>
              {info.votes > 0 ? (
                Array(parseInt(info.votes))
                  .fill(null)
                  .map((value, i) => {
                    return (
                      <FaStar key={i} className='text-principal-1'></FaStar>
                    );
                  })
              ) : (
                <div className='h-4'></div>
              )}
            </div>
          </section>
          <section>
            <label className='flex flex-col gap-2'>
              <div className='select-none'>Selecciona las fechas:</div>
              <LocalizationProvider
                locale={esEsLocale}
                dateAdapter={AdapterDateFns}
              >
                <DateRangePicker
                  disablePast
                  autoOk={true}
                  label='Advanced keyboard'
                  value={pickerValue}
                  shouldDisableDate={(x) => {}}
                  inputFormat='dd/MM/yyyy'
                  onChange={(newValue) => {
                    if (
                      new Date(newValue[0]).getTime() >
                      new Date(newValue[1]).getTime()
                    ) {
                      console.error('Fecha de entrada mayor a fecha de salida');
                    } else if (
                      new Date(newValue[0]).getTime() ===
                      new Date(newValue[1]).getTime()
                    ) {
                      console.error('Selecciona fechas diferentes');
                    } else {
                      console.warn('FECHAS CORRECTAS');
                      setPickerValue(newValue);
                      setNewDates([newValue[0], newValue[1]]);
                    }
                  }}
                  renderInput={(startProps, endProps) => (
                    <div className='flex flex-col  sm:flex-row'>
                      <input
                        className={inpStyle}
                        name='startDate'
                        ref={startProps.inputRef}
                        {...startProps.inputProps}
                      />
                      <Box className='p-2 font-medium self-center'> a </Box>
                      <input
                        className={inpStyle}
                        name='endDate'
                        ref={endProps.inputRef}
                        {...endProps.inputProps}
                      />
                    </div>
                  )}
                />
              </LocalizationProvider>
            </label>
          </section>
          {Message.status === 'error' && (
            <p className='font-medium text-red-600'>
              Debes escoger fechas diferentes.
            </p>
          )}
          <div className='flex justify-evenly w-full gap-x-3'>
            <button
              onClick={() => Confirm(info.bookingCode, newDates)}
              className='select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
            >
              Confirmar
            </button>
            <button
              onClick={() => {
                setOverlay({ shown: false, form: '', info: {} });
              }}
              className='select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
            >
              Salir
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
