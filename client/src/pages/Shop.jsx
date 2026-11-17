import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, ChevronRight, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { buildApiUrl } from '../config/api';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const isDealOnly = searchParams.get('deal') === 'true';

  const [sortOption, setSortOption] = useState('featured');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [liveProducts, setLiveProducts] = useState(PRODUCTS);
  const [priceMax, setPriceMax] = useState(250000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetch(buildApiUrl('/api/products'))
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setLiveProducts(data.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleCategoryChange = (catId) => {
    const nextParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catId);
    }
    setSearchParams(nextParams);
    setMobileFilterOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      nextParams.set('search', localSearch.trim());
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalSearch('');
    setPriceMax(250000);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...liveProducts];

    if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (isDealOnly) {
      list = list.filter(p => p.isDeal);
    }

    if (priceMax < 250000) {
      list = list.filter(p => p.price <= priceMax);
    }

    if (sortOption === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [liveProducts, selectedCategory, searchQuery, isDealOnly, priceMax, sortOption]);

  const categoryTitle = isDealOnly 
    ? 'On Sale Deals' 
    : (selectedCategory !== 'all' ? selectedCategory : 'All Products');

  return (
    <div className="shopco-shop-page">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="shopco-breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop">Shop</Link>
          {selectedCategory !== 'all' && (
            <>
              <ChevronRight size={14} />
              <span className="current-crumb">{selectedCategory}</span>
            </>
          )}
        </div>

        {/* Main Catalog Layout: Sidebar + Grid */}
        <div className="shop-layout-grid">
          {/* Left Filter Sidebar */}
          <aside className={`shop-filter-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
            <div className="filter-card">
              <div className="filter-card-header">
                <h3>Filters</h3>
                <SlidersHorizontal size={18} className="filter-icon" />
                {mobileFilterOpen && (
                  <button className="close-mobile-filters" onClick={() => setMobileFilterOpen(false)}>
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="filter-divider" />

              {/* Category Links */}
              <div className="filter-group">
                <ul className="filter-category-list">
                  <li
                    className={selectedCategory === 'all' && !isDealOnly ? 'active' : ''}
                    onClick={() => handleCategoryChange('all')}
                  >
                    <span>All Products</span>
                    <ChevronRight size={14} />
                  </li>
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <li
                      key={cat.id}
                      className={selectedCategory.toLowerCase() === cat.id.toLowerCase() ? 'active' : ''}
                      onClick={() => handleCategoryChange(cat.id)}
                    >
                      <span>{cat.name}</span>
                      <ChevronRight size={14} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="filter-divider" />

              {/* Price Filter */}
              <div className="filter-group">
                <h4 className="filter-title">Price</h4>
                <div className="price-slider-wrap">
                  <input
                    type="range"
                    min="500"
                    max="250000"
                    step="500"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="shopco-range-slider"
                  />
                  <div className="price-range-labels">
                    <span>₹500</span>
                    <span className="current-range-val">Up to ₹{priceMax.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="filter-divider" />

              {/* Quick Tags / Dress Style */}
              <div className="filter-group">
                <h4 className="filter-title">Type</h4>
                <div className="filter-tags-grid">
                  <button
                    className={`filter-pill-chip ${isDealOnly ? 'active' : ''}`}
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      if (isDealOnly) next.delete('deal');
                      else next.set('deal', 'true');
                      setSearchParams(next);
                    }}
                  >
                    Flash Deals
                  </button>
                  <button
                    className="filter-pill-chip"
                    onClick={() => setSortOption('rating')}
                  >
                    Top Rated
                  </button>
                  <button
                    className="filter-pill-chip"
                    onClick={() => setSortOption('price-low')}
                  >
                    Budget Friendly
                  </button>
                </div>
              </div>

              <div className="filter-divider" />

              {/* Apply Filter Button */}
              <div className="filter-btn-wrap">
                <button
                  className="btn-apply-filters"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  Apply Filter
                </button>
                {(selectedCategory !== 'all' || searchQuery || isDealOnly || priceMax < 250000) && (
                  <button className="btn-clear-filters" onClick={clearFilters}>
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <main className="shop-main-content">
            <div className="catalog-header-bar">
              <div className="catalog-title-wrap">
                <h1 className="catalog-category-title">{categoryTitle}</h1>
                <span className="catalog-count-text">
                  Showing 1-{filteredProducts.length} of {filteredProducts.length} Products
                </span>
              </div>

              <div className="catalog-sort-wrap">
                {/* Mobile trigger for filters */}
                <button
                  className="mobile-filter-trigger"
                  onClick={() => setMobileFilterOpen(true)}
                  aria-label="Open filter sidebar"
                >
                  <SlidersHorizontal size={16} />
                </button>

                <div className="sort-by-box">
                  <span className="sort-label">Sort by:</span>
                  <select
                    className="sort-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="featured">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="no-products-box">
                <h3>No products found</h3>
                <p>Try resetting your search query or adjusting your filters.</p>
                <button className="btn-shop-now" onClick={clearFilters} style={{ margin: '1.5rem auto 0' }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="shopco-products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {filteredProducts.length > 0 && (
              <div className="shopco-pagination-bar">
                <button className="pagination-nav-btn" disabled>
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>

                <div className="pagination-pages-row">
                  <button className="page-pill active">1</button>
                  <button className="page-pill">2</button>
                  <button className="page-pill">3</button>
                  <span className="page-dots">...</span>
                  <button className="page-pill">10</button>
                </div>

                <button className="pagination-nav-btn">
                  <span>Next</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
