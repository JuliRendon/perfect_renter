import { CircularProgress } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FaCamera,
  FaEuroSign,
  FaHome,
  FaListUl,
  FaMapMarkerAlt,
  FaMoneyCheckAlt,
  FaPlus,
  FaRegCalendarAlt,
  FaRegImages,
} from 'react-icons/fa';
import {
  CreateFormData,
  CreateFormDataMultipleFiles,
  del,
  get,
  post,
  put,
} from '../../Helpers/Api';
import FileProperty from './FileProperty';
import { Message } from '../Properties/PropertyInfo';
export default function NewProperty({ setOverlay, Token, EditProperty }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm(
    EditProperty
      ? {
          defaultValues: {
            type: EditProperty.type,
            state: EditProperty.state,
            city: EditProperty.city,
            province: EditProperty.province,
            address: EditProperty.address,
            number: EditProperty.number,
            flat: EditProperty.flat,
            stair: EditProperty.stair,
            gate: EditProperty.gate,
            zipCode: EditProperty.zipCode,
            rooms: EditProperty.rooms,
            toilets: EditProperty.toilets,
            mts: Number(EditProperty.mts),
            garage: EditProperty.garage,
            terrace: EditProperty.terrace,
            elevator: EditProperty.elevator,
            energyCertificate: EditProperty.energyCertificate,
            price: Number(EditProperty.price),
            description: EditProperty.description,
          },
        }
      : {
          defaultValues: {
            type: 'piso',
            state: 'disponible',
            city: '',
            province: '',
            address: '',
            number: '',
            flat: '',
            stair: '',
            gate: '',
            zipCode: '',
            rooms: '',
            toilets: '',
            mts: '',
            garage: '',
            terrace: '',
            elevator: '',
            energyCertificate: '',
            price: '',
            description: '',
          },
        }
  );

  const [file, setFile] = useState({
    shown: false,
    info: {},
    form: '',
  });
  const [message, setMessage] = useState({ message: '', status: '' });
  const [Loader, setLoader] = useState(false);
  // Provincias
  const [Provinces, setProvinces] = useState([]);
  const provRef = useRef(null);
  const [ProvincesFound, setProvincesFound] = useState([]);
  const [ProvincesOverlay, setProvincesOverlay] = useState(false);

  // Ciudades
  const cityRef = useRef(null);
  const [Cities, setCities] = useState([]);
  const [CitiesFound, setFound] = useState([]);
  const [CitiesOverlay, setCitiesOverlay] = useState(false);
  const cpRef = useRef(null);

  const [Error, setError] = useState('');
  const [lastProperty] = useState('');

  // Fotos en caso de entrar en EditProperty
  const [Photos, setPhotos] = useState([]);
  // Fotos en caso de entrar en newProperty
  const [PhotosOnUpload, setPhotosOnUpload] = useState([]);

  function onSubmitProperty(body, e) {
    setLoader(true);
    post(
      'http://192.168.1.16:4000/properties',
      CreateFormData(body),
      (data) => {
        if (PhotosOnUpload) {
          put(
            `http://192.168.1.16:4000/properties/${data.property}`,
            CreateFormDataMultipleFiles(PhotosOnUpload),
            (data) => {
              console.log('Success');
              reset();
              setMessage({
                message: 'Inmueble subido con éxito.',
                status: 'ok',
              });
              setTimeout(() => {
                setLoader(false);
                // );
              }, 1500);
            },
            (error) => {
              setError(error.message);
            },
            Token
          );
        } else {
          reset();
          setMessage({ message: 'Inmueble subido con éxito.', status: 'ok' });
        }
      },
      (data) => {
        setError(data.message);
      },
      Token
    );
  }

  function onSubmitEdited(body, e) {
    e.preventDefault();
    put(
      `http://192.168.1.16:4000/properties/${EditProperty.idProperty}`,
      CreateFormData(body),
      (data) => {
        console.log('Sucess');
        setMessage({ message: data.message, status: 'ok' });
        setTimeout(() => {
          // );
        }, 500);
      },
      (error) => {
        setMessage({ message: error.message, status: 'error' });
      },
      Token
    );
  }

  useEffect(() => {
    // const controller = new AbortController();
    get(
      'http://192.168.1.16:4000/properties/location',
      (data) => {
        setProvinces(data.provinces);
        setCities(data.cities);
      },
      (error) => {
        setMessage({ message: error.message, status: 'error' });
      },
      null,
      null
    );
    return () => {
      // controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (EditProperty) {
      get(
        `http://192.168.1.16:4000/properties/${EditProperty.idProperty}/photos`,
        (data) => {
          if (data.status === 'ok') {
            setPhotos(data.photos);
          }
        },
        (error) => {
          setMessage({ message: error.message, status: 'error' });
        },
        null,
        controller
      );
    }
    return () => {
      // controller.abort();
    };
  }, [EditProperty]);

  function deletePhoto(name) {
    if (EditProperty) {
      del(
        `http://192.168.1.16:4000/properties/${EditProperty.idProperty}/photos/${name}`,
        null,
        (data) => {
          if (data.status === 'ok') {
            setPhotos(Photos.filter((photo) => photo.name !== name));
            setTimeout(() => {
              setLoader(false);
            }, 3000);
          }
        },
        (error) => {
          setMessage({ message: error.message, status: 'error' });
        },
        Token
      );
    } else {
      setPhotos(Photos.filter((photo) => photo.name !== name));
      setTimeout(() => {
        setLoader(false);
      }, 3000);
    }
  }

  // Province React Hook Form
  const {
    onChange: onChangeProvince,
    ref: provinceRef,
    onBlur: onBlurProvince,
    ...restProvince
  } = register('province', {
    required: 'Debes escribir la provincia',
    pattern: {
      value:
        /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
      message:
        'La provincia no puede contener carácteres especiales ni números.',
    },
    maxLength: {
      value: 30,
      message: 'La provincia no puede tener más de 50 carácteres.',
    },
  });
  // City React Hook Form
  const { onChange, ref, onBlur, ...restCity } = register('city', {
    required: 'Debes escribir una ciudad',
    maxLength: {
      value: 30,
      message: 'La ciudad no puede tener más de 50 carácteres.',
    },
  });

  // Postal Code React Hook Form
  const { ref: cpFormRef, ...cpRest } = register('zipCode', {
    required: 'Debes escribir el código postal',
    pattern: {
      value: /^\s?\+?\s?([0-9\s]*){9,}$/,
      message: 'Debes introducir un número válido.',
    },
  });
  const inputsLabelStyle =
    'sm:text-gray-600  text-xl border-b-2 border-gray-200 flex items-center gap-1';

  const inpStyle =
    'px-3 py-3 placeholder-gray-400 text-gray-600 relative bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:ring w-full';
  const description = watch('description');

  return (
    <div className='overlay z-30 bg-white bg-opacity-75 justify-center fixed w-full h-full left-0 top-0 flex flex-col items-center px-12 pt-24 pb-2 overflow-scroll sm:overflow-hidden'>
      {message.message && <Message message={message} setMessage={Message} />}
      {Loader && (
        <div className='overlay z-50 fixed bg-gray-200 bg-opacity-50 w-full h-full left-0 top-0 flex flex-col items-center px-12 pt-24 pb-2 overflow-scroll sm:overflow-hidden'>
          <CircularProgress className='absolute top-0 left-0 right-0 bottom-0 m-auto' />{' '}
        </div>
      )}
      {file.form === 'FileProperty' && (
        <FileProperty
          setOverlay={setOverlay}
          Token={Token}
          idProperty={lastProperty}
          editProperty={EditProperty && EditProperty.idProperty}
          setFile={setFile}
          setPhotosOnUpload={setPhotosOnUpload}
          photos={Photos}
          deletePhoto={deletePhoto}
          setLoaderDiv={setLoader}
        />
      )}
      <section className='pt-20 filter drop-shadow-xl flex flex-col gap-5 bg-white relative text-principal-gris overflow-y-auto  md:w-4/6'>
        <button
          className='close-overlay absolute top-3 p-5 right-2'
          onClick={() => {
            setOverlay({ shown: false, info: {}, form: '' });
          }}
        >
          <FaPlus className='transform scale-150 rotate-45' />
        </button>
        <h1 className='title w-4/6 text-2xl sm:text-4xl text-center m-auto p-4 border-b-4 border-gray-600 '>
          Inmueble
        </h1>
        <div className='newProperty-card-container flex justify-around flex-col-reverse gap-10 '>
          <form
            autoComplete='new-password'
            className='flex flex-col gap-4 p-6'
            onSubmit={
              EditProperty
                ? handleSubmit(onSubmitEdited)
                : handleSubmit(onSubmitProperty)
            }
          >
            <h2 className={inputsLabelStyle}>
              <FaHome className='min-w-min m-1 sm:m-0' />
              ¿Qúe tipo de inmueble ofreces?
            </h2>
            <div className='grid grid-cols-3 '>
              <label className='flex gap-2 items-baseline font-medium'>
                Piso
                <input
                  type='radio'
                  name='tipo'
                  value='piso'
                  {...register('type')}
                />
              </label>
              <label className='flex gap-2 items-baseline font-medium'>
                Casa
                <input
                  type='radio'
                  name='tipo'
                  value='casa'
                  {...register('type')}
                />
              </label>
              <label className='flex gap-2 items-baseline font-medium'>
                Dúplex
                <input
                  type='radio'
                  name='tipo'
                  value='duplex'
                  {...register('type')}
                />
              </label>
            </div>

            <h3 className={inputsLabelStyle}>
              <FaRegCalendarAlt className='min-w-min m-1 sm:m-0' />
              ¿Qué disponibilidad tiene ahora mismo?
            </h3>

            <div className='flex flex-col items-end m-auto sm:m-0 sm:grid sm:grid-cols-3 '>
              <label className='flex gap-2 items-baseline font-medium'>
                Disponible
                <input
                  type='radio'
                  name='state'
                  value='disponible'
                  {...register('state')}
                />
              </label>
              <label className='flex gap-2 items-baseline font-medium'>
                Alquilado
                <input
                  type='radio'
                  name='state'
                  value='alquilado'
                  {...register('state')}
                />
              </label>
              <label className='flex gap-2 items-baseline font-medium'>
                Reservado
                <input
                  type='radio'
                  name='state'
                  value='reservado'
                  {...register('state')}
                />
              </label>
            </div>
            <h4 className={inputsLabelStyle}>
              <FaMapMarkerAlt className='min-w-min m-1 sm:m-0' />
              ¿Dónde está?
            </h4>
            <label className='relative'>
              <input
                type='text'
                name='city'
                autoComplete='new-password'
                onBlur={() => {
                  setCitiesOverlay(false);
                }}
                ref={(el) => {
                  ref(el);
                  cityRef.current = el;
                }}
                className={inpStyle}
                placeholder='Ciudad'
                onChange={(el) => {
                  setCitiesOverlay(true);
                  const citiesFound = Cities.filter((city) => {
                    if (
                      city.poblacion
                        .toLowerCase()
                        .includes(el.target.value.toLowerCase())
                    ) {
                      return city;
                    }
                    return null;
                  });
                  setFound(citiesFound);
                  onChange(el);
                }}
                {...restCity}
              />
              {errors.city && (
                <p className='text-red-500'>{errors.city.message}</p>
              )}
              {CitiesOverlay && (
                <div className='cities-cont absolute z-20 flex flex-col items-start overflow-y-scroll max-h-96  w-full border-2 border-black border-t-0 bg-white'>
                  {CitiesFound.length > 0 ? (
                    CitiesFound.slice(0, 100).map((city, i) => {
                      return (
                        <button
                          key={city.cp + i}
                          className='bg-white w-full text-left p-2 border'
                          onMouseDown={() => {
                            setValue('city', city.poblacion);
                            setValue('province', city.provincia);
                            cityRef.current.value = city.poblacion;
                            provRef.current.value = city.provincia;
                            if (city.cp.length === 4) {
                              cpRef.current.value = `0${city.cp}`;
                              setValue('zipCode', `0${city.cp}`);
                            } else {
                              cpRef.current.value = city.cp;
                              setValue('zipCode', city.cp);
                            }
                          }}
                        >
                          {city.poblacion},{' '}
                          <span className='text-gray-400'>
                            {city.provincia}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <p>No hay resultados.</p>
                  )}
                </div>
              )}
            </label>
            <label className='relative'>
              <input
                type='text'
                autoComplete='new-password'
                name='province'
                className={inpStyle}
                placeholder='Provincia'
                onBlur={() => {
                  setProvincesOverlay(false);
                }}
                ref={(e) => {
                  provinceRef(e);
                  provRef.current = e;
                }}
                onChange={(e) => {
                  setProvincesOverlay(true);
                  const provincesFound = Provinces.filter((province) => {
                    if (
                      province.provincia
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    ) {
                      return province;
                    }
                    return null;
                  });
                  setProvincesFound(provincesFound);
                  onChangeProvince(e);
                }}
                {...restProvince}
              />
              {ProvincesOverlay && (
                <div className='provinces-cont absolute z-20 flex flex-col items-start overflow-y-scroll max-h-96  w-full border-2 border-black border-t-0 bg-white'>
                  {ProvincesFound.length > 0 ? (
                    ProvincesFound.map((province) => {
                      return (
                        <button
                          className='bg-white w-full text-left p-2 border'
                          key={province.provinciaid}
                          onMouseDown={() => {
                            setValue('province', province.provincia);
                            provRef.current.value = province.provincia;
                          }}
                        >
                          {province.provincia}
                        </button>
                      );
                    })
                  ) : (
                    <p>No hay resultados.</p>
                  )}
                </div>
              )}
            </label>
            {errors.province && (
              <p className='text-red-500'>{errors.province.message}</p>
            )}
            <input
              type='text'
              autoComplete='new-password'
              name='address'
              className={inpStyle}
              placeholder='Dirección'
              {...register('address', {
                required: 'Debes escribir la dirección',
                pattern: {
                  value:
                    /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
                  message:
                    'La dirección no puede contener carácteres especiales ni números.',
                },
                maxLength: {
                  value: 30,
                  message: 'La dirección no puede tener más de 50 carácteres.',
                },
              })}
            />
            {errors.address && (
              <p className='text-red-500'>{errors.address.message}</p>
            )}
            <div className='flex flex-col gap-2'>
              <input
                type='num'
                name='number'
                autoComplete='new-password'
                className={inpStyle}
                placeholder='Nº'
                {...register('number', {
                  required: 'Debes escribir el número',
                  pattern: {
                    value: /^\s?\+?\s?([0-9\s]*){9,}$/,
                    message: 'Debes introducir un número válido.',
                  },
                })}
              />
              {errors.number && (
                <p className='text-red-500'>{errors.number.message}</p>
              )}

              <input
                type='num'
                name='flat'
                className={inpStyle}
                placeholder='Piso'
                {...register('flat', {
                  pattern: {
                    value: /^\s?\+?\s?([0-9\s]*){9,}$/,
                    message: 'Debes introducir un número válido.',
                  },
                })}
              />
              <input
                type='text'
                name='stair'
                className={inpStyle}
                placeholder='Escalera'
                {...register('stair', {
                  pattern: {
                    message: 'Debes introducir un número válido.',
                  },
                })}
              />
              <input
                type='text'
                name='gate'
                className={inpStyle}
                placeholder='Puerta'
                {...register('gate', {
                  pattern: {
                    message: 'Debes introducir un número válido.',
                  },
                })}
              />
              <input
                type='text'
                name='zipCode'
                maxLength={5}
                className={inpStyle}
                placeholder='Código Postal'
                ref={(e) => {
                  cpFormRef(e);
                  cpRef.current = e;
                }}
                {...cpRest}
              />
              {errors.zipCode && (
                <p className='text-red-500'>{errors.zipCode.message}</p>
              )}
            </div>
            <h5 className={inputsLabelStyle}>
              <FaListUl className='min-w-min m-1 sm:m-0' />
              ¿Qúe características tiene?
            </h5>
            <div className='flex flex-col gap-2'>
              <input
                {...register('rooms')}
                type='number'
                name='rooms'
                min='1'
                max='10'
                className={inpStyle}
                placeholder='Habitaciones'
                {...register('rooms', {
                  required: 'Debes escribir el número de habitaciones',
                  pattern: {
                    value: /^\s?\+?\s?([0-9\s]*){9,}$/,
                    message: 'Debes introducir un número válido.',
                  },
                })}
              />
              {errors.rooms && (
                <p className='text-red-500'>{errors.rooms.message}</p>
              )}
              <input
                {...register('toilets')}
                min='1'
                max='10'
                type='number'
                name='toilets'
                className={inpStyle}
                placeholder='Baños'
                {...register('toilets', {
                  pattern: {
                    value: /^\s?\+?\s?([0-9\s]*){9,}$/,
                    message: 'Debes introducir un número válido.',
                  },
                })}
              />
              <input
                {...register('mts')}
                min='1'
                max='1000'
                type='number'
                name='mts'
                className={inpStyle}
                placeholder='Metros'
                {...register('mts', {
                  required: 'Debes escribir el número de m2',
                  pattern: {
                    value: /^\s?\+?\s?([0-9\s]*){9,}$/,
                    message: 'Debes introducir un número válido.',
                  },
                })}
              />
              {errors.mts && (
                <p className='text-red-500'>{errors.mts.message}</p>
              )}
            </div>
            <div className='flex flex-col items-center sm:flex-row justify-between '>
              <label className='parking'>
                <div className={inputsLabelStyle}>Garaje:</div>
                <input
                  type='checkbox'
                  name='garage'
                  className={inpStyle}
                  {...register('garage')}
                />
              </label>
              <label className='terraza gap-2 items-center'>
                <div className={inputsLabelStyle}>Terraza:</div>
                <input
                  type='checkbox'
                  name='terrace'
                  className={inpStyle}
                  {...register('terrace')}
                />
              </label>
              <label className='ascensor gap-2 items-center'>
                <div className={inputsLabelStyle}>Ascensor:</div>
                <input
                  type='checkbox'
                  name='elevator'
                  className={inpStyle}
                  {...register('elevator')}
                />
              </label>
              <label className='ascensor gap-2 items-center'>
                <div className={inputsLabelStyle}>Certificado de energía:</div>
                <input
                  type='checkbox'
                  name='energyCertificate'
                  className={inpStyle}
                  {...register('energyCertificate')}
                />
              </label>
            </div>
            <h6 className={inputsLabelStyle}>
              <FaRegImages className='min-w-min m-1 sm:m-0' />
              {EditProperty
                ? 'Fotografías de la vivienda'
                : '¡Sube fotos para que vean cómo es!'}
            </h6>
            <div
              className={inpStyle + ' flex items-center justify-between'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFile({
                  shown: true,
                  userInfo: '',
                  form: 'FileProperty',
                });
              }}
            >
              <div className='flex flex-wrap gap-2 justify-center'>
                {EditProperty && Photos
                  ? Photos.map((photo) => {
                      return (
                        <div key={photo.name} className='relative'>
                          <button
                            className='delete-photo absolute top-0 right-0 bg-principal-1'
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deletePhoto(photo.name);
                              setLoader(true);
                            }}
                          >
                            <FaPlus className='transform rotate-45' />
                          </button>
                          <img
                            src={'http://192.168.1.16:4000/photo/' + photo.name}
                            alt='prueba'
                            className='w-20 h-20 object-cover'
                          />
                        </div>
                      );
                    })
                  : ''}
                {PhotosOnUpload.length > 0
                  ? PhotosOnUpload.map((file, index) => {
                      return (
                        <div key={file.name} className='relative w-20'>
                          <button
                            className='delete-photo absolute top-0 right-0 bg-principal-1'
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setLoader(true);
                              setPhotosOnUpload(
                                PhotosOnUpload.filter(
                                  (fileToRemove) =>
                                    fileToRemove.name !== file.name
                                )
                              );

                              setTimeout(() => {
                                setLoader(false);
                              }, 1000);
                            }}
                          >
                            <FaPlus className='transform rotate-45' />
                          </button>
                          <img
                            src={URL.createObjectURL(file)}
                            alt='prueba'
                            className='w-20 h-20 object-cover'
                          />
                        </div>
                      );
                    })
                  : 'La primera fotografía será la principal.'}
              </div>
              <FaCamera
                className={`text-4xl ${EditProperty && 'w-80'} cursor-pointer`}
              />
            </div>

            <p className={inputsLabelStyle}>
              <FaMoneyCheckAlt />
              ¿Qué precio por noche tiene?
            </p>
            <div className='flex flex-col-2 w-52 gap-2'>
              <input
                min='1'
                max='10000'
                type='number'
                name='price'
                className={inpStyle}
                placeholder='Precio'
                {...register('price', {
                  required: 'Debes escribir el precio',
                  pattern: {
                    value: /^\s?\+?\s?([0-9\s]*){9,}$/,
                    message: 'Debes introducir un número válido.',
                  },
                })}
              />
              <FaEuroSign className='m-5' />
            </div>
            {errors.price && (
              <p className='text-red-500'>{errors.price.message}</p>
            )}
            <label className='relative'>
              <p className={inputsLabelStyle}>
                Cuéntanos un poco más sobre tu vivienda
              </p>
              <textarea
                className={
                  'px-3 pt-3 pb-5 placeholder-gray-400 text-gray-600 relative bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:ring w-full h-20'
                }
                type='text'
                name='description'
                cols='20'
                maxLength='3000'
                placeholder='Describe tu inmueble'
                {...register('description', {
                  minLength: 0,
                  maxLength: {
                    value: 3000,
                    message: 'No puedes escribir más de 3000 carácteres.',
                  },
                })}
              />
              <p className=' absolute right-5 bottom-2 '>
                {description ? description.length : 0}/3000
              </p>
            </label>
            {Error && <div>{Error}</div>}
            <div className='flex justify-center items-center self-center  bottom-0 w-full h-28 sm:bg-transparent'>
              <input
                type='submit'
                value='AÑADIR'
                className='btn-submit select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
              />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
