import { test, expect } from '@playwright/test'

/**
 * Prueba End-to-End (E2E) - Flujo Principal del Concesionario:
 * 1. Abrir la aplicación en la página de inicio.
 * 2. Iniciar sesión con un usuario Administrador usando variables de entorno seguras.
 * 3. Acceder al módulo de Vehículos y comprobar carga del catálogo.
 * 4. Registrar un nuevo vehículo con datos válidos e identificador único.
 * 5. Verificar que el vehículo recién creado aparece en el listado/tabla.
 * 6. Cerrar sesión y verificar que el estado de autenticación se restablece.
 */

const testEmail = process.env.TEST_USER_EMAIL || ''
const testPassword = process.env.TEST_USER_PASSWORD || ''

test.describe('Flujo E2E: Autenticación, Catálogo y Creación de Vehículo', () => {
  test.beforeAll(() => {
    if (!testEmail || !testPassword) {
      throw new Error(
        'Las variables TEST_USER_EMAIL y TEST_USER_PASSWORD deben estar configuradas en .env o en el entorno para ejecutar las pruebas E2E.',
      )
    }
  })

  test('debe permitir autenticarse como Admin, crear un vehículo único, verificarlo en la tabla y cerrar sesión', async ({
    page,
  }) => {
    // Generar identificador aleatorio único para evitar colisiones de patentes en la base de datos
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString()
    const uniquePatente = `PW${randomSuffix}`
    const uniqueModelo = `Corolla E2E ${randomSuffix}`
    const testAnio = '2024'
    const testPrecio = '14500000'

    // 1. Abrir la aplicación
    await page.goto('/')
    await expect(page).toHaveTitle(/AutoGestión/i)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // 2. Iniciar sesión desde la barra de navegación
    await page.getByRole('link', { name: 'Iniciar Sesión' }).click()
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible()

    // Completar formulario de login con credenciales seguras
    await page.getByLabel(/Correo Electrónico/i).fill(testEmail)
    await page.getByLabel(/Contraseña/i).fill(testPassword)
    await page.getByRole('button', { name: /Acceder al Sistema/i }).click()

    // Verificar que el inicio de sesión fue exitoso (se muestra la píldora de usuario en el navbar)
    const userPill = page.locator('.user-pill')
    await expect(userPill).toBeVisible({ timeout: 10000 })
    await expect(userPill).toContainText('Admin')

    // 3. Acceder al catálogo de Vehículos
    await page.getByRole('link', { name: 'Vehículos', exact: true }).click()
    await expect(page).toHaveURL(/\/vehiculos/)
    await expect(
      page.getByRole('heading', { name: 'Gestión de Vehículos' }),
    ).toBeVisible()

    // Esperar a que la tabla o datos terminen de cargar
    await expect(page.locator('.loading-state')).not.toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('table')).toBeVisible()

    // 4. Crear un vehículo con datos de prueba válidos
    const nuevoVehiculoBtn = page.getByRole('button', { name: /Nuevo Vehículo/i })
    await expect(nuevoVehiculoBtn).toBeVisible()
    await nuevoVehiculoBtn.click()

    // Modal de creación visible
    const modal = page.getByRole('dialog')
    await expect(modal).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Registrar Nuevo Vehículo' }),
    ).toBeVisible()

    // Rellenar campos del formulario dentro del modal
    await modal.getByLabel(/^Patente/i).fill(uniquePatente)
    await modal.getByLabel(/^Modelo/i).fill(uniqueModelo)
    await modal.getByLabel(/^Año de Fabricación/i).fill(testAnio)
    await modal.getByLabel(/^Precio/i).fill(testPrecio)

    // Enviar formulario de creación
    await modal.getByRole('button', { name: 'Crear Vehículo' }).click()

    // El modal debe cerrarse tras la respuesta exitosa del servidor
    await expect(modal).not.toBeVisible({ timeout: 10000 })

    // 5. Comprobar que el vehículo creado aparece en el listado
    // Feedback de éxito visible
    const feedbackSuccess = page.locator('.alert-success')
    await expect(feedbackSuccess).toBeVisible()
    await expect(feedbackSuccess).toContainText(uniquePatente)

    // Verificar en la tabla de datos la patente y modelo creados (con coincidencia exacta de celda)
    const cellPatente = page.getByRole('cell', { name: uniquePatente, exact: true })
    await expect(cellPatente).toBeVisible()
    const cellModelo = page.getByRole('cell', { name: uniqueModelo, exact: true })
    await expect(cellModelo).toBeVisible()

    // 6. Cerrar sesión
    const logoutBtn = page.getByRole('button', { name: 'Cerrar sesión' })
    await expect(logoutBtn).toBeVisible()
    await logoutBtn.click()

    // Verificar que la sesión se cerró correctamente
    await expect(page.getByRole('link', { name: 'Iniciar Sesión' })).toBeVisible()
    await expect(userPill).not.toBeVisible()

    // Como usuario no autenticado, el botón de crear vehículo ya no debe existir
    await expect(nuevoVehiculoBtn).not.toBeVisible()
  })
})
