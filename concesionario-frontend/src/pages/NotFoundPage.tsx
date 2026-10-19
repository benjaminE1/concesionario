import React from 'react'
import { Link } from 'react-router-dom'
import { FileQuestion, ArrowLeft } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-container" role="region" aria-labelledby="not-found-title">
      <FileQuestion size={64} color="#60a5fa" aria-hidden="true" style={{ margin: '0 auto 1rem', display: 'block' }} />
      <h1 id="not-found-title" className="not-found-code">
        404
      </h1>
      <h2 className="not-found-heading">Página no encontrada</h2>
      <p className="not-found-text">
        La ruta a la que intentas acceder no existe o fue trasladada.
      </p>
      <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <ArrowLeft size={16} aria-hidden="true" />
        <span>Volver al Inicio</span>
      </Link>
    </div>
  )
}
