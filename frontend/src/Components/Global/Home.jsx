import { React, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa';
import { Link, useHistory } from 'react-router-dom';
import useProperties from '../../Helpers/Hooks/useProperties';
import Property from '../Properties/Property';
import { TokenContext } from '../../Helpers/Hooks/TokenProvider';
import { get } from '../../Helpers/Api';

// Styles
const sectionStyle =
  'h-max-content p-5 text-principal-1 overflow-y-auto bg-gray-Primary';
const sectionTitleStyle = 'pb-5 text-3xl font-medium';
const sectionImgStyle = 'w-2/5 float-right pl-3';
const boxContStyle = 'row-span-2 flex flex-col gap-5';
const boxContTitleStyle =
  'w-full text-center pt-4 pb-3 text-principal-1 underline text-xl';
const boxItemContStyle =
  'grid grid-cols-1 flex-grow grid-rows-auto gap-2 justify-items-center sm:grid-cols-2 relative';
const boxReadMoreBtnStyle =
  'm-auto text-xl bg-gray-Primary text-principal-1 border-2 border-gray-800 max-w-max px-6 py-2 hover:bg-principal-1 hover:text-gray-700 duration-300';
const descBoxStyle =
  'content-center w-3/4 h-full bg-principal-1-hover text-black';
const descBoxTextStyle = 'text-left p-4';
const descBoxTitleStyle = '  pb-3 font-medium';
const descBoxPStyle = '  pl-2';

export function Home() {
  return (
    <>
      <Banner />
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 16, 16, 0.9),rgba(16, 16, 16, 0.3)),url('./Images/fondo-gris.jpeg')",
        }}
        className='bg-black bg-center bg-no-repeat bg-cover flex flex-col gap-7 sm:grid sm:grid-cols-2 sm:grid-rows-3 sm:pt-5  sm:w-full pb-32'
      >
        <RentersList />
        <PropertiesList />
        <RenterDescription />
        <PropertyDescription />
      </div>
    </>
  );
}

export function PropertyDescription() {
  return (
    <section className={sectionStyle}>
      <h3 className={sectionTitleStyle}>Alquileres</h3>
      <img className={sectionImgStyle} src='/Images/flat.jpg' alt='' />
      <p className='text-justify'>
        Si tienes una vivienda y quieres ponerla en alquiler... ¡Te damos la
        bienvenida a Perfect Renter! Encontrarás personas interesadas en una
        vivienda vacacional y personas que lo que buscan es un hogar. Todas con
        un historial de votaciones que te ayudarán a tomar la mejor decisión.
        ¡Estamos aquí para que encuentres a tu inquilino perfecto!
      </p>
    </section>
  );
}

export function RenterDescription() {
  return (
    <section className={sectionStyle}>
      <h3 className={sectionTitleStyle}>Inquilinos</h3>
      <img className={sectionImgStyle} src='/Images/familia.jpg' alt='' />
      <p className='text-justify'>
        Sabemos que encontrar una vivienda puede ser complicado y queremos
        ponértelo fácil. Tanto si necesitas un lugar en el que pasar unos días,
        como si lo que buscas es un hogar para ti o tu familia, en Perfect
        Renter tenemos lo que necesitas. Un catálogo de viviendas con un
        historial de votaciones de antiguos inquilinos que te ayudarán a
        encontrar tu vivivienda perfecta.
      </p>
    </section>
  );
}

