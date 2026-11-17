import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { HeroSection } from '../components/HeroSection';

export const Home = () => {
  // New Arrivals & Top Selling product slices
  const newArrivals = PRODUCTS.slice(0, 4);
  const topSelling = PRODUCTS.filter(p => p.isBestSeller || p.isDeal).slice(0, 4);

  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      verified: true,
      text: "I'm blown away by the quality and style of the products I received. From customer support to delivery, everything was seamless and beyond my expectations!"
    },
    {
      id: 2,
      name: "Alex K.",
      verified: true,
      text: "Finding high-performance tech that looks sleek in my living room used to be a struggle until I discovered this store. The HY260 projector is phenomenal!"
    },
    {
      id: 3,
      name: "James L.",
      verified: true,
      text: "As someone who is really particular about product quality and aesthetics, I can say with 100% certainty that this is the best purchase decision I've made this year."
    }
  ];

  return (
    <div className="shopco-home-page">
      {/* 1. Hero Section + Brand Strip */}
      <HeroSection />

      {/* 2. New Arrivals Section */}
      <section className="shopco-section" id="new-arrivals">
        <div className="container">
          <h2 className="section-main-heading">NEW ARRIVALS</h2>

          <div className="shopco-products-grid">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="section-cta-wrap">
            <Link to="/shop" className="btn-view-all-pill">
              View All
            </Link>
          </div>

          <div className="section-horizontal-divider" />
        </div>
      </section>

      {/* 3. Top Selling Section */}
      <section className="shopco-section" id="top-selling">
        <div className="container">
          <h2 className="section-main-heading">TOP SELLING</h2>

          <div className="shopco-products-grid">
            {topSelling.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="section-cta-wrap">
            <Link to="/shop?deal=true" className="btn-view-all-pill">
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Browse by Category / Dress Style Bento Container */}
      <section className="shopco-section bento-section">
        <div className="container">
          <div className="bento-container-card">
            <h2 className="bento-main-heading">BROWSE BY CATEGORY</h2>

            <div className="bento-grid">
              {/* Card 1: Projectors */}
              <Link to="/shop?category=Projectors" className="bento-card bento-card-sm bento-card-1">
                <span className="bento-card-title">Projectors</span>
                <img
                  src="/images/HY260 Pro (2).jpeg"
                  alt="Projectors"
                  className="bento-card-bg-img"
                />
              </Link>

              {/* Card 2: Interactive Panels */}
              <Link to="/shop?category=Interactive Panels" className="bento-card bento-card-lg bento-card-2">
                <span className="bento-card-title">Smart Panels</span>
                <img
                  src="/images/05ee03a6-21de-4af2-a56d-0f70aaddc51d.png"
                  alt="Smart Panels"
                  className="bento-card-bg-img"
                />
              </Link>

              {/* Card 3: CCTV Surveillance */}
              <Link to="/shop?category=CCTV" className="bento-card bento-card-lg bento-card-3">
                <span className="bento-card-title">CCTV Cameras</span>
                <img
                  src="/images/1_24e0b08d-b976-4af6-b1c3-25577607556f.webp"
                  alt="CCTV Cameras"
                  className="bento-card-bg-img"
                />
              </Link>

              {/* Card 4: Dashcam & Storage */}
              <Link to="/shop?category=Dashcam" className="bento-card bento-card-sm bento-card-4">
                <span className="bento-card-title">Car Dashcams</span>
                <img
                  src="/images/Dash Cam.png"
                  alt="Car Dashcams"
                  className="bento-card-bg-img"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Reviews / Testimonials Section */}
      <section className="shopco-section testimonials-section">
        <div className="container">
          <div className="testimonials-header-row">
            <h2 className="section-main-heading left-align">OUR HAPPY CUSTOMERS</h2>
            <div className="testimonials-nav-arrows">
              <button className="arrow-btn" aria-label="Previous review">
                <ArrowLeft size={20} />
              </button>
              <button className="arrow-btn" aria-label="Next review">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-stars-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={18} fill="#FFC633" color="#FFC633" />
                  ))}
                </div>

                <div className="testimonial-author">
                  <span className="author-name">{t.name}</span>
                  {t.verified && (
                    <CheckCircle2 size={16} className="verified-icon" fill="#01AB31" color="#ffffff" />
                  )}
                </div>

                <p className="testimonial-body">
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
