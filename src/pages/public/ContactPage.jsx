import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../../api/axios'

import './ContactPage.css'


function ContactPage() {
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    const fetchContactInformation = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/contact')

        setContact(response.data)

      } catch (err) {
        console.error(
          'Failed to load contact information:',
          err
        )

        setError(
          'Unable to load our contact information right now. Please try again later.'
        )

      } finally {
        setLoading(false)
      }
    }

    fetchContactInformation()
  }, [])


  if (loading) {
    return (
      <div className="kentank-contact-page">

        <section className="kentank-contact-loading-section">

          <div className="container">

            <div className="kentank-contact-loading">

              <div
                className="spinner-border"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p>
                Loading contact information...
              </p>

            </div>

          </div>

        </section>

      </div>
    )
  }


  if (error || !contact) {
    return (
      <div className="kentank-contact-page">

        <section className="kentank-contact-error-section">

          <div className="container">

            <div className="kentank-contact-error">

              <div className="kentank-contact-error-icon">
                !
              </div>

              <h1>
                Contact Information Unavailable
              </h1>

              <p>
                {error ||
                  'Our contact information is currently unavailable.'}
              </p>

              <Link
                to="/"
                className="kentank-contact-back-btn"
              >
                Back to Home
              </Link>

            </div>

          </div>

        </section>

      </div>
    )
  }


  const whatsappNumber = contact.whatsapp_number
    ? contact.whatsapp_number.replace(/\D/g, '')
    : ''


  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : null


  const phoneUrl = contact.call_number
    ? `tel:${contact.call_number}`
    : null


  const emailUrl = contact.email
    ? `mailto:${contact.email}`
    : null


  return (
    <div className="kentank-contact-page">

      {/* PAGE HERO */}

      <section className="kentank-contact-hero">

        <div className="container">

          <div className="kentank-contact-hero-content">

            <span className="kentank-contact-label">
              Get In Touch
            </span>

            <h1>
              Contact Kentank Deliveries
            </h1>

            <p>
              Have a question about our water tanks?
              Contact us directly and we'll be happy
              to assist you.
            </p>

          </div>

        </div>

      </section>


      {/* CONTACT INFORMATION */}

      <section className="kentank-contact-section">

        <div className="container">

          <div className="row g-4">


            {/* CALL */}

            <div className="col-md-6 col-lg-3">

              <div className="kentank-contact-card">

                <div className="kentank-contact-icon">
                  ☎
                </div>

                <h2>
                  Call Us
                </h2>

                {phoneUrl ? (
                  <a
                    href={phoneUrl}
                    className="kentank-contact-value"
                  >
                    {contact.call_number}
                  </a>
                ) : (
                  <p className="kentank-contact-unavailable">
                    Phone number unavailable
                  </p>
                )}

                <p>
                  Speak directly with our team.
                </p>

              </div>

            </div>


            {/* WHATSAPP */}

            <div className="col-md-6 col-lg-3">

              <div className="kentank-contact-card">

                <div className="kentank-contact-icon">
                  💬
                </div>

                <h2>
                  WhatsApp
                </h2>

                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kentank-contact-value"
                  >
                    {contact.whatsapp_number}
                  </a>
                ) : (
                  <p className="kentank-contact-unavailable">
                    WhatsApp unavailable
                  </p>
                )}

                <p>
                  Chat with us on WhatsApp.
                </p>

              </div>

            </div>


            {/* EMAIL */}

            <div className="col-md-6 col-lg-3">

              <div className="kentank-contact-card">

                <div className="kentank-contact-icon">
                  ✉
                </div>

                <h2>
                  Email
                </h2>

                {emailUrl ? (
                  <a
                    href={emailUrl}
                    className="kentank-contact-value"
                  >
                    {contact.email}
                  </a>
                ) : (
                  <p className="kentank-contact-unavailable">
                    Email unavailable
                  </p>
                )}

                <p>
                  Send us an email anytime.
                </p>

              </div>

            </div>


            {/* BUSINESS HOURS */}

            <div className="col-md-6 col-lg-3">

              <div className="kentank-contact-card">

                <div className="kentank-contact-icon">
                  🕒
                </div>

                <h2>
                  Business Hours
                </h2>

                <strong className="kentank-contact-value">
                  {contact.business_hours}
                </strong>

                <p>
                  We're available during these hours.
                </p>

              </div>

            </div>

          </div>


          {/* LOCATION */}

          <div className="kentank-contact-location">

            <div className="kentank-contact-location-icon">
              📍
            </div>

            <div>

              <span className="kentank-contact-location-label">
                Our Location
              </span>

              <h2>
                Visit Kentank Deliveries
              </h2>

              <p>
                {contact.physical_address ||
                  'Physical address unavailable.'}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="kentank-contact-cta">

        <div className="container">

          <div className="kentank-contact-cta-content">

            <div>

              <span>
                Need a water tank?
              </span>

              <h2>
                We're ready to help you find the right tank.
              </h2>

              <p>
                Explore our available water tanks or contact
                us directly for assistance.
              </p>

            </div>

            <Link
              to="/products"
              className="kentank-contact-products-btn"
            >
              View Our Tanks
            </Link>

          </div>

        </div>

      </section>

    </div>
  )
}


export default ContactPage