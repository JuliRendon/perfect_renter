import { Link } from 'react-router-dom';
import ContactProperty from '../Forms/ContactProperty';
import { useEffect, useRef, useState } from 'react';
import { FaAngleLeft, FaAngleRight, FaFilter } from 'react-icons/fa';
import useProperties from '../../Helpers/Hooks/useProperties';
import Filters from './Filters';
import useLocalStorage from '../../Helpers/Hooks/useLocalStorage';
import Property from './Property';
import { capitalizeFirstLetter } from '../../Helpers/Api';
import { get } from '../../Helpers/Api';
import NewProperty from './NewProperty';
import Carousel from 'react-material-ui-carousel';

export default function PropertyInfo(props) {
  const [pisosVisitados, setPisosVisitados] = useLocalStorage(
    'pisosVisitados',
    []
  );

  //Overlay de respuestas
  const [message, setMessage] = useState({ status: '', message: '' });
  // Overlay de formularios
  const [Overlay, setOverlay] = useState({
    form: '',
    show: false,
    propertyInfo: {},
  });

  // Verificar si User es dueño de la propiedad
  const [Owner, setOwner] = useState(false);
  // Ampliar fotos
  const [Photo, setPhoto] = useState(true);
  // Información de la propiedad
  const [property, setProperty] = useState({});
  // Array de propiedades
  const [Properties] = useProperties();
  // Slider
  const [SlideImgs, setSlideImgs] = useState([]);
  const slider = useRef();

  function openPhoto() {
    setPhoto(!Photo);
  }

  useEffect(() => {
    // const controller = new AbortController();
    get(
      `http://192.168.1.16:4000/properties/${Number(
        props.match.params.idProperty
      )}/photos`,
      (data) => {
        setSlideImgs(data.photos);
      },
      (error) => console.log(error),
      null,
      null
    );
    return () => {
      // controller.abort();
    };
  }, [props.match.params.idProperty]);

  useEffect(() => {
    const prop = Properties.find(
      (property) =>
        property.idProperty === Number(props.match.params.idProperty)
    );

    if (prop) {
      setProperty(prop);
      // if (!pisosVisitados.includes(prop.idProperty)) {
      //   setPisosVisitados({...pisosVisitados, {p: prop.idProperty, }});
      // }
      if (props.token) {
        if (prop.idUser === props.User.idUser) {
          setOwner(true);
        } else {
          setOwner(false);
        }
      }
    }
  }, [
    props.match.params.idProperty,
    Properties,
    property,
    Owner,
    props.User,
    pisosVisitados,
    setPisosVisitados,
    props.token,
  ]);

  // Styles
  const sliderButtonStyle =
    'absolute z-10 text-white text-4xl sm:text-7xl hover:text-principal-1 hover:bg-gray-800 hover:bg-opacity-5 h-full duration-200';
  const buttonStyle =
    'select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer';

  const pageIteratorButtonsStyle = `border-2 p-3 rounded-full hover:bg-gray-500 hover:text-white duration-200  `;

  return (
    <main className='flex flex-col relative max-w-customXL'>
      <article className='w-full pb-10 flex bg-opacity-20'>
        {Overlay.form && Overlay.form !== 'editProperty' && (
          <ContactProperty
            form={Overlay.form}
            setOverlay={setOverlay}
            property={Overlay.propertyInfo}
            user={props.User}
            pictures={SlideImgs}
            setMessage={setMessage}
            message={message}
            Slider={{
              Photo: Photo,
              sliderButtonStyle: sliderButtonStyle,
              slider: slider,
              SlideImgs: SlideImgs,
            }}
          />
        )}
        {Overlay.form === 'editProperty' && (
          <NewProperty
            setOverlay={setOverlay}
            Token={props.token}
            EditProperty={property}
          />
        )}
        {message.status ? (
          <Message message={message} setMessage={setMessage} />
        ) : (
          ''
        )}
        <aside
          className={`flex justify-center items-center bg-principal-1 border-yellow-300 text-principal-gris text-xl w-32 lg:w-auto lg:bg-transparent flex-grow-0 lg:static z-20 right-0 ${
            props.IsFooterVisible ? 'bottom-28 absolute' : 'bottom-0 fixed'
          } left-0 mx-auto mt-5 sm:mt-20 `}
        >
          <button
            className='lg:hidden flex pl-6'
            onClick={() => {
              setOverlay({ show: true });
            }}
          >
            Filtrar
            <FaFilter className=' w-10 h-full p-2 lg:hidden' />
          </button>
          <Filters setOverlay={setOverlay} Overlay={Overlay} />
        </aside>
        <section className='self-start flex-grow flex flex-col items-center justify-between max-w-7xl'>
          <div className='flex flex-col w-11/12 bg-white items-center h-full filter drop-shadow-xl'>
            <div className={`slider pt-20 w-full h-full`}>
              <Carousel
                className={`slider-cont sm:max-w-7xl w-full min-h-20rem ${
                  Photo ? 'max-h-96' : 'max-h-full bg-gray-Primary'
                } flex transition-all transform ease-in duration-300 `}
                navButtonsAlwaysVisible
                indicators={false}
                autoPlay={false}
                animation='slide'
                NavButton={({ onClick, className, style, next, prev }) => {
                  if (next) {
                    return (
                      <FaAngleRight
                        onClick={onClick}
                        className={`${
                          Photo
                            ? ' text-5xl pr-2 text-white'
                            : ' text-7xl pr-5 text-principal-gris bg-gray-100 bg-opacity-10'
                        } absolute z-10  cursor-pointer hover:text-principal-1 hover:bg-gray-800 hover:bg-opacity-5 h-full right-0  duration-200`}
                      >
                        {next && 'Next'}
                      </FaAngleRight>
                    );
                  } else {
                    return (
                      <FaAngleLeft
                        onClick={onClick}
                        className={`${
                          Photo
                            ? ' text-5xl pl-2 text-white'
                            : ' text-7xl pl-5 text-principal-gris bg-gray-100 bg-opacity-10 '
                        } absolute z-10 cursor-pointer hover:text-principal-1 hover:bg-gray-800 hover:bg-opacity-5 h-full left-0 duration-200`}
                      >
                        {prev && 'Previous'}
                      </FaAngleLeft>
                    );
                  }
                }}
              >
                {SlideImgs.length > 0 ? (
                  SlideImgs.map((img, i) => {
                    console.log(img.name);
                    return (
                      <img
                        key={i}
                        onClick={openPhoto}
                        className={`object-cover duration-300 cursor-pointer ${
                          Photo
                            ? ' h-96 w-full'
                            : ' sm:h-full w-full sm:max-h-lg max-w-2xl object-contain m-auto'
                        }`}
                        src={'http://192.168.1.16:4000/photo/' + img.name}
                        alt='default'
                      />
                    );
                  })
                ) : (
                  <img
                    className=' object-cover w-full h-full duration-300 cursor-pointer'
                    onClick={openPhoto}
                    src='https://www.arquitecturaydiseno.es/medio/2020/10/19/casa-prefabricada-de-hormipresa-en-el-boecillo-valladolid-realizada-con-el-sistema-arctic-wall-de-paneles-estructurales-con-el-acabado-incorporado_6f2a28cd_1280x794.jpg'
                    alt='default home'
                  />
                )}
              </Carousel>
            </div>
            <div className='informacion w-full bg-gray-Primary p-2 bg-opacity-25 text-xl text-principal-1 flex justify-between'>
              <h2>Piso en {property.city}</h2>
              <h2>{Number(property.price)} €/mes</h2>
            </div>
            <p className='p-5 self-center font-medium text-principal-gris'>
              {`${Number(property.mts)}m² - ${property.rooms} habitaciones - ${
                property.toilets
              } ${property.toilets > 1 ? 'baños' : 'baño'}`}
            </p>
            <p className='px-5 text-base text-justify'>
              {property.description}
            </p>
            <span className='pt-5 px-5 underline font-medium'>
              Información detallada:
            </span>
            <ul className='p-5 pt-2 pl-10 w-2/3 text-center'>
              <li className='bg-gray-200 h-7'>Ciudad: {property.province}</li>
              <li>{property.terrace === 0 ? 'Sin' : 'Con'} terraza</li>
              <li className='bg-gray-200'>
                {property.garage === 0 ? 'Sin' : 'Con'} garaje
              </li>
              <li>{property.elevator === 0 ? 'Sin' : 'Con'} ascensor</li>
              <li className='bg-gray-200'>
                Estado:{' '}
                {property.state && capitalizeFirstLetter(property.state)}
              </li>
              <li>
                Fecha disponibilidad:{' '}
                {new Date(property.availabilityDate).toLocaleDateString(
                  'es-ES'
                )}
              </li>
              <li className='bg-gray-200'>
                Certificado de energía:{' '}
                {property.energyCertificate === 0 ? 'Sin especificar' : 'Si'}
              </li>
            </ul>
            {/* {property && pisosVisitados.includes(property.idProperty) && (
            <p>Ya has visitado este piso.</p>
          )} */}
          </div>
          <div className='buttons-cont z-10 font-medium p-5 flex justify-around items-center'>
            {Owner ? (
              <button
                className={buttonStyle + ' z-0'}
                onClick={() => {
                  setOverlay({
                    form: 'editProperty',
                    propertyInfo: property,
                  });
                }}
              >
                Editar
              </button>
            ) : (
              <>
                <div className='flex flex-col gap-y-3'>
                  <button
                    className={buttonStyle + ' z-0'}
                    onClick={() => {
                      setOverlay({
                        form: 'contact',
                        propertyInfo: property,
                      });
                    }}
                  >
                    Contactar
                  </button>
                  {props.token ? (
                    <button
                      className={buttonStyle}
                      onClick={() => {
                        setOverlay({
                          form: 'reservar',
                          propertyInfo: property,
                        });
                      }}
                    >
                      Reservar
                    </button>
                  ) : (
                    <>
                      <div className='flex flex-col items-center gap-y-3'>
                        <p className='text-red-600'>
                          Inicia sesión o regístrate para reservar esta
                          propiedad
                        </p>
                        <div className='flex gap-5 w-full'>
                          <Link className={`${buttonStyle}`} to='/login'>
                            Acceso
                          </Link>

                          <Link className={`${buttonStyle}`} to='/registro'>
                            Registro
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </article>
      <RelatedProperties properties={Properties} city={property.city} />
      <div
        className={`grid grid-cols-2 grid-rows-2 gap-1 right-5  ${
          props.IsFooterVisible ? 'absolute bottom-28' : 'fixed bottom-0'
        } select-none z-10 self-end`}
      >
        <Link
          to={`/alquileres/${Number(props.match.params.idProperty) - 1}`}
          className={`${pageIteratorButtonsStyle} ${
            Number(props.match.params.idProperty) === 1
              ? 'text-white bg-gray-500 pointer-events-none cursor-default'
              : 'bg-principal-1 cursor-pointer'
          }`}
        >
          <FaAngleLeft className='text-gray-700' aria-disabled />
        </Link>
        <Link
          to={`/alquileres/${Number(props.match.params.idProperty) + 1}`}
          className={`${pageIteratorButtonsStyle} ${
            Number(props.match.params.idProperty) === Properties.length
              ? 'text-white bg-gray-500 pointer-events-none cursor-default'
              : 'bg-principal-1 cursor-pointer'
          }`}
        >
          <FaAngleRight className='text-gray-700' />
        </Link>
        <p className='col-start-1 col-end-3 justify-self-center'>
          {Number(props.match.params.idProperty)}/{Properties.length}
        </p>
      </div>
    </main>
  );
}

export function Message({ message, setMessage }) {
  if (message.status === 'ok') {
    return (
      <div className='fixed w-full bg-white justify-center bg-opacity-75 h-full left-0 top-0 flex flex-col items-center py-24 overflow-scroll sm:overflow-hidden z-30'>
        <section className='contact filter drop-shadow-xl p-5 flex flex-col gap-5  bg-white relative items-center'>
          <h2 className='w-full text-principal-gris text-center border-b-2 border-gray-600 font-medium'>
            ¡Ya esta listo!
          </h2>
          <h2 className='text-principal-gris'>{message.message}</h2>
          <button
            onClick={() => {
              setMessage({ status: '', message: '' });
              window.location.reload();
            }}
            className='select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
          >
            Cerrar
          </button>
        </section>
      </div>
    );
  } else if (message.status === 'error') {
    return (
      <div className='fixed bg-white  justify-center bg-opacity-75 w-full h-full left-0 top-0 flex flex-col items-center py-24 overflow-scroll sm:overflow-hidden z-20'>
        <section className='contact p-5 filter drop-shadow-xl flex flex-col gap-5  bg-white relative items-center'>
          <h2 className='w-full text-center font-medium'>
            ¡Parece que algo va mal!
          </h2>
          <h2>{message.message}</h2>
          <Link
            to='/'
            className='select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
          >
            Cerrar
          </Link>
        </section>
      </div>
    );
  }
}

function RelatedProperties({ properties, city }) {
  var related = [];
  if (properties.length > 0) {
    related = properties.filter((property) => property.city === city);
    if (related.length > 0) {
      return (
        <div className='flex flex-col items-center p-8 overflow-hidden pb-44 w-screen'>
          <h1 className='text-2xl text-principal-gris py-2 bg-principal-1 w-screen text-center font-semibold'>
            Algunos pisos relacionados
          </h1>
          <div className='w-10/12 flex flex-row flex-wrap gap-4 place-content-center min-w-full overflow-x-auto'>
            {related.map((relationFlat) => (
              <Property key={relationFlat.idProperty} property={relationFlat} />
            ))}
          </div>
        </div>
      );
    } else {
      return '';
    }
  } else {
    return '';
  }
}
