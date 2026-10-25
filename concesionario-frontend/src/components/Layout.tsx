import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'

export const Layout: React.FC = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main-area">
        <main id="main-content" className="main-content" tabIndex={-1}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
