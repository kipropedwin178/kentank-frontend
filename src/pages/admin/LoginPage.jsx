import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../../api/axios'

import './LoginPage.css'


function LoginPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    phone_number: '',
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))

    if (error) {
      setError('')
    }
  }


  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await api.post(
        '/kentankd/login',
        formData
      )

      const { access_token, token_type } = response.data

      localStorage.setItem(
        'kentank_admin_token',
        access_token
      )

      localStorage.setItem(
        'kentank_admin_token_type',
        token_type || 'bearer'
      )

      navigate('/kentankd/dashboard')

    } catch (err) {
      console.error(
        'Admin login failed:',
        err
      )

      if (err.response?.status === 401) {
        setError(
          'Invalid phone number, email, or password.'
        )
      } else if (err.response?.status === 403) {
        setError(
          'Your admin account is currently inactive.'
        )
      } else if (err.response?.status === 422) {
        setError(
          'Please enter valid login information.'
        )
      } else {
        setError(
          'Unable to connect to the server. Please try again.'
        )
      }

    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="kentank-admin-login-page">

      <div className="kentank-admin-login-background">

        <div className="kentank-admin-login-card">

          {/* BRAND */}

          <div className="kentank-admin-login-brand">

            <div className="kentank-admin-login-logo">
              K
            </div>

            <div>

              <h1>
                Kentank Deliveries
              </h1>

              <span>
                Administration Portal
              </span>

            </div>

          </div>


          {/* HEADER */}

          <div className="kentank-admin-login-header">

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to manage your Kentank Deliveries
              website.
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div
              className="kentank-admin-login-error"
              role="alert"
            >
              <span className="kentank-admin-login-error-icon">
                !
              </span>

              <span>
                {error}
              </span>
            </div>
          )}


          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="kentank-admin-login-form"
          >

            {/* PHONE */}

            <div className="kentank-admin-login-field">

              <label htmlFor="phone_number">
                Phone Number
              </label>

              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
                required
                minLength={7}
                maxLength={20}
                disabled={loading}
              />

            </div>


            {/* EMAIL */}

            <div className="kentank-admin-login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
                required
                disabled={loading}
              />

            </div>


            {/* PASSWORD */}

            <div className="kentank-admin-login-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="kentank-admin-password-wrapper">

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  minLength={8}
                  maxLength={128}
                  disabled={loading}
                />

                <button
                  type="button"
                  className="kentank-admin-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previousValue) =>
                        !previousValue
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="kentank-admin-login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />

                  <span>
                    Signing In...
                  </span>
                </>
              ) : (
                'Sign In'
              )}

            </button>

          </form>


          {/* FOOTER */}

          <div className="kentank-admin-login-footer">

            <span>
              Secure Administration Portal
            </span>

            <span>
              © {new Date().getFullYear()} Kentank Deliveries
            </span>

          </div>

        </div>

      </div>

    </div>
  )
}


export default LoginPage