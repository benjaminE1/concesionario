import React from 'react'

const currentYear = new Date().getFullYear()

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        <p className="footer-title">AutoGestión Concesionario</p>
        <p className="footer-subtitle">
          Sistema Integral de Gestión y Control Automotriz
        </p>
        <p className="footer-copy">
          © {currentYear} AutoGestión Concesionario. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
