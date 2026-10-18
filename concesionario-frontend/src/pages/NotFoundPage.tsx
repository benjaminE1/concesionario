import React from 'react'
import { Link } from 'react-router-dom'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-container" role="region" aria-labelledby="not-found-title">
      <h1 id="not-found-title" className="not-found-code">
        404
      </h1>
      <h2 className="not-found-heading">Página no encontrada</h2>
      <p className="not-found-text">
        La ruta a la que intentas acceder no existe o fue trasladada.
      </p>
      <Link to="/" className="btn btn-primary">
        Volver al Inicio
      </Link>
    </div>
  )
}
