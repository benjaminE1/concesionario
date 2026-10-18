# Frontend — Concesionario de Vehículos (Trabajo 2)

Frontend moderno desarrollado en **React + Vite + TypeScript** para el sistema de gestión de concesionario de vehículos, consumiendo una API REST existente en **ASP.NET Core**.

## 🚀 Tecnologías

- **Framework**: React 19 + TypeScript
- **Empaquetador y Dev Server**: Vite 8
- **Enrutamiento**: React Router 7
- **Cliente HTTP**: Axios con interceptores personalizados (manejo de `204 No Content`, texto plano y JSON)
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

## 📂 Estructura del Proyecto

```text
concesionario-frontend/
├── src/
│   ├── api/             # Cliente HTTP Axios, interceptores y chequeo de conectividad
│   │   └── client.ts
│   ├── components/      # Componentes de UI accesibles (Navbar, Footer, Layout)
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   └── Navbar.tsx
│   ├── pages/           # Vistas (HomePage, NotFoundPage)
│   │   ├── HomePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── types/           # Interfaces TypeScript sincronizadas con el backend
│   │   └── index.ts
│   ├── App.tsx          # Configuración de rutas
│   ├── index.css        # Sistema de diseño accesible (WCAG 2.2 AA) y responsivo
│   └── main.tsx         # Punto de entrada
├── .env.example         # Plantilla de variables de entorno
├── .gitignore           # Exclusiones de Git (protege .env)
├── package.json
├── tsconfig.json
└── vite.config.ts       # Configuración de proxy a http://localhost:5145
```
