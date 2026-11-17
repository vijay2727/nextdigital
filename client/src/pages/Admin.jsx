import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, ShoppingCart, Users, MessageSquare, TrendingUp, AlertCircle, 
  CheckCircle2, Clock, Truck, XCircle, Plus, Search, Filter, Edit3, 
  Trash2, ExternalLink, Lock, LogOut, Eye, RefreshCw, Phone, Mail, 
  MapPin, DollarSign, Layers, ShieldCheck, ChevronRight, X, ArrowUpRight
} from 'lucide-react';
import { buildApiUrl } from '../config/api';

export const Admin = () => {
  const [token, setToken] = useState(() => localStorage.getItem('dn_admin_token') || '');
  const [adminUser, setAdminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dn_admin_user') || 'null');
    } catch {
      return null;
    }
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@digitalnextonline.com');
  const [loginPassword, setLoginPassword] = useState('Admin@DigitalNext2026');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'catalog' | 'inquiries' | 'settings'

  // Data states
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    outOfStockCount: 0,
    totalInquiries: 0,
    unreadInquiries: 0
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Filtering states
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // New product form
  const [productFormData, setProductFormData] = useState({
    name: '',
    subtitle: '',
    category: 'Projectors',
    price: '',
    mrp: '',
    discount: '',
    stockQuantity: 15,
    inStock: true,
    isDeal: false,
    isBestSeller: false,
    image: '/images/HY260 Pro (2).jpeg',
    description: '',
    featuresText: ''
  });

  // Helper for authorized API calls
  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-admin-secret': 'Admin@DigitalNext2026',
      ...(options.headers || {})
    };
    const response = await fetch(buildApiUrl(url), { ...options, headers });
    return response;
  };

  // Show transient status toast
  const notify = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 3500);
  };

  // Fetch all admin data
  const fetchAllData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      // 1. Stats
      const statsRes = await authFetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
      }

      // 2. Orders (API + Zero-loss Local Sync)
      let loadedOrders = [];
      try {
        const ordersRes = await authFetch('/api/admin/orders');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (ordersData.success && Array.isArray(ordersData.orders)) {
            loadedOrders = ordersData.orders;
          }
        }
      } catch (err) {}

      // Merge local store orders so any checkout in this browser is immediately visible
      try {
        const storeOrders = JSON.parse(localStorage.getItem('digitalnext_store_orders') || '[]');
        const userOrders = JSON.parse(localStorage.getItem('digitalnext_user_orders') || '[]');
        const localPool = [...storeOrders, ...userOrders];

        localPool.forEach(lo => {
          if (lo && lo.orderId && !loadedOrders.some(o => o.orderId === lo.orderId)) {
            loadedOrders.unshift(lo);
          }
        });
      } catch (err) {}

      setOrders(loadedOrders);

      // 3. Products
      const prodsRes = await authFetch('/api/admin/products');
      if (prodsRes.ok) {
        const prodsData = await prodsRes.json();
        if (prodsData.success) setProducts(prodsData.products || []);
      }

      // 4. Inquiries
      const inqRes = await authFetch('/api/admin/inquiries');
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        if (inqData.success) setInquiries(inqData.inquiries || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  // Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch(buildApiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setToken(data.token);
        setAdminUser(data.admin);
        localStorage.setItem('dn_admin_token', data.token);
        localStorage.setItem('dn_admin_user', JSON.stringify(data.admin));
        notify('Welcome back! Administrator session active.');
      } else {
        setLoginError(data.message || 'Invalid administrator credentials');
      }
    } catch {
      setLoginError('Could not reach backend server. Please check connection.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setAdminUser(null);
    localStorage.removeItem('dn_admin_token');
    localStorage.removeItem('dn_admin_user');
  };

  // Order Actions: Update Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    // 1. Update UI state immediately
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, orderStatus: newStatus } : o));
    if (selectedOrderDetails?.orderId === orderId) {
      setSelectedOrderDetails(prev => ({ ...prev, orderStatus: newStatus }));
    }
    notify(`Order ${orderId} marked as ${newStatus}`);

    // 2. Persist to local storage
    try {
      const storeOrders = JSON.parse(localStorage.getItem('digitalnext_store_orders') || '[]');
      const updatedStoreOrders = storeOrders.map(o => o.orderId === orderId ? { ...o, orderStatus: newStatus } : o);
      localStorage.setItem('digitalnext_store_orders', JSON.stringify(updatedStoreOrders));

      const userOrders = JSON.parse(localStorage.getItem('digitalnext_user_orders') || '[]');
      const updatedUserOrders = userOrders.map(o => o.orderId === orderId ? { ...o, orderStatus: newStatus } : o);
      localStorage.setItem('digitalnext_user_orders', JSON.stringify(updatedUserOrders));
    } catch (e) {}

    // 3. Persist to Backend API
    try {
      await authFetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {}
  };

  // Product Actions: Toggle In-Stock
  const handleToggleProductStock = async (productId, currentStatus) => {
    const nextStatus = !currentStatus;
    try {
      const res = await authFetch(`/api/admin/products/${productId}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ inStock: nextStatus })
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, inStock: nextStatus } : p));
        notify(`Stock updated: Product is now ${nextStatus ? 'In Stock' : 'Out of Stock'}`);
      }
    } catch {
      notify('Failed to update stock');
    }
  };

  // Product Actions: Delete Product
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}" from the catalog?`)) return;

    try {
      const res = await authFetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        notify(`Product removed from catalog`);
      }
    } catch {
      notify('Failed to delete product');
    }
  };

  // Product Actions: Add or Update Form Submit
  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...productFormData,
      features: productFormData.featuresText
        ? productFormData.featuresText.split('\n').map(s => s.trim()).filter(Boolean)
        : []
    };

    try {
      if (editingProduct) {
        // Edit mode
        const res = await authFetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          notify(`Product "${payload.name}" updated successfully`);
          fetchAllData();
          setEditingProduct(null);
          setIsAddProductOpen(false);
        }
      } else {
        // Add new mode
        const res = await authFetch('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          notify(`New product "${payload.name}" added to catalog`);
          fetchAllData();
          setIsAddProductOpen(false);
          setProductFormData({
            name: '',
            subtitle: '',
            category: 'Projectors',
            price: '',
            mrp: '',
            discount: '',
            stockQuantity: 15,
            inStock: true,
            isDeal: false,
            isBestSeller: false,
            image: '/images/HY260 Pro (2).jpeg',
            description: '',
            featuresText: ''
          });
        }
      }
    } catch {
      notify('Failed to save product details');
    }
  };

  // Inquiry Actions: Toggle Status
  const handleToggleInquiryStatus = async (inquiryId, currentStatus) => {
    const nextStatus = currentStatus === 'Resolved' ? 'Unread' : 'Resolved';
    try {
      const res = await authFetch(`/api/admin/inquiries/${inquiryId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(i => i.id === inquiryId ? { ...i, status: nextStatus } : i));
        notify(`Inquiry marked as ${nextStatus}`);
      }
    } catch {
      notify('Failed to update inquiry status');
    }
  };

  // Computed Live Metrics (guarantees accurate figures even during offline / local sync)
  const displayRevenue = useMemo(() => {
    const fromOrders = orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);
    return Math.max(fromOrders, stats.totalRevenue || 0);
  }, [orders, stats.totalRevenue]);

  const displayOrderCount = useMemo(() => {
    return Math.max(orders.length, stats.totalOrders || 0);
  }, [orders.length, stats.totalOrders]);

  const displayPendingCount = useMemo(() => {
    const pendingFromOrders = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
    return Math.max(pendingFromOrders, stats.pendingOrders || 0);
  }, [orders, stats.pendingOrders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesStatus = orderStatusFilter === 'all' || o.orderStatus?.toLowerCase() === orderStatusFilter.toLowerCase();
      const q = orderSearchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        o.orderId?.toLowerCase().includes(q) ||
        o.customer?.fullName?.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q) ||
        o.customer?.email?.toLowerCase().includes(q)
      );
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCat = productCategoryFilter === 'all' || p.category?.toLowerCase() === productCategoryFilter.toLowerCase();
      const q = productSearchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        p.name?.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
      return matchesCat && matchesSearch;
    });
  }, [products, productCategoryFilter, productSearchQuery]);

  // Filtered Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(i => {
      if (inquiryStatusFilter === 'all') return true;
      return i.status?.toLowerCase() === inquiryStatusFilter.toLowerCase();
    });
  }, [inquiries, inquiryStatusFilter]);

  // Categories list from products
  const uniqueCategories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [products]);

  // ==========================================
  // RENDER: LOGIN VIEW (if unauthenticated)
  // ==========================================
  if (!token) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xl)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4A5Ef1, #3b4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.2rem',
            boxShadow: '0 8px 16px rgba(74, 94, 241, 0.25)'
          }}>
            <Lock size={28} color="#ffffff" />
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#0f172a', marginBottom: '0.4rem' }}>
            Store Owner Portal
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.8rem' }}>
            Sign in to manage customer orders, live product inventory, and customer inquiries.
          </p>

          {loginError && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textAlign: 'left'
            }}>
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Administrator Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.4rem' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              {loginLoading ? 'Authenticating...' : 'Enter Admin Control Center'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border-light)' }}>
            <button
              type="button"
              onClick={() => {
                setLoginEmail('admin@digitalnextonline.com');
                setLoginPassword('Admin@DigitalNext2026');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#4A5Ef1',
                fontSize: '0.82rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Auto-fill Owner Credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: FULL ADMIN DASHBOARD
  // ==========================================
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Top Banner & Control Center Header */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: '#4A5Ef1',
              color: '#ffffff',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              letterSpacing: '0.5px'
            }}>
              ADMIN
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#0f172a', lineHeight: 1.2 }}>
                DigitalNext Control Center
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                <span>Live Store Management</span>
                <span>•</span>
                <span>Logged in as <strong>{adminUser?.email || 'Administrator'}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button
              onClick={fetchAllData}
              disabled={isLoadingData}
              title="Refresh Live Data"
              style={{
                background: '#f1f5f9',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.5rem 0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} className={isLoadingData ? 'spinning' : ''} />
              <span>{isLoadingData ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <Link
              to="/"
              target="_blank"
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.5rem 0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                color: '#334155',
                textDecoration: 'none'
              }}
            >
              <span>View Storefront</span>
              <ArrowUpRight size={14} />
            </Link>

            <button
              onClick={handleLogout}
              style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                borderRadius: '8px',
                padding: '0.5rem 0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="container" style={{ padding: '0 1.5rem', display: 'flex', gap: '1.5rem', overflowX: 'auto' }}>
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
            { id: 'catalog', label: `Catalog & Stock (${products.length})`, icon: Package },
            { id: 'inquiries', label: `Leads & Inquiries (${inquiries.length})`, icon: MessageSquare },
            { id: 'settings', label: 'Store Settings', icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 0.2rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #4A5Ef1' : '3px solid transparent',
                  color: isActive ? '#4A5Ef1' : '#64748b',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Action Message / Toast */}
      {actionMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          zIndex: 9999
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & KEY METRICS                             */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div>
            {/* 4 Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
              <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Revenue</span>
                  <div style={{ background: '#ecfdf5', padding: '0.4rem', borderRadius: '8px' }}>
                    <DollarSign size={18} color="#059669" />
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>
                  ₹{displayRevenue.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <span>Lifetime Customer Bookings</span>
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Orders</span>
                  <div style={{ background: '#eff6ff', padding: '0.4rem', borderRadius: '8px' }}>
                    <ShoppingCart size={18} color="#2563eb" />
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>
                  {displayOrderCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: displayPendingCount > 0 ? '#f59e0b' : '#64748b', marginTop: '0.4rem' }}>
                  {displayPendingCount} pending dispatch
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Catalog Products</span>
                  <div style={{ background: '#fdf4ff', padding: '0.4rem', borderRadius: '8px' }}>
                    <Package size={18} color="#9333ea" />
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>
                  {stats.totalProducts}
                </div>
                <div style={{ fontSize: '0.78rem', color: stats.outOfStockCount > 0 ? '#dc2626' : '#10b981', marginTop: '0.4rem' }}>
                  {stats.outOfStockCount > 0 ? `${stats.outOfStockCount} items out of stock` : 'All items in stock'}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Buyer Inquiries</span>
                  <div style={{ background: '#fffbeb', padding: '0.4rem', borderRadius: '8px' }}>
                    <MessageSquare size={18} color="#d97706" />
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>
                  {stats.totalInquiries}
                </div>
                <div style={{ fontSize: '0.78rem', color: stats.unreadInquiries > 0 ? '#ea580c' : '#10b981', marginTop: '0.4rem' }}>
                  {stats.unreadInquiries} unread leads
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
              {/* Recent Orders List */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    style={{ background: 'none', border: 'none', color: '#4A5Ef1', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                    <ShoppingCart size={40} style={{ margin: '0 auto 0.8rem', opacity: 0.5 }} />
                    <p>No orders placed yet. As customers check out, orders will appear here automatically.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {orders.slice(0, 5).map(o => (
                      <div
                        key={o.orderId}
                        onClick={() => setSelectedOrderDetails(o)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem',
                          borderRadius: '12px',
                          border: '1px solid var(--border-light)',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                            {o.orderId} — {o.customer?.fullName || o.customer?.name || 'Customer'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                            {o.items?.length || 1} items • {new Date(o.createdAt).toLocaleDateString()} • {o.paymentMethod}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                            ₹{parseFloat(o.totalAmount).toLocaleString('en-IN')}
                          </div>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            marginTop: '0.3rem',
                            background: o.orderStatus === 'Delivered' ? '#dcfce7' : o.orderStatus === 'Shipped' ? '#ede9fe' : '#fef3c7',
                            color: o.orderStatus === 'Delivered' ? '#15803d' : o.orderStatus === 'Shipped' ? '#6b21a8' : '#b45309'
                          }}>
                            {o.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                    Quick Management
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setProductFormData({
                          name: '',
                          subtitle: '',
                          category: 'Projectors',
                          price: '',
                          mrp: '',
                          discount: '',
                          stockQuantity: 15,
                          inStock: true,
                          isDeal: false,
                          isBestSeller: false,
                          image: '/images/HY260 Pro (2).jpeg',
                          description: '',
                          featuresText: ''
                        });
                        setIsAddProductOpen(true);
                      }}
                      className="btn-primary"
                      style={{ justifyContent: 'center', padding: '0.75rem' }}
                    >
                      <Plus size={16} />
                      <span>Add New Product</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('orders')}
                      className="btn-secondary"
                      style={{ justifyContent: 'center', padding: '0.75rem' }}
                    >
                      <Truck size={16} />
                      <span>Fulfill Pending Orders</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('inquiries')}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      <MessageSquare size={16} />
                      <span>Answer Customer Leads</span>
                    </button>
                  </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#ffffff', borderRadius: '16px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                    <ShieldCheck size={20} color="#38bdf8" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Store Diagnostics</span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    PostgreSQL tables active. Orders and inquiries are stored and synced across browser sessions.
                  </p>
                  <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                    <div>• Active Database: Render PostgreSQL</div>
                    <div>• API Status: Online & Serving</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ORDERS MANAGEMENT                                  */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div>
            {/* Filter Bar */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
              padding: '1.2rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '420px' }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by Order #, Customer, Phone, or Email..."
                  value={orderSearchQuery}
                  onChange={e => setOrderSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem 0.7rem 2.6rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Status Filter Chips */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['all', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '9999px',
                      border: orderStatusFilter === st ? '1px solid #4A5Ef1' : '1px solid var(--border-subtle)',
                      background: orderStatusFilter === st ? '#4A5Ef1' : '#ffffff',
                      color: orderStatusFilter === st ? '#ffffff' : '#475569',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
                  <ShoppingCart size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <h3 style={{ color: '#334155', marginBottom: '0.4rem' }}>No orders found</h3>
                  <p style={{ fontSize: '0.88rem' }}>Try clearing the search query or changing the status filter.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)', color: '#475569', fontWeight: 600 }}>
                        <th style={{ padding: '1rem' }}>Order ID & Date</th>
                        <th style={{ padding: '1rem' }}>Customer Details</th>
                        <th style={{ padding: '1rem' }}>Items Ordered</th>
                        <th style={{ padding: '1rem' }}>Total & Payment</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                        <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o.orderId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{o.orderId}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                              {new Date(o.createdAt).toLocaleString()}
                            </div>
                          </td>

                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>
                              {o.customer?.fullName || o.customer?.name || 'Customer'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              📞 {o.customer?.phone}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              📍 {o.customer?.city || ''} {o.customer?.pincode ? `(${o.customer.pincode})` : ''}
                            </div>
                          </td>

                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 600, color: '#334155' }}>
                              {o.items?.length || 1} product(s)
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {o.items?.map(i => `${i.name} (x${i.quantity || 1})`).join(', ')}
                            </div>
                          </td>

                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                              ₹{parseFloat(o.totalAmount).toLocaleString('en-IN')}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {o.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}
                            </span>
                          </td>

                          <td style={{ padding: '1rem' }}>
                            <select
                              value={o.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                              style={{
                                padding: '0.4rem 0.6rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-subtle)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                background: o.orderStatus === 'Delivered' ? '#dcfce7' : o.orderStatus === 'Shipped' ? '#ede9fe' : o.orderStatus === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                                color: o.orderStatus === 'Delivered' ? '#15803d' : o.orderStatus === 'Shipped' ? '#6b21a8' : o.orderStatus === 'Cancelled' ? '#b91c1c' : '#b45309',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <button
                              onClick={() => setSelectedOrderDetails(o)}
                              style={{
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                color: '#2563eb',
                                padding: '0.45rem 0.8rem',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PRODUCTS & INVENTORY CATALOG                       */}
        {/* ========================================================= */}
        {activeTab === 'catalog' && (
          <div>
            {/* Control Bar: Search + Add Product */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
              padding: '1.2rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', gap: '1rem', flex: '1 1 300px', maxWidth: '560px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search catalog products..."
                    value={productSearchQuery}
                    onChange={e => setProductSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem 0.7rem 2.6rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={e => setProductCategoryFilter(e.target.value)}
                  style={{
                    padding: '0.7rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    background: '#ffffff'
                  }}
                >
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductFormData({
                    name: '',
                    subtitle: '',
                    category: 'Projectors',
                    price: '',
                    mrp: '',
                    discount: '',
                    stockQuantity: 15,
                    inStock: true,
                    isDeal: false,
                    isBestSeller: false,
                    image: '/images/HY260 Pro (2).jpeg',
                    description: '',
                    featuresText: ''
                  });
                  setIsAddProductOpen(true);
                }}
                className="btn-primary"
                style={{ padding: '0.7rem 1.4rem' }}
              >
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid var(--border-light)',
                    padding: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{
                          width: '84px',
                          height: '84px',
                          objectFit: 'contain',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid var(--border-light)'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          background: '#f1f5f9',
                          color: '#475569',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          marginBottom: '0.3rem'
                        }}>
                          {p.category}
                        </span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                          {p.name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.4rem' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          {p.mrp > p.price && (
                            <span style={{ fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                              ₹{p.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stock Status Bar */}
                    <div style={{
                      background: p.inStock ? '#ecfdf5' : '#fef2f2',
                      border: p.inStock ? '1px solid #a7f3d0' : '1px solid #fecaca',
                      borderRadius: '10px',
                      padding: '0.6rem 0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: p.inStock ? '#10b981' : '#ef4444'
                        }}></span>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: p.inStock ? '#065f46' : '#991b1b'
                        }}>
                          {p.inStock ? 'In Stock (Ready to Ship)' : 'Out of Stock'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleProductStock(p.id, p.inStock)}
                        style={{
                          background: p.inStock ? '#ffffff' : '#dc2626',
                          color: p.inStock ? '#065f46' : '#ffffff',
                          border: p.inStock ? '1px solid #a7f3d0' : 'none',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {p.inStock ? 'Set Out of Stock' : 'Mark In Stock'}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.6rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.8rem' }}>
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setProductFormData({
                          name: p.name,
                          subtitle: p.subtitle || '',
                          category: p.category,
                          price: p.price,
                          mrp: p.mrp || p.price,
                          discount: p.discount || '',
                          stockQuantity: p.stockQuantity || 15,
                          inStock: p.inStock !== false,
                          isDeal: !!p.isDeal,
                          isBestSeller: !!p.isBestSeller,
                          image: p.image,
                          description: p.description || '',
                          featuresText: Array.isArray(p.features) ? p.features.join('\n') : ''
                        });
                        setIsAddProductOpen(true);
                      }}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        background: '#ffffff',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit3 size={14} />
                      <span>Edit Price / Details</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      style={{
                        padding: '0.5rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        background: '#fff1f2',
                        color: '#e11d48',
                        cursor: 'pointer'
                      }}
                      title="Delete Product"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: LEADS & INQUIRIES                                  */}
        {/* ========================================================= */}
        {activeTab === 'inquiries' && (
          <div>
            {/* Header & Filter */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
              padding: '1.2rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Customer Leads & Quote Requests</h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b' }}>Messages submitted via the Contact form or institutional quote requests.</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['all', 'Unread', 'Resolved'].map(st => (
                  <button
                    key={st}
                    onClick={() => setInquiryStatusFilter(st)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '9999px',
                      border: inquiryStatusFilter === st ? '1px solid #4A5Ef1' : '1px solid var(--border-subtle)',
                      background: inquiryStatusFilter === st ? '#4A5Ef1' : '#ffffff',
                      color: inquiryStatusFilter === st ? '#ffffff' : '#475569',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {st === 'all' ? 'All Leads' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Cards */}
            {filteredInquiries.length === 0 ? (
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '4rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h3>No inquiries found</h3>
                <p style={{ fontSize: '0.88rem' }}>When customers request product quotes or send messages, they will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.2rem' }}>
                {filteredInquiries.map(inq => (
                  <div
                    key={inq.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid var(--border-light)',
                      padding: '1.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: inq.status === 'Resolved' ? '#dcfce7' : '#fef3c7',
                          color: inq.status === 'Resolved' ? '#15803d' : '#b45309'
                        }}>
                          {inq.status || 'Unread'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                        {inq.name}
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem' }}>
                        <a href={`tel:${inq.phone}`} style={{ color: '#4A5Ef1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Phone size={13} /> {inq.phone}
                        </a>
                        {inq.email && (
                          <a href={`mailto:${inq.email}`} style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Mail size={13} /> {inq.email}
                          </a>
                        )}
                      </div>

                      <div style={{
                        background: '#f8fafc',
                        borderRadius: '10px',
                        padding: '0.8rem',
                        fontSize: '0.86rem',
                        color: '#334155',
                        lineHeight: 1.5,
                        marginBottom: '1rem'
                      }}>
                        <div style={{ fontWeight: 600, fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                          Subject: {inq.subject || 'General Product Inquiry'}
                        </div>
                        {inq.message || 'No additional message provided.'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.8rem' }}>
                      <button
                        onClick={() => handleToggleInquiryStatus(inq.id, inq.status)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: inq.status === 'Resolved' ? '1px solid var(--border-subtle)' : '1px solid #10b981',
                          background: inq.status === 'Resolved' ? '#ffffff' : '#ecfdf5',
                          color: inq.status === 'Resolved' ? '#64748b' : '#059669',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {inq.status === 'Resolved' ? 'Mark as Unread' : 'Mark as Contacted'}
                      </button>

                      <a
                        href={`tel:${inq.phone}`}
                        style={{
                          padding: '0.5rem 0.9rem',
                          borderRadius: '8px',
                          background: '#4A5Ef1',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        <Phone size={14} />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: STORE SETTINGS & SYSTEM INFO                       */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '800px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                Store Credentials & Security
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Your administrative control center account details.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Admin Email</label>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>{adminUser?.email || 'admin@digitalnextonline.com'}</div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Security Role</label>
                  <div style={{ fontWeight: 700, color: '#059669', marginTop: '0.2rem' }}>Super Administrator</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', fontSize: '0.84rem', color: '#475569' }}>
                Passwords are now protected with <strong>Bcrypt 10-round salting</strong>. Passwords will never be stored in plain text.
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                Upcoming Phase 2 Integrations
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Quick checklist of systems ready to link into this dashboard.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', background: '#f8fafc', borderRadius: '10px' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <div style={{ flex: 1, fontSize: '0.88rem', color: '#334155' }}>
                    <strong>Admin Order & Catalog Hub</strong> (Active now)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', background: '#f8fafc', borderRadius: '10px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1' }}></div>
                  <div style={{ flex: 1, fontSize: '0.88rem', color: '#64748b' }}>
                    <strong>Razorpay / Cashfree UPI & Card Payments</strong> (Phase 2)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', background: '#f8fafc', borderRadius: '10px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1' }}></div>
                  <div style={{ flex: 1, fontSize: '0.88rem', color: '#64748b' }}>
                    <strong>Automated Email & WhatsApp Order Confirmations</strong> (Phase 2)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT PRODUCT                               */}
      {/* ========================================================= */}
      {isAddProductOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '620px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsAddProductOpen(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#0f172a', marginBottom: '0.3rem' }}>
              {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Catalog'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
              Fill in the product specifications. Changes will appear live on your storefront.
            </p>

            <form onSubmit={handleProductFormSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DigitalNext HY320 Ultra Smart Projector"
                  value={productFormData.name}
                  onChange={e => setProductFormData({ ...productFormData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                    Category *
                  </label>
                  <select
                    value={productFormData.category}
                    onChange={e => setProductFormData({ ...productFormData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.9rem',
                      background: '#ffffff'
                    }}
                  >
                    <option value="Projectors">Projectors</option>
                    <option value="CCTV Cameras">CCTV Cameras</option>
                    <option value="Interactive Panels">Interactive Panels</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Video Conferencing">Video Conferencing</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                    Subtitle / Key Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1080P Native | Android 12"
                    value={productFormData.subtitle}
                    onChange={e => setProductFormData({ ...productFormData, subtitle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="9999"
                    value={productFormData.price}
                    onChange={e => setProductFormData({ ...productFormData, price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="12999"
                    value={productFormData.mrp}
                    onChange={e => setProductFormData({ ...productFormData, mrp: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                    Stock Units
                  </label>
                  <input
                    type="number"
                    placeholder="15"
                    value={productFormData.stockQuantity}
                    onChange={e => setProductFormData({ ...productFormData, stockQuantity: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Image URL / Asset Path
                </label>
                <input
                  type="text"
                  placeholder="/images/HY260 Pro (2).jpeg"
                  value={productFormData.image}
                  onChange={e => setProductFormData({ ...productFormData, image: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Full specifications, optical features, warranty details..."
                  value={productFormData.description}
                  onChange={e => setProductFormData({ ...productFormData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productFormData.inStock}
                    onChange={e => setProductFormData({ ...productFormData, inStock: e.target.checked })}
                  />
                  <span>In Stock</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productFormData.isDeal}
                    onChange={e => setProductFormData({ ...productFormData, isDeal: e.target.checked })}
                  />
                  <span>Mark as Deal of the Day</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productFormData.isBestSeller}
                    onChange={e => setProductFormData({ ...productFormData, isBestSeller: e.target.checked })}
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  style={{
                    padding: '0.75rem 1.4rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    background: '#ffffff',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '0.75rem 1.8rem' }}
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ORDER DETAILS & PACKING SLIP                     */}
      {/* ========================================================= */}
      {selectedOrderDetails && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedOrderDetails(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#0f172a' }}>
                Order #{selectedOrderDetails.orderId}
              </h3>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: selectedOrderDetails.orderStatus === 'Delivered' ? '#dcfce7' : '#fef3c7',
                color: selectedOrderDetails.orderStatus === 'Delivered' ? '#15803d' : '#b45309'
              }}>
                {selectedOrderDetails.orderStatus}
              </span>
            </div>

            <p style={{ color: '#64748b', fontSize: '0.84rem', marginBottom: '1.5rem' }}>
              Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString()}
            </p>

            {/* Customer & Shipping Summary */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.6rem' }}>
                Customer & Shipping Address
              </h4>
              <div style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 600 }}>
                {selectedOrderDetails.customer?.fullName || selectedOrderDetails.customer?.name}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '0.2rem' }}>
                📞 {selectedOrderDetails.customer?.phone} • ✉️ {selectedOrderDetails.customer?.email}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '0.4rem' }}>
                📍 {selectedOrderDetails.customer?.address}, {selectedOrderDetails.customer?.city} — {selectedOrderDetails.customer?.pincode}
              </div>
            </div>

            {/* Items Table */}
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.6rem' }}>
              Purchased Items
            </h4>
            <div style={{ border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)', color: '#64748b' }}>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'left' }}>Item</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrderDetails.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                        {item.name}
                      </td>
                      <td style={{ padding: '0.8rem 1rem', textAlign: 'center', color: '#64748b' }}>
                        {item.quantity || 1}
                      </td>
                      <td style={{ padding: '0.8rem 1rem', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        ₹{parseFloat(item.price).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: '#f8fafc' }}>
                    <td colSpan={2} style={{ padding: '0.8rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                      Grand Total ({selectedOrderDetails.paymentMethod})
                    </td>
                    <td style={{ padding: '0.8rem 1rem', textAlign: 'right', fontWeight: 800, color: '#4A5Ef1', fontSize: '1.1rem' }}>
                      ₹{parseFloat(selectedOrderDetails.totalAmount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Status Action inside Modal */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Update Status:</span>
                <select
                  value={selectedOrderDetails.orderStatus}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrderDetails.orderId, e.target.value)}
                  style={{
                    padding: '0.5rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    fontWeight: 700,
                    fontSize: '0.84rem'
                  }}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="btn-primary"
                style={{ padding: '0.6rem 1.4rem' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
