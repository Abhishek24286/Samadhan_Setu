import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const ReportProblemPage = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    citizenName: user?.name || '',
    citizenMobile: user?.mobile || '',
    citizenEmail: user?.email || '',
    title: '',
    category: 'Drinking Water',
    district: 'Palamu',
    block: '',
    village: '',
    location: '',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const districts = [
    'Palamu',
    'Ranchi',
    'Dhanbad',
    'East Singhbhum (Jamshedpur)',
    'Bokaro',
    'Hazaribagh',
    'Deoghar',
    'Giridih',
    'Dumka',
    'Latehar',
    'Garhwa',
    'Chatra',
    'Ramgarh',
    'West Singhbhum (Chaibasa)',
    'Seraikela Kharsawan',
    'Jamtara',
    'Godda',
    'Sahebganj',
    'Pakur',
    'Lohardaga',
    'Gumla',
    'Simdega',
    'Khunti',
    'Koderma'
  ];

  const categories = [
    'Drinking Water',
    'Roads & Transport',
    'Electricity & Power',
    'Sanitation & Waste',
    'Healthcare',
    'Education',
    'Agriculture & Irrigation',
    'Environment & Forest',
    'Public Safety',
    'Other'
  ];

  const handleFillDemo = () => {
    setFormData({
      citizenName: user?.name || 'Suresh Chandra Roy',
      citizenMobile: user?.mobile || '9431155667',
      citizenEmail: user?.email || 'suresh.roy.palamu@gmail.com',
      title: 'Solar borehole pump failure causing severe drinking water crisis',
      category: 'Drinking Water',
      district: 'Palamu',
      block: 'Chainpur Block',
      village: 'Koilakhad Gram Panchayat',
      location: 'Ward No. 3, Near Panchayat Bhavan',
      description: 'The sole community solar-powered borehole pump broke down 18 days ago due to inverter controller burning. Over 280 tribal families are forced to fetch turbid water from a dry seasonal nallah 3 km away.',
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await apiRequest('/problems', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success && res.problemId) {
        setSubmissionResult({
          problemId: res.problemId,
          title: formData.title,
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-gov-green text-xs font-bold mb-2 border border-emerald-300">
          Citizen Grievance Redressal
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Report a Community Problem
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          Submit local societal or infrastructure problems for administrative verification and institutional technical resolution.
        </p>
      </div>

      {/* If problem successfully submitted: Show Official Government Receipt */}
      {submissionResult ? (
        <div className="bg-white rounded-2xl border-2 border-gov-green p-6 sm:p-8 shadow-md text-center space-y-5 animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-gov-green flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gov-green">
              Application Registered Successfully
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Official Grievance Reference Number
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Please preserve this reference ID to track progress on the portal or via CM Helpline 181.
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
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
              title="Copy to clipboard"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy ID'}</span>
            </button>
          </div>

          {/* Summary Details */}
          <div className="text-left text-xs text-slate-600 bg-gov-bg p-4 rounded-xl border border-slate-200 space-y-1.5 max-w-md mx-auto">
            <div>
              <strong>Problem Title:</strong> {submissionResult.title}
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
                Submitted (Pending Administrative Scrutiny)
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/track?id=${submissionResult.problemId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gov-green hover:bg-gov-darkgreen shadow-sm transition"
            >
              <span>Track this Problem Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                setSubmissionResult(null);
                setFormData({
                  citizenName: user?.name || '',
                  citizenMobile: user?.mobile || '',
                  citizenEmail: user?.email || '',
                  title: '',
                  category: 'Drinking Water',
                  district: 'Palamu',
                  block: '',
                  village: '',
                  location: '',
                  description: '',
                });
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
            >
              Report Another Problem
            </button>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <span className="text-xs font-bold uppercase text-slate-500">
              Citizen Reporting Form
            </span>

            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-green hover:text-gov-darkgreen bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition"
              title="Click to populate realistic sample data for testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-gov-amber" />
              <span>Fill Sample Data</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section 1: Citizen Contact Details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gov-green" /> 1. Reporting Citizen Information
              </h3>
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
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
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
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.citizenEmail}
                    onChange={(e) => setFormData({ ...formData, citizenEmail: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Problem Details */}
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-gov-green" /> 2. Problem Information
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Problem Title / Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Drinking water shortage and borewell failure in rural village"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Problem Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      District (Jharkhand) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
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
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none"
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
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none"
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
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none"
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
                    placeholder="Explain the background of the problem, number of citizens affected, how long the issue has persisted, and why current civic arrangements are insufficient..."
                    className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-slate-500">
                Official acknowledgment ID will be generated upon submission.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl text-xs font-bold text-white bg-gov-green hover:bg-gov-darkgreen disabled:opacity-50 transition shadow-sm cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering with Government Portal...</span>
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
