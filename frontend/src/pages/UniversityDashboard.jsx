import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Layers, 
  FileText, 
  Send, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Loader2, 
  PlusCircle, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

export const UniversityDashboard = () => {
  const { user, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' | 'solutions' | 'submit'
  const [problems, setProblems] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form for submitting proposed solution
  const [targetProblem, setTargetProblem] = useState(null);
  const [solutionForm, setSolutionForm] = useState({
    title: '',
    description: '',
    technicalDetails: '',
    estimatedResources: '',
    documents: '',
    submittedBy: user?.name || '',
  });
  const [submittingSolution, setSubmittingSolution] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [probRes, solRes] = await Promise.all([
        apiRequest('/university/my-problems'),
        apiRequest('/university/my-solutions'),
      ]);

      if (probRes.success) setProblems(probRes.problems || []);
      if (solRes.success) setSolutions(solRes.solutions || []);
    } catch (err) {
      console.error('Failed to load university portal data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenSubmit = (problem) => {
    setTargetProblem(problem);
    setSolutionForm({
      title: `Technical Solution for ${problem.title}`,
      description: '',
      technicalDetails: '',
      estimatedResources: '₹ ',
      documents: '',
      submittedBy: user?.name || '',
    });
    setActiveTab('submit');
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!targetProblem) return;

    setSubmittingSolution(true);
    try {
      const res = await apiRequest('/university/solutions', {
        method: 'POST',
        body: JSON.stringify({
          problemId: targetProblem.problemId,
          ...solutionForm,
        }),
      });

      if (res.success) {
        showToast('Solution blueprint submitted successfully! District administration notified.', 'success');
        setTargetProblem(null);
        setActiveTab('solutions');
        fetchData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit solution.', 'error');
    } finally {
      setSubmittingSolution(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gov-bg -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* University Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Accredited Technical Portal
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {user?.institutionName || user?.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-gov-green" />
              University Innovation Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Examine assigned community problems, coordinate faculty-student R&D teams, and upload technical proposals.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Authorized Nodal Representative:</span>
            <span className="text-sm font-bold text-slate-900">{user?.name}</span>
            <span className="text-xs text-slate-500 block">{user?.email}</span>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 rounded-xl shadow-2xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'assigned'
                ? 'bg-gov-green text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Assigned Problems ({problems.length})
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'solutions'
                ? 'bg-gov-green text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Submitted Solutions ({solutions.length})
          </button>
          {targetProblem && (
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'submit'
                  ? 'bg-gov-green text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Submit Solution: {targetProblem.problemId}
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-gov-green mb-2" />
            <p className="text-xs text-slate-500">Retrieving assigned community problems...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: ASSIGNED PROBLEMS */}
            {activeTab === 'assigned' && (
              <div className="space-y-4">
                {problems.length > 0 ? (
                  problems.map((p) => (
                    <div
                      key={p._id}
                      className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-300 transition shadow-xs flex flex-col md:flex-row items-start justify-between gap-6"
                    >
                      <div className="space-y-2.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-gov-green bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {p.problemId}
                          </span>
                          <StatusBadge status={p.status} />
                          <span className="text-xs text-slate-400 font-medium">
                            Category: {p.category}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900">
                          {p.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-gov-saffron" />
                          <span>
                            {p.village ? `${p.village}, ` : ''}
                            {p.block ? `${p.block}, ` : ''}
                            <strong>{p.district}, Jharkhand</strong>
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed bg-gov-bg p-3.5 rounded-xl border border-slate-200">
                          {p.description}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
                        <button
                          onClick={() => handleOpenSubmit(p)}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gov-green hover:bg-gov-darkgreen shadow-sm transition cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Submit Solution Blueprint</span>
                        </button>
                        <a
                          href={`/track?id=${p.problemId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
                        >
                          <span>View Public Timeline</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                    <h3 className="font-bold text-base text-slate-900">No Pending Assigned Problems</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      All problems currently assigned to your institution have solutions submitted or are resolved.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SUBMITTED SOLUTIONS */}
            {activeTab === 'solutions' && (
              <div className="space-y-4">
                {solutions.length > 0 ? (
                  solutions.map((sol) => (
                    <div
                      key={sol._id}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            Problem: {sol.problemId}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                            Status: {sol.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Submitted on: {new Date(sol.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {sol.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {sol.description}
                      </p>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <span className="font-bold text-slate-800 block">Technical Methodology:</span>
                        <p className="text-slate-600">{sol.technicalDetails}</p>
                        {sol.estimatedResources && (
                          <p className="text-slate-600 pt-1">
                            <strong>Estimated Resources/Cost:</strong> {sol.estimatedResources}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                        <span>Lead Investigator: <strong>{sol.submittedBy}</strong></span>
                        <a
                          href={`/track?id=${sol.problemId}`}
                          className="text-gov-green hover:underline font-bold"
                        >
                          View Public Status →
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                    <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <h3 className="font-bold text-base text-slate-900">No Solutions Submitted Yet</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Select an assigned problem from the tab above to submit a technical proposal.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PROPOSED SOLUTION SUBMISSION FORM */}
            {activeTab === 'submit' && targetProblem && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold uppercase text-gov-green">
                    Technical Solution Blueprint
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                    Proposal for: {targetProblem.problemId} - {targetProblem.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Location: {targetProblem.district}, Jharkhand
                  </p>
                </div>

                <form onSubmit={handleSubmitSolution} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Solution Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={solutionForm.title}
                      onChange={(e) => setSolutionForm({ ...solutionForm, title: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Lead Faculty / Student Team Head <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={solutionForm.submittedBy}
                      onChange={(e) => setSolutionForm({ ...solutionForm, submittedBy: e.target.value })}
                      placeholder="e.g. Dr. A. K. Roy, Dept of Civil Engineering"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Executive Solution Summary <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={solutionForm.description}
                      onChange={(e) => setSolutionForm({ ...solutionForm, description: e.target.value })}
                      placeholder="Brief summary of how this solution addresses the community issue..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Detailed Technical Methodology & Specifications <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={solutionForm.technicalDetails}
                      onChange={(e) => setSolutionForm({ ...solutionForm, technicalDetails: e.target.value })}
                      placeholder="Detail the technical schematics, hardware components, civil measurements, or digital architecture proposed by the university team..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Estimated Budget / Resources Required
                      </label>
                      <input
                        type="text"
                        value={solutionForm.estimatedResources}
                        onChange={(e) => setSolutionForm({ ...solutionForm, estimatedResources: e.target.value })}
                        placeholder="e.g. ₹ 3,50,000 (Materials + Fabrication)"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Supporting Documents / Blueprints URL
                      </label>
                      <input
                        type="text"
                        value={solutionForm.documents}
                        onChange={(e) => setSolutionForm({ ...solutionForm, documents: e.target.value })}
                        placeholder="https://drive.google.com/..."
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-gov-green focus:ring-2 focus:ring-emerald-100 outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetProblem(null);
                        setActiveTab('assigned');
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submittingSolution}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gov-green hover:bg-gov-darkgreen disabled:opacity-50 transition shadow-sm cursor-pointer"
                    >
                      {submittingSolution ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting to District Administration...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Solution to Government</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
