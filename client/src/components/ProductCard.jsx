import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const ProductCard = ({ product }) => {
  const { addToCart, savePendingAction } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return '₹' + price.toLocaleString('en-IN');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      const returnUrl = `/product/${product.id}`;
      savePendingAction({
        action: 'add_to_cart',
        product,
        quantity: 1,
        returnUrl
      });
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}&action=add_to_cart&productName=${encodeURIComponent(product.name)}`);
      return;
    }

    addToCart(product, 1);
  };

  return (
    <div className="shopco-product-card" id={`product-card-${product.id}`}>
      {/* Product Image Box with #F0EEED Background */}
      <div className="product-card-img-box">
        {product.isDeal && (
          <span className="product-card-pill-badge deal">Deal</span>
        )}
        {!product.isDeal && product.isBestSeller && (
          <span className="product-card-pill-badge bestseller">Popular</span>
        )}

        <Link to={`/product/${product.id}`} className="img-anchor">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/HY260 Pro (2).jpeg';
            }}
          />
        </Link>

        {/* Quick Add To Cart overlay on hover */}
        <button
          className="quick-cart-hover-btn"
          onClick={handleAddToCart}
          aria-label="Add to cart"
          title="Add to cart"
        >
          <ShoppingBag size={18} />
          <span>Add To Cart</span>
        </button>
      </div>

      {/* Product Info */}
      <div className="product-card-details">
        <Link to={`/product/${product.id}`}>
          <h3 className="product-card-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* Star Rating in SHOP.CO style: ★★★★☆ 4.5/5 */}
        <div className="product-card-rating">
          <div className="stars-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                fill={star <= Math.round(product.rating) ? "#FFC633" : "none"}
                color={star <= Math.round(product.rating) ? "#FFC633" : "#E2E8F0"}
              />
            ))}
          </div>
          <span className="rating-score-text">
            {product.rating.toFixed(1)}<span className="rating-total">/5</span>
          </span>
        </div>

        {/* Price Row with Bold Price, MRP line-through, and Red Discount Badge */}
        <div className="product-card-price-row">
          <span className="product-current-price">{formatPrice(product.price)}</span>
          {product.mrp && product.mrp > product.price && (
            <>
              <span className="product-mrp-price">{formatPrice(product.mrp)}</span>
              <span className="product-discount-badge">
                {product.discount || `-${Math.round(((product.mrp - product.price) / product.mrp) * 100)}%`}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
