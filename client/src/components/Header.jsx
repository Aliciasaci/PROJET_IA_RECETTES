import React from 'react';
import { AppBar, Button, Container, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Header() {

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="#">
          <div className="logo">CuisineConnect</div>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link className="navbar-item" to={"/"}>
            Accueil
          </Link>
          <Link className='navbar-item' to={"/allRecettes"}>
            Toutes nos recettes
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
            <Button className="signin-btn mr-2" component={Link} to={"/signin"} style={{ color: 'black', border : '1px solid orangered', padding: '0.5rem 1rem' }}>
                Se connecter
              </Button>
              <Button className="signup-btn" component={Link} to={"/signup"} style={{ color: 'white', backgroundColor: 'orangered', padding: '0.5rem 1rem' }}>
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
