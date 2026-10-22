import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('nextdigital_cart') || localStorage.getItem('digitalnext_cart') || localStorage.getItem('atoz_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('nextdigital_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon('');
    setCouponDiscount(0);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const applyCouponCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'DNEXCLUSIVE1' || cleanCode === 'DIGITALNEXT1' || cleanCode === 'NEXTEXCLUSIVE1' || cleanCode === 'NEXTDIGITAL1' || cleanCode === 'ATOZEXCLUSIVE1') {
      if (subtotal >= 1999) {
        setCoupon(cleanCode);
        setCouponDiscount(300);
        setCouponError('');
        showToast(`Coupon "${cleanCode}" applied: ₹300 OFF!`);
        return { success: true };
      } else {
        const diff = 1999 - subtotal;
        setCouponError(`Add ₹${diff.toLocaleString('en-IN')} more to your cart to use this coupon`);
        return { success: false, message: `Add ₹${diff.toLocaleString('en-IN')} more to your cart` };
      }
    } else {
      setCouponError('Invalid coupon code. Try "NEXTEXCLUSIVE1"');
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    setCoupon('');
    setCouponDiscount(0);
    setCouponError('');
  };

  const shippingCost = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingCost);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      totalItemsCount,
      coupon,
      couponDiscount,
      couponError,
      applyCouponCode,
      removeCoupon,
      shippingCost,
      grandTotal,
      isDrawerOpen,
      setIsDrawerOpen,
      toastMessage
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
