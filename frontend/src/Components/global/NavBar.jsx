import {React, useState } from "react";
import * as FaIcons from "react-icons/fa";
import {MenuElements} from "./MenuElements";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Register from "../Register";
import { Home } from "./Home";
import '../../index.css';
import '../../mediaQuery.css';

// import '../../index.css';

export default function NavBar(){
    const [mostrarMenu,setMostrarMenu]=useState(false);
    const showmenu =()=>setMostrarMenu(!mostrarMenu);
    

    console.log(mostrarMenu);
    return(
      <Router>
        <nav className="navbar">
          <Link to='/' className='logo'>
            <img src="logo-pr-amarillo.png" alt="logo Perfect renter"  id="logo" />
          </Link>
        <ul className={mostrarMenu ? 'menu menu-toggle': 'menu'} id="menu">
            {MenuElements.map((item)=>{
                return (
                    <li key={item.id}><Link to={item.path}>{item.title}</Link></li>
                )
            })}
        </ul>
        <div className='menu-bar' id="menu-bar">
           <FaIcons.FaBars onClick={showmenu}/> 
        </div>
        <div className="user">
          <Link to='/Login'>
          <span>Login</span>
          </Link>
        </div>
        <div className="register">
          <Link to='/register'>
          <span>Register</span>
          </Link>
        </div>
      </nav>
      <Switch>
          <Route path='/register'>
            <Register/>
          </Route>

          <Route path='/' exact>
            <Home/>
          </Route>
          <Route path='/load'>
       
          </Route>
        </Switch>
      </Router>
    );
    // function Registro(){
    //   return <Register/>;
    // }

};
