import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  PhoneCall,
  GraduationCap
} from 'lucide-react';

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, token, logout, isAdmin, isUniversity } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Report a Problem', path: '/report' },
    { label: 'Track Problem', path: '/track' },
    { label: 'Universities', path: '/universities' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white font-sans shadow-sm">
      {/* Top Header Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-amber-400">Government of Jharkhand</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">Public Service & Problem Redressal Initiative</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
              <PhoneCall className="w-3 h-3 text-[#0D5C3A]" /> Helpline: 181 / 0651-2446162
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <Link
              to="/admin/login"
              className="text-slate-300 hover:text-amber-300 transition text-[11px] underline decoration-dotted"
            >
              Government Official Access
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between py-3">
          {/* Logo & Portal Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-sm shrink-0 overflow-hidden bg-white border border-gray-200">
              <img 
                src="/images/hero/images.jpg" 
                alt="Jharkhand Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                  Samadhan<span style={{ color: '#0D5C3A' }}>Setu</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                state={link.path === '/report' && !token ? { from: { pathname: '/report' } } : undefined}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  isActive(link.path)
                    ? 'text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                style={isActive(link.path) ? { backgroundColor: '#0D5C3A' } : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action & Authentication State (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {token && user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white transition shadow-sm"
                    style={{ backgroundColor: '#0D5C3A' }}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>Admin Console</span>
                  </Link>
                )}

                {isUniversity && (
                  <Link
                    to="/university/dashboard"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-700 text-white hover:bg-blue-800 transition shadow-sm"
                  >
                    <GraduationCap className="w-4 h-4 text-amber-300" />
                    <span>University Portal</span>
                  </Link>
                )}

                <div 
                  className="px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ backgroundColor: '#F0F7F4', color: '#0D5C3A' }}
                >
                  {user.name.split(' ')[0]} ({user.role})
                </div>

                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Citizen Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white transition shadow-sm"
                  style={{ backgroundColor: '#0D5C3A' }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to={token ? "/report" : "/login"}
              state={!token ? { from: { pathname: "/report" } } : undefined}
              className="px-3 py-1.5 text-xs font-bold text-white rounded-md shadow-sm"
              style={{ backgroundColor: '#0D5C3A' }}
            >
              Report
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer & Backdrop Overlay */}
      {mobileOpen && (
        <>
          {/* Semi-transparent Backdrop */}
          <div 
            className="fixed inset-0 bg-black/25 z-30 lg:hidden backdrop-blur-xs" 
            onClick={() => setMobileOpen(false)} 
          />

          {/* Dropdown Drawer */}
          <div className="absolute top-full left-0 w-full bg-white px-4 py-5 space-y-3 shadow-xl z-40 border-b border-gray-200 lg:hidden animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                state={link.path === '/report' && !token ? { from: { pathname: '/report' } } : undefined}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive(link.path)
                    ? 'text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
                style={isActive(link.path) ? { backgroundColor: '#0D5C3A' } : undefined}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-100 space-y-2">
              {token && user ? (
                <>
                  <div className="text-xs font-semibold text-slate-600 px-3 py-2 bg-slate-50 rounded-xl">
                    Logged in as: <strong className="text-slate-900">{user.name}</strong> ({user.role})
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 rounded-xl text-xs font-bold text-white text-center shadow-sm"
                      style={{ backgroundColor: '#0D5C3A' }}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {isUniversity && (
                    <Link
                      to="/university/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 rounded-xl text-xs font-bold bg-blue-700 text-white text-center shadow-sm"
                    >
                      University Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="w-full text-center px-4 py-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition"
                  >
                    Logout Securely
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-3 rounded-xl text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: '#0D5C3A' }}
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};