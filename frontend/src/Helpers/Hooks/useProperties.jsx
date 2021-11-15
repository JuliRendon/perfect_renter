import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { get } from '../Api';

export default function useProperties() {
  const [properties, setProperty] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const controller = new AbortController();
    const controllerSearch = new AbortController();
    if (location.search) {
      get(
        `http://localhost:4000/properties${location.search}`,
        (data) => {
          if (data.message !== 'No hay conicidencias para su busqueda') {
            setProperty(data.properties);
          } else {
            setProperty([]);
          }
        },
        (error) => console.error(error),
        null,
        controller
      );
    } else {
      get(
        'http://localhost:4000/properties',
        (data) => {
          if (data.message !== 'No hay conicidencias para su busqueda') {
            setProperty(data.properties);
          }
        },
        (error) => console.error(error),
        null,
        controllerSearch
      );
    }
    return () => {
      controller.abort();
      controllerSearch.abort();
    };
  }, [location]);

  return [properties, setProperty];
}
