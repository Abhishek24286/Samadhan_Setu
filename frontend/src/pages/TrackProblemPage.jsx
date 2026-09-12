import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Tag, 
  Calendar, 
  Building2, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { apiRequest } from '../utils/api';
import { StatusBadge } from '../components/StatusBadge';
import { ProblemTimeline } from '../components/ProblemTimeline';

export const TrackProblemPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [problemId, setProblemId] = useState(initialId);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample IDs quick buttons for demo
  const sampleIds = ['JH-2026-000001', 'JH-2026-000002', 'JH-2026-000003', 'JH-2026-000004'];

  const handleSearch = async (idToSearch) => {
    const id = (idToSearch || problemId).trim().toUpperCase();
    if (!id) {
      setErrorMsg('Please enter a valid Reference Number (e.g., JH-2026-000001).');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setProblem(null);

    try {
      const res = await apiRequest(`/problems/track/${id}`);
      if (res.success && res.problem) {
        setProblem(res.problem);
        setSearchParams({ id });
      } else {
        setErrorMsg(res.message || 'No record found.');
      }
    } catch (err) {
      setErrorMsg(err.message || `No record found with Reference ID '${id}'. Please verify.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-gov-green text-xs font-bold mb-2 border border-emerald-300">
          Citizen Verification
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Track Problem Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Enter your official government reference number to inspect real-time progress and departmental updates.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={problemId}
              onChange={(e) => setProblemId(e.target.value)}
              placeholder="Enter Reference Number (e.g. JH-2026-000001)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none text-sm font-mono uppercase text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-white bg-gov-green hover:bg-gov-darkgreen disabled:opacity-50 transition shadow-sm cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Track Status</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Sample IDs for evaluators */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Quick Demo Search:</span>
          {sampleIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setProblemId(id);
                handleSearch(id);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 font-mono text-[11px] font-bold text-slate-700 transition"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Problem Details & Timeline View */}
      {problem && (
        <div className="space-y-6 animate-in fade-in">
          {/* Main Problem Meta Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-slate-900 text-white p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {problem.problemId}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Category: {problem.category}
                  </span>
                </div>
                <div>
                  <StatusBadge status={problem.status} />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {problem.title}
              </h2>

              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gov-saffron" />
                  <span>
                    {problem.village ? `${problem.village}, ` : ''}
                    {problem.block ? `${problem.block}, ` : ''}
                    <strong>{problem.district}, Jharkhand</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>
                    Reported on: {new Date(problem.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-7 space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Reported Problem Description
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-gov-bg p-4 rounded-xl border border-slate-200">
                  {problem.description}
                </p>
              </div>

              {/* Assignment status callout */}
              {(problem.assignedUniversityName || problem.assignedDepartment) && (
                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px] font-bold uppercase">Assigned Authority / Partner</span>
                    <span className="font-extrabold text-indigo-900 text-sm">
                      {problem.assignedUniversityName || problem.assignedDepartment}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-white text-indigo-700 font-bold border border-indigo-200 self-start sm:self-auto">
                    {problem.assignedTo === 'University' ? 'Technical Academic Partner' : 'Government Department'}
                  </span>
                </div>
              )}

              {/* Remarks if any */}
              {problem.adminRemarks && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-900 block mb-1">
                    Official Administrative Remarks:
                  </span>
                  <p className="text-emerald-950 leading-relaxed">
                    {problem.adminRemarks}
                  </p>
                </div>
              )}

              {/* Rejection reason if rejected */}
              {problem.status === 'Rejected' && problem.rejectionReason && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                  <span className="font-bold text-rose-900 block mb-1">
                    Administrative Disqualification Reason:
                  </span>
                  <p className="text-rose-950 leading-relaxed">
                    {problem.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Visual Status Timeline */}
          <ProblemTimeline currentStatus={problem.status} timeline={problem.timeline} />
        </div>
      )}
    </div>
  );
};
