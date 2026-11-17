import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, Search, X } from 'lucide-react';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const isDealOnly = searchParams.get('deal') === 'true';

  const [sortOption, setSortOption] = useState('featured');
  const [localSearch, setLocalSearch] = useState(searchQuery);

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
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

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

    if (sortOption === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCategory, searchQuery, isDealOnly, sortOption]);

  return (
    <div className="shop-page">
      <div className="container">
        {/* Breadcrumb / Page Title */}
        <div style={{ padding: '2rem 0 1rem', borderBottom: '1px solid var(--border-light)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: '#0f172a' }}>
            {isDealOnly ? 'Flash Deals & Discounts' : selectedCategory !== 'all' ? selectedCategory : 'All Products'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Showing {filteredProducts.length} authentic digital products & electronics
          </p>
        </div>

        {/* Main Shop Layout */}
        <div className="shop-layout">
          {/* Sidebar */}
          <aside className="filter-sidebar">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                <SlidersHorizontal size={18} />
                <span>Filters</span>
              </div>
              {(selectedCategory !== 'all' || searchQuery || isDealOnly) && (
                <button onClick={clearFilters} style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 600 }}>
                  Reset
                </button>
              )}
            </div>

            {/* In-sidebar Search */}
            <div className="filter-group">
              <h4>Search Products</h4>
              <form onSubmit={handleSearchSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '0.4rem 0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Keywords..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.88rem' }}
                  />
                  <button type="submit">
                    <Search size={16} color="#64748b" />
                  </button>
                </div>
              </form>
            </div>

            {/* Categories */}
            <div className="filter-group">
              <h4>Categories</h4>
              <ul className="category-filter-list">
                {CATEGORIES.map(cat => {
                  const count = cat.id === 'all'
                    ? PRODUCTS.length
                    : PRODUCTS.filter(p => p.category.toLowerCase() === cat.id.toLowerCase()).length;

                  const isActive = (cat.id === 'all' && selectedCategory === 'all') ||
                    (selectedCategory.toLowerCase() === cat.id.toLowerCase());

                  return (
                    <li key={cat.id}>
                      <button
                        className={`category-filter-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(cat.id)}
                      >
                        <span>{cat.name}</span>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>({count})</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Deals Filter Toggle */}
            <div className="filter-group">
              <h4>Offers</h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isDealOnly}
                  onChange={(e) => {
                    const nextParams = new URLSearchParams(searchParams);
                    if (e.target.checked) {
                      nextParams.set('deal', 'true');
                    } else {
                      nextParams.delete('deal');
                    }
                    setSearchParams(nextParams);
                  }}
                />
                <span>Flash Deals Only</span>
              </label>
            </div>
          </aside>

          {/* Catalog Content */}
          <main className="catalog-main">
            {/* Toolbar */}
            <div className="catalog-toolbar">
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Found <strong>{filteredProducts.length}</strong> items
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <label htmlFor="sort-select" style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600 }}>Sort by:</label>
                <select
                  id="sort-select"
                  className="sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Active filters pill list */}
            {(selectedCategory !== 'all' || searchQuery || isDealOnly) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Active filters:</span>
                {selectedCategory !== 'all' && (
                  <span style={{ background: '#eff6ff', color: '#1e40af', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    Category: {selectedCategory}
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleCategoryChange('all')} />
                  </span>
                )}
                {searchQuery && (
                  <span style={{ background: '#eff6ff', color: '#1e40af', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    Search: "{searchQuery}"
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.delete('search');
                      setSearchParams(next);
                    }} />
                  </span>
                )}
                {isDealOnly && (
                  <span style={{ background: '#fef2f2', color: '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    Deals Only
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.delete('deal');
                      setSearchParams(next);
                    }} />
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '4rem 2rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.5rem' }}>No products match your criteria</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Try resetting your category or search filters to see all available tech solutions.
                </p>
                <button className="btn-primary" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
