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
              <Button className="" component={Link} to={"/signup"}>
                <strong>S'inscrire</strong>
              </Button>
              <Button className="" component={Link} to={"/signin"}>
                Se connecter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
