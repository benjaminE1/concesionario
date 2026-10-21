import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
  pageSize?: number
}

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = [1]

  if (currentPage > 3) {
    pages.push('...')
  }

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (currentPage < totalPages - 2) {
    pages.push('...')
  }

  pages.push(totalPages)
  return pages
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
}) => {
  if (totalItems <= 0) return null

  const startRecord = (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, totalItems)
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <nav
      className="pagination-nav"
      role="navigation"
      aria-label="Paginación de resultados"
    >
      <div className="pagination-info">
        <span>
          Mostrando <strong>{startRecord}</strong>–<strong>{endRecord}</strong> de{' '}
          <strong>{totalItems}</strong> registros
        </span>
        <span className="pagination-page-indicator">
          (Pág. {currentPage} de {totalPages})
        </span>
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="btn-pagination"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Ir a la página anterior"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span>Anterior</span>
        </button>

        <div className="pagination-numbers" role="group" aria-label="Números de página">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis" aria-hidden="true">
                  …
                </span>
              )
            }

            const pageNum = Number(page)
            const isActive = pageNum === currentPage

            return (
              <button
                key={pageNum}
                type="button"
                className={`btn-page-number ${isActive ? 'is-active' : ''}`}
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Página ${pageNum}`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className="btn-pagination"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Ir a la página siguiente"
        >
          <span>Siguiente</span>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
