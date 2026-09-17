import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../../api/axios'
import AddToCartButton from '../../components/AddToCartButton'

import './ProductsPage.css'


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


function ProductsPage() {
  const [tanks, setTanks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    const fetchTanks = async () => {
      try {
        const response = await api.get('/tanks')

        const tanksWithImages = await Promise.all(
          response.data.map(async (tank) => {
            try {
              const imageResponse = await api.get(
                `/tanks/${tank.id}/images`
              )

              const validImages =
                imageResponse.data.filter(
                  (image) => image.image_url
                )

              return {
                ...tank,
                images: validImages,
              }

            } catch (imageError) {
              console.error(
                `Failed to load images for tank ${tank.id}:`,
                imageError
              )

              return {
                ...tank,
                images: [],
              }
            }
          })
        )

        setTanks(tanksWithImages)

      } catch (err) {
        console.error(
          'Failed to load tanks:',
          err
        )

        setError(
          'Unable to load our water tanks right now. Please try again later.'
        )

      } finally {
        setLoading(false)
      }
    }

    fetchTanks()
  }, [])

  return (
    <div className="kentank-products-page">

      {/* ==========================================
          PAGE HERO
      ========================================== */}

      <section className="kentank-products-hero">

        <div className="container">

          <div className="kentank-products-hero-content">

            <span className="kentank-products-label">
              Our Products
            </span>

            <h1>
              Quality Water Tanks
              <span> For Every Need</span>
            </h1>

            <p>
              Explore our complete collection of quality
              water tanks, available at competitive prices
              and ready for convenient delivery.
            </p>

          </div>

        </div>

      </section>


      {/* ==========================================
          PRODUCTS SECTION
      ========================================== */}

      <section className="kentank-products-section">

        <div className="container">

          <div className="kentank-products-heading">

            <div>

              <span className="kentank-products-section-label">
                Available Tanks
              </span>

              <h2>
                Find Your Perfect Water Tank
              </h2>

            </div>


            {!loading && !error && (
              <div className="kentank-products-count">

                {tanks.length}{' '}

                {tanks.length === 1
                  ? 'Tank'
                  : 'Tanks'}

              </div>
            )}

          </div>


          {/* ==========================================
              LOADING
          ========================================== */}

          {loading && (

            <div className="kentank-products-loading">

              <div
                className="spinner-border"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p>
                Loading our water tanks...
              </p>

            </div>

          )}


          {/* ==========================================
              ERROR
          ========================================== */}

          {!loading && error && (

            <div className="kentank-products-error">

              <div className="kentank-products-error-icon">
                !
              </div>

              <h3>
                Something went wrong
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="kentank-products-retry"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>

            </div>

          )}


          {/* ==========================================
              EMPTY
          ========================================== */}

          {!loading &&
            !error &&
            tanks.length === 0 && (

              <div className="kentank-products-empty">

                <div className="kentank-products-empty-icon">
                  💧
                </div>

                <h3>
                  No Tanks Available
                </h3>

                <p>
                  We don't have any water tanks available
                  at the moment. Please check back soon.
                </p>

                <Link
                  to="/contact"
                  className="kentank-products-contact-btn"
                >
                  Contact Us
                </Link>

              </div>

            )}


          {/* ==========================================
              PRODUCT GRID
          ========================================== */}

          {!loading &&
            !error &&
            tanks.length > 0 && (

              <div className="row g-4">

                {tanks.map((tank) => {

                  const primaryImage =
                    tank.images?.find(
                      (image) =>
                        image.image_url
                    )


                  return (

                    <div
                      className="col-6 col-lg-4"
                      key={tank.id}
                    >

                      <article className="kentank-product-card">

                        <Link
                          to={`/products/${tank.id}`}
                          className="kentank-product-card-link"
                        >

                          {/* ==================================
                              PRODUCT IMAGE
                          ================================== */}

                          <div className="kentank-product-image-wrapper">

                            {primaryImage ? (

                              <img
                                src={getImageUrl(
                                  primaryImage.image_url
                                )}
                                alt={tank.name}
                                className="kentank-product-image"
                              />

                            ) : (

                              <div className="kentank-product-no-image">

                                <span>
                                  💧
                                </span>

                                <p>
                                  Image coming soon
                                </p>

                              </div>

                            )}


                            {/* Availability */}

                            <span
                              className={`kentank-product-availability kentank-product-availability-${tank.availability
                                .toLowerCase()
                                .replaceAll(' ', '-')}`}
                            >
                              {tank.availability}
                            </span>

                          </div>


                          {/* ==================================
                              PRODUCT INFORMATION
                          ================================== */}

                          <div className="kentank-product-body">

                            <div className="kentank-product-main-info">

                              <h3>
                                {tank.name}
                              </h3>

                              <span className="kentank-product-capacity">

                                {Number(
                                  tank.capacity_liters
                                ).toLocaleString()}{' '}

                                Liters

                              </span>

                            </div>


                            <p className="kentank-product-description">

                              {tank.description ||
                                'Quality water storage tank designed for dependable everyday use.'}

                            </p>


                            {/* Price */}

                            <div className="kentank-product-bottom">

                              <div className="kentank-product-price">

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


                              <span className="kentank-product-contact">
                                View Details
                              </span>

                            </div>

                          </div>

                        </Link>


                        {/* ==================================
                            ADD TO CART
                        ================================== */}

                        <AddToCartButton tank={tank} />

                      </article>

                    </div>

                  )
                })}

              </div>

            )}

        </div>

      </section>


      {/* ==========================================
          BOTTOM CTA
      ========================================== */}

      <section className="kentank-products-cta">

        <div className="container">

          <div className="kentank-products-cta-content">

            <div>

              <span>
                Need Help Choosing?
              </span>

              <h2>
                Not sure which tank is right for you?
              </h2>

              <p>
                Contact us and we'll help you find a
                suitable water storage solution.
              </p>

            </div>


            <Link
              to="/contact"
              className="kentank-products-cta-btn"
            >
              Contact Us
            </Link>

          </div>

        </div>

      </section>

    </div>
  )
}


export default ProductsPage