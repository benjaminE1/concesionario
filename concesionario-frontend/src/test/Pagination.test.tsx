import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from '../components/Pagination'

describe('Componente de Paginación (Pagination.tsx)', () => {
  it('no se renderiza si totalItems es 0', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn()}
        totalItems={0}
        pageSize={10}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('muestra el rango de registros y la página actual correctamente', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={4}
        onPageChange={vi.fn()}
        totalItems={35}
        pageSize={10}
      />,
    )

    // Registros 11 al 20 de 35
    expect(screen.getByText(/11/)).toBeInTheDocument()
    expect(screen.getByText(/20/)).toBeInTheDocument()
    expect(screen.getByText(/35/)).toBeInTheDocument()
    expect(screen.getByText(/Pág\. 2 de 4/i)).toBeInTheDocument()
  })

  it('deshabilita el botón Anterior en la página 1 y permite avanzar con Siguiente', async () => {
    const user = userEvent.setup()
    const onPageChangeMock = vi.fn()

    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={onPageChangeMock}
        totalItems={25}
        pageSize={10}
      />,
    )

    const prevBtn = screen.getByRole('button', { name: /ir a la página anterior/i })
    const nextBtn = screen.getByRole('button', { name: /ir a la página siguiente/i })

    expect(prevBtn).toBeDisabled()
    expect(nextBtn).toBeEnabled()

    await user.click(nextBtn)
    expect(onPageChangeMock).toHaveBeenCalledWith(2)
  })

  it('deshabilita el botón Siguiente en la última página y permite retroceder con Anterior', async () => {
    const user = userEvent.setup()
    const onPageChangeMock = vi.fn()

    render(
      <Pagination
        currentPage={3}
        totalPages={3}
        onPageChange={onPageChangeMock}
        totalItems={25}
        pageSize={10}
      />,
    )

    const prevBtn = screen.getByRole('button', { name: /ir a la página anterior/i })
    const nextBtn = screen.getByRole('button', { name: /ir a la página siguiente/i })

    expect(prevBtn).toBeEnabled()
    expect(nextBtn).toBeDisabled()

    await user.click(prevBtn)
    expect(onPageChangeMock).toHaveBeenCalledWith(2)
  })

  it('permite hacer clic directamente en un número de página', async () => {
    const user = userEvent.setup()
    const onPageChangeMock = vi.fn()

    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={onPageChangeMock}
        totalItems={30}
        pageSize={10}
      />,
    )

    const page2Btn = screen.getByRole('button', { name: 'Página 2' })
    await user.click(page2Btn)
    expect(onPageChangeMock).toHaveBeenCalledWith(2)
  })

  it('marca la página activa con aria-current="page"', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={vi.fn()}
        totalItems={30}
        pageSize={10}
      />,
    )

    const page2Btn = screen.getByRole('button', { name: 'Página 2' })
    expect(page2Btn).toHaveAttribute('aria-current', 'page')
    expect(page2Btn).toHaveClass('is-active')
  })
})
