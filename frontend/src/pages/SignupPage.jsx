import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, AlertCircle, Loader2 } from 'lucide-react';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, sendOtp, signupWithOtp } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    userType: 'citizen', // 'citizen' | 'university' | 'admin'
    institutionName: '',
    district: 'Ranchi',
    registrationNumber: '',
    address: '',
    expertiseTags: '',
    serviceLocation: '',
    contactPerson: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [useOtp, setUseOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const districts = [
    'Ranchi', 'Dhanbad', 'Palamu', 'East Singhbhum (Jamshedpur)',
    'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih', 'Dumka', 'Latehar'
  ];

  const handleSendOtp = async () => {
    if (!formData.mobile) {
      setErrorMsg('Please enter your mobile number to receive OTP.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await sendOtp(formData.mobile, 'signup');
      setOtpSent(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!useOtp && formData.password !== formData.confirmPassword) {
      setErrorMsg('Password confirmation does not match.');
      return;
    }

    if (!useOtp && formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (formData.userType === 'admin') {
      setErrorMsg('Unauthorized role selection. Government administrator accounts are restricted.');
      return;
    }

    setLoading(true);
    try {
      let newUser;
      
      if (useOtp && formData.userType === 'citizen') {
        newUser = await signupWithOtp({
          name: formData.name,
          mobile: formData.mobile,
          district: formData.district,
          otp: otp,
          password: formData.password || ''
        });
      } else {
        newUser = await signup({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          userType: formData.userType,
          institutionName: formData.userType === 'university' ? formData.institutionName : '',
          district: formData.district,
          registrationNumber: formData.userType === 'university' ? formData.registrationNumber : '',
          address: formData.userType === 'university' ? formData.address : '',
          expertiseTags: formData.userType === 'university' ? formData.expertiseTags.split(',').map(tag => tag.trim()).filter(t => t) : [],
          serviceLocation: formData.userType === 'university' ? formData.serviceLocation : '',
          contactPerson: formData.userType === 'university' ? formData.contactPerson : '',
        });
      }

      if (newUser.role === 'university') {
        navigate('/university/dashboard');
      } else if (newUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 px-4 py-12 sm:py-16">
      <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 font-black text-sm">
            झार
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create User Account
          </h1>
          <p className="text-xs text-slate-500">
            Register as a local citizen or an accredited academic institution
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
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Account Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2.5 cursor-pointer transition ${
                  formData.userType === 'citizen'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="userType"
                  value="citizen"
                  checked={formData.userType === 'citizen'}
                  onChange={() => {
                    setFormData({ ...formData, userType: 'citizen' });
                    setUseOtp(false);
                  }}
                  className="text-emerald-700 focus:ring-emerald-700"
                />
                <span>Citizen / Student</span>
              </label>

              <label
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2.5 cursor-pointer transition ${
                  formData.userType === 'university'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="userType"
                  value="university"
                  checked={formData.userType === 'university'}
                  onChange={() => {
                    setFormData({ ...formData, userType: 'university' });
                    setUseOtp(false);
                  }}
                  className="text-emerald-700 focus:ring-emerald-700"
                />
                <span>University</span>
              </label>

              <label
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2.5 cursor-pointer transition ${
                  formData.userType === 'admin'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="userType"
                  value="admin"
                  checked={formData.userType === 'admin'}
                  onChange={() => {
                    setFormData({ ...formData, userType: 'admin' });
                    setUseOtp(false);
                  }}
                  className="text-emerald-700 focus:ring-emerald-700"
                />
                <span>Dist. Collectorate</span>
              </label>
            </div>
          </div>

          {formData.userType === 'citizen' && (
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => { setUseOtp(false); setOtpSent(false); setOtp(''); }}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition ${!useOtp ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Register with Password
              </button>
              <button
                type="button"
                onClick={() => { setUseOtp(true); }}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition ${useOtp ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Register with OTP
              </button>
            </div>
          )}

          {formData.userType === 'university' && (
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">
                  Official College / University Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  placeholder="e.g., Birla Institute of Technology, Mesra"
                  className="w-full text-xs p-2.5 rounded-lg border border-blue-300 focus:border-blue-600 outline-none bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1">
                    Registration Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="Govt/AICTE Reg No."
                    className="w-full text-xs p-2.5 rounded-lg border border-blue-300 focus:border-blue-600 outline-none bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1">
                    Service Location
                  </label>
                  <input
                    type="text"
                    value={formData.serviceLocation}
                    onChange={(e) => setFormData({ ...formData, serviceLocation: e.target.value })}
                    placeholder="City / Region"
                    className="w-full text-xs p-2.5 rounded-lg border border-blue-300 focus:border-blue-600 outline-none bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full institutional address"
                  className="w-full text-xs p-2.5 rounded-lg border border-blue-300 focus:border-blue-600 outline-none bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">
                  Expertise Tags <span className="text-blue-600 font-normal">(Comma separated)</span>
                </label>
                <input
                  type="text"
                  value={formData.expertiseTags}
                  onChange={(e) => setFormData({ ...formData, expertiseTags: e.target.value })}
                  placeholder="e.g., Civil Engineering, Water Management"
                  className="w-full text-xs p-2.5 rounded-lg border border-blue-300 focus:border-blue-600 outline-none bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Name of nodal point of contact"
                  className="w-full text-xs p-2.5 rounded-lg border border-blue-300 focus:border-blue-600 outline-none bg-white text-slate-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {formData.userType === 'university' ? 'Nodal Officer / Representative Name' : 'Full Name'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Rameshwar Mahato"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 outline-none bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(!useOtp || formData.userType === 'university' || formData.userType === 'admin') && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {formData.userType === 'admin' ? 'Official Govt Email (.gov.in)' : 'Email Address'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required={!useOtp}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={formData.userType === 'admin' ? 'name@jharkhand.gov.in' : 'name@example.com'}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 outline-none bg-white text-slate-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="10-digit mobile"
                  disabled={useOtp && otpSent}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 outline-none bg-white text-slate-900 disabled:bg-slate-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              District (Jharkhand) <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 outline-none bg-white text-slate-900"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {(!useOtp || formData.userType === 'university' || formData.userType === 'admin') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required={!useOtp}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 outline-none bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required={!useOtp}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 outline-none bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {useOtp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional Password <span className="text-slate-400 font-normal">(for future login without OTP)</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Set an optional password"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 outline-none bg-white text-slate-900"
                />
              </div>
            </div>
          )}

          {useOtp && otpSent && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enter 6-Digit OTP <span className="text-rose-500">*</span>
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
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 outline-none font-mono tracking-widest bg-white text-slate-900"
                />
              </div>
              <div className="text-right mt-1">
                <button type="button" onClick={handleSendOtp} className="text-[10px] text-emerald-700 hover:underline font-bold">
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          {useOtp && !otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition shadow-xs cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending OTP...</span>
                </span>
              ) : (
                <span>Send OTP to Mobile</span>
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition shadow-xs cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </span>
              ) : (
                <span>{useOtp ? 'Verify OTP & Register' : 'Register Account'}</span>
              )}
            </button>
          )}
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-700 font-bold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};