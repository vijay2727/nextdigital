import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { Star, ChevronRight, CheckCircle2, SlidersHorizontal, ArrowLeft, ArrowRight, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { buildApiUrl } from '../config/api';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsDrawerOpen, savePendingAction } = useCart();
  const { isAuthenticated } = useAuth();

  const cleanId = id === 'nextdigital-75-flat-panel' 
    ? 'digitalnext-75-flat-panel' 
    : (id === 'nextdigital-65-flat-panel' ? 'digitalnext-65-flat-panel' : id);

  const [product, setProduct] = useState(() => PRODUCTS.find(p => p.id === cleanId || p.id === id) || null);
  const [activeImage, setActiveImage] = useState(product?.image || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // details, reviews, faqs
  const [selectedVariant, setSelectedVariant] = useState(0);

  useEffect(() => {
    fetch(buildApiUrl(`/api/products/${cleanId || id}`))
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setProduct(data.data);
          setActiveImage(data.data.image);
        }
      })
      .catch(() => {});
  }, [id, cleanId]);

  useEffect(() => {
    if (id && (id === 'nextdigital-75-flat-panel' || id === 'nextdigital-65-flat-panel')) {
      navigate(`/product/${cleanId}`, { replace: true });
    }
  }, [id, cleanId, navigate]);

  useEffect(() => {
    if (product) {
      if (!activeImage) setActiveImage(product.image);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 className="section-main-heading">Product Not Found</h2>
        <p style={{ color: 'rgba(0,0,0,0.6)', margin: '1rem 0 2rem' }}>
          The product you are looking for does not exist or has been moved.
        </p>
        <Link to="/shop" className="btn-shop-now" style={{ margin: '0 auto' }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const formatPrice = (price) => '₹' + price.toLocaleString('en-IN');

  const relatedProducts = PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      const returnUrl = `/product/${product.id}`;
      savePendingAction({
        action: 'add_to_cart',
        product,
        quantity,
        returnUrl
      });
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}&action=add_to_cart&productName=${encodeURIComponent(product.name)}`);
      return;
    }

    addToCart(product, quantity);
    setIsDrawerOpen(true);
  };

  const galleryImages = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : [product.image, product.image, product.image];

  return (
    <div className="shopco-detail-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="shopco-breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop">Shop</Link>
          <ChevronRight size={14} />
          <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
          <ChevronRight size={14} />
          <span className="current-crumb">{product.name}</span>
        </div>

        {/* Product Hero Details Grid */}
        <div className="detail-product-layout">
          {/* Gallery Block */}
          <div className="detail-gallery-block">
            {/* Vertical Thumbnails */}
            <div className="thumbnails-column">
              {galleryImages.slice(0, 3).map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn-card ${activeImage === img ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                  aria-label={`View angle ${idx + 1}`}
                >
                  <img src={img} alt={`${product.name} angle ${idx + 1}`} />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="main-image-stage">
              <img
                src={activeImage || product.image}
                alt={product.name}
                id="main-product-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/HY260 Pro (2).jpeg';
                }}
              />
            </div>
          </div>

          {/* Product Info Block */}
          <div className="detail-info-block">
            <h1 className="detail-product-name">{product.name}</h1>

            {/* Star Rating Row */}
            <div className="detail-rating-row">
              <div className="stars-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={star <= Math.round(product.rating) ? "#FFC633" : "none"}
                    color={star <= Math.round(product.rating) ? "#FFC633" : "#E2E8F0"}
                  />
                ))}
              </div>
              <span className="rating-score-text">
                {product.rating.toFixed(1)}<span className="rating-total">/5</span>
              </span>
            </div>

            {/* Price Row */}
            <div className="detail-price-row">
              <span className="detail-current-price">{formatPrice(product.price)}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="detail-mrp-price">{formatPrice(product.mrp)}</span>
                  <span className="detail-discount-badge">
                    {product.discount || `-${Math.round(((product.mrp - product.price) / product.mrp) * 100)}%`}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="detail-short-desc">
              {product.description || product.subtitle}
            </p>

            <div className="detail-divider" />

            {/* Options / Variant Selector (SHOP.CO Style) */}
            <div className="detail-option-group">
              <span className="option-label">Select Model / Variant</span>
              <div className="option-pills-row">
                {['Standard Edition', 'Pro Edition (Full Pack)', 'Dual Setup Pack'].map((variant, index) => (
                  <button
                    key={index}
                    className={`variant-pill-btn ${selectedVariant === index ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(index)}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            <div className="detail-divider" />

            {/* Quantity Selector + Add To Cart Button */}
            <div className="detail-action-bar">
              <div className="shopco-qty-pill">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qty-number">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                className="btn-add-to-cart-shopco"
                id="detail-add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section: Product Details, Rating & Reviews, FAQs */}
        <div className="shopco-tabs-container">
          <div className="tabs-header-bar">
            <button
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Product Details
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Rating & Reviews
            </button>
            <button
              className={`tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
              onClick={() => setActiveTab('faqs')}
            >
              FAQs
            </button>
          </div>

          <div className="tab-content-area">
            {activeTab === 'details' && (
              <div className="tab-pane-details">
                <div className="specs-table-card">
                  <h3>Technical Specifications</h3>
                  <table className="specs-table">
                    <tbody>
                      {product.specs && Object.entries(product.specs).map(([key, val]) => (
                        <tr key={key}>
                          <td className="spec-key">{key}</td>
                          <td className="spec-val">{val}</td>
                        </tr>
                      ))}
                      {!product.specs && (
                        <>
                          <tr>
                            <td className="spec-key">Category</td>
                            <td className="spec-val">{product.category}</td>
                          </tr>
                          <tr>
                            <td className="spec-key">Warranty</td>
                            <td className="spec-val">1 Year Official Brand Warranty</td>
                          </tr>
                          <tr>
                            <td className="spec-key">Authenticity</td>
                            <td className="spec-val">100% Genuine Certified Hardware</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {product.features && product.features.length > 0 && (
                  <div className="features-card">
                    <h3>Key Highlights</h3>
                    <ul className="features-list">
                      {product.features.map((feat, idx) => (
                        <li key={idx}>
                          <CheckCircle2 size={16} className="feature-check" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-pane-reviews">
                <div className="reviews-header-bar">
                  <div className="reviews-count-title">
                    All Reviews <span>({product.reviewsCount})</span>
                  </div>
                  <div className="reviews-actions">
                    <button className="filter-circle-btn" aria-label="Filter reviews">
                      <SlidersHorizontal size={16} />
                    </button>
                    <button className="btn-write-review">
                      Write a Review
                    </button>
                  </div>
                </div>

                <div className="reviews-cards-grid">
                  <div className="review-card-item">
                    <div className="stars-row">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={16} fill="#FFC633" color="#FFC633" />
                      ))}
                    </div>
                    <div className="reviewer-name-row">
                      <span className="reviewer-name">Samantha D.</span>
                      <CheckCircle2 size={16} fill="#01AB31" color="#fff" />
                    </div>
                    <p className="review-comment">
                      "I love this product! The quality is top notch and the setup took less than 5 minutes. Exactly what I was looking for."
                    </p>
                    <span className="review-date">Posted on August 14, 2026</span>
                  </div>

                  <div className="review-card-item">
                    <div className="stars-row">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={16} fill="#FFC633" color="#FFC633" />
                      ))}
                    </div>
                    <div className="reviewer-name-row">
                      <span className="reviewer-name">Ethan R.</span>
                      <CheckCircle2 size={16} fill="#01AB31" color="#fff" />
                    </div>
                    <p className="review-comment">
                      "Exceeded my expectations! Crystal clear image quality and built-in speakers are surprisingly punchy."
                    </p>
                    <span className="review-date">Posted on August 19, 2026</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faqs' && (
              <div className="tab-pane-faqs">
                <div className="faq-item">
                  <h4>What is covered under the warranty?</h4>
                  <p>All units come with full 1 to 3 year manufacturer warranty covering hardware defects, power adapters, and technical support.</p>
                </div>
                <div className="faq-item">
                  <h4>How fast is shipping?</h4>
                  <p>We dispatch all orders within 24 hours. Delivery takes 2-4 business days across India.</p>
                </div>
                <div className="faq-item">
                  <h4>Can I return or exchange?</h4>
                  <p>Yes, we offer a hassle-free 7-day return policy for any transit damages or verified defects.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* YOU MIGHT ALSO LIKE Section */}
        {relatedProducts.length > 0 && (
          <section className="shopco-section you-might-like">
            <h2 className="section-main-heading">YOU MIGHT ALSO LIKE</h2>
            <div className="shopco-products-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
