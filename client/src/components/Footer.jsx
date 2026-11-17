import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

export const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="shopco-footer-wrapper">
      {/* 1. Floating Newsletter Black Card */}
      <div className="container">
        <div className="newsletter-card">
          <div className="newsletter-title-wrap">
            <h2>STAY UP TO DATE ABOUT OUR LATEST OFFERS</h2>
          </div>

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="newsletter-input-box">
              <Mail size={20} className="newsletter-mail-icon" />
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-newsletter-subscribe">
              {subscribed ? 'Subscribed!' : 'Subscribe to Newsletter'}
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main Footer Body with #F0F0F0 Background */}
      <div className="footer-main-body">
        <div className="container">
          <div className="footer-grid-shopco">
            {/* Brand Column */}
            <div className="footer-brand-col">
              <Link to="/" className="footer-logo">
                SHOP.CO
              </Link>
              <p className="footer-bio">
                We have products and electronics that suit your style and which you're proud to own. From cinema smart projectors to high-security surveillance.
              </p>

              {/* Social Circles */}
              <div className="social-icons-row">
                {/* Twitter / X */}
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-circle" aria-label="Twitter">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-circle active" aria-label="Facebook">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-circle" aria-label="Instagram">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                {/* GitHub */}
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-circle" aria-label="GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 1: Company */}
            <div className="footer-nav-col">
              <h4>COMPANY</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/shop">Features</Link></li>
                <li><Link to="/about">Works & Clients</Link></li>
                <li><Link to="/contact">Career</Link></li>
              </ul>
            </div>

            {/* Column 2: Help */}
            <div className="footer-nav-col">
              <h4>HELP</h4>
              <ul>
                <li><Link to="/contact">Customer Support</Link></li>
                <li><Link to="/contact">Delivery Details</Link></li>
                <li><Link to="/contact">Terms & Conditions</Link></li>
                <li><Link to="/contact">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Column 3: FAQ */}
            <div className="footer-nav-col">
              <h4>FAQ</h4>
              <ul>
                <li><Link to="/account">Account</Link></li>
                <li><Link to="/checkout">Manage Deliveries</Link></li>
                <li><Link to="/account">Orders</Link></li>
                <li><Link to="/checkout">Payments</Link></li>
              </ul>
            </div>

            {/* Column 4: Resources */}
            <div className="footer-nav-col">
              <h4>RESOURCES</h4>
              <ul>
                <li><Link to="/shop?category=Projectors">Smart Projectors Guide</Link></li>
                <li><Link to="/shop?category=CCTV">Surveillance Setup</Link></li>
                <li><Link to="/shop?category=Interactive Panels">Interactive Smart Panels</Link></li>
                <li><Link to="/admin">Admin Portal 🔒</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-divider" />

          {/* Bottom Bar: Copyright & Payment Badges */}
          <div className="footer-bottom-row">
            <p className="copyright-text">
              Shop.co © 2000-2026, All Rights Reserved
            </p>

            <div className="payment-badges-row">
              <span className="pay-badge visa">VISA</span>
              <span className="pay-badge mastercard">Mastercard</span>
              <span className="pay-badge paypal">PayPal</span>
              <span className="pay-badge applepay">ApplePay</span>
              <span className="pay-badge gpay">G Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
