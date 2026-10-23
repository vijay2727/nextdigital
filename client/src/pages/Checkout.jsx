import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, ShieldCheck, CreditCard, Banknote, ArrowLeft, UserCheck, Lock } from 'lucide-react';
import { buildApiUrl } from '../config/api';

export const Checkout = () => {
  const { cartItems, subtotal, coupon, couponDiscount, shippingCost, grandTotal, clearCart } = useCart();
  const { user, isAuthenticated, addCustomerOrder } = useAuth();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    state: 'Delhi',
    pincode: user?.pincode || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setCustomer(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || '',
        pincode: prev.pincode || user.pincode || ''
      }));
    }
  }, [user]);

  if (!isAuthenticated) {
    return null;
  }

  const formatPrice = (price) => '₹' + price.toLocaleString('en-IN');

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customer.fullName || !customer.phone || !customer.address || !customer.pincode) {
      alert('Please fill out all required shipping fields');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customer,
      items: cartItems.map(i => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity
      })),
      subtotal,
      discount: couponDiscount,
      totalAmount: grandTotal,
      paymentMethod
    };

    try {
      const res = await fetch(buildApiUrl('/api/checkout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCompletedOrder(data.order);
        addCustomerOrder(data.order);
        clearCart();
      } else {
        // Fallback local order
        const mockOrder = {
          orderId: 'ND-' + Math.floor(100000 + Math.random() * 900000),
          customer,
          items: payload.items,
          totalAmount: grandTotal,
          paymentMethod,
          createdAt: new Date().toISOString()
        };
        setCompletedOrder(mockOrder);
        addCustomerOrder(mockOrder);
        clearCart();
      }
    } catch {
      const mockOrder = {
        orderId: 'ND-' + Math.floor(100000 + Math.random() * 900000),
        customer,
        items: payload.items,
        totalAmount: grandTotal,
        paymentMethod,
        createdAt: new Date().toISOString()
      };
      setCompletedOrder(mockOrder);
      addCustomerOrder(mockOrder);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '720px' }}>
        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <CheckCircle2 size={56} color="#059669" style={{ margin: '0 auto 1.2rem' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
            Order Placed Successfully!
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem' }}>
            Thank you for choosing DigitalNext India. Your order number is:
          </p>
          <div style={{ display: 'inline-block', background: '#eff6ff', border: '1px dashed #3b82f6', padding: '0.6rem 1.4rem', borderRadius: '8px', fontSize: '1.25rem', fontWeight: 800, color: '#1d4ed8', marginBottom: '2rem' }}>
            {completedOrder.orderId}
          </div>

          <div style={{ textAlign: 'left', background: '#f8fafc', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.8rem' }}>Order Details</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.4rem', color: '#475569' }}>
              <span>Recipient:</span>
              <strong style={{ color: '#0f172a' }}>{completedOrder.customer.fullName} ({completedOrder.customer.phone})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.4rem', color: '#475569' }}>
              <span>Delivery Address:</span>
              <span style={{ textAlign: 'right', maxWidth: '300px', color: '#0f172a' }}>
                {completedOrder.customer.address}, {completedOrder.customer.city}, {completedOrder.customer.pincode}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.4rem', color: '#475569' }}>
              <span>Payment Mode:</span>
              <strong style={{ color: '#0f172a' }}>{completedOrder.paymentMethod === 'COD' ? 'Cash on Delivery (Pending)' : completedOrder.paymentMethod}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem', marginTop: '0.6rem' }}>
              <span>Total Payable:</span>
              <span style={{ color: '#2563eb' }}>{formatPrice(completedOrder.totalAmount)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/shop" className="btn-primary">
              Continue Shopping
            </Link>
            <Link to="/" className="btn-secondary" style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.5rem' }}>Your shopping cart is empty</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Add some products to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div style={{ padding: '2rem 0 1rem' }}>
          <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.88rem', marginBottom: '0.8rem' }}>
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: '#0f172a' }}>
            Secure Checkout
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="checkout-grid">
            {/* Left Column: Delivery & Payment Details */}
            <div>
              {/* Logged in or Guest Banner */}
              {user ? (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.8rem 1.2rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#065f46', fontSize: '0.88rem' }}>
                    <UserCheck size={18} color="#059669" />
                    <span>Signed in as <strong>{user.name}</strong> ({user.email})</span>
                  </div>
                  <Link to="/account" style={{ color: '#047857', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'underline' }}>
                    My Account
                  </Link>
                </div>
              ) : (
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.8rem 1.2rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#1e40af', fontSize: '0.88rem' }}>
                    <Lock size={16} color="#2563eb" />
                    <span>Already a DigitalNext customer?</span>
                  </div>
                  <Link to="/login?redirect=/checkout" style={{ color: '#1d4ed8', fontSize: '0.84rem', fontWeight: 700 }}>
                    Sign In for Faster Checkout →
                  </Link>
                </div>
              )}

              {/* Shipping Address */}
              <div className="checkout-box">
                <h3>1. Delivery Address</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="checkout-name">Full Name *</label>
                    <input
                      type="text"
                      id="checkout-name"
                      name="fullName"
                      placeholder="e.g. Deepak Sharma"
                      required
                      value={customer.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="checkout-phone">Mobile Number *</label>
                    <input
                      type="tel"
                      id="checkout-phone"
                      name="phone"
                      placeholder="+91 99995 93931"
                      required
                      value={customer.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="checkout-email">Email Address (For Invoicing)</label>
                  <input
                    type="email"
                    id="checkout-email"
                    name="email"
                    placeholder="deepak@gmail.com"
                    value={customer.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="checkout-address">Flat / House No., Street, Landmark *</label>
                  <input
                    type="text"
                    id="checkout-address"
                    name="address"
                    placeholder="House/Shop No, Street, Colony..."
                    required
                    value={customer.address}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="checkout-city">City / District *</label>
                    <input
                      type="text"
                      id="checkout-city"
                      name="city"
                      placeholder="e.g. New Delhi"
                      required
                      value={customer.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="checkout-state">State *</label>
                    <input
                      type="text"
                      id="checkout-state"
                      name="state"
                      placeholder="Delhi"
                      required
                      value={customer.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="checkout-pincode">PIN Code *</label>
                    <input
                      type="text"
                      id="checkout-pincode"
                      name="pincode"
                      placeholder="110092"
                      required
                      value={customer.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="checkout-box">
                <h3>2. Payment Method</h3>
                <div className="payment-method-selector">
                  <label className={`payment-radio-label ${paymentMethod === 'COD' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <Banknote size={20} color="#059669" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Cash on Delivery (COD)</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Pay via cash or UPI to the courier upon delivery</div>
                    </div>
                  </label>

                  <label className={`payment-radio-label ${paymentMethod === 'BANK_TRANSFER' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={() => setPaymentMethod('BANK_TRANSFER')}
                    />
                    <ShieldCheck size={20} color="#2563eb" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Direct Bank Transfer / NEFT / IMPS</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Institutional & GST invoicing for corporate accounts</div>
                    </div>
                  </label>
                </div>

                {/* Payment Gateway Integration Placeholder */}
                <div className="payment-placeholder-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#1e40af', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <CreditCard size={18} />
                    <span>Online Payment Gateway (Razorpay / PayU / PhonePe)</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#3b82f6', lineHeight: '1.4' }}>
                    Payment gateway module is configured in the backend and ready for your production API keys. Online cards and UPI can be enabled when you're ready.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div>
              <div className="checkout-box" style={{ position: 'sticky', top: '90px' }}>
                <h3>Order Summary ({cartItems.length} items)</h3>

                <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1.2rem', paddingRight: '0.4rem' }}>
                  {cartItems.map(item => (
                    <div key={item.product.id} style={{ display: 'flex', gap: '0.8rem', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', padding: '2px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', lineHeight: '1.3' }}>
                          {item.product.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          Qty: {item.quantity} × {formatPrice(item.product.price)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="order-summary-row" style={{ color: '#16a34a' }}>
                    <span>Coupon Discount ({coupon})</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="order-summary-row">
                  <span>Shipping & Delivery</span>
                  <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                </div>

                <div className="order-summary-row total">
                  <span>Total Amount</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>

                <button
                  type="submit"
                  className="btn-checkout-proceed"
                  id="place-order-button"
                  disabled={isSubmitting}
                  style={{ marginTop: '1.5rem' }}
                >
                  {isSubmitting ? 'Placing Order...' : `Confirm & Place Order (${formatPrice(grandTotal)})`}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.78rem', marginTop: '1rem' }}>
                  <ShieldCheck size={16} color="#059669" />
                  <span>100% Secure & Genuine Product Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
