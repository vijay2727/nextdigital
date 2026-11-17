import React from 'react';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="shopco-hero-section">
      <div className="container">
        <div className="hero-content-grid">
          {/* Left Column: Headlines & Stats */}
          <div className="hero-text-col">
            <h1 className="hero-main-title">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>

            <p className="hero-description">
              Browse through our diverse range of meticulously crafted garments, smart projectors, 
              interactive panels, and tech hardware designed to bring out your individuality and cater 
              to your sense of style.
            </p>

            <div className="hero-cta-wrap">
              <Link to="/shop" className="btn-shop-now">
                Shop Now
              </Link>
            </div>

            {/* Stats Row */}
            <div className="hero-stats-row">
              <div className="stat-item">
                <span className="stat-number">200+</span>
                <span className="stat-label">International Brands</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-number">2,000+</span>
                <span className="stat-label">High-Quality Products</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-number">30,000+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with 4-Point Sparkle Stars */}
          <div className="hero-visual-col">
            {/* Sparkle Star - Top Right */}
            <div className="hero-sparkle sparkle-lg">
              <svg viewBox="0 0 104 104" fill="currentColor">
                <path d="M52 0C52 28.7 28.7 52 0 52C28.7 52 52 75.3 52 104C52 75.3 75.3 52 104 52C75.3 52 52 28.7 52 0Z" />
              </svg>
            </div>

            {/* Sparkle Star - Middle Left */}
            <div className="hero-sparkle sparkle-sm">
              <svg viewBox="0 0 56 56" fill="currentColor">
                <path d="M28 0C28 15.46 15.46 28 0 28C15.46 28 28 40.54 28 56C28 40.54 40.54 28 56 28C40.54 28 28 15.46 28 0Z" />
              </svg>
            </div>

            {/* Hero Main Image */}
            <div className="hero-image-wrapper">
              <img
                src="/images/shopping (1).webp"
                alt="Find clothes and tech that match your style"
                className="hero-person-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/HY260 Pro (2).jpeg';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Iconic Solid Black Brand Strip Directly Below Hero */}
      <div className="hero-brand-strip" id="brands">
        <div className="container">
          <div className="brand-strip-inner">
            <span className="brand-logo-text versace">VERSACE</span>
            <span className="brand-logo-text zara">ZARA</span>
            <span className="brand-logo-text gucci">GUCCI</span>
            <span className="brand-logo-text prada">PRADA</span>
            <span className="brand-logo-text calvin">Calvin Klein</span>
          </div>
        </div>
      </div>
    </section>
  );
};
