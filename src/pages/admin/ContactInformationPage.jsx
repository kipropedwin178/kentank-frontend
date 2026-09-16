import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../../api/axios'

import './ContactInformationPage.css'


function ContactInformationPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    call_number: '',
    whatsapp_number: '',
    email: '',
    physical_address: '',
    business_hours: '',
  })

  const [contactExists, setContactExists] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


  const getAuthConfig = () => {
    const token = localStorage.getItem(
      'kentank_admin_token'
    )

    const tokenType =
      localStorage.getItem(
        'kentank_admin_token_type'
      ) || 'bearer'

    return {
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
    }
  }


  const handleUnauthorized = () => {
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


  const fetchContactInformation = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get(
        '/kentankd/contacts',
        getAuthConfig()
      )

      if (response.data) {
        setFormData({
          call_number:
            response.data.call_number || '',

          whatsapp_number:
            response.data.whatsapp_number || '',

          email:
            response.data.email || '',

          physical_address:
            response.data.physical_address || '',

          business_hours:
            response.data.business_hours || '',
        })

        setContactExists(true)

        // Existing information should remain
        // collapsed when the page is opened.
        setFormOpen(false)

      } else {
        setContactExists(false)

        // If no information exists yet,
        // keep the form open for configuration.
        setFormOpen(true)
      }

    } catch (err) {
      console.error(
        'Failed to load contact information:',
        err
      )

      if (err.response?.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        'Unable to load contact information. Please try again.'
      )

    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchContactInformation()
  }, [])


  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))

    if (error) {
      setError('')
    }

    if (success) {
      setSuccess('')
    }
  }


  const handleEdit = () => {
    setFormOpen(true)
    setError('')
    setSuccess('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  const handleCloseForm = () => {
    if (saving) {
      return
    }

    setFormOpen(false)
    setError('')
    setSuccess('')
  }


  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')
    setSaving(true)

    const wasUpdating = contactExists

    try {
      let response

      if (contactExists) {
        response = await api.put(
          '/kentankd/contacts',
          formData,
          getAuthConfig()
        )
      } else {
        response = await api.post(
          '/kentankd/contacts',
          formData,
          getAuthConfig()
        )
      }

      const contact = response.data

      setFormData({
        call_number:
          contact.call_number || '',

        whatsapp_number:
          contact.whatsapp_number || '',

        email:
          contact.email || '',

        physical_address:
          contact.physical_address || '',

        business_hours:
          contact.business_hours || '',
      })

      setContactExists(true)

      setSuccess(
        wasUpdating
          ? 'Contact information updated successfully.'
          : 'Contact information created successfully.'
      )

      // Collapse only after the save
      // has completed successfully.
      setFormOpen(false)

    } catch (err) {
      console.error(
        'Failed to save contact information:',
        err
      )

      if (err.response?.status === 401) {
        handleUnauthorized()
        return
      }

      if (err.response?.status === 409) {
        setError(
          'Contact information already exists. Please refresh the page and update it instead.'
        )
      } else if (err.response?.status === 422) {
        setError(
          'Please check the information you entered and try again.'
        )
      } else {
        setError(
          'Unable to save contact information. Please try again.'
        )
      }

    } finally {
      setSaving(false)
    }
  }


  if (loading) {
    return (
      <div className="kentank-contact-page">
        <div className="contact-loading-state">
          <div className="contact-spinner"></div>

          <p>
            Loading contact information...
          </p>
        </div>
      </div>
    )
  }


  return (
    <div className="kentank-contact-page">

      <div className="contact-page-header">

        <div>
          <span className="admin-section-label">
            WEBSITE SETTINGS
          </span>

          <h1>
            Contact Information
          </h1>

          <p>
            Manage the contact details displayed
            throughout the Kentank Deliveries website.
          </p>
        </div>

      </div>


      {error && (
        <div className="contact-alert contact-alert-error">
          <span className="contact-alert-icon">
            !
          </span>

          <span>
            {error}
          </span>
        </div>
      )}


      {success && (
        <div className="contact-alert contact-alert-success">
          <span className="contact-alert-icon">
            ✓
          </span>

          <span>
            {success}
          </span>
        </div>
      )}


      <div className="contact-content-grid">

        <section className="contact-form-card">

          <div className="contact-card-header">

            <div>
              <h2>
                Business Contact Details
              </h2>

              <p>
                These details will be available to
                visitors on the public website.
              </p>
            </div>


            <div className="contact-status-badge">
              <span></span>

              {contactExists
                ? 'Configured'
                : 'Not Configured'}
            </div>

          </div>


          {!formOpen && contactExists ? (
            <div className="contact-collapsed-content">

              <div className="contact-collapsed-message">

                <div className="contact-info-icon">
                  ✓
                </div>

                <div>
                  <h3>
                    Contact information is configured
                  </h3>

                  <p>
                    Your current business contact
                    information is saved and active
                    on the website.
                  </p>
                </div>

              </div>


              <button
                type="button"
                className="contact-save-button"
                onClick={handleEdit}
              >
                Edit Contact Information
              </button>

            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >

              <div className="contact-form-grid">

                <div className="contact-form-group">

                  <label htmlFor="call_number">
                    Phone Number
                  </label>

                  <input
                    id="call_number"
                    name="call_number"
                    type="tel"
                    value={formData.call_number}
                    onChange={handleChange}
                    placeholder="+254 7XX XXX XXX"
                    required
                    disabled={saving}
                  />

                  <small>
                    Number customers should use for
                    direct calls.
                  </small>

                </div>


                <div className="contact-form-group">

                  <label htmlFor="whatsapp_number">
                    WhatsApp Number
                  </label>

                  <input
                    id="whatsapp_number"
                    name="whatsapp_number"
                    type="tel"
                    value={formData.whatsapp_number}
                    onChange={handleChange}
                    placeholder="+254 7XX XXX XXX"
                    required
                    disabled={saving}
                  />

                  <small>
                    Number customers should use to
                    contact you through WhatsApp.
                  </small>

                </div>


                <div className="contact-form-group">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="info@example.com"
                    required
                    disabled={saving}
                  />

                  <small>
                    Business email address for customer
                    inquiries.
                  </small>

                </div>


                <div className="contact-form-group">

                  <label htmlFor="business_hours">
                    Business Hours
                  </label>

                  <input
                    id="business_hours"
                    name="business_hours"
                    type="text"
                    value={formData.business_hours}
                    onChange={handleChange}
                    placeholder="Mon - Sat: 8:00 AM - 6:00 PM"
                    required
                    disabled={saving}
                  />

                  <small>
                    Example: Mon - Sat: 8:00 AM - 6:00 PM
                  </small>

                </div>


                <div className="contact-form-group contact-form-full">

                  <label htmlFor="physical_address">
                    Physical Address
                  </label>

                  <textarea
                    id="physical_address"
                    name="physical_address"
                    value={formData.physical_address}
                    onChange={handleChange}
                    placeholder="Enter the physical location of your business"
                    rows="4"
                    disabled={saving}
                  />

                  <small>
                    Optional. This will be displayed on
                    the public Contact Us page.
                  </small>

                </div>

              </div>


              <div className="contact-form-actions">

                <button
                  type="submit"
                  className="contact-save-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="contact-button-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      {contactExists
                        ? 'Update Contact Information'
                        : 'Save Contact Information'}
                    </>
                  )}
                </button>


                {contactExists && (
                  <button
                    type="button"
                    className="contact-save-button"
                    onClick={handleCloseForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>
          )}

        </section>


        <aside className="contact-info-card">

          <div className="contact-info-icon">
            ☎
          </div>

          <h2>
            Public Contact Details
          </h2>

          <p>
            The information you enter here will be
            used by the public website so visitors
            can easily contact Kentank Deliveries.
          </p>


          <div className="contact-info-list">

            <div className="contact-info-item">
              <span>📞</span>

              <div>
                <strong>
                  Phone
                </strong>

                <p>
                  {formData.call_number || 'Not configured'}
                </p>
              </div>
            </div>


            <div className="contact-info-item">
              <span>💬</span>

              <div>
                <strong>
                  WhatsApp
                </strong>

                <p>
                  {formData.whatsapp_number || 'Not configured'}
                </p>
              </div>
            </div>


            <div className="contact-info-item">
              <span>✉</span>

              <div>
                <strong>
                  Email
                </strong>

                <p>
                  {formData.email || 'Not configured'}
                </p>
              </div>
            </div>


            <div className="contact-info-item">
              <span>📍</span>

              <div>
                <strong>
                  Address
                </strong>

                <p>
                  {formData.physical_address || 'Not configured'}
                </p>
              </div>
            </div>


            <div className="contact-info-item">
              <span>🕒</span>

              <div>
                <strong>
                  Business Hours
                </strong>

                <p>
                  {formData.business_hours || 'Not configured'}
                </p>
              </div>
            </div>

          </div>

        </aside>

      </div>

    </div>
  )
}


export default ContactInformationPage