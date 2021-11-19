import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CreateFormData, post, put } from '../../Helpers/Api';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

// Import inputs controlados
import Email from './Inputs/Email';
import Password from './Inputs/Password';
import FirstName from './Inputs/FirstName';
import {
  FaBookOpen,
  FaPlus,
  FaRegAddressCard,
  FaRegCalendarAlt,
  FaTrash,
  FaUserAlt,
} from 'react-icons/fa';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box } from '@mui/system';
import { format } from 'date-fns';
import { Message } from '../Properties/PropertyInfo';
export default function Register({
  Token,
  usuario,
  setOverlay,
  onSubmitDeleted,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm(
    Token
      ? {
          defaultValues: {
            email: usuario.email,
            name: usuario.name,
            lastName: usuario.lastName,
            city: usuario.ciudad,
            tel: usuario.tel,
            bio: usuario.bio,
            birthDate: new Date(usuario.birthDate).toISOString().substr(0, 10),
          },
        }
      : {
          defaultValues: {
            email: '',
            name: '',
            lastName: '',
            city: '',
            tel: '',
            bio: '',
            birthDate: '',
          },
        }
  );
  const formFunctions = { register, errors };
  const [message, setMessage] = useState({ message: '', status: '' });
  // States
  const [Error, setError] = useState('');
  const [DatePicker, setDatePicker] = useState(false);
  const [Value, setDateValue] = useState([null, null]);
  // Enviar datos a backend
  function onSubmitRegister(body, e) {
    e.preventDefault();
    setValue('birthDate', format(new Date(body.birthDate), 'yyyy/MM/dd'));
    const age = new Date().getYear() - new Date(body.birthDate).getYear();
    if (age < 17) {
      setError('Debes ser mayor de edad.');
    } else {
      post(
        'http://192.168.1.16:4000/users',
        CreateFormData(body),
        (data) => {
          console.log('Success');
          setMessage({ message: data.message, status: 'ok' });
          reset();
          setOverlay({ shown: false, userInfo: {} });
        },
        (data) => {
          setError(data.message);
        },
        Token
      );
    }
  }

  function onSubmitEdited(body, e) {
    e.preventDefault();
    put(
      `http://192.168.1.16:4000/users/${usuario.idUser}`,
      CreateFormData(body),
      (data) => {
        console.log('Success');
        setMessage({ message: data.message, status: 'ok' });
        reset();
      },
      (error) => {
        setError(error.message);
      },
      Token
    );
  }
  const inpStyle =
    'px-3 py-3 placeholder-gray-400 text-gray-600 focus:cursor-default relative bg-white text-sm border border-gray-400 outline-none focus:outline-none focus:ring w-full cursor-pointer';
  const buttonStyle =
    'select-none w-full self-center text-center bg-principal-1 text-principal-gris border border-yellow-300 text-black py-2 px-3 hover:bg-gray-Primary hover:text-principal-1 transform ease-in duration-200 cursor-pointer';

  const registerComponentStyle = Token
    ? 'overlay z-20 bg-white bg-opacity-75 fixed w-full h-full min-h-full h-96 left-0 top-0 flex flex-col items-center pt-20 pb-10 overflow-auto sm:overflow-hidden'
    : 'bg-white bg-opacity-50';
  const bio = watch('bio');
  return (
    <div className={registerComponentStyle}>
      {message.message && <Message message={message} setMessage={Message} />}
      <section
        className={
          Token
            ? 'w-4/5 max-w-xl items-center p-4 pt-14 flex flex-col gap-5 mt-2 filter drop-shadow-xl bg-white text-principal-gris overflow-y-auto relative'
            : 'pt-24 pb-32 flex flex-col items-center gap-5 p-2 text-principal-gris '
        }
      >
        {Token && (
          <button
            className='close-overlay absolute top-3 right-3 p-2'
            onClick={() => {
              setOverlay({ shown: false, userInfo: {} });
            }}
          >
            <FaPlus className='transform rotate-45 text-xl' />
          </button>
        )}
        <div className='title text-3xl p-4 border-b-4 self-center border-gray-700 flex justify-center w-3/6 select-none'>
          {Token ? <h2>EDITAR</h2> : <h2>REGISTRO</h2>}
        </div>
        <form
          className='flex flex-col gap-3 md:w-96 w-3/4'
          onSubmit={
            Token
              ? handleSubmit(onSubmitEdited)
              : handleSubmit(onSubmitRegister)
          }
        >
          {!Token && (
            <h3 className='flex gap-2 font-medium items-center'>
              <div className='p-2 rounded-full border-2 border-gray-600'>
                <FaUserAlt className='text-principal-1' />
              </div>
              Datos de ingreso:
            </h3>
          )}
          {Token && (
            <h3 className='flex gap-2 font-medium items-center'>
              <div className='p-2 rounded-full border-2 border-gray-600 bg-principal-1-hover'></div>
              Email:
            </h3>
          )}
          <Controller
            name='email'
            control={control}
            rules={{
              required: 'Debes escribir un email.',
              maxLength: {
                value: 200,
                message: 'El email no puede contener más de 200 caracteres.',
              },
            }}
            render={({ field: { onChange, name, ref, value } }) => {
              return (
                <Email
                  value={value}
                  onChange={onChange}
                  inputRef={ref}
                  name={name}
                  className={inpStyle}
                />
              );
            }}
          />
          {errors.email && (
            <p className='text-red-500'>{errors.email.message}</p>
          )}
          {!Token && <Password {...formFunctions} />}
          {!Token && (
            <h3 className='flex gap-2 font-medium items-center'>
              <div className='p-2 rounded-full border-2 border-gray-600'>
                <FaRegAddressCard className='text-principal-1' />
              </div>
              Información personal:
            </h3>
          )}
          {Token && (
            <h3 className='flex gap-2 font-medium items-center'>
              <div className='p-2 rounded-full border-2 border-gray-600 bg-principal-1-hover'></div>
              Nombre:
            </h3>
          )}
          <Controller
            name='name'
            control={control}
            rules={{
              required: 'Debes escribir un nombre.',
              pattern: {
                value:
                  /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
                message:
                  'El nombre no puede contener caracteres especiales ni números.',
              },
              minLength: {
                value: 3,
                message: 'El nombre debe contener como mínimo 3 caracteres.',
              },
              maxLength: {
                value: 30,
                message: 'El nombre no puede tener más de 30 caracteres.',
              },
            }}
            render={({ field: { onChange, name, ref, value } }) => {
              return (
                <FirstName
                  value={value}
                  onChange={onChange}
                  inputRef={ref}
                  name={name}
                  className={inpStyle}
                />
              );
            }}
          />
          {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
          {Token && (
            <h3 className='flex gap-2 font-medium items-center'>
              <div className='p-2 rounded-full border-2 border-gray-600 bg-principal-1-hover'></div>
              Apellidos:
            </h3>
          )}
          <input
            className={inpStyle}
            type='text'
            name='lastName'
            placeholder='Apellidos*'
            {...register('lastName', {
              required: 'Debes escribir un apellido.',
              pattern: {
                value:
                  /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
                message:
                  'El apellido no puede contener caracteres especiales ni números.',
              },
              minLength: {
                value: 3,
                message: 'El apellido debe contener como mínimo 3 caracteres.',
              },
              maxLength: {
                value: 30,
                message: 'El apellido no puede tener más de 30 caracteres.',
              },
            })}
          />
          {errors.lastName && (
            <p className='text-red-500'>{errors.lastName.message}</p>
          )}
          {Token && (
            <h3 className='flex gap-2 font-medium items-center'>
              <div className='p-2 rounded-full border-2 border-gray-600 bg-principal-1-hover'></div>
              Ciudad:
            </h3>
          )}
          <input
            className={inpStyle}
            type='text'
            name='city'
            placeholder='City*'
            {...register('city', {
              required: 'Debes escribir la ciudad dónde resides.',
              pattern: {
                value:
                  /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
                message:
                  'La ciudad no puede contener caracteres especiales ni números.',
              },
              maxLength: {
                value: 30,
                message: 'La ciudad no puede tener más de 50 caracteres.',
              },
            })}
          />
          {errors.city && <p className='text-red-500'>{errors.city.message}</p>}
          {Token && (
            <h3 className='flex gap-2 font-medium items-center'>
              <div className='p-2 rounded-full border-2 border-gray-600 bg-principal-1-hover'></div>
              Teléfono:
            </h3>
          )}
          <input
            className={inpStyle}
            type='tel'
            name='Teléfono'
            placeholder='Tlf'
            {...register('tel', {
              pattern: {
                value: /^\s?\+?\s?([0-9][0-9\s]*){9,}$/,
                message: 'Debes introducir un número de teléfono válido.',
              },
            })}
          />
          {errors.tel && <p className='text-red-500'>{errors.tel.message}</p>}
          {!Token && (
            <h3 className='flex gap-2 font-medium items-center'>
              <div className='p-2 rounded-full border-2 border-gray-600'>
                <FaBookOpen className='text-principal-1' />
              </div>
              Cuéntanos algo sobre ti:
            </h3>
          )}
          {Token && (
            <h3 className='flex gap-2 font-medium items-center'>
              <div className='p-2 rounded-full border-2 border-gray-600 bg-principal-1-hover'></div>
              Biografía:
            </h3>
          )}
          <div className='relative'>
            <textarea
              className={inpStyle + ' h-40 resize-none'}
              type='text'
              name='bio'
              maxLength={250}
              placeholder='Bio'
              {...register('bio', {
                required: { value: false, message: 'Bio' },
                minLength: 0,
                maxLength: {
                  value: 255,
                  message: 'No puedes escribir más de 250 caracteres.',
                },
              })}
            />
            {
              <p
                className={`${
                  bio.length > 250 && 'text-red-500'
                } absolute right-5 bottom-5`}
              >
                {bio ? bio.length : 0}/250
              </p>
            }
          </div>
          {!Token && (
            <h3 className='flex gap-2 font-medium items-center'>
              <div className='p-2 rounded-full border-2 border-gray-600'>
                <FaRegCalendarAlt className='text-principal-1' />
              </div>
              Fecha de nacimiento:
            </h3>
          )}
          {Token && (
            <h3 className='flex gap-2 font-medium items-center'>
              <div className='p-2 rounded-full border-2 border-gray-600 bg-principal-1-hover'></div>
              Fecha de nacimiento:
            </h3>
          )}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label='Custom input'
              value={Value}
              open={DatePicker}
              onClose={(e) => {
                setDatePicker(false);
              }}
              onChange={(newValue) => {
                setDateValue(format(new Date(newValue), 'dd/MM/yyyy'));
                setValue('birthDate', format(new Date(newValue), 'yyyy/MM/dd'));
              }}
              renderInput={({ inputRef, inputProps, InputProps }) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    className={inpStyle}
                    ref={inputRef}
                    readOnly={true}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      setDatePicker(true);
                    }}
                    autoComplete='new-password'
                    {...inputProps}
                    name='birthDate'
                    placeholder='dd/mm/yyyy'
                  />
                </Box>
              )}
            />
          </LocalizationProvider>

          {errors.birthDate && (
            <p className='text-red-500'>{errors.birthDate.message}</p>
          )}

          {Error ? <div className='text-red-500 font-medium'>{Error}</div> : ''}

          <input
            className={buttonStyle + ' '}
            type='submit'
            value={Token ? 'Guardar' : 'Registrar'}
          />
        </form>
        {Token && (
          <div className='flex justify-center sm:justify-end sm:pr-2'>
            <button
              className='py-4 px-2 my-5 text-principal-1 bg-gray-Primary flex items-center justify-around hover:bg-principal-1 hover:text-principal-gris duration-300 border border-yellow-300'
              onClick={() => {
                setOverlay({
                  form: 'deleteAccount',
                  shown: true,
                  onSubmitDeleted: onSubmitDeleted,
                });
              }}
            >
              <FaTrash className='hover:text-red-500 w-8' />{' '}
              <span className=''>Eliminar cuenta</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
