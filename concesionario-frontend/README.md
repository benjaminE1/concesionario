# Frontend — Concesionario de Vehículos (Trabajo 2)

Frontend moderno desarrollado en **React + Vite + TypeScript** para el sistema de gestión de concesionario de vehículos, consumiendo una API REST existente en **ASP.NET Core Web API**.

## 🚀 Tecnologías

- **Framework**: React 19 + TypeScript
- **Empaquetador y Dev Server**: Vite 8
- **Enrutamiento**: React Router 7 con protección de rutas (`<ProtectedRoute>`, `<RoleRoute>`)
- **Autenticación**: JWT con decodificación de claims y persistencia segura en sesión
- **Cliente HTTP**: Axios con interceptores personalizados (manejo de `204 No Content`, texto plano, JSON y emisión de eventos 401)
- **CRUD de Vehículos**: Listado con filtros en vivo, ficha técnica, formulario modal accesible para creación y edición, y diálogo de confirmación para eliminación.
- **Testing**: Vitest + React Testing Library + @testing-library/jest-dom + jsdom
- **Linter**: Oxlint
- **Accesibilidad**: Estructura semántica HTML5 y ratios de contraste WCAG 2.2 nivel AA

---

## 📋 Requisitos Previos

- **Node.js**: v20 o superior (recomendado v24.x)
- **npm**: v10 o superior (recomendado v11.x)
- **Backend ASP.NET Core**: ejecutándose en `http://localhost:5145`

---

## 🛠️ Instalación y Configuración

1. Ingresar a la carpeta del frontend:
   ```bash
   cd concesionario-frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Copiar el archivo de plantilla `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
   > **Nota:** La variable `VITE_API_BASE_URL=/api` aprovecha el proxy inverso configurado en Vite (`vite.config.ts`), el cual redirige internamente las llamadas a `http://localhost:5145` para evitar bloqueos por CORS durante el desarrollo.

---

## ▶️ Ejecución en Desarrollo

Iniciar el servidor local con Vite:
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

---

## 🧪 Pruebas Unitarias y de Componentes

Ejecutar la suite completa de pruebas unitarias y de componentes con Vitest:
```bash
npm test
```
Incluye 18 pruebas automatizadas:
- Decodificación y validación de expiración de JWT (`jwt.test.ts`).
- Validación de formulario accesible y submit en Login (`LoginPage.test.tsx`).
- Redirección y control de acceso por roles (`RouteProtection.test.tsx`).
- Ciclo completo CRUD de Vehículos y permisos de rol Admin (`VehiculosCrud.test.tsx`).

### Pruebas End-to-End (E2E) con Playwright

Ejecutar la prueba de integración y navegación completa en navegador real (Chromium):
```bash
npm run test:e2e
```

**Flujo automatizado cubierto (`tests/e2e/vehiculos-flow.spec.ts`):**
1. Abrir la aplicación y verificar carga del encabezado.
2. Navegar a Iniciar Sesión e ingresar con credenciales de administrador leídas de variables de entorno seguras (`TEST_USER_EMAIL` y `TEST_USER_PASSWORD`).
3. Comprobar inicio de sesión exitoso y acceso al catálogo de Vehículos.
4. Abrir modal "➕ Nuevo Vehículo" y registrar un vehículo con patente aleatoria única (evitando colisiones en la BD).
5. Comprobar mensaje de confirmación y presencia del nuevo registro en la tabla de datos.
6. Cerrar sesión y verificar que el botón de creación ya no es accesible.

**Configuración de variables de entorno para E2E:**
Las credenciales deben ubicarse en `.env` (ignorado por Git):
```ini
TEST_USER_EMAIL=admin@gmail.com
TEST_USER_PASSWORD=123
```
*Si necesitas reinstalar el navegador de Playwright:*
```bash
npx playwright install chromium
```

---

## 🔍 Comprobaciones y Construcción

- **Verificación de código y linter:**
  ```bash
  npm run lint
  ```

- **Compilación de producción y chequeo de tipos TypeScript:**
  ```bash
  npm run build
  ```

- **Previsualizar la compilación de producción:**
  ```bash
  npm run preview
  ```

---

## 🔐 Credenciales de Prueba (Rol Admin)

- **Email**: `admin@gmail.com`
- **Contraseña**: `123`
- **Rol en base de datos**: `Admin` (ID de usuario: 2)
- **Ruta protegida**: `/admin` (requiere autenticación con rol Admin)
- **Permisos CRUD**: La creación, edición y eliminación de vehículos en `/vehiculos` requiere rol `Admin`.

---

## 📂 Estructura del Proyecto

```text
concesionario-frontend/
├── src/
│   ├── api/             # Cliente HTTP Axios, servicios y conectividad
│   │   ├── authService.ts
│   │   ├── client.ts
│   │   └── vehiculosService.ts
│   ├── components/      # Componentes de UI accesibles, Modales y Guards
│   │   ├── ConfirmDeleteModal.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── RoleRoute.tsx
│   │   ├── VehiculoDetailModal.tsx
│   │   └── VehiculoFormModal.tsx
│   ├── context/         # Estado global de autenticación
│   │   ├── AuthContext.tsx
│   │   ├── authContextDef.ts
│   │   └── useAuth.ts
│   ├── pages/           # Vistas
│   │   ├── AdminPanelPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── UnauthorizedPage.tsx
│   │   └── VehiculosPage.tsx
│   ├── test/            # Suite de pruebas unitarias/componentes con Vitest (18 tests)
│   │   ├── jwt.test.ts
│   │   ├── LoginPage.test.tsx
│   │   ├── RouteProtection.test.tsx
│   │   ├── setup.ts
│   │   └── VehiculosCrud.test.tsx
│   ├── types/           # Interfaces TypeScript sincronizadas con el backend
│   │   └── index.ts
│   ├── utils/           # Decodificador de JWT y expiración
│   │   └── jwt.ts
│   ├── App.tsx          # Configuración de rutas públicas y privadas
│   ├── index.css        # Sistema de diseño accesible (WCAG 2.2 AA) y responsivo
│   └── main.tsx         # Punto de entrada
├── tests/
│   └── e2e/             # Pruebas End-to-End con Playwright
│       └── vehiculos-flow.spec.ts
├── .env.example         # Plantilla de variables de entorno (sin secretos)
├── .gitignore           # Exclusiones de Git (protege .env y reportes Playwright)
├── package.json         # Scripts 'test' y 'test:e2e'
├── playwright.config.ts # Configuración de Playwright E2E
├── tsconfig.json
└── vite.config.ts       # Configuración de proxy y Vitest
```

