import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('jh_token') || null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Restore authenticated session on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiRequest('/auth/me');
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session expired or server unavailable:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  // Citizen & University Login
 // Citizen & University Login
  const login = async (emailOrMobile, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      // Fix: Change 'emailOrMobile' to 'identifier' to match the backend route
      body: JSON.stringify({ identifier: emailOrMobile, password }),
    });

    if (res.success && res.token) {
      localStorage.setItem('jh_token', res.token);
      setToken(res.token);
      setUser(res.user);
      showToast(res.message || 'Logged in successfully.', 'success');
      return res.user;
    }
    throw new Error(res.message || 'Login failed.');
  };

  // Dedicated Government Admin Login
  const adminLogin = async (adminId, password) => {
    const res = await apiRequest('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ adminId, password }),
    });

    if (res.success && res.token) {
      localStorage.setItem('jh_token', res.token);
      setToken(res.token);
      setUser(res.user);
      showToast('Administrative authorization verified. Welcome to Admin Portal.', 'success');
      return res.user;
    }
    throw new Error(res.message || 'Admin authorization failed.');
  };

  // Public Signup (Citizen or University ONLY)
  const signup = async (userData) => {
    const res = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (res.success && res.token) {
      localStorage.setItem('jh_token', res.token);
      setToken(res.token);
      setUser(res.user);
      showToast(res.message, 'success');
      return res.user;
    }
    throw new Error(res.message || 'Signup failed.');
  };

  // OTP Functions
  const sendOtp = async (mobile, context) => {
    const res = await apiRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, context }),
    });
    if (!res.success) throw new Error(res.message || 'Failed to send OTP.');
    return res;
  };

  const loginWithOtp = async (mobile, otp) => {
    const res = await apiRequest('/auth/verify-otp-login', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp }),
    });

    if (res.success && res.token) {
      localStorage.setItem('jh_token', res.token);
      setToken(res.token);
      setUser(res.user);
      showToast(res.message || 'Logged in successfully.', 'success');
      return res.user;
    }
    throw new Error(res.message || 'OTP login failed.');
  };

  const signupWithOtp = async (userData) => {
    const res = await apiRequest('/auth/verify-otp-signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (res.success && res.token) {
      localStorage.setItem('jh_token', res.token);
      setToken(res.token);
      setUser(res.user);
      showToast(res.message, 'success');
      return res.user;
    }
    throw new Error(res.message || 'OTP signup failed.');
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('jh_token');
    setToken(null);
    setUser(null);
    showToast('You have been logged out securely.', 'info');
  };

  const isAdmin = user?.role === 'admin';
  const isUniversity = user?.role === 'university';
  const isCitizen = user?.role === 'citizen';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        toasts,
        showToast,
        removeToast,
        login,
        adminLogin,
        signup,
        sendOtp,
        loginWithOtp,
        signupWithOtp,
        logout,
        isAdmin,
        isUniversity,
        isCitizen,
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
