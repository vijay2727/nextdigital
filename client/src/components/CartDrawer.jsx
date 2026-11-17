import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, Tag } from 'lucide-react';
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

      {/* Drawer Panel */}
      <div className={`shopco-cart-drawer ${isDrawerOpen ? 'open' : ''}`} id="cart-drawer-panel">
        <div className="drawer-header">
          <h3 className="drawer-title">YOUR CART</h3>
          <button
            className="drawer-close-btn"
            id="close-cart-drawer"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Alert */}
        <div className="drawer-shipping-notice">
          {subtotal >= 999 ? (
            <span>You unlocked <strong>FREE Shipping</strong>!</span>
          ) : (
            <span>Add <strong>{formatPrice(999 - subtotal)}</strong> more for FREE Shipping!</span>
          )}
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-title">Your cart is empty</div>
              <p className="empty-subtitle">
                Explore our catalog to add clothes, smart projectors, and tech gadgets to your cart.
              </p>
              <button
                className="btn-shop-now"
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/shop');
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="drawer-items-list">
              {cartItems.map((item) => (
                <div className="cart-item-card" key={item.product.id}>
                  {/* Thumbnail */}
                  <div className="cart-item-thumb-box">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/HY260 Pro (2).jpeg';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="cart-item-info">
                    <div className="item-title-row">
                      <h4 className="item-name" title={item.product.name}>
                        {item.product.name}
                      </h4>
                      <button
                        className="item-remove-btn"
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <span className="item-variant-label">
                      Category: {item.product.category}
                    </span>

                    <div className="item-price-quantity-row">
                      <span className="item-price">{formatPrice(item.product.price)}</span>

                      <div className="shopco-qty-pill small">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer / Order Summary */}
        {cartItems.length > 0 && (
          <div className="drawer-footer-summary">
            {/* Promo code pill input */}
            <form className="drawer-coupon-form" onSubmit={handleApply}>
              <div className="promo-input-box">
                <Tag size={16} className="promo-tag-icon" />
                <input
                  type="text"
                  placeholder="Add promo code"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-apply-coupon">
                Apply
              </button>
            </form>

            {couponError && <div className="coupon-error-msg">{couponError}</div>}
            {coupon && (
              <div className="coupon-applied-msg">
                <span>Code <strong>{coupon}</strong> applied: -{formatPrice(couponDiscount)}</span>
                <button type="button" onClick={removeCoupon} className="remove-code-btn">Remove</button>
              </div>
            )}

            {/* Calculations */}
            <div className="summary-lines">
              <div className="summary-row">
                <span>Subtotal</span>
                <span className="bold-val">{formatPrice(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount</span>
                  <span className="discount-val">-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span className="bold-val">{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="total-val">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              className="btn-checkout-shopco"
              onClick={handleProceedCheckout}
            >
              <span>Go to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
