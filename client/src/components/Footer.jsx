import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Clock, ShieldCheck, Truck, Headphones } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Overview */}
          <div className="footer-col">
            <div className="brand-logo" style={{ color: '#ffffff', marginBottom: '1rem' }}>
              <span className="logo-badge">Next</span>
              <span style={{ color: '#60a5fa' }}>Digital</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.2rem' }}>
              Your one-stop destination for CCTV security systems, smart HD projectors, 4K interactive panels, covert spy cameras, and computer storage accessories across India.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', color: '#cbd5e1' }}>
                <MapPin size={16} color="#60a5fa" />
                <span>C-76, Street No-7, West Vinod Nagar, Mandawali, Delhi-110092</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', color: '#cbd5e1' }}>
                <Mail size={16} color="#60a5fa" />
                <a href="mailto:info@cctvwale.com" style={{ color: '#cbd5e1' }}>info@cctvwale.com</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', color: '#cbd5e1' }}>
                <Phone size={16} color="#60a5fa" />
                <a href="tel:+919999593931" style={{ color: '#cbd5e1', fontWeight: 600 }}>+91 99995 93931</a>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div className="footer-col">
            <h4>Product Categories</h4>
            <ul className="footer-links">
              <li><Link to="/shop?category=Projectors">Smart Projectors</Link></li>
              <li><Link to="/shop?category=Interactive Panels">Interactive Panels (4K)</Link></li>
              <li><Link to="/shop?category=CCTV">CCTV Security Cameras</Link></li>
              <li><Link to="/shop?category=Spy Cam">Spy & Hidden Cameras</Link></li>
              <li><Link to="/shop?category=Dashcam">Car Dashcams</Link></li>
              <li><Link to="/shop?category=Storage">Simmtronics SSD & MicroSD</Link></li>
              <li><Link to="/shop?category=Cables">Gold Plated HDMI Cables</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Customer Support</h4>
            <ul className="footer-links">
              <li><Link to="/contact">Request a Quote</Link></li>
              <li><Link to="/about">About NextDigital</Link></li>
              <li><Link to="/shop?deal=true">Today's Deals</Link></li>
              <li><Link to="/contact">Bulk Institutional Orders</Link></li>
              <li><Link to="/contact">After Sales Technical Support</Link></li>
              <li><Link to="/contact">Warranty & Returns</Link></li>
            </ul>
          </div>

          {/* Trust & Guarantees */}
          <div className="footer-col">
            <h4>Why NextDigital</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                <ShieldCheck size={20} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#ffffff', fontSize: '0.88rem', fontWeight: 600 }}>100% Genuine Tech</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Direct official brand warranties on all items.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                <Truck size={20} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#ffffff', fontSize: '0.88rem', fontWeight: 600 }}>Pan India Dispatch</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Fast reliable transit via top courier partners.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                <Headphones size={20} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#ffffff', fontSize: '0.88rem', fontWeight: 600 }}>CCTV Wale & Projector Wale</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Trusted on-ground technical assistance.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© 2026 NextDigital India. Designed for high performance e-commerce. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Verified Genuine Products</span>
            <span>GST Registered</span>
            <span>Secure Checkout Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
