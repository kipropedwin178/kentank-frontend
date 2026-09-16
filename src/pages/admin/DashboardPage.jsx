import { useEffect, useState } from 'react'

import api from '../../api/axios'

import './DashboardPage.css'


function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setError('')

        const token = localStorage.getItem(
          'kentank_admin_token'
        )

        const response = await api.get(
          '/kentankd/dashboard',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setDashboard(response.data)

      } catch (err) {
        console.error(
          'Failed to load dashboard:',
          err
        )

        if (err.response?.status === 401) {
          localStorage.removeItem(
            'kentank_admin_token'
          )

          localStorage.removeItem(
            'kentank_admin_token_type'
          )

          window.location.href =
            '/kentankd/login'

          return
        }

        setError(
          'Unable to load dashboard information.'
        )

      } finally {
        setLoading(false)
      }
    }


    fetchDashboard()
  }, [])


  if (loading) {
    return (
      <div className="kentank-dashboard-loading">

        <div
          className="spinner-border"
          role="status"
        />

        <p>
          Loading dashboard...
        </p>

      </div>
    )
  }


  if (error) {
    return (
      <div className="kentank-dashboard-error">

        <div className="kentank-dashboard-error-card">

          <div className="kentank-dashboard-error-icon">
            !
          </div>

          <h2>
            Dashboard Unavailable
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>

        </div>

      </div>
    )
  }


  return (
    <div className="kentank-dashboard-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="kentank-dashboard-header">

        <div>

          <span className="kentank-dashboard-eyebrow">
            ADMINISTRATION
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Welcome to your Kentank Deliveries
            administration portal.
          </p>

        </div>

      </div>


      {/* =================================================
          MAIN STATISTICS
      ================================================= */}

      <div className="kentank-dashboard-stats">

        {/* TOTAL TANKS */}

        <div className="kentank-dashboard-stat-card">

          <div className="kentank-dashboard-stat-icon blue">
            T
          </div>

          <div>

            <span>
              Total Tanks
            </span>

            <strong>
              {dashboard?.total_tanks ?? 0}
            </strong>

          </div>

        </div>


        {/* ACTIVE */}

        <div className="kentank-dashboard-stat-card">

          <div className="kentank-dashboard-stat-icon green">
            ✓
          </div>

          <div>

            <span>
              Active Tanks
            </span>

            <strong>
              {dashboard?.active_tanks ?? 0}
            </strong>

          </div>

        </div>


        {/* INACTIVE */}

        <div className="kentank-dashboard-stat-card">

          <div className="kentank-dashboard-stat-icon red">
            !
          </div>

          <div>

            <span>
              Inactive Tanks
            </span>

            <strong>
              {dashboard?.inactive_tanks ?? 0}
            </strong>

          </div>

        </div>


        {/* IMAGES */}

        <div className="kentank-dashboard-stat-card">

          <div className="kentank-dashboard-stat-icon purple">
            I
          </div>

          <div>

            <span>
              Tank Images
            </span>

            <strong>
              {dashboard?.total_images ?? 0}
            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
          AVAILABILITY
      ================================================= */}

      <section className="kentank-dashboard-section">

        <div className="kentank-dashboard-section-header">

          <div>

            <span>
              INVENTORY
            </span>

            <h2>
              Tank Availability
            </h2>

          </div>

        </div>


        <div className="kentank-dashboard-availability">

          {/* IN STOCK */}

          <div className="kentank-dashboard-availability-card">

            <div className="availability-icon in-stock">
              ✓
            </div>

            <div>

              <span>
                In Stock
              </span>

              <strong>
                {dashboard?.availability?.in_stock ?? 0}
              </strong>

            </div>

          </div>


          {/* LIMITED */}

          <div className="kentank-dashboard-availability-card">

            <div className="availability-icon limited">
              !
            </div>

            <div>

              <span>
                Limited Stock
              </span>

              <strong>
                {dashboard?.availability?.limited_stock ?? 0}
              </strong>

            </div>

          </div>


          {/* OUT OF STOCK */}

          <div className="kentank-dashboard-availability-card">

            <div className="availability-icon out-stock">
              ×
            </div>

            <div>

              <span>
                Out of Stock
              </span>

              <strong>
                {dashboard?.availability?.out_of_stock ?? 0}
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          CONTACT STATUS
      ================================================= */}

      <section className="kentank-dashboard-section">

        <div className="kentank-dashboard-section-header">

          <div>

            <span>
              BUSINESS INFORMATION
            </span>

            <h2>
              Contact Configuration
            </h2>

          </div>

        </div>


        <div className="kentank-dashboard-contact-card">

          <div className="kentank-dashboard-contact-icon">
            @
          </div>

          <div className="kentank-dashboard-contact-content">

            <h3>
              Website Contact Information
            </h3>

            <p>
              Your public website contact information
              is currently{' '}
              <strong>
                {dashboard?.contact_configured
                  ? 'configured'
                  : 'not configured'}
              </strong>.
            </p>

          </div>

          <div
            className={
              dashboard?.contact_configured
                ? 'kentank-dashboard-status configured'
                : 'kentank-dashboard-status not-configured'
            }
          >

            <span />

            {dashboard?.contact_configured
              ? 'Configured'
              : 'Not Configured'}

          </div>

        </div>

      </section>


      {/* =================================================
          QUICK OVERVIEW
      ================================================= */}

      <section className="kentank-dashboard-section">

        <div className="kentank-dashboard-section-header">

          <div>

            <span>
              OVERVIEW
            </span>

            <h2>
              Website Summary
            </h2>

          </div>

        </div>


        <div className="kentank-dashboard-summary">

          <div>

            <span>
              Active Products
            </span>

            <strong>
              {dashboard?.active_tanks ?? 0}
            </strong>

            <small>
              Products currently visible
              to website visitors.
            </small>

          </div>


          <div>

            <span>
              Available Inventory
            </span>

            <strong>
              {dashboard?.availability?.in_stock ?? 0}
            </strong>

            <small>
              Tanks currently marked
              as in stock.
            </small>

          </div>


          <div>

            <span>
              Product Images
            </span>

            <strong>
              {dashboard?.total_images ?? 0}
            </strong>

            <small>
              Images currently stored
              for your tanks.
            </small>

          </div>

        </div>

      </section>

    </div>
  )
}


export default DashboardPage