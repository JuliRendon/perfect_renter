```jsx
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa';
import { useHistory } from 'react-router';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';
import { format } from 'date-fns';
import CalendarPickerSkeleton from '@mui/lab/CalendarPickerSkeleton';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import esEsLocale from 'date-fns/locale/es';

const [setOverlay, Overlay] = useState({ show: false });
const pMinVal = useRef();
const history = useHistory();
const [pickerValue, setPickerValue] = useState([null, null]);
const {
  register,
  handleSubmit,
  setValue,
  formState: { errors },
} = useForm({
  defaultValues: {
    orden: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    tipo: '',
    pMin: '',
    pMax: '',
    hab: '',
    garaje: '',
    baños: '',
    m2: '',
    entrada: '',
    salida: '',
  },
});

function onSubmit(body, e) {
  e.preventDefault();

  const queryString = Object.keys(body)
    .filter((val) => {
      if (val === 'garaje' && body['garaje'] === true) {
        return body[val];
      } else {
        return body[val].length >= 1;
      }
    })
    .map((key) => {
      if (key === 'garaje') {
        return `${key}=1`;
      } else {
        return `${key}=${body[key]}`;
      }
    })
    .join('&');

  if (history.location.pathname.length > 12) {
    history.replace('/alquileres?' + queryString);
  }
  history.push('?' + queryString);

  if (window.innerWidth <= 650) {
    setOverlay({ show: false });
  }
}

const inputsLabelStyle = ' text-xl duration-200';
const inputStyle =
  'bg-gray-Primary px-2 placeholder-yellow-300 border border-gray-600 border-opacity-40 text-principal-1 font-medium';

<div className='relative'>
  <div
    className={`transform w-full h-full flex flex-col items-center pt-24 overflow-scroll duration-300 sm:overflow-hidden sm:z-0 sm:mt-0 sm:static sm:py-10`}
  >
    <section className='filtros shadow-custom sm:shadow-none overflow-scroll overflow-x-hidden sm:overflow-hidden pt-2 border border-black sm:border-transparent flex flex-col gap-5 w-10/12 sm:w-full bg-white sm:bg-none relative'>
      <button
        className='close-overlay absolute top-3 right-3 sm:hidden'
        onClick={() => {
          setOverlay({ show: false, form: '' });
        }}
      >
        <FaPlus className='transform rotate-45 ' />
      </button>
      <h1 className='title self-center select-none font-semibold text-principal-gris  text-2xl underline'>
        Filtros
      </h1>
      <div className='filters-card-container flex justify-around flex-col-reverse gap-10 sm:flex-row '>
        <form
          className='flex flex-col gap-4 p-2'
          onSubmit={handleSubmit(onSubmit)}
        >
          <label>
            <select
              name='orden'
              defaultValue=''
              {...register('orden')}
              className={inputStyle}
            >
              <option value='' disabled>
                Filtrar por
              </option>
              <option value='precio' className='font-medium'>
                Precio
              </option>
              <option value='creacion' className='font-medium'>
                Fecha de creacion
              </option>
              <option value='valoraciones' className='font-medium'>
                Valoraciones
              </option>
            </select>
          </label>
          <label>
            <select
              name='direccion'
              {...register('direccion')}
              className={inputStyle}
            >
              <option value='' disabled>
                Orden
              </option>
              <option value='ASC' className='font-medium'>
                Asc
              </option>
              <option value='DESC' className='font-medium'>
                Desc
              </option>
            </select>
          </label>
          <LocalizationProvider
            locale={esEsLocale}
            dateAdapter={AdapterDateFns}
          >
            <DateRangePicker
              disablePast
              autoOk={true}
              label='Advanced keyboard'
              value={pickerValue}
              renderLoading={() => <CalendarPickerSkeleton />}
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

                  if (
                    newValue[0] &&
                    !isNaN(newValue[0].getTime()) &&
                    newValue[1] &&
                    !isNaN(newValue[1].getTime())
                  ) {
                    setValue('entrada', format(newValue[0], 'yyyy/MM/dd'));
                    setValue('salida', format(newValue[1], 'yyyy/MM/dd'));
                  }
                }
              }}
              renderInput={(startProps, endProps) => (
                <div className='flex flex-col'>
                  <label>
                    <span className={inputsLabelStyle}>Fecha de entrada:</span>
                    <input
                      className={inputStyle}
                      name='startDate'
                      autoComplete='off'
                      ref={startProps.inputRef}
                      {...startProps.inputProps}
                    />
                  </label>
                  <label>
                    <span className={inputsLabelStyle}>Fecha de salida:</span>
                    <input
                      className={inputStyle}
                      name='endDate'
                      autoComplete='off'
                      ref={endProps.inputRef}
                      {...endProps.inputProps}
                    />
                  </label>
                </div>
              )}
            />
          </LocalizationProvider>
          <div className={inputsLabelStyle}>Ciudad:</div>
          <label className='city'>
            <input
              {...register('ciudad', {
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
              type='text'
              name='ciudad'
              className={inputStyle}
              placeholder='Ciudad...'
            />
            {errors.city && (
              <p className='text-red-500'>{errors.city.message}</p>
            )}
          </label>
          <div className={inputsLabelStyle}>Provincia:</div>
          <label className='province'>
            <input
              {...register('provincia', {
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
              })}
              type='text'
              name='provincia'
              className={inputStyle}
              placeholder='Provincia...'
            />
          </label>
          <div className='grid grid-cols-2 grid-rows-2'>
            <div className={`col-start-1 col-end-3 ${inputsLabelStyle}`}>
              Tipo de vivienda:
            </div>
            <label className='flex gap-2 items-baseline font-medium'>
              Piso
              <input
                type='radio'
                name='tipo'
                value='piso'
                {...register('tipo')}
              />
            </label>
            <label className='flex gap-2 items-baseline font-medium'>
              Casa
              <input
                type='radio'
                name='tipo'
                value='casa'
                {...register('tipo')}
              />
            </label>
            <label className='flex gap-2 items-baseline font-medium'>
              Duplex
              <input
                type='radio'
                name='tipo'
                value='duplex'
                {...register('tipo')}
              />
            </label>
            <label className='flex gap-2 items-baseline font-medium'>
              Cualquiera
              <input type='radio' name='tipo' value='%' {...register('tipo')} />
            </label>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='minPrice'>
              <div className={inputsLabelStyle}>Precio Mínimo:</div>
              <input
                ref={pMinVal}
                min='1'
                max='10000'
                {...register('pMin')}
                type='number'
                name='pMin'
                className={inputStyle}
                placeholder='Mínimo'
              />€
            </label>
            <label className='maxPrice'>
              <div className={inputsLabelStyle}>Precio Máximo:</div>
              <input
                {...register('pMax')}
                min='1'
                max='10000'
                type='number'
                name='pMax'
                className={inputStyle}
                placeholder='Máximo'
              />€
            </label>
          </div>
          <label className='rooms'>
            <div className={inputsLabelStyle}>Habitaciones:</div>
            <input
              {...register('hab')}
              type='number'
              name='hab'
              min='1'
              max='10'
              className={inputStyle}
              placeholder='Hab...'
            />
          </label>
          <label className='parking flex gap-2 items-center'>
            <div className={inputsLabelStyle}>Garaje:</div>
            <input
              {...register('garaje')}
              type='checkbox'
              name='garaje'
              className={inputStyle}
              placeholder='Garaje...'
            />
          </label>
          <label className='toilets'>
            <div className={inputsLabelStyle}>Baños: </div>
            <input
              {...register('baños')}
              min='1'
              max='10'
              type='number'
              name='baños'
              className={inputStyle}
              placeholder='Baños...'
            />
          </label>
          <label className='mts'>
            <div className={inputsLabelStyle}>Metros:</div>
            <input
              {...register('m2')}
              min='1'
              max='1000'
              type='number'
              name='m2'
              className={inputStyle}
              placeholder='Metros...'
            />
          </label>
          <div className='flex justify-center items-center self-center sticky bottom-0 w-full h-28 bg-white sm:bg-transparent'>
            <input
              type='submit'
              value='Aplicar filtros'
              className='btn-submit text-xl bg-none p-2 font-medium text-principal-gris border-gray-700 border-2 h-2/4 hover:bg-gray-Primary bg-principal-1 hover:border-white hover:text-principal-1 duration-300'
            />
          </div>
        </form>
      </div>
    </section>
  </div>
</div>;
```