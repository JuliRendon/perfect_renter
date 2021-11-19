import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../Helpers/Api';
import { TokenContext } from '../../Helpers/Hooks/TokenProvider';
import Login from '../Forms/Login';

export default function ManageBokking({ match }) {
  const [Token] = useContext(TokenContext);
  const [booking, setBooking] = useState({});

  function acceptBooking() {
    // const controller = new AbortController();
    get(
      `http://192.168.1.16:4000/properties/${match.params.bookingCode}/accept`,
      (data) => {
        setBooking(data);
      },
      (error) => {
        console.error(error);
        setBooking(error);
      },
      Token,
      null
    );
  }

  function cancelBooking() {
    // const controller = new AbortController();
    get(
      `http://192.168.1.16:4000/properties/${match.params.bookingCode}/cancel`,
      (data) => {
        setBooking(data);
      },
      (error) => {
        setBooking(error);
      },
      Token,
      null
    );
  }

  if (Token) {
    if (booking.status === 'error') {
      return (
        <div className='z-10 bg-white bg-opacity-0 justify-center fixed w-full h-full left-0 top-0 flex flex-col items-center py-20 overflow-scroll sm:overflow-hidden'>
          <section className='contact bg-white h-auto w-5/12 py-5 px-5 filter drop-shadow-xl flex flex-col gap-5 justify-center relative items-center'>
            <h2 className='text-4xl text-principal-gris border-b-4 border-gray-600'>
              ¡Parece que hay un error!
            </h2>
            <h3 className='text-xl text-principal-gris '>{booking.message}</h3>
            <Link
              to='/'
              className='select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
            >
              Cerrar
            </Link>
          </section>
        </div>
      );
    }
    if (booking.status === 'ok') {
      return (
        <div className='z-10 bg-white bg-opacity-0 justify-center fixed w-full h-full left-0 top-0 flex flex-col items-center py-20 overflow-scroll sm:overflow-hidden'>
          <section className='contact bg-white h-auto w-5/12 py-5 px-5 filter drop-shadow-xl flex flex-col gap-5 justify-center relative items-center'>
            <h2 className='text-4xl text-principal-gris border-b-4 border-gray-600'>
              ¡Ya esta listo!
            </h2>
            <h3 className='text-xl text-principal-gris '>{booking.message}</h3>
            <Link
              to='/'
              className='select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
            >
              Cerrar
            </Link>
          </section>
        </div>
      );
    }
    if (match.path.includes('accept')) {
      return (
        <div className='z-10 bg-white bg-opacity-0 justify-center fixed w-full h-full left-0 top-0 flex flex-col items-center py-20 overflow-scroll sm:overflow-hidden'>
          <section className='contact bg-white h-auto w-5/12 py-5 px-5 filter drop-shadow-xl flex flex-col gap-5 justify-center relative items-center'>
            <h2 className='text-4xl text-principal-gris border-b-4 border-gray-600'>
              Felicidades por tu reserva
            </h2>
            <h3 className='text-xl text-principal-gris font-medium text-center'>
              Esperamos que sea el Inquilino perfecto
              <img
                className='w-full pt-2 sm:pt-8'
                src='https://www.cerrajeriaplacer.com/que-debo-hacer-si-me-roban-las-llaves-de-casa_img21063t1.jpg'
                alt='llaves de casa'
              />
            </h3>
            <div className='flex flex-row w-10/12 sm:flex-row  sm:justify-between gap-4 lg:pt-12'>
              <button
                className='select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
                onClick={acceptBooking}
              >
                ¡Aceptar reserva!
              </button>
              <button
                className='select-none w-full self-center text-center bg-red-400 text-white border border-red-500 py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 hover:border-yellow-400 transform ease-in duration-200 cursor-pointer'
                onClick={cancelBooking}
              >
                ¡Cancelar reserva!
              </button>
            </div>
          </section>
        </div>
      );
    } else {
      return (
        <div className='z-10 bg-white bg-opacity-0 justify-center fixed w-full h-full left-0 top-0 flex flex-col items-center py-20 overflow-scroll sm:overflow-hidden'>
          <section className='contact bg-white h-auto w-7/12 py-5 px-5 filter drop-shadow-xl flex flex-col gap-5  relative items-center'>
            <h2 className='text-4xl text-principal-gris border-b-4 border-gray-600 p-2 '>
              ¡Piensatelo Bien!
            </h2>
            <h3 className='text-xl text-principal-gris '>
              ¡Puede ser el Inquilino Perfecto!
              {/* <img
                className='w-2/5 pt-2 sm:pt-8'
                src='https://www.cerrajeriaplacer.com/que-debo-hacer-si-me-roban-las-llaves-de-casa_img21063t1.jpg'
                alt='llaves de casa'
              /> */}
            </h3>
            <div className='flex flex-row w-10/12 sm:flex-row  sm:justify-between gap-4 lg:pt-12'>
              <button
                className='select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
                onClick={acceptBooking}
              >
                ¡Aceptar reserva!
              </button>
              <button
                className='select-none w-full self-center text-center bg-red-400 text-white border border-red-500 py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 hover:border-yellow-400 transform ease-in duration-200 cursor-pointer'
                onClick={cancelBooking}
              >
                ¡Cancelar reserva!
              </button>
            </div>
          </section>
        </div>
      );
    }
  } else {
    /**Si no esta validado mostramos el componente login y al entrar vuelve a la misma url de accept o cancel */
    return (
      <>
        <div className='z-10 bg-white bg-opacity-0 justify-center fixed w-full h-full left-0 top-0 flex flex-col items-center py-20 overflow-scroll sm:overflow-hidden'>
          <section className='contact text-principal-gris p-8 filter drop-shadow-xl flex flex-col gap-5  bg-white relative'>
            <h2 className='pt-4  text-center'>
              Debes iniciar sessión para administrar tu reserva...
            </h2>
            <Login />
          </section>
        </div>
      </>
    );
  }
}
