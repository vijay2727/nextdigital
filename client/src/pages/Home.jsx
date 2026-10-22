import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProudAssociation } from '../components/ProudAssociation';
import { HeroSlider } from '../components/HeroSlider';

export const Home = () => {
  const flashDeals = PRODUCTS.filter(p => p.isDeal).slice(0, 6);
  const bestSellers = PRODUCTS.filter(p => p.isBestSeller).slice(0, 6);

  return (
    <div className="home-page">
      {/* 1. Hero Slider Section with 4 Slides and Quick Highlights Strip */}
      <HeroSlider />

      {/* 2. Flash Deals Section */}
      <section className="section-wrapper" id="home-flash-deals">
        <div className="container">
          <div className="section-header">
            <div className="section-title-group">
              <h2>Flash Deals</h2>
              <p>Direct pricing on verified projectors and surveillance equipment</p>
            </div>
            <Link to="/shop?deal=true" className="view-all-link">
              <span>View All Deals</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="products-grid">
            {flashDeals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Category Showcase */}
      <section className="section-wrapper" style={{ background: 'var(--color-soft-blue)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-title-group">
              <h2>Product Categories</h2>
              <p>Hardware solutions for cinema setups, smart classrooms, and security</p>
            </div>
            <Link to="/shop" className="view-all-link">
              <span>All Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="categories-showcase-grid">
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <Link to={`/shop?category=${cat.id}`} key={cat.id} className="category-tile">
                <h4>{cat.name}</h4>
                <span>Explore Catalog</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best Sellers */}
      <section className="section-wrapper" id="home-bestsellers">
        <div className="container">
          <div className="section-header">
            <div className="section-title-group">
              <h2>Best Sellers</h2>
              <p>Verified models for home entertainment, education, and surveillance</p>
            </div>
            <Link to="/shop" className="view-all-link">
              <span>View Full Catalog</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="products-grid">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Promotional Banner */}
      <div className="container">
        <div style={{ background: '#030303', color: '#ffffff', borderRadius: '16px', padding: '2.5rem 3rem', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', alignItems: 'center', gap: '2rem', margin: '2rem 0 3.5rem', boxShadow: 'var(--shadow-lg)' }}>
          <div>
            <span style={{ display: 'inline-block', background: 'var(--color-accent)', color: '#030303', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.8rem' }}>
              Special Promotion
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1.2, marginBottom: '0.8rem', color: '#ffffff' }}>
              Triple Camera Car Dashcam with Touch Screen
            </h3>
            <p style={{ color: '#d1d5db', fontSize: '0.96rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Front road view, cabin interior recording with night vision, and rear parking camera with guidelines.
            </p>
            <Link to="/product/car-dashcam-triple" className="btn-primary">
              <span>View Dashcam (₹4,999)</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img src="/images/Dash Cam.png" alt="DigitalNext Car Dashcam" style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain' }} />
          </div>
        </div>
      </div>

      {/* 6. Proud Association */}
      <ProudAssociation />
    </div>
  );
};
