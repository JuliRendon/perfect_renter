import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaRegArrowAltCircleUp } from 'react-icons/fa';
import { CreateFormData, put } from '../../Helpers/Api';
import EditAvatar from 'react-avatar-editor';
import { Message } from '../Properties/PropertyInfo';

export default function Avatar({ setOverlay, avatar, usuario, Token }) {
  const [Error, setError] = useState('');
  const [FileName, setFileName] = useState('');
  const [ImgPreview, setImgPreview] = useState(null);
  const [Scale, setScale] = useState(1);
  const hiddenInput = useRef(null);
  const editedImg = useRef(null);
  const [message, setMessage] = useState({ message: '', status: '' });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { ref, onChange, ...rest } = register('avatar', {
    required: 'Debes escoger una foto',
  });

  function uploadFile(body, e) {
    e.preventDefault();
    if (body.avatar[0]) {
      editedImg.current.getImageScaledToCanvas().toBlob((blob) => {
        const file = new File([blob], hiddenInput.current.files[0].name, {
          type: 'image/jpeg',
        });

        put(
          `http://192.168.1.16:4000/users/${usuario.idUser}`,
          CreateFormData({ avatar: file }),
          (data) => {
            console.log('Success');
            setMessage({ message: data.message, status: 'ok' });
          },
          (error) => {
            setError(error.message);
          },
          Token
        );
      }, 'image/jpeg');
    }
  }

  function imageHandler(e) {
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (d) => {
        if (reader.readyState === 2) {
          setImgPreview(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  return (
    <div className='overlay z-20 bg-white bg-opacity-75 fixed w-full h-full left-0 top-0 flex flex-col justify-center items-center pt-20 pb-10 px-2 overflow-auto sm:overflow-hidden'>
      {message.message && <Message message={message} setMessage={Message} />}
      <section className='avatar mt-6 filter drop-shadow-xl h-min flex flex-col items-center gap-5 bg-white text-principal-gris overflow-y-auto md:w-3/4'>
        <button
          className='close-overlay absolute top-3 p-5 right-2'
          onClick={() => {
            setOverlay({ shown: false, info: {} });
          }}
        >
          <FaPlus className='transform scale-150 rotate-45' />
        </button>
        <h1 className='title text-3xl p-4 border-b-4 border-gray-600 self-center flex justify-center w-5/6 select-none'>
          Añadir avatar
        </h1>
        <p className='font-medium text-center'>
          Añade una foto de perfil para tener más oportunidades en las mejores
          viviendas.
        </p>
        <div className='contact-card-container flex justify-around flex-col-reverse gap-10 sm:flex-row '>
          <form
            className='flex flex-col gap-10 md:gap-3 pl-2 font-medium w-full pb-4'
            onSubmit={handleSubmit(uploadFile)}
          >
            <div className='flex flex-col items-center p-2'>
              <button
                className='font-medium flex items-center gap-2 w-full bg-blue-600 text-white p-2 justify-center'
                onClick={(e) => {
                  e.preventDefault();
                  hiddenInput.current.click();
                }}
              >
                <FaRegArrowAltCircleUp className='animate-bounce' />
                Selecciona un archivo
              </button>
              <input
                className='hidden'
                {...rest}
                onChange={(e) => {
                  onChange(e);
                  imageHandler(e);
                  setFileName(hiddenInput.current.files[0].name);
                }}
                ref={(e) => {
                  ref(e);
                  hiddenInput.current = e;
                }}
                type='file'
                name='avatar'
              />
            </div>
            {Error && (
              <p className='text-red-600 font-medium text-center'>{Error}</p>
            )}
            {errors.avatar && (
              <p className='text-red-600 font-medium text-center'>
                {errors.avatar.message}
              </p>
            )}
            {FileName && (
              <>
                <EditAvatar
                  image={ImgPreview}
                  ref={editedImg}
                  width={250}
                  height={250}
                  borderRadius={150}
                  border={50}
                  color={[255, 255, 255, 0.6]} // RGBA
                  scale={Scale}
                  rotate={0}
                />
                <input
                  type='range'
                  name='scale'
                  min='1'
                  max='3'
                  step='0.01'
                  onChange={(e) => {
                    setScale(e.target.value);
                  }}
                />
              </>
            )}
            <button
              type='submit'
              className='select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer'
            >
              Subir
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
