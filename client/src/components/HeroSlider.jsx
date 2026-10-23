import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Percent, Award } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: "POPULAR IN PROJECTORS",
    title: "DigitalNext HY260 PRO Smart Projector",
    subtitle: "Native 1080P Full HD with 4K decoding support and Android 11.",
    price: "₹9,999",
    mrp: "₹12,000",
    discount: "17% OFF",
    badgeTitle: "BEST VALUE & PRICE",
    buttonText: "View Projectors",
    link: "/product/hy260-pro",
    image: "/images/HY260 Pro (2).jpeg",
    gradient: "linear-gradient(135deg, #4A5Ef1 0%, #7989f7 100%)"
  },
  {
    id: 2,
    tag: "SMART EDUCATION",
    title: "DigitalNext 75 Inch 4K Interactive Flat Panel",
    subtitle: "20-point touch smart board for schools, colleges, and meeting rooms.",
    price: "₹1,59,999",
    mrp: "₹2,29,999",
    discount: "30% OFF",
    badgeTitle: "EDUCATION SPECIAL",
    buttonText: "Explore Panels",
    link: "/product/digitalnext-75-flat-panel",
    image: "/images/05ee03a6-21de-4af2-a56d-0f70aaddc51d.png",
    gradient: "linear-gradient(135deg, #1e293b 0%, #4A5Ef1 100%)"
  },
  {
    id: 3,
    tag: "FLASH SALE",
    title: "CP PLUS 360 Degree Wi-Fi PT Camera",
    subtitle: "Motorized pan and tilt, motion tracking, two-way audio, and night vision.",
    price: "₹1,225",
    mrp: "₹3,600",
    discount: "66% OFF",
    badgeTitle: "TOP SELLER & PRICE",
    buttonText: "Shop CCTV Cameras",
    link: "/product/cp-plus-cpe28a",
    image: "/images/1_24e0b08d-b976-4af6-b1c3-25577607556f.webp",
    gradient: "linear-gradient(135deg, #0f172a 0%, #7989f7 100%)"
  },
  {
    id: 4,
    tag: "VEHICLE SURVEILLANCE",
    title: "Triple Camera Car Dashcam with Touch Screen",
    subtitle: "Simultaneous road front, cabin interior, and rear parking recording.",
    price: "₹4,999",
    mrp: "₹9,999",
    discount: "50% OFF",
    badgeTitle: "ROAD SAFETY DEAL",
    buttonText: "View Car Dashcams",
    link: "/product/car-dashcam-triple",
    image: "/images/Dash Cam.png",
    gradient: "linear-gradient(135deg, #312e81 0%, #4A5Ef1 100%)"
  }
];

export const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[currentSlide];

  return (
    <div
      className="hero-slider-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        {/* Main Slider Card */}
        <div
          className="hero-slider-card"
          style={{ background: slide.gradient }}
          id="hero-slider-main"
        >
          {/* Arrow Left */}
          <button
            className="slider-nav-btn prev"
            onClick={handlePrev}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Arrow Right */}
          <button
            className="slider-nav-btn next"
            onClick={handleNext}
            aria-label="Next Slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slide Content Grid */}
          <div className="slider-content-grid">
            {/* Left Text Block */}
            <div className="slider-text-block">
              <span className="slider-tag-chip">{slide.tag}</span>
              <h1 className="slider-title">{slide.title}</h1>
              <p className="slider-subtitle">{slide.subtitle}</p>

              <div className="slider-action-row">
                <Link to={slide.link} className="slider-cta-btn">
                  {slide.buttonText}
                </Link>
                <div className="slider-discount-pill">
                  {slide.discount}
                </div>
              </div>
            </div>

            {/* Right Media & Price Badge */}
            <div className="slider-media-block">
              {/* Floating Deal Stamp Badge */}
              <div className="slider-badge-stamp">
                <span className="stamp-sub">FOR THE</span>
                <span className="stamp-main">{slide.badgeTitle}</span>
              </div>

              {/* Retail Price Tag Badge */}
              <div className="retail-price-tag" title="Special Direct Price">
                <div className="price-tag-hole"></div>
                <div className="price-tag-content">
                  <span className="price-tag-label">SPECIAL OFFER</span>
                  <span className="price-tag-amount">{slide.price}</span>
                  <span className="price-tag-mrp">MRP {slide.mrp}</span>
                </div>
              </div>

              {/* Product Hero Shot */}
              <div className="slider-image-wrapper">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="slider-hero-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/HY260 Pro (2).jpeg';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Bar Indicators */}
          <div className="slider-indicators">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                className={`slider-indicator-bar ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 5-Card Quick Highlight Strip (Matching reference mockup below hero banner) */}
        <div className="quick-strip-grid">
          {/* Card 1: Featured deal */}
          <Link to="/product/cp-plus-cpe28a" className="quick-strip-card">
            <div className="quick-card-img-box">
              <img src="/images/1_24e0b08d-b976-4af6-b1c3-25577607556f.webp" alt="CP Plus Camera" />
            </div>
            <div className="quick-card-info">
              <h4>CP PLUS 360 Camera</h4>
              <div className="quick-card-prices">
                <span className="quick-card-mrp">₹3,600</span>
                <span className="quick-card-price">₹1,225</span>
              </div>
            </div>
          </Link>

          {/* Card 2: Promo Coupon */}
          <div className="quick-strip-card coupon-card">
            <div className="quick-icon-bubble accent-lime">
              <Percent size={18} />
            </div>
            <div className="quick-card-info">
              <h4>Save ₹300 on orders</h4>
              <p>With code <strong>DIGITALNEXT1</strong></p>
            </div>
          </div>

          {/* Card 3: Institutional supply */}
          <Link to="/shop?category=Interactive Panels" className="quick-strip-card">
            <div className="quick-icon-bubble soft-blue">
              <Award size={18} />
            </div>
            <div className="quick-card-info">
              <h4>Smart Class Panels</h4>
              <p>4K touch displays for schools</p>
            </div>
          </Link>

          {/* Card 4: Free delivery */}
          <div className="quick-strip-card">
            <div className="quick-icon-bubble soft-purple">
              <Truck size={18} />
            </div>
            <div className="quick-card-info">
              <h4>Free Delivery</h4>
              <p>On all orders above ₹999</p>
            </div>
          </div>

          {/* Card 5: Warranty */}
          <div className="quick-strip-card">
            <div className="quick-icon-bubble accent-yellow">
              <ShieldCheck size={18} />
            </div>
            <div className="quick-card-info">
              <h4>1 to 3 Year Warranty</h4>
              <p>Official manufacturer warranty</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