export function Banner() {
  const history = useHistory();
  const { register, handleSubmit } = useForm();

  function onSubmit(body, e) {
    e.preventDefault();
    history.push(`/alquileres?ciudad=${body.city}`);
  }
  return (
    <div
      className='header bg-center bg-cover sm:h-60vh h-1/3  max-w-full grid grid-cols-10 grid-rows-8'
      style={{
        backgroundImage:
          "linear-gradient(rgba(16, 16, 16, 0.3),rgba(16, 16, 16, 0.9)),url('./Images/bgheader.jpg')",
      }}
    >
      <div className='header-text col-start-2 col-end-10 sm:col-start-7 sm:col-end-11 row-start-3 row-end-6 text-white h-30vh flex flex-col gap-2'>
        <h3 className='text-xl font-light'>Encuentra tu</h3>
        <h1 className='text-4xl text-principal-1'>Inquilino Perfecto</h1>
        <p className='w-4/5 text-base font-light'>
          Porque tú o tu propiedad merecen ser valorados. Busca pisos e
          inquilinos, mira sus reseñas y contacta con solo unos Click's.
        </p>
        <Link
          to='/nosotros'
          className='btn-more text-xl bg-none p-2 border-yellow-400 border-2 max-w-max hover:bg-principal-1 hover:border-white hover:text-gray-600 duration-300'
        >
          Leer más
        </Link>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='relative col-start-2 col-end-10 mt-14 sm:col-start-4 sm:col-end-8 row-start-7 row-end-8 self-end w-full'
      >
        <input
          type='text'
          {...register('city', {
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
          placeholder='Escribe aquí tu ciudad favorita...'
          className='w-full pl-2 p-2 bg-gray-300 outline-contras'
        />
        <FaSearch
          onClick={handleSubmit(onSubmit)}
          className='text-gray-900 absolute top-3 right-2 cursor-pointer'
        />
      </form>
    </div>
  );
}

export function PropertiesList() {
  const [Properties] = useProperties();
  return (
    <div className={boxContStyle}>
      <h2 className={boxContTitleStyle}>ALQUILERES</h2>
      <div className={boxItemContStyle}>
        {Properties.length > 0 &&
          Properties.slice(0, 4).map((property) => (
            <Property
              key={property.idProperty}
              property={property}
              mountOn={'home'}
            />
          ))}
      </div>

      <Link to='/alquileres' className={boxReadMoreBtnStyle}>
        <button>Ver más</button>
      </Link>
    </div>
  );
}

export function RentersList() {
  const [OverlayTenants, setOverlayTenants] = useState(false);
  const [Token] = useContext(TokenContext);
  const [Users, setUsers] = useState([]);

  useEffect(() => {
    // const controller = new AbortController();
    if (Token) {
      get(
        'http://192.168.1.16:4000/users',
        (data) => {
          setUsers(data.users);
        },
        (error) => console.error(error),
        Token,
        null
      );
    } else {
      setUsers([
        {
          idUser: 1,
          avatar: 'fotoperfil1.jpg',
          name: 'Lucía Rodríguez',
          city: 'Cáceres',
        },
        {
          idUser: 2,
          avatar: 'fotoperfil2.jpg',
          name: 'Sofía Guijuela',
          city: 'Albacete',
        },
        {
          idUser: 3,
          avatar: 'fotoperfil3.jpg',
          name: 'Isaac Martin',
          city: 'Granada',
        },
        {
          idUser: 4,
          avatar: 'fotoperfil4.jpg',
          name: 'Juan Antonio',
          city: 'La Langa',
        },
      ]);
    }
    return () => {
      // controller.abort();
    };
  }, [Token]);
  const buttonStyle =
    'select-none w-1/4 self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer';

  return (
    <div className={boxContStyle}>
      <h2 className={boxContTitleStyle}>INQUILINOS</h2>
      <div
        className={boxItemContStyle}
        onClick={(e) => {
          !Token && setOverlayTenants(true);
        }}
      >
        {OverlayTenants && (
          <div
            className={`animate-fadeIn overlay z-20 absolute  flex flex-col gap-2 items-center justify-center m-auto top-0 bottom-0 left-0 right-0 text-xl font-medium text-white`}
          >
            <span className='filter drop-shadow-2xl'>
              Regístrate para visualizar otros usuarios
            </span>
            <Link className={`${buttonStyle} `} to='/registro'>
              Registro
            </Link>
          </div>
        )}
        {Users.length
          ? Users.slice(0, 4).map((user) => (
              <Renter Token={Token} key={user.idUser} user={user} />
            ))
          : ''}
      </div>
      {Token ? (
        <Link to='/inquilinos' className={boxReadMoreBtnStyle}>
          <button>Ver más</button>
        </Link>
      ) : (
        <button
          className={boxReadMoreBtnStyle}
          onClick={(e) => {
            !Token && setOverlayTenants(true);
          }}
        >
          Ver más
        </button>
      )}
    </div>
  );
}

export function Renter({ user, Token }) {
  return (
    <div className={descBoxStyle + ` ${!Token && 'filter blur'}`}>
      <img
        className=' w-full h-48 object-cover '
        src={
          user.avatar
            ? 'http://192.168.1.16:4000/photo/' + user.avatar
            : 'http://192.168.1.16:4000/photo/fotoperfil7.jpg'
        }
        alt=''
      />

      {Token ? (
        <Link to={'/inquilinos/' + user.idUser}>
          <div className={descBoxTextStyle}>
            <h2 className={descBoxTitleStyle}>{user.name}</h2>
            <p className={descBoxPStyle}>{user.city}</p>
          </div>
        </Link>
      ) : (
        <div className={descBoxTextStyle}>
          <h2 className={descBoxTitleStyle}>{user.name}</h2>
          <p className={descBoxPStyle}>{user.city}</p>
        </div>
      )}
    </div>
  );
}
