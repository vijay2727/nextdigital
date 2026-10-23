import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Sparkles, Zap } from 'lucide-react';

export const Login = () => {
  const { login, isLoading, authError, setAuthError } = useAuth();
  const { restoreAndExecutePendingAction } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to page they came from (e.g. checkout, product), or to /account
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/account';
  const actionParam = searchParams.get('action');
  const productNameParam = searchParams.get('productName');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;

    const res = await login(identifier.trim(), password);
    if (res.success) {
      // Restore and execute any pending cart action (Add to Cart or Buy Now)
      const executed = restoreAndExecutePendingAction();
      if (executed) {
        if (executed.action === 'buy_now') {
          navigate('/checkout');
          return;
        }
        if (executed.action === 'add_to_cart') {
          navigate(executed.returnUrl || redirectTo || `/product/${executed.product.id}`);
          return;
        }
      }
      navigate(redirectTo);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSent(true);
      setTimeout(() => {
        setForgotModalOpen(false);
        setForgotSent(false);
        setForgotEmail('');
      }, 3500);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Background Decor */}
      <div className="auth-bg-ambient"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2, padding: '3.5rem 1.5rem' }}>
        <div className="auth-container-card">
          {/* Left Branded Presentation Side */}
          <div className="auth-side-brand">
            <div className="auth-brand-badge">DigitalNext Secure Customer Portal</div>
            <h2 className="auth-brand-title">Welcome to DigitalNext Online</h2>
            <p className="auth-brand-desc">
              Sign in to manage your orders, track pan-India courier shipments, access GST invoices, and redeem exclusive customer discounts.
            </p>

            <div className="auth-features-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <ShieldCheck size={18} color="#38bdf8" />
                </div>
                <div>
                  <strong>Official Warranty Registration</strong>
                  <span>Instant access to brand warranty documents & serial tracking.</span>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <UserCheck size={18} color="#38bdf8" />
                </div>
                <div>
                  <strong>1-Click Faster Checkout</strong>
                  <span>Saved billing and delivery addresses automatically pre-filled.</span>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Sparkles size={18} color="#38bdf8" />
                </div>
                <div>
                  <strong>Exclusive VIP Coupons</strong>
                  <span>Get ₹300 OFF orders above ₹1,999 with code DIGITALNEXT1.</span>
                </div>
              </div>
            </div>

            <div className="auth-brand-quote">
              <span className="quote-mark">“</span>
              <span>Trusted by 5,000+ businesses and schools across India for CCTV security and smart visual setups.</span>
            </div>
          </div>

          {/* Right Interactive Login Form */}
          <div className="auth-side-form">
            <div className="auth-form-header">
              <span className="auth-pill-sub">Customer Access</span>
              <h1>Sign In to Account</h1>
              <p>Enter your verified email or mobile phone number to continue.</p>
            </div>

            {/* Auth Gate Notification Banners */}
            {actionParam === 'add_to_cart' && (
              <div className="auth-gate-banner" id="auth-gate-banner">
                <Lock size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Sign In Required to Add to Cart</strong>
                  <span>
                    Please sign in to add {productNameParam ? <strong>{productNameParam}</strong> : 'this item'} to your cart. We will redirect you right back to your product.
                  </span>
                </div>
              </div>
            )}

            {actionParam === 'buy_now' && (
              <div className="auth-gate-banner" id="auth-gate-banner">
                <Zap size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Sign In to Complete Purchase</strong>
                  <span>
                    Please sign in to buy {productNameParam ? <strong>{productNameParam}</strong> : 'this item'}. You will be redirected straight to checkout to finalize your order.
                  </span>
                </div>
              </div>
            )}

            {!actionParam && redirectTo === '/checkout' && (
              <div className="auth-gate-banner" id="auth-gate-banner">
                <ShieldCheck size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Authentication Required for Checkout</strong>
                  <span>
                    Please sign in to access checkout and place your order securely. Your cart items are preserved.
                  </span>
                </div>
              </div>
            )}

            {authError && (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={18} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} id="customer-login-form">
              <div className="form-group">
                <label htmlFor="login-identifier">Email Address or Phone Number</label>
                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    type="text"
                    id="login-identifier"
                    name="identifier"
                    placeholder="e.g. name@example.com or 9876543210"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="login-password">Password</label>
                  <button
                    type="button"
                    className="auth-link-forgot"
                    onClick={() => setForgotModalOpen(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    name="password"
                    placeholder="Enter your account password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="auth-options-row">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn-primary auth-submit-btn"
                id="login-submit-button"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Verifying Account...' : 'Sign In to Account'}</span>
                <ArrowRight size={18} />
              </button>

              <div className="auth-footer-prompt">
                <span>New to DigitalNext?</span>
                <Link
                  to={`/register${location.search}`}
                  className="auth-signup-link"
                  id="link-to-register"
                >
                  Create an Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="modal-backdrop" onClick={() => setForgotModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              Reset Your Password
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Enter the registered email address linked to your DigitalNext customer account. We will send a secure password reset link.
            </p>

            {forgotSent ? (
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '1.2rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.92rem' }}>
                <ShieldCheck size={28} color="#059669" style={{ margin: '0 auto 0.5rem' }} />
                <strong>Password Reset Link Dispatched!</strong>
                <p style={{ marginTop: '0.3rem', fontSize: '0.85rem' }}>
                  Please check your inbox at <strong>{forgotEmail}</strong>. Follow the instructions to choose a new password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <div className="form-group">
                  <label htmlFor="forgot-email">Registered Email Address</label>
                  <input
                    type="email"
                    id="forgot-email"
                    placeholder="e.g. name@company.com"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setForgotModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
