import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  User, Package, MapPin, ShieldCheck, LogOut, CheckCircle2, 
  Clock, Truck, ChevronRight, Phone, Mail, Edit3, ShoppingBag, ExternalLink
} from 'lucide-react';

export const Account = () => {
  const { user, logout, updateProfile, orders } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'coupons'
  const [isEditing, setIsEditing] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    pincode: user?.pincode || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        pincode: user.pincode || ''
      });
    }
  }, [user]);

  // If not logged in, show access card or redirect
  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '640px', textAlign: 'center' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '3rem 2rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}>
          <User size={56} color="#4A5Ef1" style={{ margin: '0 auto 1.2rem' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.6rem' }}>
            Customer Account Access
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.98rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Please sign in to view your order history, track shipments, and manage your delivery addresses.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/login" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
              <span>Log In</span>
            </Link>
            <Link to="/register" className="btn-secondary" style={{ padding: '0.75rem 2rem' }}>
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="account-page-wrapper">
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {/* Customer Header Banner */}
        <div className="account-header-card">
          <div className="account-user-meta">
            <div className="account-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 className="account-user-name">{user.name}</h1>
                <span className="account-verified-tag">
                  <ShieldCheck size={14} />
                  <span>Verified Customer</span>
                </span>
              </div>
              <div className="account-contact-row">
                <span><Mail size={14} /> {user.email}</span>
                {user.phone && <span><Phone size={14} /> +91 {user.phone}</span>}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="account-logout-btn"
            id="account-logout-button"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="account-nav-tabs">
          <button
            className={`account-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={18} />
            <span>My Orders & Shipments</span>
            {orders.length > 0 && <span className="account-badge-count">{orders.length}</span>}
          </button>

          <button
            className={`account-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Profile & Addresses</span>
          </button>

          <button
            className={`account-tab-btn ${activeTab === 'coupons' ? 'active' : ''}`}
            onClick={() => setActiveTab('coupons')}
          >
            <ShieldCheck size={18} />
            <span>Exclusive VIP Benefits</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="account-tab-content">
            {orders.length === 0 ? (
              <div className="account-empty-card">
                <ShoppingBag size={52} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                <h3>No Orders Yet</h3>
                <p>You haven't placed any orders yet. Browse our selection of smart projectors, 4K panels, and CCTV cameras.</p>
                <Link to="/shop" className="btn-primary" style={{ marginTop: '1.2rem', display: 'inline-flex' }}>
                  <span>Explore Product Catalog</span>
                  <ChevronRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="account-orders-list">
                {orders.map((ord, idx) => (
                  <div key={ord.orderId || idx} className="account-order-card">
                    <div className="order-card-header">
                      <div>
                        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Order ID</div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>{ord.orderId}</div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Placed On</div>
                        <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                          {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                        </div>
                      </div>

                      <div className="order-status-pill">
                        <CheckCircle2 size={15} color="#059669" />
                        <span>{ord.orderStatus || 'Confirmed'}</span>
                      </div>
                    </div>

                    <div className="order-card-body">
                      <div className="order-items-preview">
                        {ord.items && ord.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="order-item-row">
                            <span className="order-item-qty">{item.quantity}x</span>
                            <span className="order-item-name">{item.name || item.product?.name}</span>
                            <span className="order-item-price">₹{((item.price || item.product?.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-card-footer">
                        <div style={{ fontSize: '0.86rem', color: '#64748b' }}>
                          Payment: <strong>{ord.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : ord.paymentMethod}</strong>
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                          Total: ₹{(ord.totalAmount || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile & Addresses */}
        {activeTab === 'profile' && (
          <div className="account-tab-content">
            <div className="account-profile-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#0f172a' }}>Customer Profile Information</h3>
                  <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Update your contact information and primary shipping address.</p>
                </div>
                {!isEditing && (
                  <button
                    className="btn-secondary"
                    onClick={() => setIsEditing(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}
                  >
                    <Edit3 size={15} />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {profileSaved && (
                <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.9rem 1.2rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="#059669" />
                  <span>Profile details updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Mobile / WhatsApp Phone Number</label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label>Default Shipping Address</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House / Flat / Street address"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Delhi, Noida"
                    />
                  </div>

                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="6 digits pincode"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: VIP Benefits */}
        {activeTab === 'coupons' && (
          <div className="account-tab-content">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="account-benefit-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                    ACTIVE COUPON
                  </span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>₹300 OFF</span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  VIP Member Welcome Code
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
                  Applicable on all orders above ₹1,999 across smart projectors, flat panels, and CCTV systems.
                </p>
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '0.6rem 1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code style={{ fontSize: '1rem', fontWeight: 800, color: '#2563eb' }}>NEXTEXCLUSIVE1</code>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Apply in cart</span>
                </div>
              </div>

              <div className="account-benefit-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                    DIRECT ACCESS
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Priority Technical Consultation
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
                  Direct line to our senior Delhi visual & surveillance installation engineers for custom setups.
                </p>
                <a href="tel:+919999593931" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}>
                  <Phone size={15} />
                  <span>Call +91 99995 93931</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
