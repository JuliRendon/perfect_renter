import React, { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { get } from '../../Helpers/Api';
import useProperties from '../../Helpers/Hooks/useProperties';
import Filters from './Filters';
import Property from './Property';

export default function Properties(props) {
  const [Overlay, setOverlay] = useState({ show: false });
  const [Properties] = useProperties();
  const [bestRatedProperties, setBestRatedProperties] = useState([]);

  useEffect(() => {
    // const controller = new AbortController();
    get(
      `http://192.168.1.16:4000/properties?orden=valoraciones&direccion=DESC`,
      (data) => {
        if (data.message !== 'No hay conicidencias para su búsqueda') {
          setBestRatedProperties(data.properties);
        } else {
          setBestRatedProperties([]);
        }
      },
      (error) => console.error(error),
      null,
      null
    );
    return () => {
      // controller.abort();
    };
  }, []);

  return (
    <>
      <main className='flex flex-col sm:flex-row sm:gap-2'>
        <aside
          className={` w-min sm:bg-white bg-gray-Primary flex-grow-0 sm:static right-0 top-20 z-20 sm:top-0 mt-2 sm:mt-0 sm:pt-20`}
        >
          <button
            className='lg:hidden flex flex-col w-20 h-20 fixed rounded-full justify-center text-base bottom-3 bg-principal-1 right-1 items-center '
            onClick={() => {
              setOverlay({ show: true });
            }}
          >
            Filtrar
            <FaFilter className=' w-8 h-min lg:hidden' />
          </button>
          <Filters setOverlay={setOverlay} Overlay={Overlay} />
        </aside>
        <section
          className={`ALQUILERES ${
            Overlay.show && 'overflow-hidden'
          } flex flex-col items-center mt-20 flex-grow  w-full`}
        >
          <h1 className='text-4xl text-principal-gris shadow-lg pt-10 md:pt-10 bg-principal-1 w-full p-10 font-semibold'>
            Viviendas en alquiler
          </h1>
          <div className='cont-alquileres pt-2 justify-center flex flex-wrap w-full gap-5'>
            {Properties.length > 0 ? (
              Properties.map((property) => (
                <Property
                  key={property.idProperty}
                  property={property}
                  mountOn={'propertiesList'}
                />
              ))
            ) : (
              <div>No hay conicidencias para su búsqueda.</div>
            )}
          </div>
        </section>
      </main>
      <aside
        className={`ALQUILERES ${
          Overlay.show && 'overflow-hidden'
        } flex flex-col items-center mt-20 flex-grow  pb-28`}
      >
        <h1 className='text-2xl text-principal-gris py-2 bg-principal-1 w-screen text-center font-semibold'>
          Viviendas destacadas
        </h1>
        <div className='cont-alquileres p-2 justify-center flex flex-wrap w-full gap-5'>
          {bestRatedProperties.length > 0 &&
            bestRatedProperties
              .slice(0, 3)
              .map((property) => (
                <Property
                  key={property.idProperty}
                  property={property}
                  mountOn={'bestPropertiesList'}
                />
              ))}
        </div>
      </aside>
    </>
  );
}
