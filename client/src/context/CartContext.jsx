import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('digitalnext_cart') || localStorage.getItem('nextdigital_cart') || localStorage.getItem('atoz_cart');
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

  // Preserve cart state across sessions and logins and clean legacy keys
  useEffect(() => {
    try {
      localStorage.removeItem('nextdigital_cart');
      localStorage.removeItem('atoz_cart');
      localStorage.setItem('digitalnext_cart', JSON.stringify(cartItems));
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

  /**
   * Add to cart handler:
   * Strictly prevents cart mutation if user is unauthenticated, unless explicit force/auth override is supplied.
   */
  const addToCart = (product, quantity = 1, force = false) => {
    if (!isAuthenticated && !force) {
      return false;
    }

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
    return true;
  };

  /**
   * Pending action helpers to store intended cart actions across login redirect
   */
  const savePendingAction = (actionData) => {
    try {
      localStorage.setItem('digitalnext_pending_action', JSON.stringify(actionData));
    } catch (e) {
      console.error('Failed to save pending action', e);
    }
  };

  const getPendingAction = () => {
    try {
      const saved = localStorage.getItem('digitalnext_pending_action');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };

  const clearPendingAction = () => {
    try {
      localStorage.removeItem('digitalnext_pending_action');
    } catch (e) {
      console.error('Failed to clear pending action', e);
    }
  };

  const restoreAndExecutePendingAction = () => {
    try {
      const raw = localStorage.getItem('digitalnext_pending_action');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.product) {
        addToCart(parsed.product, parsed.quantity || 1, true);
        localStorage.removeItem('digitalnext_pending_action');
        return parsed;
      }
    } catch (e) {
      console.error('Error executing pending action', e);
    }
    return null;
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

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item?.product?.price || 0;
    const qty = item?.quantity || 0;
    return acc + (price * qty);
  }, 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item?.quantity || 0), 0);

  // Auto-remove coupon discount if subtotal drops below the minimum requirement
  useEffect(() => {
    if (coupon && subtotal < 1999) {
      setCoupon('');
      setCouponDiscount(0);
      setCouponError('Coupon removed: Order subtotal is now below ₹1,999');
    }
  }, [subtotal, coupon]);

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
      setCouponError('Invalid coupon code. Try "DIGITALNEXT1"');
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
      savePendingAction,
      getPendingAction,
      clearPendingAction,
      restoreAndExecutePendingAction,
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
