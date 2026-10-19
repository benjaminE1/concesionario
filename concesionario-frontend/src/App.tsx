import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { VehiculosPage } from './pages/VehiculosPage'
import { LoginPage } from './pages/LoginPage'
import { AdminPanelPage } from './pages/AdminPanelPage'
import { UnauthorizedPage } from './pages/UnauthorizedPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleRoute } from './components/RoleRoute'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Rutas Públicas */}
            <Route index element={<HomePage />} />
            <Route path="vehiculos" element={<VehiculosPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />

            {/* Rutas Protegidas para Usuarios Autenticados */}
            <Route element={<ProtectedRoute />}>
              {/* Rutas con Restricción de Rol Admin */}
              <Route element={<RoleRoute allowedRoles={['Admin']} />}>
                <Route path="admin" element={<AdminPanelPage />} />
              </Route>
            </Route>

            {/* Ruta 404 No Encontrada */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
