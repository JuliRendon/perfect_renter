```jsx
import React, { useContext, useEffect, useState } from 'react';
import {
  FaCamera,
  FaHome,
  FaPencilAlt,
  FaPlus,
  FaPlusSquare,
  FaStar,
  FaTrash,
  FaUser,
  FaAngleRight,
  FaAngleLeft,
} from 'react-icons/fa';
import Password from '../Forms/Inputs/Password';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { format } from 'date-fns';
import esEsLocale from 'date-fns/locale/es';
import Carousel from 'react-material-ui-carousel';

const [ShownBookings, setShownBookings] = useState('proximas');

const Token = 1;
const mountOn = 'profile';
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

const Bookings = [
  {
    address: 'Calle España',
    bookingCode: 'reserva5',
    city: 'Madrid',
    endBookingDate: '2021-10-20T00:00:00.000Z',
    idBooking: 5,
    idProperty: 5,
    number: 1,
    photo: 'flat.jpg',
    price: '2000.00',
    rooms: 3,
    startBookingDate: '2021-10-15T00:00:00.000Z',
    state: 'finalizada',
    type: 'duplex',
    votes: '2.0000',
  },
  {
    address: 'Calle España',
    bookingCode: 'reserva5',
    city: 'Madrid',
    endBookingDate: '2021-10-20T00:00:00.000Z',
    idBooking: 5,
    idProperty: 5,
    number: 1,
    photo: 'flat.jpg',
    price: '2000.00',
    rooms: 3,
    startBookingDate: '2021-10-15T00:00:00.000Z',
    state: 'finalizada',
    type: 'duplex',
    votes: '2.0000',
  },
];

const SlideImgs = [
  'llaves-de-la-casa-10.jpg',
  'portada-nosotros.jpg',
  'flat.jpg',
];

const Votes = [
  {
    idVote: 1,
    commentRenter: 'Es un señor especial.',
    idRenter: 12,
    voteValueRenter: 3,
    name: 'Manu',
    lastName: 'Torres',
    avatar: 'manu.jpg',
  },
  {
    idVote: 3,
    commentRenter: 'Es un señor muy amable.',
    idRenter: 14,
    voteValueRenter: 5,
    name: 'Julian',
    lastName: 'Rendon',
    avatar: 'julian.jpg',
  },
  {
    idVote: 4,
    commentRenter: 'Preguntan mucho.',
    idRenter: 12,
    voteValueRenter: 1,
    name: 'Manu',
    lastName: 'Torres',
    avatar: 'manu.jpg',
  },
  {
    idVote: 5,
    commentRenter: 'Todo ok.',
    idRenter: 14,
    voteValueRenter: 3,
    name: 'Julian',
    lastName: 'Rendon',
    avatar: 'julian.jpg',
  },
];

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

const propiedadUsuario = [
  {
    idProperty: 1,
    idUser: 12,
    description:
      'Promoción de Obra nueva situada en Barcelona, exclusiva promoción de 22 viviendas con acabados de primera calidad, sistema de climatización de aerotermia de ahorro energético, suelos de parqué, piso de 90,30m² construidos, 2 habitaciones dobles y 1 individual, 2 baños completos, cocina independiente con salida al balcón, amplio comedor con salida al balcón, con parking opcional ! Ven a pedir bookingrmación !',
    city: 'Barcelona',
    province: 'Barcelona',
    address: 'Carrer del Riu',
    zipCode: '08480',
    number: 9,
    type: 'piso',
    stair: '0',
    elevator: null,
    flat: 1,
    gate: '3',
    mts: '90.00',
    rooms: 3,
    garage: 0,
    terrace: 0,
    toilets: 2,
    energyCertificate: 0,
    availabilityDate: '2021-11-10T00:00:00.000Z',
    price: '650.00',
    state: 'disponible',
    votes: '3.0000',
    createdAt: '2021-11-10T19:26:11.000Z',
  },
  {
    idProperty: 2,
    idUser: 12,
    description:
      'Últimos apartamentos en nuestra promoción Santa Clara 11.Se encuentra instalada en una de las mejores zonas del casco antiguo de Girona, frente al río Onyar. El objetivo de Zenit Houses es transformar el edificio denso de oficinas de los años 70 en una nueva tipología de vida dinámica. Se propone un nuevo patio de luces. Se piensa como un espacio moderno, transparente y luminoso, abierto al cielo. Como corazón de construcción, proporciona luz, ventilación y carácter a las viviendas y al público. Se define en bloques de vidrio siguiendo la tradición de la galería norte-europea, tal como sucede en la Viennese Otto Wagner modernist DS. Las tipologías de viviendas variadas están abiertas tanto en la calle como en el patio. Los diferentes niveles están ocupados con múltiples experiencias de vida. La antigua estructura flexible se adapta a los nuevos tiempos, y también desarrolla una nueva fachada en la calle, que muestra el carácter renovado de Girona. Los apartamentos están listos para entrar a vivir, cocinas totalmente completas con los electrodomésticos integrados incluidos.',
    city: 'Girona',
    province: 'Girona',
    address: 'Carrer de Costa Rica',
    zipCode: '17001',
    number: 9,
    type: 'duplex',
    stair: '1',
    elevator: 1,
    flat: 2,
    gate: '2',
    mts: '85.00',
    rooms: 2,
    garage: 0,
    terrace: 0,
    toilets: 1,
    energyCertificate: 0,
    availabilityDate: '2021-11-10T00:00:00.000Z',
    price: '300.00',
    state: 'disponible',
    votes: '0.0000',
    createdAt: '2021-11-10T19:26:11.000Z',
  },
  {
    idProperty: 3,
    idUser: 13,
    description:
      'El piso está reformado y se encuentra en ÓPTIMAS CONDICIONES. Cuenta con CALEFACCIÓN CENTRAL INCLUIDA EN EL PRECIO. Tiene aire acondicionado en el salón Es EXTERIOR.\nTiene techos altos, paredes lisas con molduras de techo, suelos de parqué. Cuenta con puerta blindada y ventilación cruzada. Podemos encontrar ARMARIOS EMPOTRADOS en dos dormitorios. Las ventanas son climalit. Se divide en las siguientes estancias: -Hall de entrada: Recibidor que da acceso a la vivienda -Salón: con ventanas exteriores. La zona de comedor es independiente. -Cocina: Independiente, amueblada y equipada con ELECTRODOMÉSTICOS. Cuenta con HORNO, microondas, LAVAVAJILLAS, HORNO, y vitrocerámica. Tiene ventana. -Zona office que da servicio a la cocina -Zona de lavadero, independiente, con su puerta de servicio -Dormitorio 1: MATER BEDROOM, con baño ensuite. Tiene ventana exterior. Acceso desde el salón -Baño 1: Con bañera -Dormitorio 2: INDIVIDUAL, con baño ensuite. Tiene ventana interior -Baño 2: Con pie de ducha -Dormitorio 3: de SERVICIO. Tiene ventana -Baño 3: Con ducha. Tiene ventana',
    city: 'Madrid',
    province: 'Madrid',
    address: 'Calle Aragón',
    zipCode: '28002',
    number: 9,
    type: 'piso',
    stair: '1',
    elevator: null,
    flat: 3,
    gate: '2',
    mts: '80.00',
    rooms: 1,
    garage: 0,
    terrace: 0,
    toilets: 1,
    energyCertificate: 0,
    availabilityDate: '2021-11-10T00:00:00.000Z',
    price: '1250.00',
    state: 'disponible',
    votes: '3.0000',
    createdAt: '2021-11-10T19:26:11.000Z',
  },
];

const property = {
  idProperty: 3,
  idUser: 13,
  description:
    'El piso está reformado y se encuentra en ÓPTIMAS CONDICIONES. Cuenta con CALEFACCIÓN CENTRAL INCLUIDA EN EL PRECIO. Tiene aire acondicionado en el salón Es EXTERIOR.\nTiene techos altos, paredes lisas con molduras de techo, suelos de parqué. Cuenta con puerta blindada y ventilación cruzada. Podemos encontrar ARMARIOS EMPOTRADOS en dos dormitorios. Las ventanas son climalit. Se divide en las siguientes estancias: -Hall de entrada: Recibidor que da acceso a la vivienda -Salón: con ventanas exteriores. La zona de comedor es independiente. -Cocina: Independiente, amueblada y equipada con ELECTRODOMÉSTICOS. Cuenta con HORNO, microondas, LAVAVAJILLAS, HORNO, y vitrocerámica. Tiene ventana. -Zona office que da servicio a la cocina -Zona de lavadero, independiente, con su puerta de servicio -Dormitorio 1: MATER BEDROOM, con baño ensuite. Tiene ventana exterior. Acceso desde el salón -Baño 1: Con bañera -Dormitorio 2: INDIVIDUAL, con baño ensuite. Tiene ventana interior -Baño 2: Con pie de ducha -Dormitorio 3: de SERVICIO. Tiene ventana -Baño 3: Con ducha. Tiene ventana',
  city: 'Madrid',
  province: 'Madrid',
  address: 'Calle Aragón',
  zipCode: '28002',
  number: 9,
  type: 'piso',
  stair: '1',
  elevator: null,
  flat: 3,
  gate: '2',
  mts: '80.00',
  rooms: 1,
  garage: 0,
  terrace: 0,
  toilets: 1,
  energyCertificate: 0,
  availabilityDate: '2021-11-10T00:00:00.000Z',
  price: '1250.00',
  state: 'disponible',
  votes: '3.0000',
  createdAt: '2021-11-10T19:26:11.000Z',
};

function onSubmitDeleted(body, e) {
  alert('usuario eliminado');
}

const [Overlay, setOverlay] = useState({
  shown: false,
  info: {},
  form: '',
});

const inpStyle =
  'px-3 py-3 placeholder-gray-400 text-gray-600 focus:cursor-default relative bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:ring w-full cursor-pointer';

const registerComponentStyle = Token
  ? 'overlay z-20 bg-gray-400 bg-opacity-75 fixed w-full h-full min-h-full h-96 left-0 top-0 flex flex-col items-center pt-20 pb-10 overflow-auto sm:overflow-hidden'
  : 'bg-gray-200 bg-opacity-50';

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
    <div className='overlay z-20 bg-gray-400 bg-opacity-75 fixed w-full h-full left-0 top-0 flex flex-col items-center sm:px-12 sm:py-24 pt-24 px-2 overscroll-scroll sm:overflow-hidden'>
      <section className='delete-property shadow-custom py-2 px-2 border-2 border-gray-700 flex flex-col items-center gap-5 bg-gray-100 relative text-principal-gris overflow-y-scroll md:w-3/4'>
        <button
          className='close-overlay absolute top-3 p-5 right-2'
          onClick={() => {
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

            <input
              className='button select-none w-1/2 self-center text-center bg-principal-1 text-principal-gris border border-gray-400 text-black p-2 hover:bg-gray-200 hover:text-gray-600 transform ease-in duration-200 cursor-pointer '
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

function BookingsComp({ Bookings, ShownBookings, User, setOverlay }) {
  return (
    <div>
      {Bookings.length ? (
        Bookings.filter((booking) => {
          if (ShownBookings === 'proximas') {
            return booking.state !== 'finalizada';
          } else {
            return booking.state === 'finalizada';
          }
        }).map((booking) => {
          return (
            <span key={Math.random()} className='max-w-xs'>
              <article
                className={`animate-fadeIn shadow-custom h-1/3 max-w-xs flex flex-col items-start justify-between
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
                <button className='lg:h-40 w-full relative flex flex-col flex-grow justify-between lg:w-4/12'>
                  <img
                    className={'h-32 w-44 object-cover'}
                    src={booking.photo}
                    alt='alquiler'
                  />
                  <div className='flex justify-end bg-gray-Primary w-full p-2'>
                    {booking.votes > 0 ? (
                      Array(parseInt(booking.votes))
                        .fill(null)
                        .map((value, i) => {
                          return (
                            <FaStar
                              key={Math.random()}
                              className='text-principal-1'
                            ></FaStar>
                          );
                        })
                    ) : (
                      <div className='h-4'></div>
                    )}
                  </div>
                </button>
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

