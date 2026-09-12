import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Phone, AlertCircle, Loader2, User, GraduationCap, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const loggedUser = await login(emailOrMobile, password);
      if (loggedUser.role === 'university') {
        navigate('/university/dashboard');
      } else if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login credentials not valid.');
    } finally {
      setLoading(false);
    }
  };

  const fillUniversityDemo = () => {
    setEmailOrMobile('bitmesra@jharkhand.edu.in');
    setPassword('University@2026');
    setErrorMsg('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-gov-green flex items-center justify-center mx-auto mb-2 font-black text-sm">
            झार
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Portal Sign In
          </h1>
          <p className="text-xs text-slate-500">
            Access your Citizen services or University research dashboard
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registered Email or Mobile Number
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                placeholder="e.g., bitmesra@jharkhand.edu.in or 9835012345"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <span className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gov-green hover:bg-gov-darkgreen disabled:opacity-50 transition shadow-sm cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </span>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Demo Fast Login for University */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={fillUniversityDemo}
            className="text-[11px] font-semibold text-gov-green hover:underline inline-flex items-center gap-1"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Use Demo University Account (BIT Mesra)</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Don't have an account?</span>
          <Link to="/signup" className="text-gov-green font-bold hover:underline">
            Register as Citizen / University
          </Link>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/admin/login"
            className="text-[11px] text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 underline"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Government Administrator Portal Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
