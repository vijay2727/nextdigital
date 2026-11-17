import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, X, Menu, ChevronDown, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showTopBar, setShowTopBar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="main-header">
      {/* 1. Top Black Announcement Bar with Dismiss Button */}
      {showTopBar && (
        <div className="top-announcement-bar">
          <div className="container announcement-inner">
            <span className="announcement-text">
              Sign up and get 20% off to your first order.{' '}
              <Link to={user ? "/shop" : "/register"} className="announcement-link">
                Sign Up Now
              </Link>
            </span>
            <button
              className="announcement-close-btn"
              onClick={() => setShowTopBar(false)}
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="navbar-container">
        <div className="container">
          <div className="header-inner">
            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Brand Logo - SHOP.CO / DIGITALNEXT Heavy Display Style */}
            <Link to="/" className="brand-logo" id="header-brand-logo" title="DigitalNext | SHOP.CO Style">
              <span className="logo-main">SHOP.CO</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav">
              <div
                className="nav-item-dropdown"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <Link to="/shop" className="nav-link dropdown-trigger">
                  <span>Shop</span>
                  <ChevronDown size={14} className={`dropdown-chevron ${shopDropdownOpen ? 'open' : ''}`} />
                </Link>

                {shopDropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/shop?category=Projectors" onClick={() => setShopDropdownOpen(false)}>
                      Smart Projectors
                    </Link>
                    <Link to="/shop?category=Interactive Panels" onClick={() => setShopDropdownOpen(false)}>
                      Interactive 4K Panels
                    </Link>
                    <Link to="/shop?category=CCTV" onClick={() => setShopDropdownOpen(false)}>
                      CCTV Cameras
                    </Link>
                    <Link to="/shop?category=Spy Cam" onClick={() => setShopDropdownOpen(false)}>
                      Spy & Hidden Cameras
                    </Link>
                    <Link to="/shop?category=Dashcam" onClick={() => setShopDropdownOpen(false)}>
                      Car Dashcams
                    </Link>
                    <Link to="/shop?category=Storage" onClick={() => setShopDropdownOpen(false)}>
                      SSD & Memory Cards
                    </Link>
                    <div className="dropdown-divider" />
                    <Link to="/shop" onClick={() => setShopDropdownOpen(false)} style={{ fontWeight: 700 }}>
                      View All Products →
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/shop?deal=true" className="nav-link">
                On Sale
              </Link>
              <Link to="/shop?sort=newest" className="nav-link">
                New Arrivals
              </Link>
              <Link to="/about" className="nav-link">
                Brands
              </Link>
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </nav>

            {/* Rounded Pill Search Bar */}
            <form className="search-bar-form" onSubmit={handleSearchSubmit}>
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  id="header-search-input"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Actions: Cart & Profile Icons */}
            <div className="header-actions">
              <button
                className="icon-action-btn"
                id="header-cart-button"
                onClick={() => setIsDrawerOpen(true)}
                aria-label="View shopping cart"
              >
                <ShoppingCart size={22} />
                {totalItemsCount > 0 && (
                  <span className="cart-count-badge" id="cart-item-count">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              <Link
                to={user ? '/account' : '/login'}
                className="icon-action-btn"
                id="header-account-button"
                aria-label="Customer Account"
                title={user ? `Signed in as ${user.name}` : 'Sign In'}
              >
                <User size={22} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <ul className="mobile-nav-list">
            <li>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            </li>
            <li>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
            </li>
            <li>
              <Link to="/shop?deal=true" onClick={() => setMobileMenuOpen(false)}>On Sale (Deals)</Link>
            </li>
            <li>
              <Link to="/shop?sort=newest" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
            </li>
            <li>
              <Link to="/shop?category=Projectors" onClick={() => setMobileMenuOpen(false)}>Projectors</Link>
            </li>
            <li>
              <Link to="/shop?category=Interactive Panels" onClick={() => setMobileMenuOpen(false)}>Smart Class Panels</Link>
            </li>
            <li>
              <Link to="/shop?category=CCTV" onClick={() => setMobileMenuOpen(false)}>CCTV Cameras</Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>Brands & About</Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </li>
            <li className="mobile-nav-auth">
              <Link to={user ? "/account" : "/login"} onClick={() => setMobileMenuOpen(false)}>
                {user ? `Account (${user.name})` : "Sign In / Register"}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