function CancelBooking({ setOverlay, info, Token }) {
  const [Message, setMessage] = useState();

  function Confirm(bookingCode) {
    setMessage('Reserva cancelada con éxito.');
    setOverlay({ shown: false, info: {}, form: '' });
    window.location.reload();
  }

  return (
    <div className='overlay z-20 p-4 bg-gray-400 bg-opacity-75 fixed w-full h-full left-0 top-0 flex flex-col items-center py-24 overscroll-scroll sm:overflow-hidden'>
      {message.message && <ConfirmMessage Message={Message} />}
      <section className='cancel-booking shadow-custom w-full p-4 border-2 border-gray-700 flex flex-col gap-5 bg-gray-100 relative text-principal-gris overflow-y-scroll md:w-3/4'>
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
            <div className='flex bg-gray-Primary w-min rounded-tr pr-2 gap-1'>
              {info.votes > 0 ? (
                Array(parseInt(info.votes))
                  .fill(null)
                  .map((value, i) => {
                    return (
                      <FaStar
                        key={Math.random()}
                        className='text-principal-1'
                      ></FaStar>
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
        setMessage({
          status: 'ok',
          message:
            'Reserva editada con éxito. Tu casero confirmará la reserva.',
        });
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
    <div className='overlay z-20 p-4 bg-gray-400 bg-opacity-75 fixed w-full h-full left-0 top-0 flex flex-col items-center py-24 overscroll-scroll sm:overflow-hidden'>
      {Message.status === 'ok' && <ConfirmMessage Message={Message.message} />}
      <article className='shadow-custom cancel-booking w-full p-4 border-2 border-gray-700 flex flex-col gap-5 bg-gray-100 relative text-principal-gris overflow-y-scroll md:w-3/4 '>
        <button
          className='close-overlay absolute top-3 p-5 right-2'
          onClick={() => {
            setOverlay({ shown: false, info: {}, form: '' });
          }}
        >
          <FaPlus className='transform scale-150 rotate-45' />
        </button>
        <h1 className='title text-3xl p-4 border-b-4 self-center border-gray-700 flex justify-center w-5/6 select-none'>
          Editar reserva
        </h1>
        <div className='perfil flex flex-col items-center gap-5'>
          <section
            className={`animate-fadeIn bg-white border border-black w-full md:w-4/12 md:max-w-md sm:w-7/12`}
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
            <div className='flex bg-gray-Primary w-min rounded-tr pr-2 gap-1'>
              {info.votes > 0 ? (
                Array(parseInt(info.votes))
                  .fill(null)
                  .map((value, i) => {
                    return (
                      <FaStar
                        key={Math.random()}
                        className='text-principal-1'
                      ></FaStar>
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
                      <div className='p-2 font-medium self-center'> a </div>
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
          <div className='flex justify-evenly w-full '>
            <button
              onClick={() => Confirm(info.bookingCode, newDates)}
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
      </article>
    </div>
  );
}

<article className='pt-24 pb-32 flex flex-col w-full justify-center max-w-5xl m-auto'>
  <div className='bg-principal-1 text-principal-gris font-medium text-3xl pl-5 bg-opacity-25  '>
    SOBRE TI
  </div>
  <div className='grid grid-cols-1 justify-items-center items-center sm:grid-cols-2 p-10 gap-10 sm:gap-32 '>
    <section className='w-52 h-52 max-h-xs max-w-xs relative'>
      <img
        className='w-full h-full rounded-full'
        src={User.avatar}
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
        <div className='contenedor-alquileres flex flex-wrap justify-center gap-5 sm:max-w-none sm:justify-start sm:pl-2 px-2 pb-10'>
          {propiedadUsuario.length > 0 ? (
            propiedadUsuario.map((property) => (
              <article
                className={`
        ${
          mountOn === 'home'
            ? 'cont-vivienda overflow-hidden content-center w-3/4 h-full bg-principal-1-hover shadow-custom hover:text-gray-900 duration-300'
            : `cont-vivienda overflow-hidden  relative max-w-xs filter drop-shadow-lg sm:max-w-xs bg-white sm:w-auto min-w-min ${
                mountOn === 'profile' ? 'pb-10 lg:h-lg' : 'h-100  '
              } w-full my-5  text-gray-400 hover:text-gray-900 duration-300`
        }
        `}
                // className={`cont-vivienda overflow-hidden content-center w-3/4 h-full bg-principal-1-hover  hover:max-h-full shadow-custom hover:text-gray-900 duration-300`}
              >
                <div className='slider w-full sm:max-w-custom md:max-w-none relative'>
                  <Carousel
                    navButtonsAlwaysVisible
                    indicators={false}
                    autoPlay={false}
                    animation='slide'
                    NavButton={({ onClick, className, style, next, prev }) => {
                      if (next) {
                        return (
                          <FaAngleRight
                            onClick={onClick}
                            className='absolute z-10 text-white text-3xl cursor-pointer hover:text-principal-1 hover:bg-gray-800 hover:bg-opacity-5 h-full shadow-md right-0 pr-2 duration-200'
                          >
                            {next && 'Next'}
                          </FaAngleRight>
                        );
                      } else {
                        return (
                          <FaAngleLeft
                            onClick={onClick}
                            className='absolute z-10 text-white text-3xl cursor-pointer hover:text-principal-1 hover:bg-gray-800 hover:bg-opacity-5 h-full shadow-md left-0 pl-2 duration-200'
                          >
                            {prev && 'Previous'}
                          </FaAngleLeft>
                        );
                      }
                    }}
                    className='slider-cont min-w-xxs h-48 transition-all transform ease-in'
                  >
                    {SlideImgs.length > 0 ? (
                      SlideImgs.map((img, i) => {
                        return (
                          <img
                            key={i}
                            className='object-cover w-full h-48'
                            src={img}
                            alt='default'
                          />
                        );
                      })
                    ) : (
                      <img
                        className='object-fit h-48 w-full'
                        src='https://www.arquitecturaydiseno.es/medio/2020/10/19/casa-prefabricada-de-hormipresa-en-el-boecillo-valladolid-realizada-con-el-sistema-arctic-wall-de-paneles-estructurales-con-el-acabado-incorporado_6f2a28cd_1280x794.jpg'
                        alt='default home'
                      />
                    )}
                  </Carousel>
                </div>

                <div className='sm:max-w-custom md:max-w-none'>
                  <button to={`/alquileres/${property.idProperty}`}>
                    <div className='bg-gray-Primary p-2 bg-opacity-25 text-lg text-principal-1 flex justify-between gap-2'>
                      <h3>
                        {capitalizeFirstLetter(property.type)} en{' '}
                        {property.city}
                      </h3>
                      <h3>{Number(property.price)} €/noche</h3>
                    </div>
                    <div className='p-2'>
                      {property.province}
                      <div className='text-black font-medium p-2'>
                        {`${property.mts}m² - ${
                          property.rooms
                        } habitaciones - ${property.toilets} ${
                          property.toilets > 1 ? 'baños' : 'baño'
                        }`}
                      </div>
                      {(mountOn === 'profile' ||
                        mountOn === 'propertiesList') && (
                        <div className='sm:w-72 pt-2 text-base'>
                          <p className='overflow-hidden'>
                            {property.description.slice(0, 100)}...
                          </p>
                        </div>
                      )}
                    </div>
                    <footer className='flex p-2 justify-end'>
                      {Array(parseInt(property.votes))
                        .fill(null)
                        .map((value, i) => {
                          return (
                            <FaStar key={i} className='text-principal-1' />
                          );
                        })}
                    </footer>
                  </button>
                  {Token ? (
                    <div className='flex justify-between w-full absolute bottom-1 '>
                      <button className='text-xl p-4 hover:text-blue-700'>
                        <FaPencilAlt />
                      </button>
                      <button className='text-xl p-4 hover:text-red-500'>
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </article>
            ))
          ) : (
            <div>No hay ningún inmueble</div>
          )}
        </div>
        <div className='text-gray-400 flex flex-col items-center gap-2 m-auto pb-5 lg:flex-grow'>
          <button className='flex flex-col items-center gap-2'>
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
            !(ShownBookings === 'finalizada') && setShownBookings('finalizada');
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
      Opiniones
    </h2>
    <div className='votes-cont pt-5 flex flex-col sm:flex-row sm:flex-wrap gap-5 w-full items-center justify-center'>
      {Votes.length ? (
        Votes.map((vote) => {
          return (
            <article
              key={Math.random()}
              className='flex w-10/12 shadow-xl max-w-xs'
              key={vote.idVote}
            >
              <img
                className='w-14 h-14 rounded-full m-2'
                src={vote.avatar}
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
                            key={Math.random()}
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
  <div className='flex justify-center sm:justify-end sm:pr-2'>
    <button className='py-4 px-2 my-5 rounded-full text-principal-1 bg-gray-Primary flex items-center justify-around'>
      <FaTrash className='text-principal-1 hover:text-red-500 w-8' />{' '}
      <span className=''>Eliminar cuenta</span>
    </button>
  </div>
</article>;
```
