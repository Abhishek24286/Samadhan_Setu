import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  FileText, 
  Search, 
  UserCheck, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  User, 
  HelpCircle,
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
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-slate-200">
      {/* 1. Official Government Top Tricolor Ribbon & Accessibility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-amber-400 font-bold">झारखंड सरकार</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Government of Jharkhand Public-Service Initiative</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <PhoneCall className="w-3 h-3 text-emerald-400" /> Helpline: 181 / 0651-2446162
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <Link
              to="/admin/login"
              className="text-slate-400 hover:text-amber-300 transition text-[11px] underline decoration-dotted"
            >
              Government Official Access
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Government Tricolor Accent line */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-gov-saffron"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-gov-green"></div>
      </div>

      {/* 2. Main Portal Branding & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3.5">
          {/* Official Emblem & Portal Title */}
          <Link to="/" className="flex items-center gap-3.5 group">
            {/* Government Emblem placeholder */}
            <div className="w-12 h-12 rounded-full bg-gov-green text-white flex items-center justify-center font-serif text-lg font-black border-2 border-amber-500 shadow-xs shrink-0">
              <span>झार</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
                  समाधान <span className="text-gov-green">सेतु</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-gov-green border border-emerald-300">
                  Citizen Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Public Problem Redressal & Institutional Innovation Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                  isActive(link.path)
                    ? 'bg-gov-green text-white shadow-xs'
                    : 'text-slate-700 hover:text-gov-green hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action & Authentication State */}
          <div className="hidden lg:flex items-center gap-3">
            {token && user ? (
              <div className="flex items-center gap-2">
                {/* Role specific dashboard button */}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gov-green text-white hover:bg-gov-darkgreen transition shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Admin Console</span>
                  </Link>
                )}

                {isUniversity && (
                  <Link
                    to="/university/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-700 text-white hover:bg-blue-800 transition shadow-xs"
                  >
                    <GraduationCap className="w-4 h-4 text-amber-300" />
                    <span>University Portal</span>
                  </Link>
                )}

                <div className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                  {user.name.split(' ')[0]} ({user.role})
                </div>

                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 transition"
                >
                  Citizen Login
                </Link>
                <Link
                  to="/report"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-gov-green hover:bg-gov-darkgreen transition shadow-xs"
                >
                  Report Problem
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/report"
              className="px-2.5 py-1.5 text-xs font-bold bg-gov-green text-white rounded-md"
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

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                isActive(link.path)
                  ? 'bg-gov-green text-white font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {token && user ? (
              <>
                <div className="text-xs font-medium text-slate-500 px-3">
                  Logged in as: <strong className="text-slate-800">{user.name}</strong> ({user.role})
                </div>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-xs font-bold bg-gov-green text-white"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {isUniversity && (
                  <Link
                    to="/university/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-xs font-bold bg-blue-700 text-white"
                  >
                    University Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 rounded-lg text-xs font-bold border border-slate-300 text-slate-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 rounded-lg text-xs font-bold bg-gov-green text-white"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
