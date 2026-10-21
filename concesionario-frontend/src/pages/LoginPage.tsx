import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { LockKeyhole, Lightbulb, ArrowLeft, LogIn } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, error: authError, clearError, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Ruta previa a la que el usuario intentó acceder antes del login
  const fromLocation =
    (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Si ya está autenticado, redirigir automáticamente
  useEffect(() => {
    if (isAuthenticated) {
      navigate(fromLocation, { replace: true })
    }
  }, [isAuthenticated, navigate, fromLocation])

  // Limpiar errores previos al montar o escribir
  useEffect(() => {
    clearError()
  }, [clearError])

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {}

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      errors.email = 'El correo electrónico es requerido.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Ingresa un formato de correo electrónico válido (ej: usuario@dominio.com).'
    }

    if (!password) {
      errors.password = 'La contraseña es requerida.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await login({ email: email.trim(), password })
      navigate(fromLocation, { replace: true })
    } catch {
      // El error se gestiona y expone a través de AuthContext
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card" role="region" aria-labelledby="login-heading">
        <header className="login-header">
          <div className="login-icon" aria-hidden="true">
            <LockKeyhole size={40} className="login-icon-lucide" />
          </div>
          <h1 id="login-heading" className="login-title">
            Iniciar Sesión
          </h1>
          <p className="login-subtitle">
            Ingresa tus credenciales para acceder a los módulos de gestión.
          </p>
        </header>

        {/* Notificación de error global */}
        {authError && (
          <div className="alert alert-danger" role="alert" aria-live="assertive">
            <p className="alert-heading">No fue posible iniciar sesión</p>
            <p className="alert-text">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="login-form">
          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Correo Electrónico <span aria-hidden="true">*</span>
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }))
                }
              }}
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              disabled={isSubmitting || loading}
            />
            {fieldErrors.email && (
              <p id="email-error" className="field-error" role="alert">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="form-group">
            <label htmlFor="login-password" className="form-label">
              Contraseña <span aria-hidden="true">*</span>
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }))
                }
              }}
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              disabled={isSubmitting || loading}
            />
            {fieldErrors.password && (
              <p id="password-error" className="field-error" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting || loading}
            aria-busy={isSubmitting || loading}
          >
            <LogIn size={18} aria-hidden="true" style={{ marginRight: '0.5rem' }} />
            <span>{isSubmitting || loading ? 'Verificando...' : 'Acceder al Sistema'}</span>
          </button>
        </form>

        {/* Tarjeta de ayuda con credenciales de acceso */}
        <aside className="login-help" aria-label="Credenciales de acceso">
          <p className="help-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Lightbulb size={18} aria-hidden="true" style={{ color: '#f59e0b', flexShrink: 0 }} />
            <span>Credenciales de demostración:</span>
          </p>
          <div className="help-box">
            <p>
              <strong>Email:</strong> <code>admin@gmail.com</code>
            </p>
            <p>
              <strong>Contraseña:</strong> <code>123</code>
            </p>
          </div>
        </aside>

        <div className="login-footer">
          <Link to="/" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Volver a la página principal</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
