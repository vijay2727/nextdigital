import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
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
    <div className="product-card" id={`product-card-${product.id}`}>
      {/* Product Image Box */}
      <div className="card-image-box">
        {product.isDeal && (
          <span className="card-badge deal">Deal</span>
        )}
        {!product.isDeal && product.isBestSeller && (
          <span className="card-badge bestseller">Bestseller</span>
        )}
        <Link to={`/product/${product.id}`} style={{ display: 'contents' }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              // Fallback placeholder if image path fails
              e.target.onerror = null;
              e.target.src = '/images/HY260 Pro (2).jpeg';
            }}
          />
        </Link>
      </div>

      {/* Card Content */}
      <div className="card-content">
        <div className="card-category">{product.category}</div>

        <Link to={`/product/${product.id}`}>
          <h3 className="card-title" title={product.name}>{product.name}</h3>
        </Link>

        <p className="card-subtitle">{product.subtitle}</p>

        {/* Rating */}
        <div className="card-rating">
          <Star size={14} className="rating-star-icon" fill="#f59e0b" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="rating-count">({product.reviewsCount})</span>
        </div>

        {/* Price Row */}
        <div className="card-price-row">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.mrp && product.mrp > product.price && (
            <>
              <span className="mrp-price">{formatPrice(product.mrp)}</span>
              <span className="discount-tag">{product.discount}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="card-actions">
          <button
            className="btn-card-add"
            id={`add-to-cart-${product.id}`}
            onClick={handleAddToCart}
          >
            <ShoppingBag size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
