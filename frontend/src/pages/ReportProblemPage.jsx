import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Tag, 
  CheckCircle2, 
  Send, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Copy,
  Sparkles,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ReportProblemPage = () => {
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    citizenName: user?.name || '',
    citizenMobile: user?.mobile || '',
    citizenEmail: user?.email || '',
    district: 'Palamu',
    block: '',
    village: '',
    location: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // True once a logged-in user's account info is available. Their name, mobile,
  // and email are locked in the form; only description, location, and image
  // remain editable for them.
  const isLoggedIn = Boolean(user);

  // useAuth() may resolve the user slightly after this component's first render
  // (e.g. while a token is being verified), so keep the contact fields in sync
  // whenever the logged-in user's data becomes available or changes.
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        citizenName: user.name || prev.citizenName,
        citizenMobile: user.mobile || prev.citizenMobile,
        citizenEmail: user.email || prev.citizenEmail,
      }));
    }
  }, [user]);

  const districts = [
    'Palamu', 'Ranchi', 'Dhanbad', 'East Singhbhum (Jamshedpur)', 'Bokaro', 
    'Hazaribagh', 'Deoghar', 'Giridih', 'Dumka', 'Latehar', 'Garhwa', 
    'Chatra', 'Ramgarh', 'West Singhbhum (Chaibasa)', 'Seraikela Kharsawan', 
    'Jamtara', 'Godda', 'Sahebganj', 'Pakur', 'Lohardaga', 'Gumla', 
    'Simdega', 'Khunti', 'Koderma'
  ];

  // Clean up object URL on unmount or when preview changes to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size must be less than 5MB.');
        return;
      }
      // Revoke previous preview URL if it exists
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const dataPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        dataPayload.append(key, formData[key]);
      });
      
      if (imageFile) {
        dataPayload.append('image', imageFile);
      }

      const response = await fetch('https://samadhan-setu-f7pe.onrender.com/api/problems', {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: dataPayload,
      });

      const res = await response.json();

      if (response.ok && res.success && res.problemId) {
        setSubmissionResult({
          problemId: res.problemId,
          title: res.problem?.title || 'Community Problem Report',
          district: formData.district,
          date: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        });
      } else {
        throw new Error(res.message || 'Failed to submit problem.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (submissionResult?.problemId) {
      navigator.clipboard.writeText(submissionResult.problemId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Title */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Report a Community Problem
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          Submit local societal or infrastructure problems with optional photo evidence for AI evaluation and university technical resolution.
          {isLoggedIn && ' Your account details are pre-filled below \u2014 just add the problem details.'}
        </p>
      </div>

      {submissionResult ? (
        <div className="bg-white rounded-2xl border-2 border-emerald-500 p-6 sm:p-8 shadow-md text-center space-y-5 animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Application Registered Successfully
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Official Grievance Reference Number
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Please preserve this reference ID to track progress on the portal.
            </p>
          </div>

          {/* Reference ID Pill Box */}
          <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-inner">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Reference ID
              </span>
              <span className="text-lg sm:text-xl font-mono font-black text-emerald-400 tracking-wider">
                {submissionResult.problemId}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy ID'}</span>
            </button>
          </div>

          {/* Summary Details */}
          <div className="text-left text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 max-w-md mx-auto">
            <div>
              <strong>AI Evaluated Title:</strong> {submissionResult.title}
            </div>
            <div>
              <strong>District:</strong> {submissionResult.district}, Jharkhand
            </div>
            <div>
              <strong>Registration Date:</strong> {submissionResult.date}
            </div>
            <div>
              <strong>Current Status:</strong>{' '}
              <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                Submitted & Routed to Universities
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/track?id=${submissionResult.problemId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition"
            >
              <span>Track this Problem Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setSubmissionResult(null);
                handleRemoveImage();
                setErrorMsg('');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
            >
              Report Another Problem
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Citizen Contact Details */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.citizenName}
                    onChange={(e) => setFormData({ ...formData, citizenName: e.target.value })}
                    placeholder="e.g., Rameshwar Mahato"
                    disabled={isLoggedIn}
                    readOnly={isLoggedIn}
                    className={`w-full text-xs p-2.5 rounded-lg border outline-none ${
                      isLoggedIn
                        ? 'border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed'
                        : 'border-slate-300 focus:border-slate-900'
                    }`}
                  />
                  {isLoggedIn && (
                    <span className="text-[10px] text-slate-400 mt-1 block">From your account</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.citizenMobile}
                    onChange={(e) => setFormData({ ...formData, citizenMobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    disabled={isLoggedIn}
                    readOnly={isLoggedIn}
                    className={`w-full text-xs p-2.5 rounded-lg border outline-none ${
                      isLoggedIn
                        ? 'border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed'
                        : 'border-slate-300 focus:border-slate-900'
                    }`}
                  />
                  {isLoggedIn && (
                    <span className="text-[10px] text-slate-400 mt-1 block">From your account</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address {!isLoggedIn && '(Optional)'}
                  </label>
                  <input
                    type="email"
                    value={formData.citizenEmail}
                    onChange={(e) => setFormData({ ...formData, citizenEmail: e.target.value })}
                    placeholder="email@example.com"
                    disabled={isLoggedIn}
                    readOnly={isLoggedIn}
                    className={`w-full text-xs p-2.5 rounded-lg border outline-none ${
                      isLoggedIn
                        ? 'border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed'
                        : 'border-slate-300 focus:border-slate-900'
                    }`}
                  />
                  {isLoggedIn && (
                    <span className="text-[10px] text-slate-400 mt-1 block">From your account</span>
                  )}
                </div>
              </div>
            </div>

            {/* Problem Info & Location */}
            <div className="pt-2 border-t border-slate-100">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District (Jharkhand) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-slate-900 outline-none bg-white"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Block / Tehsil
                    </label>
                    <input
                      type="text"
                      value={formData.block}
                      onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                      placeholder="e.g., Chainpur Block"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Village / Ward / Panchayat
                    </label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      placeholder="e.g., Murumdag Panchayat, Ward 4"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Landmark / Location Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Near Primary Health Sub-Center, Murumdag"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Detailed Problem Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Explain the issue, people affected, and duration. Gemini AI will automatically categorize and generate a professional title from this text and your photo!"
                    className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:border-slate-900 outline-none leading-relaxed"
                  />
                </div>

                {/* Image Upload & Camera Capture Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Attach Photographic Evidence (Optional)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer transition">
                      <Camera className="w-4 h-4 text-slate-600" />
                      <span>Take Photo / Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Supports JPG, PNG, WEBP (Max 5MB). AI analyzes images to improve category precision.
                    </span>
                  </div>

                  {/* Image Preview Thumbnail */}
                  {imagePreview && (
                    <div className="mt-3 relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Evidence preview"
                        className="w-24 h-24 object-cover rounded-lg border border-slate-300 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-slate-500">
                AI evaluation & reference ID will generate instantly upon submission.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition shadow-sm cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing via AI & Broadcasting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Community Problem</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};