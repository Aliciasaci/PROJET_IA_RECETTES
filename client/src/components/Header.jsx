import React from 'react';

export default function Header({ setActiveComponent }) {
  const handleLinkClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="#">
          <div className="logo">CuisineConnect</div>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item" onClick={() => handleLinkClick("search")}>
            Accueil
          </a>
          <a className="navbar-item" onClick={() => handleLinkClick("recette")}>
            Recette
          </a>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-primary btn-signup"  onClick={() => handleLinkClick("signin")}>
                <strong>Sign up</strong>
              </a>
              <a className="button is-light"  onClick={() => handleLinkClick("login")}>
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
