import React, { useContext, useEffect, useState } from 'react';
import { capitalizeFirstLetter, get } from '../../Helpers/Api';
import { FaStar } from 'react-icons/fa';
import { TokenContext } from '../../Helpers/Hooks/TokenProvider';
import ContactTenant from '../Forms/ContactTenant';
import useProperties from '../../Helpers/Hooks/useProperties';
import Property from '../Properties/Property';
import { Link } from 'react-router-dom';

export default function UserProfile({ match }) {
  const [Token] = useContext(TokenContext);
  const [user, setUser] = useState({});
  const [Overlay, setOverlay] = useState({ shown: false, userInfo: {} });
  const [Bookings, setBookings] = useState([]);
  const [properties] = useProperties([]);
  const [Votes, setVotes] = useState([]);

  useEffect(() => {
    // const controller = new AbortController();
    // const controllerBookings = new AbortController();
    // const controllerVotes = new AbortController();
    get(
      `http://192.168.1.16:4000/users/${match.params.idUser}`,
      (data) => {
        setUser(data.userInfo);
      },
      (error) => {
        console.error(error);
      },
      Token,
      null
    );
    get(
      `http://192.168.1.16:4000/users/${match.params.idUser}/bookings/renter`,
      (data) => {
        if (data.status === 'ok') {
          setBookings(data.bookings);
        }
      },
      (error) => {
        console.error(error);
      },
      Token,
      null
    );
    get(
      `http://192.168.1.16:4000/users/${match.params.idUser}/votes`,
      (data) => {
        if (data.status === 'ok') {
          setVotes(data.Valoraciones);
        }
      },
      (error) => {
        console.error(error);
      },
      Token,
      null
    );
    return () => {
      // controller.abort();
      // controllerBookings.abort();
      // controllerVotes.abort();
    };
  }, [match.params.idUser, Token]);

  const propiedadUsuario = properties.filter(
    (property) => property.idUser === user.idUser
  );
  const buttonStyle =
    'select-none w-1/4 self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer';

  return (
    <>
      {Overlay.shown && (
        <ContactTenant
          setOverlay={setOverlay}
          info={Overlay.info}
          Token={Token}
        />
      )}
      <main className='pb-32 py-20 flex flex-col items-center justify-center max-w-5xl m-auto'>
        <div className='perfil flex flex-col items-center justify-center'>
          <article className=' flex flex-col gap-5 items-center justify-center'>
            <img
              className=' w-60 h-60 object-cover rounded-circle'
              src={
                user.avatar
                  ? `http://192.168.1.16:4000/photo/${user.avatar}`
                  : require('../../Images/defProfile.png').default
              }
              alt='imagen de perfil'
            />

            <section className=''>
              <div className='bg-gray-Primary p-2 bg-opacity-25 text-3xl text-principal-1 flex justify-between'>
                <h1>
                  {user.name
                    ? `${capitalizeFirstLetter(
                        user.name
                      )} ${capitalizeFirstLetter(user.lastName)}`
                    : 'Nombre de tenant'}
                </h1>
              </div>
              <div className='flex self-center px-2 py-2'>
                {[1, 2, 3, 4, 5].map((value, i) => {
                  return (
                    <FaStar
                      key={value}
                      className={`text-principal-1 duration-200 text-2xl cursor-pointer`}
                    />
                  );
                })}
              </div>
              <h2 className='text-2xl border-b border-gray-200 text-principal-gris bg-principal-1 w-full p-1 font-semibold'>
                Biografía
              </h2>
              <p className='p-2'>
                {user.bio}
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus obcaecati dignissimos ratione labore rem nesciunt
                architecto illo a quos, iure quibusdam aliquid quo impedit
                dolorum quam assumenda minus beatae voluptate!
              </p>
            </section>
          </article>
        </div>

        <section className='w-full pt-2'>
          <h2 className='text-2xl border-b border-gray-200 text-principal-gris bg-principal-1 w-full p-1 font-semibold'>
            Historial viviendas
          </h2>
          <div
            className='
      bookings-cont p-5 flex flex-col items-center  gap-5
      sm:justify-start sm:flex-row sm:flex-wrap lg:justify-start'
          >
            {Bookings.length ? (
              Bookings.map((booking) => {
                return (
                  <span key={booking.idBooking} className='max-w-xs'>
                    <article
                      className={`animate-fadeIn filter drop-shadow-xl h-1/3 max-w-xs flex flex-col items-start justify-between
                sm:w- sm:max-w-xs
                lg:flex-row lg:max-w-md lg:w-full`}
                    >
                      <div className='flex flex-col flex-grow lg:w-5/12 w-full'>
                        <h2 className='bg-gray-Primary text-principal-1 text-lg w-full pl-2'>
                          {capitalizeFirstLetter(booking.type)} en{' '}
                          {booking.city}
                        </h2>
                        <p>
                          {booking.address}, {booking.number}
                        </p>
                        <p>Precio: {Number(booking.price)}€</p>
                        <p>
                          Entrada:{' '}
                          {new Date(
                            booking.startBookingDate
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          Salida:
                          {new Date(
                            booking.endBookingDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className='border-r-2 border-opacity-75 border-gray-700'></div>
                      <Link
                        to={`/alquileres/${booking.idProperty}`}
                        className='lg:h-40 w-full relative flex flex-col flex-grow justify-between lg:w-4/12'
                      >
                        <img
                          className='flex-grow object-cover w-full h-full'
                          src={
                            booking.photo
                              ? 'http://192.168.1.16:4000/photo/' +
                                booking.photo
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
                    {Bookings.length > 1 && (
                      <div className='separador bg-principal-1 h-4 mt-5 w-full sm:w-0 max-w-xs'></div>
                    )}
                  </span>
                );
              })
            ) : (
              <h2 className='p-2'>
                Este inquilino no tiene historial de viviendas.
              </h2>
            )}
          </div>
        </section>
        <section className='w-full '>
          <h2 className='text-2xl border-b border-gray-200 text-principal-gris bg-principal-1 w-full p-1 font-semibold'>
            Aquileres
          </h2>
          <div className='flex flex-wrap gap-5 justify-center'>
            {propiedadUsuario.length > 0 ? (
              propiedadUsuario.map((property) => (
                <Property key={property.idProperty} property={property}>
                  <div className='cont-vivienda bg-white w-auto min-w-min my-5 border border-black shadow-2xl '>
                    <img
                      className='w-auto max-w-xs'
                      src={require('../../Images/defPicture.jpg').default}
                      alt='default'
                    />
                    <div>
                      {property.city}
                      <br />
                      {property.province}
                      <br />
                      {property.adress}
                      <br />
                      {property.price}
                      <br />
                      <span className='flex'>
                        {Array(parseInt(property.votes))
                          .fill(null)
                          .map((value, i) => {
                            return (
                              <FaStar
                                key={i}
                                className='text-principal-1'
                              ></FaStar>
                            );
                          })}
                      </span>
                    </div>
                  </div>
                </Property>
              ))
            ) : (
              <div className='font-medium p-2'>No hay ningún inmueble.</div>
            )}
          </div>
        </section>

        <section className='w-full pb-20'>
          <h2 className='text-2xl border-b border-gray-200 text-principal-gris bg-principal-1 w-full p-1 font-semibold'>
            Opiniones
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

        <button
          className={buttonStyle + ''}
          onClick={() => {
            setOverlay({ shown: true, info: user, form: 'contact' });
          }}
        >
          Contactar
        </button>
      </main>
    </>
  );
}
