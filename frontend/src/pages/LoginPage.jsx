import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Phone, AlertCircle, Loader2, User, GraduationCap, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sendOtp, loginWithOtp } = useAuth();

  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState('citizen'); // 'citizen', 'university', 'admin'
  const [useOtp, setUseOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSendOtp = async () => {
    if (!emailOrMobile) {
      setErrorMsg('Please enter your mobile number first.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await sendOtp(emailOrMobile, 'login');
      setOtpSent(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      let loggedUser;
      if (useOtp) {
        loggedUser = await loginWithOtp(emailOrMobile, otp);
      } else {
        loggedUser = await login(emailOrMobile, password);
      }
      
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
            Access your Citizen services, University research, or DC dashboard
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => { setLoginRole('citizen'); setUseOtp(false); setOtpSent(false); setOtp(''); }}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition ${loginRole === 'citizen' ? 'bg-white shadow-sm text-gov-green' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Citizen
          </button>
          <button
            type="button"
            onClick={() => { setLoginRole('university'); setUseOtp(false); setOtpSent(false); setOtp(''); }}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition ${loginRole === 'university' ? 'bg-white shadow-sm text-gov-green' : 'text-slate-500 hover:text-slate-700'}`}
          >
            University
          </button>
          <button
            type="button"
            onClick={() => { setLoginRole('admin'); setUseOtp(false); setOtpSent(false); setOtp(''); }}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition ${loginRole === 'admin' ? 'bg-white shadow-sm text-gov-green' : 'text-slate-500 hover:text-slate-700'}`}
          >
            DC Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {useOtp ? 'Registered Mobile Number' : loginRole === 'admin' ? 'Official Govt Email' : loginRole === 'university' ? 'University Email' : 'Email or Mobile Number'}
            </label>
            <div className="relative">
              {useOtp ? (
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              ) : (
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              )}
              <input
                type="text"
                required
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                placeholder={useOtp ? "10-digit mobile number" : loginRole === 'admin' ? "name@jharkhand.gov.in" : loginRole === 'university' ? "institute@jharkhand.edu.in" : "name@example.com or 9835012345"}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none"
                disabled={useOtp && otpSent}
              />
            </div>
          </div>

          {!useOtp && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                {loginRole === 'citizen' && (
                  <button type="button" onClick={() => setUseOtp(true)} className="text-[11px] text-gov-green hover:underline font-semibold cursor-pointer">
                    Forgot password? Use OTP
                  </button>
                )}
                {loginRole !== 'citizen' && (
                  <span className="text-[11px] text-slate-400">
                    Contact admin if forgotten
                  </span>
                )}
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
          )}

          {useOtp && otpSent && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enter 6-Digit OTP
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none font-mono tracking-widest"
                />
              </div>
              <div className="text-right mt-1">
                <button type="button" onClick={handleSendOtp} className="text-[10px] text-gov-green hover:underline">
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          {useOtp && !otpSent ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gov-green hover:bg-gov-darkgreen disabled:opacity-50 transition shadow-sm cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending OTP...</span>
                  </span>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setUseOtp(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Back to Password Login
              </button>
            </div>
          ) : (
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
                <span>{useOtp ? 'Verify OTP & Sign In' : 'Sign In'}</span>
              )}
            </button>
          )}
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
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Don't have an account?</span>
          <Link to="/signup" className="text-gov-green font-bold hover:underline text-center sm:text-right">
            Register as Citizen / University / DC
          </Link>
        </div>

      </div>
    </div>
  );
};
