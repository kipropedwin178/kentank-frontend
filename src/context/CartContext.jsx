import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'


const CartContext = createContext()


export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState(() => {

    const savedCart =
      localStorage.getItem('kentank_cart')

    return savedCart
      ? JSON.parse(savedCart)
      : []
  })


  useEffect(() => {

    localStorage.setItem(
      'kentank_cart',
      JSON.stringify(cartItems)
    )

  }, [cartItems])


  const addToCart = (tank) => {

    setCartItems((previousItems) => {

      const existingItem =
        previousItems.find(
          (item) => item.id === tank.id
        )

      if (existingItem) {

        return previousItems.map((item) =>
          item.id === tank.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...previousItems,
        {
          ...tank,
          quantity: 1,
        },
      ]
    })
  }


  const removeFromCart = (tankId) => {

    setCartItems((previousItems) =>
      previousItems.filter(
        (item) => item.id !== tankId
      )
    )
  }


  const increaseQuantity = (tankId) => {

    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.id === tankId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }


  const decreaseQuantity = (tankId) => {

    setCartItems((previousItems) =>
      previousItems
        .map((item) =>
          item.id === tankId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    )
  }


  const clearCart = () => {
    setCartItems([])
  }


  const totalItems = useMemo(() => {

    return cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    )

  }, [cartItems])


  const totalAmount = useMemo(() => {

    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          item.quantity,
      0
    )

  }, [cartItems])


  return (

    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalAmount,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >

      {children}

    </CartContext.Provider>

  )
}


export function useCart() {

  const context =
    useContext(CartContext)

  if (!context) {

    throw new Error(
      'useCart must be used within CartProvider'
    )
  }

  return context
}