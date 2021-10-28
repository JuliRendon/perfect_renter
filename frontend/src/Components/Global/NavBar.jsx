import { React, useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { MenuElements } from './MenuElements';
import { Link } from 'react-router-dom';

export default function NavBar({ token, setToken }) {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const showMenu = () => setMostrarMenu(!mostrarMenu);

  const buttonStyle =
    'text-center bg-principal-1 min-w-min p-1 cursor-pointer sm:hover:text-white sm:hover:font-bold sm:duration-300';

  return (
    <nav className='navbar bg-gray-Primary grid grid-cols-9 gap-5 items-center font-light h-20 fixed top-0 w-full z-50'>
      <Link
        to='/'
        className='logo w-10 p-1 sm:col-start-1 sm:col-end-2 col-start-2 justify-self-end xl:justify-self-center'
      >
        <img
          src='/Images/logo-pr-amarillo.png'
          alt='logo Perfect renter'
          id='logo'
        />
      </Link>
      <ul
        className={`navBar
        sm:text-lg sm:static sm:flex-row sm:justify-self-start sm:col-start-2 sm:col-end-8 sm:bg-transparent sm:p-0 sm:justify-around sm:w-full
        lg:text-xl lg:justify-self-center lg:col-start-2 lg:col-end-8 lg:justify-evenly
        xl:col-start-2 xl:col-end-8 xl:justify-self-end xl:justify-around
        ${
          mostrarMenu ? 'right-0' : '-right-full'
        } text-2xl flex flex-col p-5 items-center bg-gray-Primary duration-300 absolute top-20`}
        id='menu'
      >
        {MenuElements.map((item) => {
          if (item.id === 3 && !token) {
            return (
              <li
                key={item.id}
                className='text-gray-400 select-none pointer-events-none cursor-default py-10 w-full sm:w-auto text-center sm:p-0'
              >
                <Link to={item.path} onClick={showMenu}>
                  {item.title}
                </Link>
              </li>
            );
          } else {
            return (
              <li
                key={item.id}
                className='text-principal-1 cursor-pointer hover:text-white duration-300 ease-in-out py-10 w-full sm:w-auto text-center sm:p-0'
              >
                <Link to={item.path} onClick={showMenu}>
                  {item.title}
                </Link>
              </li>
            );
          }
        })}
        {token && (
          <button
            className={`block sm:hidden text-white p-1 hover:text-principal-1 sm:col-start-8 md:col-start-9 md:col-end-10 justify-self-start  py-10 w-full sm:w-auto sm:justify-self-end md:justify-self-center`}
            onClick={() => {
              setToken('');
              window.location.reload();
            }}
          >
            Salir
          </button>
        )}
      </ul>
      <div
        className='text-gray-300 block sm:hidden absolute top-6 right-4 text-3xl cursor-pointer'
        id='menu-bar'
      >
        <FaIcons.FaBars onClick={showMenu} />
      </div>
      {token ? (
        <>
          <Link
            to='/perfil'
            className={`${buttonStyle} relative col-start-5 justify-self-center sm:col-start-8 lg:col-start-8 lg:justify-self-end sm:justify-self-start sm:px-2 sm:hover:px-3 lg:px-6 lg:hover:px-8 flex items-center gap-3 justify-around`}
          >
            <FaIcons.FaUser className='text-gray-700' />
            <span>Perfil</span>
          </Link>
          <button
            className={`hidden sm:block text-white p-1 hover:text-principal-1 sm:col-start-9 lg:col-start-9 lg:col-end-10 justify-self-start sm:justify-self-end lg:justify-self-center`}
            onClick={() => {
              setToken('');
              window.location.reload();
            }}
          >
            Salir
          </button>
        </>
      ) : (
        <>
          <Link
            className={`${buttonStyle} col-start-4 col-end-6 row-start-1 sm:col-start-8 sm:col-end-9 justify-self-end px-8  hover:px-10`}
            to='/login'
          >
            Login
          </Link>

          <Link
            className={`${buttonStyle} col-start-6 col-end-8 row-start-1 sm:col-start-9 sm:col-end-10 justify-self-center px-6 hover:px-8`}
            to='/register'
          >
            Register
          </Link>
        </>
      )}
    </nav>
  );
}
