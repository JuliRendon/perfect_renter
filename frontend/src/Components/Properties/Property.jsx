import React, { useEffect, useState } from 'react';
import {
  FaAngleLeft,
  FaAngleRight,
  FaPencilAlt,
  FaStar,
  FaTrash,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { del, get } from '../../Helpers/Api';
import NewProperty from './NewProperty';
import Carousel from 'react-material-ui-carousel';
import { Message } from '../Properties/PropertyInfo';

export default function Property({
  property,
  token,
  profileOverlay,
  setProfileOverlay,
  mountOn,
}) {
  const [SlideImgs, setSlideImgs] = useState([]);
  const [message, setMessage] = useState({ message: '', status: '' });
  const [Overlay, setOverlay] = useState({
    shown: false,
    form: '',
  });

  useEffect(() => {
    // const controller = new AbortController();
    get(
      `http://192.168.1.16:4000/properties/${property.idProperty}/photos`,
      (data) => {
        if (data.status === 'ok' && mountOn === 'propertiesList') {
          setSlideImgs(data.photos.slice(0, 5));
        } else if (data.status === 'ok' && mountOn === 'profile') {
          setSlideImgs(data.photos);
        } else {
          setSlideImgs(data.photos);
        }
      },
      (error) => setMessage({ message: error.message, status: 'error' }),
      null,
      null
    );
    return () => {
      // controller.abort();
    };
  }, [property.idProperty, mountOn]);

  function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  function onSubmitDeleted(body, e) {
    del(
      `http://192.168.1.16:4000/properties/${property.idProperty}`,
      body,
      (data) => {
        setMessage({ message: data.message, status: 'ok' });
      },
      (error) => setMessage({ message: error.message, status: 'error' }),
      token
    );
  }

  return (
    <>
      {Overlay.form === 'editProperty' && (
        <NewProperty
          setOverlay={setOverlay}
          Token={token}
          EditProperty={property}
        />
      )}

      {message.message && <Message message={message} setMessage={Message} />}
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
                    src={'http://192.168.1.16:4000/photo/' + img.name}
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
          <Link to={`/alquileres/${property.idProperty}`}>
            <div className='bg-gray-Primary p-2 bg-opacity-25 text-lg text-principal-1 flex justify-between gap-2'>
              <h3>
                {capitalizeFirstLetter(property.type)} en {property.city}
              </h3>
              <h3>{Number(property.price)} €/noche</h3>
            </div>
            <div className='p-2'>
              {property.province}
              <div className='text-black font-medium p-2'>
                {`${property.mts}m² - ${property.rooms} habitaciones - ${
                  property.toilets
                } ${property.toilets > 1 ? 'baños' : 'baño'}`}
              </div>
              {(mountOn === 'profile' || mountOn === 'propertiesList') && (
                <div className='sm:w-72 pt-2 text-base'>
                  <p className='overflow-hidden'>
                    {property.description && property.description.slice(0, 100)}
                    ...
                  </p>
                </div>
              )}
            </div>
            <footer className='flex p-2 justify-end'>
              {Array(parseInt(property.votes))
                .fill(null)
                .map((value, i) => {
                  return <FaStar key={i} className='text-principal-1' />;
                })}
            </footer>
          </Link>
          {token ? (
            <div className='flex justify-between w-full absolute bottom-1 '>
              <button
                className='text-xl p-4 hover:text-blue-700'
                onClick={() => {
                  setOverlay({ shown: true, form: 'editProperty' });
                }}
              >
                <FaPencilAlt />
              </button>
              <button
                className='text-xl p-4 hover:text-red-500'
                onClick={() => {
                  setProfileOverlay({
                    form: 'deleteProperty',
                    shown: true,
                    onSubmitDeleted: onSubmitDeleted,
                  });
                }}
              >
                <FaTrash />
              </button>
            </div>
          ) : (
            ''
          )}
        </div>
      </article>
    </>
  );
}
