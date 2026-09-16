import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import api from '../../api/axios'

import './TankDetailsPage.css'


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000'


const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return ''
  }

  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://')
  ) {
    return imageUrl
  }

  return `${API_BASE_URL}${imageUrl}`
}


function TankDetailsPage() {
  const { tankId } = useParams()

  const [tank, setTank] = useState(null)
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    const fetchTankDetails = async () => {
      try {
        setLoading(true)
        setError('')

        const tankResponse = await api.get(
          `/tanks/${tankId}`
        )

        const imageResponse = await api.get(
          `/tanks/${tankId}/images`
        )

        const validImages = imageResponse.data.filter(
          (image) => image.image_url
        )

        setTank(tankResponse.data)
        setImages(validImages)
        setSelectedImage(0)

      } catch (err) {
        console.error(
          'Failed to load tank details:',
          err
        )

        if (err.response?.status === 404) {
          setError(
            'The water tank you are looking for could not be found.'
          )
        } else {
          setError(
            'Unable to load this water tank right now. Please try again later.'
          )
        }

      } finally {
        setLoading(false)
      }
    }

    fetchTankDetails()
  }, [tankId])


  if (loading) {
    return (
      <div className="kentank-details-page">

        <section className="kentank-details-loading-section">

          <div className="container">

            <div className="kentank-details-loading">

              <div
                className="spinner-border"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p>
                Loading tank details...
              </p>

            </div>

          </div>

        </section>

      </div>
    )
  }


  if (error || !tank) {
    return (
      <div className="kentank-details-page">

        <section className="kentank-details-error-section">

          <div className="container">

            <div className="kentank-details-error">

              <div className="kentank-details-error-icon">
                !
              </div>

              <h1>
                Tank Not Found
              </h1>

              <p>
                {error ||
                  'The requested water tank is not available.'}
              </p>

              <Link
                to="/products"
                className="kentank-details-back-btn"
              >
                Back to Products
              </Link>

            </div>

          </div>

        </section>

      </div>
    )
  }


  const currentImage = images[selectedImage]


  const availabilityClass = tank.availability
    .toLowerCase()
    .replaceAll(' ', '-')


  return (
    <div className="kentank-details-page">

      {/* PAGE HEADER */}

      <section className="kentank-details-header">

        <div className="container">

          <div className="kentank-details-breadcrumb">

            <Link to="/">
              Home
            </Link>

            <span>/</span>

            <Link to="/products">
              Products
            </Link>

            <span>/</span>

            <span>
              {tank.name}
            </span>

          </div>

        </div>

      </section>


      {/* PRODUCT DETAILS */}

      <section className="kentank-details-section">

        <div className="container">

          <div className="row g-4 g-lg-5">

            {/* IMAGE GALLERY */}

            <div className="col-lg-7">

              <div className="kentank-details-gallery">

                {/* MAIN IMAGE */}

                <div className="kentank-details-main-image">

                  {currentImage ? (
                    <img
                      src={getImageUrl(
                        currentImage.image_url
                      )}
                      alt={tank.name}
                    />
                  ) : (
                    <div className="kentank-details-no-image">

                      <span>
                        💧
                      </span>

                      <p>
                        Image coming soon
                      </p>

                    </div>
                  )}

                  <span
                    className={`kentank-details-availability kentank-details-availability-${availabilityClass}`}
                  >
                    {tank.availability}
                  </span>

                </div>


                {/* THUMBNAILS */}

                {images.length > 1 && (
                  <div className="kentank-details-thumbnails">

                    {images.map((image, index) => (
                      <button
                        type="button"
                        key={image.id}
                        className={`kentank-details-thumbnail ${
                          index === selectedImage
                            ? 'active'
                            : ''
                        }`}
                        onClick={() =>
                          setSelectedImage(index)
                        }
                        aria-label={`View image ${index + 1}`}
                      >

                        <img
                          src={getImageUrl(
                            image.image_url
                          )}
                          alt={`${tank.name} ${index + 1}`}
                        />

                      </button>
                    ))}

                  </div>
                )}

              </div>

            </div>


            {/* PRODUCT INFORMATION */}

            <div className="col-lg-5">

              <div className="kentank-details-info">

                <span className="kentank-details-label">
                  Water Tank
                </span>

                <h1 className="kentank-details-title">
                  {tank.name}
                </h1>


                <div className="kentank-details-price">

                  <small>
                    Price
                  </small>

                  <strong>
                    KES{' '}
                    {Number(
                      tank.price
                    ).toLocaleString()}
                  </strong>

                </div>


                <div className="kentank-details-specifications">

                  <div className="kentank-details-spec">

                    <span>
                      Capacity
                    </span>

                    <strong>
                      {Number(
                        tank.capacity_liters
                      ).toLocaleString()}{' '}
                      Liters
                    </strong>

                  </div>


                  <div className="kentank-details-spec">

                    <span>
                      Availability
                    </span>

                    <strong
                      className={`kentank-details-stock-${availabilityClass}`}
                    >
                      {tank.availability}
                    </strong>

                  </div>

                </div>


                <div className="kentank-details-description">

                  <h2>
                    Product Description
                  </h2>

                  <p>
                    {tank.description ||
                      'Quality water storage tank designed for dependable everyday use.'}
                  </p>

                </div>


                {/* CONTACT ACTIONS */}

                <div className="kentank-details-actions">

                  <Link
                    to="/contact"
                    className="kentank-details-contact-btn"
                  >
                    Contact Us
                  </Link>

                  <Link
                    to="/contact"
                    className="kentank-details-whatsapp-btn"
                  >
                    WhatsApp Us
                  </Link>

                </div>


                <Link
                  to="/products"
                  className="kentank-details-back-link"
                >
                  ← Back to all tanks
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* BOTTOM INFORMATION */}

      <section className="kentank-details-benefits">

        <div className="container">

          <div className="row g-3">

            <div className="col-md-4">

              <div className="kentank-details-benefit">

                <div className="kentank-details-benefit-icon">
                  ✓
                </div>

                <div>

                  <h3>
                    Quality Products
                  </h3>

                  <p>
                    Reliable water storage solutions.
                  </p>

                </div>

              </div>

            </div>


            <div className="col-md-4">

              <div className="kentank-details-benefit">

                <div className="kentank-details-benefit-icon">
                  🚚
                </div>

                <div>

                  <h3>
                    Convenient Delivery
                  </h3>

                  <p>
                    Delivery arranged to your location.
                  </p>

                </div>

              </div>

            </div>


            <div className="col-md-4">

              <div className="kentank-details-benefit">

                <div className="kentank-details-benefit-icon">
                  💰
                </div>

                <div>

                  <h3>
                    Competitive Prices
                  </h3>

                  <p>
                    Quality tanks at competitive prices.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  )
}


export default TankDetailsPage