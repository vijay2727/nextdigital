import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, MapPin, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const Register = () => {
  const { register, isLoading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/account';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    pincode: '',
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (validationError) setValidationError('');
    if (authError) setAuthError(null);
  };

  // Password Strength Calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score: 2, label: 'Moderate', color: '#f59e0b' };
    return { score: 3, label: 'Strong & Secure', color: '#10b981' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }

    if (!formData.email.trim()) {
      setValidationError('Please enter your email address.');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match. Please verify your password.');
      return;
    }

    if (!formData.agreeTerms) {
      setValidationError('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    const res = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode
    });

    if (res.success) {
      navigate(redirectTo);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-bg-ambient"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2, padding: '3.5rem 1.5rem' }}>
        <div className="auth-container-card" style={{ maxWidth: '980px' }}>
          {/* Left Brand Summary Side */}
          <div className="auth-side-brand">
            <div className="auth-brand-badge">Join NextDigital Customer Network</div>
            <h2 className="auth-brand-title">Create Your Verified Customer Account</h2>
            <p className="auth-brand-desc">
              Get immediate access to verified brand warranties, GST invoicing, express courier dispatches, and customized quotation requests for educational & enterprise hardware.
            </p>

            <div className="auth-benefits-grid">
              <div className="auth-benefit-card">
                <CheckCircle2 size={20} color="#38bdf8" />
                <div>
                  <h4>Pan-India Delivery</h4>
                  <p>Express courier dispatch with live tracking links.</p>
                </div>
              </div>

              <div className="auth-benefit-card">
                <CheckCircle2 size={20} color="#38bdf8" />
                <div>
                  <h4>GST Invoice Ready</h4>
                  <p>Input your company GSTIN during checkout for tax credit.</p>
                </div>
              </div>

              <div className="auth-benefit-card">
                <CheckCircle2 size={20} color="#38bdf8" />
                <div>
                  <h4>₹300 Welcome Benefit</h4>
                  <p>Instant coupon code NEXTEXCLUSIVE1 on orders above ₹1,999.</p>
                </div>
              </div>

              <div className="auth-benefit-card">
                <CheckCircle2 size={20} color="#38bdf8" />
                <div>
                  <h4>Technical Helpline</h4>
                  <p>Direct access to our senior Delhi installation engineers.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)', fontSize: '0.85rem', color: '#94a3b8' }}>
              Already registered?{' '}
              <Link to={`/login${redirectTo !== '/account' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} style={{ color: '#38bdf8', fontWeight: 600 }}>
                Sign in to existing account →
              </Link>
            </div>
          </div>

          {/* Right Registration Form */}
          <div className="auth-side-form">
            <div className="auth-form-header">
              <span className="auth-pill-sub">Fast & Free Registration</span>
              <h1>Customer Sign Up</h1>
              <p>Complete the brief form below to set up your customer profile.</p>
            </div>

            {(validationError || authError) && (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={18} />
                <span>{validationError || authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} id="customer-register-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="reg-name">Full Name *</label>
                  <div className="auth-input-wrapper">
                    <User size={18} className="auth-input-icon" />
                    <input
                      type="text"
                      id="reg-name"
                      name="name"
                      placeholder="e.g. Rahul Sharma"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-phone">Mobile Phone (WhatsApp) *</label>
                  <div className="auth-input-wrapper">
                    <Phone size={18} className="auth-input-icon" />
                    <input
                      type="tel"
                      id="reg-phone"
                      name="phone"
                      placeholder="e.g. 98765 43210"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email Address *</label>
                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="reg-password">Password *</label>
                  <div className="auth-input-wrapper">
                    <Lock size={18} className="auth-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="reg-password"
                      name="password"
                      placeholder="Min 6 characters"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-confirm-password">Confirm Password *</label>
                  <div className="auth-input-wrapper">
                    <Lock size={18} className="auth-input-icon" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="reg-confirm-password"
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password strength meter */}
              {formData.password && (
                <div className="password-strength-container">
                  <div className="password-strength-bars">
                    <div className="strength-bar" style={{ background: strength.score >= 1 ? strength.color : '#e2e8f0' }}></div>
                    <div className="strength-bar" style={{ background: strength.score >= 2 ? strength.color : '#e2e8f0' }}></div>
                    <div className="strength-bar" style={{ background: strength.score >= 3 ? strength.color : '#e2e8f0' }}></div>
                  </div>
                  <span className="strength-text" style={{ color: strength.color }}>
                    Strength: {strength.label}
                  </span>
                </div>
              )}

              {/* Optional Shipping Address pre-fill */}
              <div className="auth-collapsible-section">
                <div className="auth-collapsible-header">
                  <MapPin size={16} color="#4A5Ef1" />
                  <span>Default Shipping Address (Optional for Faster Checkout)</span>
                </div>
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    name="address"
                    placeholder="House / Flat / Office Street Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="auth-sub-input"
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      name="city"
                      placeholder="City / Town (e.g. Delhi, Noida)"
                      value={formData.city}
                      onChange={handleChange}
                      className="auth-sub-input"
                    />
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode (6 digits)"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="auth-sub-input"
                    />
                  </div>
                </div>
              </div>

              <div className="auth-options-row" style={{ marginTop: '1.2rem' }}>
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <span style={{ fontSize: '0.84rem' }}>
                    I agree to the NextDigital <a href="#terms" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Terms of Service</a> and <a href="#privacy" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Privacy Policy</a>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="btn-primary auth-submit-btn"
                id="register-submit-button"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Creating Your Account...' : 'Complete Sign Up'}</span>
                <ArrowRight size={18} />
              </button>

              <div className="auth-footer-prompt">
                <span>Already have an account?</span>
                <Link
                  to={`/login${redirectTo !== '/account' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                  className="auth-signup-link"
                  id="link-to-login"
                >
                  Log In Here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
