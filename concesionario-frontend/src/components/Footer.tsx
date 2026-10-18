import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        <p className="footer-title">Lenguaje de Programación Web II — Trabajo 2</p>
        <p className="footer-subtitle">
          Sistema de Gestión para Concesionario de Vehículos • React + Vite + TypeScript
        </p>
        <p className="footer-copy">
          Diseñado cumpliendo buenas prácticas de accesibilidad (WCAG 2.2 Nivel AA) y consumo seguro de API REST.
        </p>
      </div>
    </footer>
  )
}
