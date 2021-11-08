import React, { useEffect, useState } from 'react';
import { capitalizeFirstLetter, del, get, parseJwt } from '../../Helpers/Api';
import {
  FaCamera,
  FaPencilAlt,
  FaPlus,
  FaPlusSquare,
  FaStar,
  FaTrash,
} from 'react-icons/fa';
import Register from '../Forms/Register';
import useProperties from '../../Helpers/Hooks/useProperties';
import Property from '../Properties/Property';
import Avatar from '../Users/avatar';
import NewProperty from '../Properties/NewProperty';
import { Link } from 'react-router-dom';
import { ConfirmMessage } from '../Forms/VoteForm';

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

  useEffect(() => {
    get(
      `http://localhost:4000/users/${parseJwt(token).idUser}`,
      (data) => {
        setUser(data.userInfo);
      },
      (error) => console.log(error),
      token
    );
    if (User.idUser) {
      get(
        `http://localhost:4000/users/${User.idUser}/bookings`,
        (data) => {
          setBookings(data.bookings);
        },
        (error) => {
          console.log(error);
        },
        token
      );
    }
  }, [token, User.avatar, User.idUser]);

  function onSubmitDeleted(body, e) {
    if (window.confirm('¿Desea eliminar la cuenta?')) {
      del(
        `http://localhost:4000/users/${User.idUser}`,
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

  const propiedadUsuario = properties.filter(
    (property) => property.idUser === User.idUser
  );

  console.log(propiedadUsuario);
  return (
    <article className='pt-24 pb-32 flex flex-col justify-center'>
      {Overlay.form === 'register' && (
        <Register
          setOverlay={setOverlay}
          userInfo={Overlay.info}
          usuario={User}
          Token={token}
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

      <div className='bg-principal-1 text-principal-gris font-medium text-3xl pl-5 bg-opacity-25  '>
        SOBRE TI
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 p-10 gap-10 sm:gap-32 '>
        <section className='w-full h-full relative'>
          <img
            className='sm:max-w-sm rounded-full  py-4 object-contain'
            src={
              User.avatar
                ? `http://localhost:4000/photo/${User.avatar}`
                : require('../../Images/defProfile.png').default
            }
            alt='perfil de usuario'
          />

          <FaCamera
            className='text-4xl text-principal-gris m-auto absolute top-0 right-0 left-0 bottom-0'
            onClick={() => {
              setOverlay({ shown: true, userInfo: User, form: 'avatar' });
            }}
          />
        </section>
        <section className='w-auto'>
          <div className=' px-4 text-2xl bg-gray-Primary text-principal-1  font-normal flex flex-col-2 justify-between'>
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
            <span className='pl-2  overflow-x-auto'>{User.email}</span>
            <li className='bg-gray-400 text-lg px-2 '>Ciudad</li>
            <span className='pl-2  overflow-x-auto'>{User.ciudad}</span>
            <li className='bg-gray-400 text-lg px-2'>Teléfono</li>
            <span className='pl-2  overflow-x-auto'>{User.tel}</span>
            <li className='bg-gray-400 text-lg px-2'>Fecha de nacimiento</li>
            <span className='pl-2  overflow-x-auto'>
              {new Date(User.birthDate).toLocaleDateString('es-ES')}
            </span>
            <li className='bg-gray-400 text-lg px-2'>Biografía</li>
            <span className='py-2  overflow-x-auto'>{User.bio}</span>
          </ul>
        </section>
      </div>
      <div>
        <section>
          <div className='bg-principal-1 text-principal-gris font-medium text-3xl pl-5 bg-opacity-25 '>
            ALQUILERES
          </div>
          <div className='contenedor alquileres flex flex-wrap items-center justify-center sm:justify-start gap-5 sm:pl-2 pb-10'>
            {propiedadUsuario.length > 0 ? (
              propiedadUsuario.map((property) => (
                <Property
                  key={property.idProperty}
                  property={property}
                  token={token}
                />
              ))
            ) : (
              <div>No hay ningún inmueble</div>
            )}
            <button className='text-gray-400 flex flex-col items-center gap-2'>
              <span>Añade un inmueble</span>
              <FaPlusSquare
                className='text-4xl '
                onClick={() => {
                  setOverlay({
                    shown: true,
                    userInfo: User,
                    form: 'property',
                  });
                }}
              />
            </button>
          </div>
        </section>
        <section className='reservas '>
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
      <div className='flex justify-end'>
        <button
          className='py-4 px-2 rounded-full text-principal-1 bg-gray-Primary flex flex-row items-center justify-around'
          onClick={() => {
            onSubmitDeleted();
          }}
        >
          <FaTrash className='text-principal-1 hover:text-red-500' /> Eliminar
          cuenta
        </button>
      </div>
    </article>
  );
}

function BookingsComp({ Bookings, ShownBookings, User, setOverlay }) {
  function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  return (
    <div className='bookings-cont p-5 flex flex-col sm:flex-row sm:flex-wrap gap-5'>
      {Bookings.length ? (
        Bookings.filter((booking) => {
          if (ShownBookings === 'proximas') {
            return booking.state !== 'finalizada';
          } else {
            return booking.state === 'finalizada';
          }
        }).map((booking) => {
          return (
            <article
              key={booking.idBooking}
              className={`animate-fadeIn h-1/3 flex md:w-4/12 md:max-w-md sm:w-7/12 justify-between shadow-2xl`}
            >
              <div className='flex flex-col flex-grow w-5/12'>
                <h2 className='bg-gray-Primary text-principal-1 text-lg w-full'>
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
                      onClick={() => console.log('')}
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
                className='w-4/12 relative flex flex-col justify-between'
              >
                <img
                  className='object-cover flex-grow'
                  src={require('../../Images/defPicture.jpg').default}
                  alt=''
                />
                <div className='flex justify-end bg-gray-Primary w-full'>
                  {booking.votes > 0 ? (
                    Array(parseInt(booking.votes))
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
              </Link>
            </article>
          );
        })
      ) : (
        <h2>No hay reservas.</h2>
      )}
    </div>
  );
}

function CancelBooking({ setOverlay, info, Token }) {
  const [Message, setMessage] = useState();

  function Confirm(bookingCode) {
    get(
      `http://localhost:4000/properties/${bookingCode}/cancel`,
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
    <div className='overlay z-20 p-4 bg-gray-400 bg-opacity-75 fixed w-full h-full left-0 top-0 flex flex-col items-center py-24 overscroll-scroll sm:overflow-hidden'>
      {Message && <ConfirmMessage Message={Message} />}
      <section className='cancel-booking w-full p-4 border-2 border-gray-700 flex flex-col gap-5 bg-gray-100 relative text-principal-gris overflow-y-scroll md:w-3/4'>
        <button
          className='close-overlay absolute top-3 p-5 right-2'
          onClick={() => {
            setOverlay({ shown: false, info: {}, form: '' });
          }}
        >
          <FaPlus className='transform scale-150 rotate-45' />
        </button>
        <h1 className='title text-3xl p-4 border-b-4 self-center border-gray-700 flex justify-center w-5/6 select-none'>
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
          </article>
          <h3 className='text-base font-medium'>
            ¿Desea cancelar la reserva de {info.city}?
          </h3>
          <div className='flex justify-evenly w-full '>
            <button
              onClick={() => Confirm(info.bookingCode)}
              className='w-full p-2 hover:text-principal-1 font-medium text-center bg-gray-200'
            >
              Confirmar
            </button>
            <button
              onClick={() => {
                setOverlay({ shown: false, form: '', info: {} });
              }}
              className='w-full p-2 hover:text-principal-1 font-medium'
            >
              Salir
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// function EditBooking({ setOverlay, info, Token }) {
//   const [Message, setMessage] = useState();

//   function Confirm(bookingCode, startBookingDate, endBookingDate) {}

//   return (
//     <div className='overlay z-10 p-4 bg-gray-400 bg-opacity-75 fixed w-full h-full left-0 top-0 flex flex-col items-center py-24 overscroll-scroll sm:overflow-hidden'>
//       {Message && <ConfirmMessage Message={Message} />}
//       <section className='cancel-booking w-full p-4 border-2 border-gray-700 flex flex-col gap-5 bg-gray-100 relative text-principal-gris overflow-y-scroll md:w-3/4'>
//         <button
//           className='close-overlay absolute top-3 p-5 right-2'
//           onClick={() => {
//             setOverlay({ shown: false, info: {}, form: '' });
//           }}
//         >
//           <FaPlus className='transform scale-150 rotate-45' />
//         </button>
//         <h1 className='title text-3xl p-4 border-b-4 self-center border-gray-700 flex justify-center w-5/6 select-none'>
//           Cancelar reserva
//         </h1>
//         <div className='perfil flex flex-col items-center gap-5'>
//           <article
//             className={`animate-fadeIn border border-black w-full md:w-4/12 md:max-w-md sm:w-7/12 shadow-2xl`}
//           >
//             <h2 className='bg-gray-Primary text-principal-1 text-lg w-full font-medium'>
//               {capitalizeFirstLetter(info.type)} en {info.city}
//             </h2>
//             <p>
//               {info.address}, {info.number}
//             </p>
//             <p>Precio: {Number(info.price)}€</p>
//             <p>
//               Entrada: {new Date(info.startBookingDate).toLocaleDateString()}
//             </p>
//             <p>Salida: {new Date(info.endBookingDate).toLocaleDateString()}</p>
//             {/* <img
//           className='object-cover flex-grow'
//           src={require('../../Images/defPicture.jpg').default}
//           alt=''
//         /> */}
//             <div className='flex bg-gray-Primary w-min rounded-tr pr-2 gap-1'>
//               {info.votes > 0 ? (
//                 Array(parseInt(info.votes))
//                   .fill(null)
//                   .map((value, i) => {
//                     return (
//                       <FaStar key={i} className='text-principal-1'></FaStar>
//                     );
//                   })
//               ) : (
//                 <div className='h-4'></div>
//               )}
//             </div>
//           </article>
//           <h3 className='text-base font-medium'>
//             ¿Desea cancelar la reserva de {info.city}?
//           </h3>
//           <div className='flex justify-evenly w-full '>
//             <button
//               onClick={() => Confirm(info.bookingCode)}
//               className='w-full p-2 hover:text-principal-1 font-medium text-center bg-gray-200'
//             >
//               Confirmar
//             </button>
//             <button
//               onClick={() => {
//                 setOverlay({ shown: false, form: '', info: {} });
//               }}
//               className='w-full p-2 hover:text-principal-1 font-medium'
//             >
//               Salir
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
