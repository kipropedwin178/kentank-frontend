import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import './AdminLayout.css'


function AdminLayout() {
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(false)


  const closeSidebar = () => {
    setSidebarOpen(false)
  }


  const handleLogout = () => {
    localStorage.removeItem(
      'kentank_admin_token'
    )

    localStorage.removeItem(
      'kentank_admin_token_type'
    )

    navigate(
      '/kentankd/login',
      { replace: true }
    )
  }


  return (
    <div className="kentank-admin-layout">

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="kentank-admin-overlay"
          onClick={closeSidebar}
        />
      )}


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={
          sidebarOpen
            ? 'kentank-admin-sidebar open'
            : 'kentank-admin-sidebar'
        }
      >

        {/* BRAND */}

        <div className="kentank-admin-sidebar-brand">

          <div className="kentank-admin-sidebar-logo">
            K
          </div>

          <div>

            <strong>
              Kentank
            </strong>

            <span>
              Administration
            </span>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="kentank-admin-navigation">

          <span className="kentank-admin-nav-label">
            MAIN MENU
          </span>


          <NavLink
            to="/kentankd/dashboard"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive
                ? 'kentank-admin-nav-link active'
                : 'kentank-admin-nav-link'
            }
          >

            <span className="kentank-admin-nav-icon">
              D
            </span>

            <span>
              Dashboard
            </span>

          </NavLink>


          <NavLink
            to="/kentankd/tanks"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive
                ? 'kentank-admin-nav-link active'
                : 'kentank-admin-nav-link'
            }
          >

            <span className="kentank-admin-nav-icon">
              T
            </span>

            <span>
              Tank Management
            </span>

          </NavLink>


          <NavLink
            to="/kentankd/contact"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive
                ? 'kentank-admin-nav-link active'
                : 'kentank-admin-nav-link'
            }
          >

            <span className="kentank-admin-nav-icon">
              C
            </span>

            <span>
              Contact Information
            </span>

          </NavLink>

        </nav>


        {/* SIDEBAR FOOTER */}

        <div className="kentank-admin-sidebar-footer">

          <button
            type="button"
            className="kentank-admin-logout-button"
            onClick={handleLogout}
          >

            <span className="kentank-admin-nav-icon">
              →
            </span>

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div className="kentank-admin-main">

        {/* TOP BAR */}

        <header className="kentank-admin-topbar">

          <button
            type="button"
            className="kentank-admin-menu-button"
            onClick={() =>
              setSidebarOpen(
                (previousValue) =>
                  !previousValue
              )
            }
            aria-label="Open admin menu"
          >
            ☰
          </button>


          <div className="kentank-admin-topbar-title">

            <strong>
              Kentank Deliveries
            </strong>

            <span>
              Administration Portal
            </span>

          </div>


          <div className="kentank-admin-topbar-status">

            <span />

            Online

          </div>

        </header>


        {/* PAGE CONTENT */}

        <main className="kentank-admin-content">

          <Outlet />

        </main>

      </div>

    </div>
  )
}


export default AdminLayout