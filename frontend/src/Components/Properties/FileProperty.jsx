import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaRegArrowAltCircleUp } from 'react-icons/fa';
import {
  CreateFormData,
  CreateFormDataMultipleFiles,
  put,
} from '../../Helpers/Api';
import CircularProgress from '@mui/material/CircularProgress';
import { Message } from '../Properties/PropertyInfo';
export default function FileProperty({
  setOverlay,
  idProperty,
  Token,
  editProperty,
  setFile,
  photos,
  setPhotosOnUpload,
  deletePhoto,
  setLoaderDiv,
}) {
  const [Error, setError] = useState('');
  const [Button, setButton] = useState(false);
  const [FileName, setFileName] = useState([]);
  const [message, setMessage] = useState({ status: '', message: '' });
  const [TotalPhotos, setTotalPhotos] = useState(0);
  const hiddenInput = useRef(null);
  const [Loader, setLoader] = useState(false);
  const { handleSubmit, register } = useForm();
  const { ref, onChange, ...rest } = register('photo');

  function uploadFile(body, e) {
    e.preventDefault();

    const photos = [];

    Object.keys(body.photo).map((pic, index) => {
      return photos.push(body.photo[index]);
    });

    if (FileName) {
      setPhotosOnUpload(FileName);
      console.log('EDITAR', FileName);
      setTimeout(() => {
        setLoader(false);
      }, 1000);
      setFile({
        shown: false,
        userInfo: '',
        form: '',
      });
    }
  }

  function editFile(body, e) {
    e.preventDefault();

    const photos = [];

    Object.keys(body.photo).map((pic, index) => {
      return photos.push(body.photo[index]);
    });
    put(
      `http://192.168.1.16:4000/properties/${editProperty}`,
      photos.length > 1
        ? CreateFormDataMultipleFiles(photos)
        : CreateFormData({ photo: photos[0] }),
      (data) => {
        if (data.status === 'ok') {
          console.log('Sucess');
          setTimeout(() => {
            setButton(false);
            setLoader(false);
            setFileName('');
          }, 500);
          setMessage({ status: 'ok', message: '¡Fotos subidas con éxito!' });
        }
      },
      (error) => {
        setButton(true);
        setLoader(false);
        setError(error.message);
      },
      Token
    );
  }

  useEffect(() => {
    setTotalPhotos(photos.length + FileName.length);
  }, [FileName.length, photos.length, FileName]);

  return (
    <div className='overlay z-20 bg-white bg-opacity-75 justify-center fixed w-full h-full left-0 top-0 flex flex-col items-center px-12 py-24 overscroll-scroll sm:overflow-hidden'>
      {message.message && <Message message={message} setMessage={Message} />}
      {Loader && (
        <div className='overlay z-50 fixed bg-gray-200 bg-opacity-50 w-full h-full left-0 top-0 flex flex-col items-center px-12 pt-24 pb-2 overflow-scroll sm:overflow-hidden'>
          <CircularProgress className='absolute top-0 left-0 right-0 bottom-0 m-auto' />{' '}
        </div>
      )}
      <section className=' pt-2 filter drop-shadow-xl  flex flex-col items-center gap-5 bg-white relative text-principal-gris overflow-y-auto md:w-3/4 max-w-3xl'>
        <button
          className='close-overlay absolute top-3 right-3'
          onClick={() => {
            setFile({ shown: false, form: '' });
          }}
        >
          <FaPlus className='transform rotate-45' />
        </button>
        <h1 className='title text-3xl p-4 border-b-4 self-center border-gray-700 flex justify-center w-5/6 select-none'>
          Añade las fotos de tu inmueble
        </h1>
        <div className='file-uploader-container flex justify-around flex-col-reverse gap-10 sm:flex-row sm:w-11/12'>
          <form
            onSubmit={
              editProperty ? handleSubmit(editFile) : handleSubmit(uploadFile)
            }
            className='flex flex-col gap-10 md:gap-3 pl-2 font-medium w-full pb-4'
          >
            <div className='flex flex-col gap-5 items-center'>
              <button
                className='font-medium flex items-center gap-2 bg-blue-600 text-white p-2'
                onClick={(e) => {
                  e.preventDefault();
                  hiddenInput.current.click();
                }}
              >
                <FaRegArrowAltCircleUp className='animate-bounce' />
                Selecciona los archivos
              </button>

              <div className='photo-cont flex flex-col gap-2 justify-center sm:justify-start w-full'>
                {photos && (
                  <div className='uploaded-photos-cont flex flex-col gap-1'>
                    <span className='border-b-2 border-gray-600 w-1/2 sm:w- mb-2'>
                      Fotos subidas:
                    </span>
                    <div className='flex flex-wrap gap-2 justify-center'>
                      {photos.map((photo, index) => {
                        return (
                          <div key={photo.name} className='relative'>
                            <button
                              className='delete-photo absolute top-0 right-0 bg-principal-1'
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setLoaderDiv(true);
                                deletePhoto(photo.name);
                              }}
                            >
                              <FaPlus className='transform rotate-45' />
                            </button>
                            <img
                              src={
                                'http://192.168.1.16:4000/photo/' + photo.name
                              }
                              alt='prueba'
                              className='w-20 h-20 object-cover'
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {FileName ? (
                  <div className='flex flex-col gap-1'>
                    <span className='border-b-2 border-gray-600 w-1/2 sm:w- mb-2'>
                      Fotos seleccionadas:
                    </span>
                    <div className='selected-photos-cont flex flex-wrap gap-2 justify-center'>
                      {FileName.map((file, index) => {
                        return (
                          <div key={file.name} className='relative w-20'>
                            <button
                              className='delete-photo absolute top-0 right-0 bg-principal-1'
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setLoader(true);
                                console.log(FileName);
                                setFileName(
                                  FileName.filter(
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
                      })}
                    </div>
                  </div>
                ) : (
                  <p className='text-center'>Ningún archivo seleccionado.</p>
                )}
              </div>

              <input
                className='hidden'
                {...rest}
                onChange={(e) => {
                  setLoader(true);
                  const arrayPhotos = [];
                  onChange(e);
                  for (const photo of hiddenInput.current.files) {
                    arrayPhotos.push(photo);
                  }
                  setFileName(arrayPhotos);
                  setButton(true);
                  setTimeout(() => {
                    setLoader(false);
                  }, 5000);
                }}
                ref={(e) => {
                  ref(e);
                  hiddenInput.current = e;
                }}
                type='file'
                multiple='multiple'
                name='photo'
              />
            </div>
            {Error && (
              <p className='text-red-600 font-medium text-center'>{Error}</p>
            )}
            {Message.status === 'ok' && (
              <p className='font-medium text-green-700 text-center'>
                {Message.message}
              </p>
            )}

            <span
              className={`self-center ${
                TotalPhotos >= 30 &&
                FileName.length > 0 &&
                ' text-red-500 animate-pulse'
              }`}
            >
              Fotos: {TotalPhotos}/30
            </span>

            <button
              onClick={(e) => {
                setButton(false);
                setLoader(true);
              }}
              type='submit'
              className={`${
                Button
                  ? 'bg-principal-1 text-principal-gris cursor-pointer'
                  : 'text-gray-400 select-none pointer-events-none cursor-default'
              } ${
                (TotalPhotos >= 30 || FileName.length < 1) &&
                'text-gray-400 select-none pointer-events-none cursor-default '
              } select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer`}
            >
              Añadir
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
