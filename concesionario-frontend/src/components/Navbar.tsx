import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CarFront, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    closeMenu()
    logout()
  }

  return (
    <header className="site-header" role="banner">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <div className="header-container">
        <Link to="/" className="brand-link" onClick={closeMenu}>
          <CarFront className="brand-icon" size={24} aria-hidden="true" />
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
          {isMenuOpen ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>

        {/* Navegación principal */}
        <nav
          id="primary-navigation"
          className={`site-nav ${isMenuOpen ? 'is-open' : ''}`}
          role="navigation"
          aria-label="Navegación principal"
        >
          <ul className="nav-list">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'is-active' : ''}`}
                aria-current={location.pathname === '/' ? 'page' : undefined}
                onClick={closeMenu}
              >
                Inicio
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/vehiculos"
                className={`nav-link ${location.pathname === '/vehiculos' ? 'is-active' : ''}`}
                aria-current={location.pathname === '/vehiculos' ? 'page' : undefined}
                onClick={closeMenu}
              >
                Vehículos
              </Link>
            </li>

            {/* Enlace al Panel Admin visible solo si tiene rol Admin */}
            {isAdmin && (
              <li className="nav-item">
                <Link
                  to="/admin"
                  className={`nav-link ${location.pathname === '/admin' ? 'is-active' : ''}`}
                  aria-current={location.pathname === '/admin' ? 'page' : undefined}
                  onClick={closeMenu}
                >
                  Panel Admin
                </Link>
              </li>
            )}

            {/* Sección de autenticación */}
            {isAuthenticated && user ? (
              <li className="nav-item auth-nav-item">
                <div className="user-pill" aria-label={`Usuario: ${user.name}`}>
                  <span className="user-name">{user.name}</span>
                  <span className="status-pill badge-disponible user-role">{user.role}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-logout"
                  onClick={handleLogout}
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={15} aria-hidden="true" />
                  <span>Salir</span>
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  to="/login"
                  className={`btn btn-primary nav-login-btn ${
                    location.pathname === '/login' ? 'is-active' : ''
                  }`}
                  onClick={closeMenu}
                >
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
