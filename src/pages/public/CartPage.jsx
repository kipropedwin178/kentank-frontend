import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useCart } from '../../context/CartContext'
import api from '../../api/axios'

import './CartPage.css'

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

function CartPage() {
  const {
    cartItems,
    totalItems,
    totalAmount,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart()

  const [whatsappNumber, setWhatsappNumber] =
    useState('')

  const [contactLoading, setContactLoading] =
    useState(true)

  useEffect(() => {
    const fetchContactInformation = async () => {
      try {
        const response = await api.get('/contact')

        setWhatsappNumber(
          response.data.whatsapp_number
        )
      } catch (error) {
        console.error(
          'Failed to load WhatsApp number:',
          error
        )
      } finally {
        setContactLoading(false)
      }
    }

    fetchContactInformation()
  }, [])

  const formatPrice = (price) => {
    return Number(price).toLocaleString('en-KE')
  }

  const handleOrderNow = () => {
    if (
      cartItems.length === 0 ||
      !whatsappNumber
    ) {
      return
    }

    const tankList = cartItems
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} × ${
            item.quantity
          } - KES ${formatPrice(
            Number(item.price) * item.quantity
          )}`
      )
      .join('\n')

    const message = `Hello Kentank Deliveries,

I am interested in the following water tank(s):

${tankList}

Estimated Total: KES ${formatPrice(totalAmount)}

Kindly provide more information regarding availability, delivery options, and payment procedures.

Thank you.`

    const encodedMessage =
      encodeURIComponent(message)

    const cleanWhatsappNumber =
      whatsappNumber.replace(/\D/g, '')

    const whatsappUrl =
      `https://wa.me/${cleanWhatsappNumber}` +
      `?text=${encodedMessage}`

    window.open(
      whatsappUrl,
      '_blank',
      'noopener,noreferrer'
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="kentank-cart-page">
        <section className="kentank-cart-hero">
          <div className="container">
            <h1>Your Cart</h1>

            <p>
              Your selected water tanks will appear
              here.
            </p>
          </div>
        </section>

        <section className="kentank-cart-empty-section">
          <div className="container">
            <div className="kentank-empty-cart">
              <div className="kentank-empty-cart-icon">
                🛒
              </div>

              <h2>Your cart is empty</h2>

              <p>
                Browse our water tanks and add the
                ones you are interested in.
              </p>

              <Link
                to="/products"
                className="kentank-browse-products-btn"
              >
                Browse Water Tanks
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="kentank-cart-page">
      <section className="kentank-cart-hero">
        <div className="container">
          <h1>Your Cart</h1>

          <p>
            {totalItems}{' '}
            {totalItems === 1
              ? 'item'
              : 'items'}{' '}
            selected
          </p>
        </div>
      </section>

      <section className="kentank-cart-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="kentank-cart-grid">
                {cartItems.map((item) => {
                  const itemTotal =
                    Number(item.price) *
                    item.quantity

                  const primaryImage =
                    item.images?.find(
                      (image) =>
                        image.image_url
                    )

                  return (
                    <article
                      className="kentank-cart-item"
                      key={item.id}
                    >
                      <Link
                        to={`/products/${item.id}`}
                        className="kentank-cart-image-link"
                      >
                        {primaryImage ? (
                          <img
                            src={getImageUrl(
                              primaryImage.image_url
                            )}
                            alt={item.name}
                            className="kentank-cart-item-image"
                          />
                        ) : (
                          <div className="kentank-cart-no-image">
                            No Image
                          </div>
                        )}
                      </Link>

                      <div className="kentank-cart-item-content">
                        <Link
                          to={`/products/${item.id}`}
                          className="kentank-cart-item-name"
                        >
                          {item.name}
                        </Link>

                        <p className="kentank-cart-item-price">
                          KES{' '}
                          {formatPrice(
                            item.price
                          )}
                        </p>

                        <div className="kentank-cart-item-bottom">
                          <div className="kentank-quantity-controls">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              −
                            </button>

                            <span>
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>

                          <strong className="kentank-cart-item-total">
                            KES{' '}
                            {formatPrice(
                              itemTotal
                            )}
                          </strong>
                        </div>

                        <button
                          type="button"
                          className="kentank-remove-item-btn"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>

            <div className="col-lg-4">
              <aside className="kentank-cart-summary">
                <h2>Order Summary</h2>

                <div className="kentank-summary-row">
                  <span>Total Items</span>

                  <strong>
                    {totalItems}
                  </strong>
                </div>

                <div className="kentank-summary-divider"></div>

                <div className="kentank-summary-total">
                  <span>Total Amount</span>

                  <strong>
                    KES{' '}
                    {formatPrice(
                      totalAmount
                    )}
                  </strong>
                </div>

                <button
                  type="button"
                  className="kentank-order-now-btn"
                  onClick={handleOrderNow}
                  disabled={
                    contactLoading ||
                    !whatsappNumber
                  }
                >
                  {contactLoading
                    ? 'Loading...'
                    : 'Order Now on WhatsApp'}
                </button>

                <p className="kentank-order-note">
                  Your order will be sent to
                  Kentank Deliveries through
                  WhatsApp.
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CartPage