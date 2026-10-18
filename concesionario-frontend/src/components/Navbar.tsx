import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/vehiculos', label: 'Vehículos' },
  ]

  return (
    <header className="site-header" role="banner">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <div className="header-container">
        <Link to="/" className="brand-link" onClick={closeMenu}>
          <span className="brand-icon" aria-hidden="true">
            🚗
          </span>
          <span className="brand-text">AutoGestión Concesionario</span>
        </Link>

        {/* Botón menú accesible para móviles */}
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          onClick={toggleMenu}
        >
          <span className="menu-icon" aria-hidden="true">
            {isMenuOpen ? '✕' : '☰'}
          </span>
        </button>

        {/* Navegación principal */}
        <nav
          id="primary-navigation"
          className={`site-nav ${isMenuOpen ? 'is-open' : ''}`}
          role="navigation"
          aria-label="Navegación principal"
        >
          <ul className="nav-list">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <li key={link.to} className="nav-item">
                  <Link
                    to={link.to}
                    className={`nav-link ${isActive ? 'is-active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
