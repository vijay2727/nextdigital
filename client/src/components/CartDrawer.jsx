import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartDrawer = () => {
  const {
    cartItems,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    coupon,
    couponDiscount,
    couponError,
    applyCouponCode,
    removeCoupon,
    shippingCost,
    grandTotal
  } = useCart();
  const { isAuthenticated } = useAuth();

  const [inputCode, setInputCode] = useState('');
  const navigate = useNavigate();

  const formatPrice = (price) => '₹' + price.toLocaleString('en-IN');

  const handleApply = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyCouponCode(inputCode);
    }
  };

  const handleProceedCheckout = () => {
    setIsDrawerOpen(false);
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isDrawerOpen ? 'open' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isDrawerOpen ? 'open' : ''}`} id="cart-drawer-panel">
        <div className="drawer-header">
          <h3>Shopping Cart ({cartItems.length})</h3>
          <button
            className="drawer-close-btn"
            id="close-cart-drawer"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free shipping banner */}
        <div style={{ background: '#f0fdf4', padding: '0.65rem 1.5rem', borderBottom: '1px solid #dcfce7', fontSize: '0.82rem', color: '#166534' }}>
          {subtotal >= 999 ? (
            <span>You have unlocked <strong>FREE Shipping</strong>!</span>
          ) : (
            <span>Add <strong>{formatPrice(999 - subtotal)}</strong> more to get Free Shipping!</span>
          )}
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                Your cart is empty
              </div>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Explore our smart projectors, CCTV cameras, and tech accessories.
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/shop');
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item-row" key={item.product.id}>
                <div className="cart-item-thumb">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                <div className="cart-item-details">
                  <h4 title={item.product.name}>{item.product.name}</h4>
                  <div className="cart-item-price">{formatPrice(item.product.price)}</div>

                  <div className="cart-item-controls">
                    <div className="quantity-control" style={{ transform: 'scale(0.85)', transformOrigin: 'left' }}>
                      <button className="qty-btn" onClick={() => updateQuantity(item.product.id, -1)}>
                        <Minus size={14} />
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.product.id, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      className="btn-remove-item"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            {/* Coupon Box */}
            {coupon ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#eff6ff', padding: '0.5rem 0.8rem', borderRadius: '6px', marginBottom: '0.8rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#1e40af', fontWeight: 600 }}>Coupon: {coupon} (-{formatPrice(couponDiscount)})</span>
                <button onClick={removeCoupon} style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 600 }}>Remove</button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="coupon-input-group">
                <input
                  type="text"
                  placeholder="Coupon code (DIGITALNEXT1)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
                <button type="submit" className="btn-apply-coupon">Apply</button>
              </form>
            )}

            {couponError && (
              <div style={{ color: '#dc2626', fontSize: '0.78rem', marginBottom: '0.6rem' }}>
                {couponError}
              </div>
            )}

            <div className="order-summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="order-summary-row" style={{ color: '#16a34a' }}>
                <span>Discount</span>
                <span>-{formatPrice(couponDiscount)}</span>
              </div>
            )}

            <div className="order-summary-row">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
            </div>

            <div className="order-summary-row total">
              <span>Estimated Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            <button
              className="btn-checkout-proceed"
              id="drawer-proceed-to-checkout"
              onClick={handleProceedCheckout}
              style={{ marginTop: '1rem' }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};
