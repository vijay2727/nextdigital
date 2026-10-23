import React, { createContext, useContext, useState, useEffect } from 'react';
import { buildApiUrl } from '../config/api';

const AuthContext = createContext();

// Pre-seeded local demo customer for 100% offline or static deployment resilience
const INITIAL_DEMO_USERS = [
  {
    id: 'CUST-1001',
    name: 'Ramesh Sharma',
    email: 'demo@digitalnext.com',
    phone: '9876543210',
    password: 'password123',
    address: 'B-42, Sector 62',
    city: 'Noida',
    pincode: '201301',
    createdAt: new Date().toISOString()
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('digitalnext_user') || localStorage.getItem('nextdigital_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && parsed.email.toLowerCase() === 'demo@nextdigital.com') {
          parsed.email = 'demo@digitalnext.com';
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('digitalnext_user_orders') || localStorage.getItem('nextdigital_user_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Initialize local demo users in storage and cleanup stale legacy keys
  useEffect(() => {
    try {
      // Remove any legacy keys
      localStorage.removeItem('nextdigital_user');
      localStorage.removeItem('nextdigital_user_orders');
      localStorage.removeItem('nextdigital_all_customers');
      localStorage.removeItem('nextdigital_cart');

      const stored = localStorage.getItem('digitalnext_all_customers');
      if (!stored) {
        localStorage.setItem('digitalnext_all_customers', JSON.stringify(INITIAL_DEMO_USERS));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save current user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('digitalnext_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('digitalnext_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Save user orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('digitalnext_user_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Login handler
  const login = async (identifier, password) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      // 1. Try Express backend API
      const res = await fetch(buildApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setIsLoading(false);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      // 2. Offline fallback to local registry
      try {
        const stored = localStorage.getItem('digitalnext_all_customers') || localStorage.getItem('nextdigital_all_customers');
        const allCust = stored ? JSON.parse(stored) : INITIAL_DEMO_USERS;

        const cleanIdent = identifier.trim().toLowerCase();
        const found = allCust.find(c =>
          c.email.toLowerCase() === cleanIdent ||
          (cleanIdent === 'demo@nextdigital.com' && c.email.toLowerCase() === 'demo@digitalnext.com') ||
          (cleanIdent === 'demo@digitalnext.com' && c.email.toLowerCase() === 'demo@nextdigital.com') ||
          (c.phone && c.phone.replace(/\D/g, '') === cleanIdent.replace(/\D/g, ''))
        );

        if (found) {
          if (found.password === password) {
            const { password: _, ...userObj } = found;
            setUser(userObj);
            setIsLoading(false);
            return { success: true, user: userObj };
          } else {
            setIsLoading(false);
            setAuthError('Incorrect password. Please try again.');
            return { success: false, message: 'Incorrect password. Please try again.' };
          }
        }
      } catch (e) {
        console.error(e);
      }

      setIsLoading(false);
      const errMsg = err.message || 'No account found with these credentials.';
      setAuthError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Register handler
  const register = async (userData) => {
    setIsLoading(true);
    setAuthError(null);

    const { name, email, phone, password, address, city, pincode } = userData;

    try {
      // 1. Try Express backend API
      const res = await fetch(buildApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        // Also persist locally for offline continuity
        syncLocalCustomer({ ...userData, id: data.user.id });
        setIsLoading(false);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      // 2. Offline fallback register in local storage
      try {
        const stored = localStorage.getItem('digitalnext_all_customers') || localStorage.getItem('nextdigital_all_customers');
        const allCust = stored ? JSON.parse(stored) : INITIAL_DEMO_USERS;

        const normEmail = email.trim().toLowerCase();
        const existing = allCust.find(c => c.email.toLowerCase() === normEmail);
        if (existing) {
          setIsLoading(false);
          setAuthError('An account with this email address already exists.');
          return { success: false, message: 'An account with this email address already exists.' };
        }

        const newCust = {
          id: 'CUST-' + Date.now(),
          name: name.trim(),
          email: normEmail,
          phone: phone ? phone.trim() : '',
          password,
          address: address ? address.trim() : '',
          city: city ? city.trim() : '',
          pincode: pincode ? pincode.trim() : '',
          createdAt: new Date().toISOString()
        };

        allCust.push(newCust);
        localStorage.setItem('digitalnext_all_customers', JSON.stringify(allCust));

        const { password: _, ...userObj } = newCust;
        setUser(userObj);
        setIsLoading(false);
        return { success: true, user: userObj };
      } catch (e) {
        console.error(e);
      }

      setIsLoading(false);
      setAuthError(err.message || 'Registration failed.');
      return { success: false, message: err.message };
    }
  };

  // Update profile handler
  const updateProfile = async (updatedFields) => {
    if (!user) return { success: false };

    try {
      fetch(buildApiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...updatedFields })
      }).catch(() => {});
    } catch (e) {
      console.error(e);
    }

    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);

    // Update in local registry
    try {
      const stored = localStorage.getItem('digitalnext_all_customers') || localStorage.getItem('nextdigital_all_customers');
      if (stored) {
        const allCust = JSON.parse(stored);
        const idx = allCust.findIndex(c => c.id === user.id);
        if (idx !== -1) {
          allCust[idx] = { ...allCust[idx], ...updatedFields };
          localStorage.setItem('digitalnext_all_customers', JSON.stringify(allCust));
        }
      }
    } catch (e) {
      console.error(e);
    }

    return { success: true, user: updatedUser };
  };

  // Add order to customer's order list
  const addCustomerOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  // Sync helper
  const syncLocalCustomer = (custObj) => {
    try {
      const stored = localStorage.getItem('digitalnext_all_customers') || localStorage.getItem('nextdigital_all_customers');
      const allCust = stored ? JSON.parse(stored) : INITIAL_DEMO_USERS;
      if (!allCust.some(c => c.id === custObj.id || c.email === custObj.email)) {
        allCust.push(custObj);
        localStorage.setItem('digitalnext_all_customers', JSON.stringify(allCust));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        updateProfile,
        orders,
        addCustomerOrder
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
