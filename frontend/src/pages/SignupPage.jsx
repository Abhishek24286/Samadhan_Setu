import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, AlertCircle, Loader2, Fingerprint, ShieldCheck } from 'lucide-react';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, sendOtp, signupWithOtp } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    userType: 'citizen',
    aadhaarNumber: '',
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
  const [successMsg, setSuccessMsg] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const districts = [
    'Ranchi', 'Dhanbad', 'Palamu', 'East Singhbhum (Jamshedpur)',
    'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih', 'Dumka', 'Latehar'
  ];

  const handleSendOtp = async () => {
    if (formData.userType === 'citizen') {
      if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
        setErrorMsg('Valid 12-digit identification number is compulsory for citizen signup.');
        return;
      }
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await sendOtp(formData.aadhaarNumber || formData.mobile, 'signup');
      setOtpSent(true);
      setSuccessMsg('OTP sent successfully. (Prototype Test OTP: 123456)');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.userType === 'citizen') {
      if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
        setErrorMsg('A valid 12-digit identification number is mandatory.');
        return;
      }
      if (!otpSent || !otp) {
        setErrorMsg('Please complete verification OTP (Use 123456).');
        return;
      }
    }

    setLoading(true);
    try {
      let newUser;
     // Inside SignupPage.jsx -> handleSubmit
if (formData.userType === 'citizen') {
  newUser = await signupWithOtp({
    name: formData.name,
    mobile: formData.mobile,
    aadhaarNumber: formData.aadhaarNumber,
    district: formData.district,
    otp: otp,
    password: formData.password || ''
  });
}else {
        newUser = await signup({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          userType: 'university',
          institutionName: formData.institutionName,
          district: formData.district,
          registrationNumber: formData.registrationNumber,
          address: formData.address,
          expertiseTags: formData.expertiseTags.split(',').map(tag => tag.trim()).filter(t => t),
          serviceLocation: formData.serviceLocation,
          contactPerson: formData.contactPerson,
        });
      }

      if (newUser.role === 'university') {
        navigate('/university/dashboard');
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
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 px-4 py-12 sm:py-16 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Header Section with Jharkhand Official Logo */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs overflow-hidden p-1.5">
            <img 
              src="images/hero/images.jpg" 
              alt="Government of Jharkhand Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Create Portal Account
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Secure Registration • Government of Jharkhand Gateway
            </p>
          </div>
        </div>

        {/* Prototype Testing Assistant Banner */}
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Prototype Testing Guide:</span> For Citizens, enter any 12-digit ID, click verify, and type <span className="font-mono font-bold">123456</span> as the OTP to bypass and register successfully.
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

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Account Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Account Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2.5 cursor-pointer transition ${formData.userType === 'citizen' ? 'border-emerald-700 bg-emerald-50/70 text-emerald-900 font-bold shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}>
                <input
                  type="radio"
                  name="userType"
                  value="citizen"
                  checked={formData.userType === 'citizen'}
                  onChange={() => { setFormData({ ...formData, userType: 'citizen' }); setOtpSent(false); setOtp(''); setErrorMsg(''); }}
                  className="text-emerald-700 focus:ring-emerald-700"
                />
                <span>Citizen (ID Req.)</span>
              </label>

              <label className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2.5 cursor-pointer transition ${formData.userType === 'university' ? 'border-emerald-700 bg-emerald-50/70 text-emerald-900 font-bold shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}>
                <input
                  type="radio"
                  name="userType"
                  value="university"
                  checked={formData.userType === 'university'}
                  onChange={() => { setFormData({ ...formData, userType: 'university' }); setOtpSent(false); setOtp(''); setErrorMsg(''); }}
                  className="text-emerald-700 focus:ring-emerald-700"
                />
                <span>Academic Institution</span>
              </label>
            </div>
          </div>

          {/* CITIZEN FORM */}
          {formData.userType === 'citizen' && (
            <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-4">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs pb-2 border-b border-emerald-200">
                <Fingerprint className="w-4 h-4 text-emerald-700" />
                <span>Mandatory Identity Verification</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  12-Digit Identification Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={12}
                  value={formData.aadhaarNumber}
                  onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder="Enter 12-digit Unique ID"
                  disabled={otpSent}
                  className="w-full text-xs p-2.5 rounded-lg border border-emerald-300 focus:border-emerald-600 outline-none font-mono bg-white text-slate-900 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Abhishek Kumar"
                  className="w-full text-xs p-2.5 rounded-lg border border-emerald-300 focus:border-emerald-600 outline-none bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">Mobile Number <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                    placeholder="10-digit mobile"
                    disabled={otpSent}
                    className="w-full text-xs p-2.5 rounded-lg border border-emerald-300 focus:border-emerald-600 outline-none bg-white text-slate-900 disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">District <span className="text-rose-500">*</span></label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-emerald-300 focus:border-emerald-600 outline-none bg-white text-slate-900"
                  >
                    {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Enter 6-Digit OTP <span className="text-emerald-700 font-mono">(Test: 123456)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full text-xs p-2.5 rounded-lg border border-emerald-300 focus:border-emerald-600 outline-none font-mono tracking-widest bg-white text-slate-900"
                  />
                </div>
              )}
            </div>
          )}

          {/* UNIVERSITY FORM */}
          {formData.userType === 'university' && (
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-4">
              <div className="text-blue-900 font-bold text-xs pb-2 border-b border-blue-200">
                Institutional Details
              </div>
              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">College / Institution Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  placeholder="e.g., Government Engineering College, Palamu"
                  className="w-full text-xs p-2.5 rounded-lg border border-blue-300 focus:border-blue-600 outline-none bg-white text-slate-900"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1">Registration No. <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="Reg No."
                    className="w-full text-xs p-2.5 rounded-lg border border-blue-300 focus:border-blue-600 outline-none bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1">District <span className="text-rose-500">*</span></label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-blue-300 focus:border-blue-600 outline-none bg-white text-slate-900"
                  >
                    {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1">Password <span className="text-rose-500">*</span></label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full text-xs p-2.5 rounded-lg border border-blue-300 focus:border-blue-600 outline-none bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1">Confirm Password <span className="text-rose-500">*</span></label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    className="w-full text-xs p-2.5 rounded-lg border border-blue-300 focus:border-blue-600 outline-none bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submission Buttons */}
          {formData.userType === 'citizen' ? (
            !otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
                <span>Verify ID & Send OTP</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition shadow-sm cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Complete Citizen Registration</span>}
              </button>
            )
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Register University Account</span>}
            </button>
          )}
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-700 font-bold hover:underline">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};