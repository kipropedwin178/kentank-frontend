import { useRef } from 'react'
import { Link } from 'react-router-dom'

import { useCart } from '../context/CartContext'

import './Navbar.css'


function Navbar() {
  const navbarCollapseRef = useRef(null)

  const { totalItems } = useCart()

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
                className="nav-link kentank-nav-card"
                to="/"
                onClick={closeNavbar}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link kentank-nav-card"
                to="/products"
                onClick={closeNavbar}
              >
                Products
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link kentank-nav-card"
                to="/about"
                onClick={closeNavbar}
              >
                About Us
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link kentank-nav-card"
                to="/contact"
                onClick={closeNavbar}
              >
                Contact Us
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link kentank-nav-card kentank-cart-link"
                to="/cart"
                onClick={closeNavbar}
              >
                <span>🛒 Cart</span>

                {totalItems > 0 && (
                  <span className="kentank-cart-badge">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  )
}

export default Navbar