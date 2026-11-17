import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { Star, ShoppingBag, ShieldCheck, Truck, Headphones, Check, Zap } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsDrawerOpen, savePendingAction } = useCart();
  const { isAuthenticated } = useAuth();

  const cleanId = id === 'nextdigital-75-flat-panel' 
    ? 'digitalnext-75-flat-panel' 
    : (id === 'nextdigital-65-flat-panel' ? 'digitalnext-65-flat-panel' : id);

  const product = PRODUCTS.find(p => p.id === cleanId || p.id === id);

  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id && (id === 'nextdigital-75-flat-panel' || id === 'nextdigital-65-flat-panel')) {
      navigate(`/product/${cleanId}`, { replace: true });
    }
  }, [id, cleanId, navigate]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <p style={{ color: '#64748b', margin: '1rem 0 2rem' }}>The product you are looking for does not exist or has been moved.</p>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
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

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      savePendingAction({
        action: 'buy_now',
        product,
        quantity,
        returnUrl: '/checkout'
      });
      navigate(`/login?redirect=${encodeURIComponent('/checkout')}&action=buy_now&productName=${encodeURIComponent(product.name)}`);
      return;
    }

    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ padding: '1.5rem 0', fontSize: '0.86rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/" style={{ color: '#64748b' }}>Home</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} style={{ color: '#64748b' }}>{product.category}</Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="product-detail-grid">
          {/* Gallery Column */}
          <div className="detail-gallery">
            <div className="detail-main-image">
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

            {product.gallery && product.gallery.length > 1 && (
              <div className="detail-thumbnails">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn ${activeImage === img ? 'active' : ''}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Column */}
          <div className="detail-info-box">
            <div className="detail-category-tag">{product.category}</div>
            <h1 className="detail-title">{product.name}</h1>
            <p className="detail-subtitle">{product.subtitle}</p>

            {/* Rating and Reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#fef3c7', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700, color: '#b45309' }}>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span style={{ color: '#64748b', fontSize: '0.88rem' }}>({product.reviewsCount} customer reviews)</span>
              <span style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Check size={14} /> In Stock (Direct Warehouse Dispatch)
              </span>
            </div>

            {/* Price Card */}
            <div className="detail-price-card">
              <span className="detail-price">{formatPrice(product.price)}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '1.1rem' }}>
                    {formatPrice(product.mrp)}
                  </span>
                  <span className="discount-tag" style={{ fontSize: '0.85rem', padding: '0.2rem 0.6rem' }}>
                    {product.discount}
                  </span>
                </>
              )}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '-1rem', marginBottom: '1.5rem' }}>
              Inclusive of all taxes & GST. Free delivery on orders over ₹999.
            </div>

            {/* Description */}
            <p style={{ color: '#334155', fontSize: '0.98rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
                  Key Highlights
                </h4>
                <ul className="detail-features-list">
                  {product.features.map((feat, idx) => (
                    <li key={idx}>
                      <Check size={16} className="feature-check-icon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="quantity-row">
              <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>Quantity:</span>
              <div className="quantity-control">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qty-display">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="detail-actions-row">
              <button
                className="btn-add-detail"
                id="detail-add-to-cart-btn"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </button>
              <button
                className="btn-primary"
                id="detail-buy-now-btn"
                onClick={handleBuyNow}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Zap size={18} />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Trust Assurances */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '1.2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <ShieldCheck size={20} color="#2563eb" style={{ margin: '0 auto 0.3rem' }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>100% Genuine</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Brand Warranty</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Truck size={20} color="#2563eb" style={{ margin: '0 auto 0.3rem' }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Pan-India Delivery</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Express Air Courier</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Headphones size={20} color="#2563eb" style={{ margin: '0 auto 0.3rem' }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Tech Assistance</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>CCTV Wale Support</div>
              </div>
            </div>

            {/* Technical Specifications */}
            {product.specs && (
              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#0f172a', fontWeight: 700, marginBottom: '0.8rem' }}>
                  Technical Specifications
                </h3>
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key}>
                        <td className="spec-key">{key}</td>
                        <td className="spec-val">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="section-wrapper" style={{ borderTop: '1px solid var(--border-light)', marginTop: '2rem' }}>
            <div className="section-header">
              <div className="section-title-group">
                <h2>Related Products</h2>
                <p>More top recommended gear in {product.category}</p>
              </div>
              <Link to={`/shop?category=${product.category}`} className="view-all-link">
                <span>View All {product.category}</span>
              </Link>
            </div>
            <div className="products-grid">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
