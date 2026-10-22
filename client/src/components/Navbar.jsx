import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Phone, ShieldCheck, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="main-header">
      {/* Top Announcement Bar */}
      <div className="top-announcement-bar">
        <span>
          Use coupon code <strong>DNEXCLUSIVE1</strong> to get ₹300 OFF on orders above ₹1,999 | Free Shipping above ₹999
        </span>
      </div>

      {/* Main Header Row */}
      <div className="container">
        <div className="header-inner">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" id="header-brand-logo">
            <span className="logo-badge">Digital</span>
            <span className="next">Next</span>
          </Link>

          {/* Search Bar */}
          <form className="search-bar-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <Search size={18} color="#64748b" />
              <input
                type="text"
                id="header-search-input"
                placeholder="Search projectors, CCTV cameras, spy cams, SSDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Actions & Contact */}
          <div className="header-actions">
            <div className="contact-pill">
              <Phone size={16} color="#2563eb" />
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Need Help?</div>
                <a href="tel:+919999593931" className="phone-num">+91 99995 93931</a>
              </div>
            </div>

            <button
              className="cart-btn-trigger"
              id="header-cart-button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="View shopping cart"
            >
              <ShoppingBag size={20} />
              <span>Cart</span>
              {totalItemsCount > 0 && (
                <span className="cart-count-badge" id="cart-item-count">{totalItemsCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Sub-bar */}
      <nav className="nav-bar-sub">
        <div className="container">
          <ul className="nav-links-list">
            <li className="nav-link-item">
              <Link to="/" id="nav-home">Home</Link>
            </li>
            <li className="nav-link-item">
              <Link to="/shop" id="nav-shop-all">Shop All</Link>
            </li>
            <li className="nav-link-item deal-highlight">
              <Link to="/shop?deal=true" id="nav-deals">Flash Deals</Link>
            </li>
            <li className="nav-link-item">
              <Link to="/shop?category=Projectors" id="nav-projectors">Projectors</Link>
            </li>
            <li className="nav-link-item">
              <Link to="/shop?category=Interactive Panels" id="nav-panels">Smart Class Panels</Link>
            </li>
            <li className="nav-link-item">
              <Link to="/shop?category=CCTV" id="nav-cctv">CCTV Cameras</Link>
            </li>
            <li className="nav-link-item">
              <Link to="/shop?category=Spy Cam" id="nav-spy-cam">Spy Cam</Link>
            </li>
            <li className="nav-link-item">
              <Link to="/shop?category=Dashcam" id="nav-dashcam">Car Dashcams</Link>
            </li>
            <li className="nav-link-item">
              <Link to="/shop?category=Storage" id="nav-storage">SSD & Memory</Link>
            </li>
            <li className="nav-link-item">
              <Link to="/about" id="nav-about">About Us</Link>
            </li>
            <li className="nav-link-item">
              <Link to="/contact" id="nav-contact">Contact</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};
