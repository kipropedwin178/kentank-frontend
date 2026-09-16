import { useRef } from 'react'
import { Link } from 'react-router-dom'

import './Navbar.css'

function Navbar() {
  const navbarCollapseRef = useRef(null)

  const closeNavbar = () => {
    const collapseElement = navbarCollapseRef.current

    if (!collapseElement) {
      return
    }

    if (collapseElement.classList.contains('show')) {
      const collapseInstance =
        window.bootstrap?.Collapse.getInstance(collapseElement)

      if (collapseInstance) {
        collapseInstance.hide()
      } else {
        collapseElement.classList.remove('show')
      }
    }
  }

  return (
    <nav className="navbar navbar-expand-lg kentank-navbar">
      <div className="container">

        <Link
          className="kentank-navbar-brand"
          to="/"
          onClick={closeNavbar}
          aria-label="Kentank Deliveries Home"
        >
          <img
            src="/logo.png"
            alt="Kentank Deliveries"
            className="kentank-logo"
          />
        </Link>

        <button
          className="navbar-toggler ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          ref={navbarCollapseRef}
          className="collapse navbar-collapse"
          id="mainNavbar"
        >
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                onClick={closeNavbar}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/products"
                onClick={closeNavbar}
              >
                Products
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/about"
                onClick={closeNavbar}
              >
                About Us
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/contact"
                onClick={closeNavbar}
              >
                Contact Us
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  )
}

export default Navbar