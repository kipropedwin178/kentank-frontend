import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'

import './AddToCartButton.css'

function AddToCartButton({ tank }) {
  const { addToCart, cartItems } = useCart()

  const [isAdded, setIsAdded] = useState(false)
  const [flyingCoin, setFlyingCoin] = useState(null)

  useEffect(() => {
    if (!flyingCoin) {
      return
    }

    const timer = setTimeout(() => {
      setFlyingCoin(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [flyingCoin])

  const handleAddToCart = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (isAdded) {
      return
    }

    const button = event.currentTarget
    const buttonRect = button.getBoundingClientRect()

    const cartTarget =
      document.querySelector('.kentank-cart-link')

    const targetRect =
      cartTarget?.getBoundingClientRect()

    const startX =
      buttonRect.left + buttonRect.width / 2

    const startY =
      buttonRect.top + buttonRect.height / 2

    const endX = targetRect
      ? targetRect.left + targetRect.width / 2
      : window.innerWidth - 80

    const endY = targetRect
      ? targetRect.top + targetRect.height / 2
      : 30

    const existingItem = cartItems.find(
      (item) => item.id === tank.id
    )

    const newQuantity = existingItem
      ? existingItem.quantity + 1
      : 1

    setFlyingCoin({
      id: Date.now(),
      quantity: newQuantity,
      startX,
      startY,
      endX,
      endY,
    })

    addToCart(tank)

    setIsAdded(true)

    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <>
      <div className="kentank-product-cart-area">
        <button
          type="button"
          className={`kentank-add-cart-btn ${
            isAdded
              ? 'kentank-add-cart-btn-added'
              : ''
          }`}
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          {isAdded ? (
            <>✓ Added to Cart</>
          ) : (
            <>🛒 Add to Cart</>
          )}
        </button>
      </div>

      {flyingCoin && (
        <div
          key={flyingCoin.id}
          className="kentank-flying-cart-item"
          style={{
            '--start-x': `${flyingCoin.startX}px`,
            '--start-y': `${flyingCoin.startY}px`,
            '--end-x': `${flyingCoin.endX}px`,
            '--end-y': `${flyingCoin.endY}px`,
          }}
        >
          {flyingCoin.quantity}
        </div>
      )}
    </>
  )
}

export default AddToCartButton