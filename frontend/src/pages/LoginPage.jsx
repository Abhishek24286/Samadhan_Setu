import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, Lock, ShieldCheck, AlertCircle, Loader2, Fingerprint, RefreshCw } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, sendOtp, loginWithOtp } = useAuth();

  const [loginMethod, setLoginMethod] = useState('aadhaar'); // 'aadhaar' | 'password' | 'otp'
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    mobile: '',
    aadhaarNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // Word CAPTCHA States
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  const generateWordCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateWordCaptcha();
  }, []);

  const handleSendOtp = async () => {
    if (captchaInput.trim() !== captchaText) {
      setErrorMsg('Incorrect CAPTCHA text. Please try again.');
      generateWordCaptcha();
      return;
    }

    if (loginMethod === 'aadhaar') {
      if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
        setErrorMsg('Please enter a valid 12-digit identification number.');
        return;
      }
    } else {
      if (!formData.mobile) {
        setErrorMsg('Please enter your mobile number.');
        return;
      }
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await sendOtp(formData.aadhaarNumber || formData.mobile, loginMethod === 'aadhaar' ? 'aadhaar-login' : 'login');
      setOtpSent(true);
      setSuccessMsg('OTP sent successfully. (Prototype Test OTP: 123456)');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP.');
      generateWordCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (captchaInput.trim() !== captchaText) {
      setErrorMsg('Incorrect CAPTCHA text. Please try again.');
      generateWordCaptcha();
      return;
    }

    setLoading(true);

    try {
      let user;
      if (loginMethod === 'password') {
        user = await login(formData.identifier, formData.password);
      } else if (loginMethod === 'otp') {
        user = await loginWithOtp(formData.mobile, otp);
      } else {
        if (otp.length !== 6) {
          throw new Error('Please enter a valid 6-digit verification OTP (Use 123456 for testing).');
        }
        user = await loginWithOtp(formData.aadhaarNumber, otp);
      }

      if (user?.role === 'university') {
        navigate('/university/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
      generateWordCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 px-4 py-12 sm:py-16 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Header Branding with Clean Transparent Logo Container */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xs overflow-hidden">
            <img 
              src="images/hero/images.jpg" 
              alt="Government of Jharkhand Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Portal Sign In
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              SamadhanSetu • Government Gateway
            </p>
          </div>
        </div>

        {/* Prototype Testing Assistant Banner */}
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Prototype Mode Active:</span> Enter Word CAPTCHA, provide valid details, and use <span className="font-mono font-bold">123456</span> for OTP testing.
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl text-center">
          <button
            type="button"
            onClick={() => { setLoginMethod('aadhaar'); setOtpSent(false); setOtp(''); setErrorMsg(''); setSuccessMsg(''); generateWordCaptcha(); }}
            className={`text-xs font-bold py-2 rounded-lg transition ${loginMethod === 'aadhaar' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ID Verification
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('password'); setOtpSent(false); setOtp(''); setErrorMsg(''); setSuccessMsg(''); generateWordCaptcha(); }}
            className={`text-xs font-bold py-2 rounded-lg transition ${loginMethod === 'password' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('otp'); setOtpSent(false); setOtp(''); setErrorMsg(''); setSuccessMsg(''); generateWordCaptcha(); }}
            className={`text-xs font-bold py-2 rounded-lg transition ${loginMethod === 'otp' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Mobile OTP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {loginMethod === 'aadhaar' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  12-Digit Identification Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Fingerprint className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={formData.aadhaarNumber}
                    onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value.replace(/\D/g, '') })}
                    placeholder="Enter 12-digit ID number"
                    disabled={otpSent}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 outline-none font-mono bg-white text-slate-900 disabled:bg-slate-100"
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter 6-Digit OTP <span className="text-rose-500">*</span> <span className="text-emerald-700 font-mono">(Test: 123456)</span>
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
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 outline-none font-mono tracking-widest bg-white text-slate-900"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {loginMethod === 'password' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email or Mobile <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    placeholder="Enter email or 10-digit mobile"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 outline-none bg-white text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 outline-none bg-white text-slate-900"
                  />
                </div>
              </div>
            </>
          )}

          {loginMethod === 'otp' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Mobile Number <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    disabled={otpSent}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 outline-none bg-white text-slate-900 disabled:bg-slate-100"
                  />
                </div>
              </div>
              {otpSent && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 6-Digit OTP <span className="text-emerald-700 font-mono">(Test: 123456)</span></label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 outline-none font-mono tracking-widest bg-white text-slate-900"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* WORD CAPTCHA SECTION */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Security Verification <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div 
                className="relative bg-slate-100 border border-slate-300 px-3 py-2.5 rounded-lg font-mono text-sm font-extrabold tracking-widest text-slate-800 select-none shrink-0 overflow-hidden"
                style={{
                  backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                  backgroundSize: '8px 8px'
                }}
              >
                <span className="relative z-10 italic">{captchaText}</span>
              </div>

              <input
                type="text"
                required
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter characters"
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 outline-none font-mono bg-white text-slate-900"
              />

              <button
                type="button"
                onClick={generateWordCaptcha}
                title="Refresh Captcha"
                className="p-2.5 bg-slate-100 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-200 transition shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Button */}
          {loginMethod === 'aadhaar' && !otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
              <span>Send Verification OTP</span>
            </button>
          ) : loginMethod === 'otp' && !otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send OTP to Mobile</span>}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In Securely</span>}
            </button>
          )}
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-700 font-bold hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
};