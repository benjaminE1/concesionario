import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  CarFront,
  Home,
  Wrench,
  Building2,
  Users,
  ShieldCheck,
  LogIn,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from 'lucide-react'
import { useAuth } from '../context/useAuth'

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const [prevPath, setPrevPath] = useState(location.pathname)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  // Ajustar estado si cambia la ruta sin efecto síncrono en cascada
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setIsOpen(false)
  }

  // Cerrar con tecla Escape en dispositivos móviles (WCAG 2.1)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Evitar scroll del cuerpo cuando el sidebar móvil está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const handleLogout = () => {
    closeSidebar()
    logout()
  }

  const isLinkActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const navLinks = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Vehículos', path: '/vehiculos', icon: CarFront },
    { name: 'Repuestos', path: '/repuestos', icon: Wrench },
  ]

  const adminLinks = [
    { name: 'Sucursales', path: '/sucursales', icon: Building2 },
    { name: 'Usuarios', path: '/usuarios', icon: Users },
    { name: 'Panel Admin', path: '/admin', icon: ShieldCheck },
  ]

  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      {/* Barra superior visible exclusivamente en móviles */}
      <header className="mobile-topbar" role="banner">
        <Link to="/" className="brand-link" onClick={closeSidebar}>
          <CarFront className="brand-icon" size={24} aria-hidden="true" />
          <span className="brand-text">AutoGestión Concesionario</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isOpen}
          aria-controls="sidebar-navigation"
          aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          onClick={toggleSidebar}
        >
          {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </header>

      {/* Backdrop overlay para pantallas pequeñas */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Barra lateral principal */}
      <aside
        id="sidebar-navigation"
        className={`app-sidebar ${isOpen ? 'is-open' : ''}`}
        aria-label="Barra lateral de navegación"
      >
        {/* Cabecera del Sidebar con Nombre / Logo */}
        <div className="sidebar-header">
          <Link to="/" className="brand-link" onClick={closeSidebar}>
            <CarFront className="brand-icon" size={26} aria-hidden="true" />
            <div className="brand-info">
              <span className="brand-text">AutoGestión</span>
              <span className="brand-subtitle">Concesionario</span>
            </div>
          </Link>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Cerrar barra lateral"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Navegación por Módulos */}
        <nav className="sidebar-nav" role="navigation" aria-label="Navegación principal">
          <div className="nav-section">
            <span className="nav-section-title">Módulos</span>
            <ul className="sidebar-nav-list">
              {navLinks.map((item) => {
                const IconComponent = item.icon
                const active = isLinkActive(item.path)
                return (
                  <li key={item.path} className="sidebar-nav-item">
                    <Link
                      to={item.path}
                      className={`sidebar-nav-link ${active ? 'is-active' : ''}`}
                      aria-current={active ? 'page' : undefined}
                      onClick={closeSidebar}
                    >
                      <IconComponent className="sidebar-nav-icon" size={18} aria-hidden="true" />
                      <span className="sidebar-nav-text">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {isAdmin && (
            <div className="nav-section">
              <span className="nav-section-title">Administración</span>
              <ul className="sidebar-nav-list">
                {adminLinks.map((item) => {
                  const IconComponent = item.icon
                  const active = isLinkActive(item.path)
                  return (
                    <li key={item.path} className="sidebar-nav-item">
                      <Link
                        to={item.path}
                        className={`sidebar-nav-link ${active ? 'is-active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                        onClick={closeSidebar}
                      >
                        <IconComponent className="sidebar-nav-icon" size={18} aria-hidden="true" />
                        <span className="sidebar-nav-text">{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </nav>

        {/* Pie del Sidebar: Información de Usuario y Cierre de Sesión */}
        <div className="sidebar-footer">
          {isAuthenticated && user ? (
            <div className="sidebar-auth-box">
              <div className="user-pill" aria-label={`Usuario: ${user.name}`}>
                <div className="user-avatar" aria-hidden="true">
                  <UserIcon size={16} />
                </div>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="status-pill badge-disponible user-role">{user.role}</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-logout"
                onClick={handleLogout}
                aria-label="Cerrar sesión"
              >
                <LogOut size={16} aria-hidden="true" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          ) : (
            <div className="sidebar-auth-box">
              <Link
                to="/login"
                className={`btn btn-primary btn-block nav-login-btn ${
                  location.pathname === '/login' ? 'is-active' : ''
                }`}
                onClick={closeSidebar}
              >
                <LogIn size={18} aria-hidden="true" style={{ marginRight: '0.4rem' }} />
                <span>Iniciar Sesión</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
