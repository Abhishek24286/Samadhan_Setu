import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

export const UniversityDashboard = () => {
  const { user, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' | 'solutions' | 'submit'
  
  const [problems, setProblems] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detail view state for selected problem
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Form state for submitting proposed solution
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

  // Fetch real data from your backend API / Database
  const fetchData = async () => {
    setLoading(true);
    try {
      const [probRes, solRes] = await Promise.all([
        apiRequest('/university/my-problems'),
        apiRequest('/university/my-solutions'),
      ]);

      if (probRes && probRes.success && probRes.problems) {
        setProblems(probRes.problems);
      } else if (Array.isArray(probRes)) {
        setProblems(probRes);
      } else {
        setProblems([]);
      }

      if (solRes && solRes.success) {
        setSolutions(solRes.solutions || []);
      } else if (Array.isArray(solRes)) {
        setSolutions(solRes);
      }
    } catch (err) {
      console.error('Failed to load university portal data from DB:', err.message);
      if (showToast) {
        showToast('Failed to fetch latest problems from database.', 'error');
      }
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
          problemId: targetProblem.problemId || targetProblem._id,
          ...solutionForm,
        }),
      });

      if (res && res.success) {
        if (showToast) showToast('Solution blueprint submitted successfully.', 'success');
        setTargetProblem(null);
        setActiveTab('solutions');
        fetchData();
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to submit solution.', 'error');
    } finally {
      setSubmittingSolution(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 p-3 sm:p-4 text-slate-900 text-xs">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 rounded-md shadow-sm border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-700 pb-1 mb-1.5">
                Academic Partner Portal &bull; {user?.institutionName || user?.name || 'Institutional Access'}
              </div>
              <h1 className="text-base font-bold text-white tracking-tight">
                University Task Management & Solution Filing System
              </h1>
            </div>

            <div className="flex items-center gap-4 bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700/60 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Nodal Officer</span>
                <span className="font-bold text-slate-100">{user?.name || 'N/A'}</span>
              </div>
              <div className="h-6 w-px bg-slate-700"></div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact Email</span>
                <span className="text-slate-300 font-mono">{user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Task View Panel */}
        {selectedProblem && (
          <div className="bg-white border border-slate-400 p-4 rounded space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="px-2 py-0.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px]"
                >
                  Back to List
                </button>
                <span className="font-mono font-bold text-slate-800">#{selectedProblem.problemId || selectedProblem._id}</span>
                <StatusBadge status={selectedProblem.status} />
              </div>
              <button
                onClick={() => setSelectedProblem(null)}
                className="text-slate-500 font-bold hover:text-slate-800 px-1 text-sm"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2 space-y-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{selectedProblem.title}</h2>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Category: {selectedProblem.category} | District: {selectedProblem.district}
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-600 uppercase text-[10px] block mb-1">Detailed Problem Description</span>
                  <p className="text-slate-800 leading-normal whitespace-pre-line">{selectedProblem.description}</p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
                <span className="font-bold text-slate-600 uppercase text-[10px] block border-b border-slate-200 pb-1">Location Details</span>
                <div>
                  <span className="text-slate-500 block text-[11px]">District / Block:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedProblem.village ? `${selectedProblem.village}, ` : ''}
                    {selectedProblem.block ? `${selectedProblem.block}, ` : ''}
                    {selectedProblem.district}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Full Address:</span>
                  <span className="text-slate-800">{selectedProblem.location || 'N/A'}</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const prob = selectedProblem;
                      setSelectedProblem(null);
                      handleOpenSubmit(prob);
                    }}
                    className="w-full text-center px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded"
                  >
                    Submit Proposal for This Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Navigation Bar */}
        <div className="flex items-center gap-1 border-b border-slate-300 bg-white px-2 py-1.5 rounded">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-3 py-1 font-bold text-xs rounded transition ${
              activeTab === 'assigned'
                ? 'bg-slate-800 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Assigned Tasks ({problems.length})
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-3 py-1 font-bold text-xs rounded transition ${
              activeTab === 'solutions'
                ? 'bg-slate-800 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Filed Proposals ({solutions.length})
          </button>
          {targetProblem && (
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-3 py-1 font-bold text-xs rounded transition ${
                activeTab === 'submit'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Filing: #{targetProblem.problemId || targetProblem._id}
            </button>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-12 text-center bg-white border border-slate-300 rounded text-slate-500 font-medium">
            Fetching problem records from database...
          </div>
        ) : (
          <>
            {/* TAB 1: ASSIGNED PROBLEMS */}
            {activeTab === 'assigned' && (
              <div className="bg-white border border-slate-300 rounded overflow-hidden">
                <div className="p-2.5 border-b border-slate-200 bg-slate-50 font-bold text-slate-800">
                  Assigned Community Problems & Technical Requirements
                </div>
                {problems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                        <tr>
                          <th className="py-2 px-3 border-r border-slate-200">ID</th>
                          <th className="py-2 px-3 border-r border-slate-200">Title & Description</th>
                          <th className="py-2 px-3 border-r border-slate-200">Category</th>
                          <th className="py-2 px-3 border-r border-slate-200">Location</th>
                          <th className="py-2 px-3 border-r border-slate-200">Status</th>
                          <th className="py-2 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        {problems.map((p) => (
                          <tr key={p._id || p.problemId} className="hover:bg-slate-50">
                            <td className="py-2 px-3 border-r border-slate-200 font-mono font-bold text-slate-900 whitespace-nowrap">
                              {p.problemId || p._id}
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 max-w-sm">
                              <div className="font-bold text-slate-900">{p.title}</div>
                              <div className="text-slate-600 truncate text-[11px]">{p.description}</div>
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">{p.category}</td>
                            <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">
                              {p.district}
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">
                              <StatusBadge status={p.status} />
                            </td>
                            <td className="py-2 px-3 text-right whitespace-nowrap space-x-1">
                              <button
                                onClick={() => setSelectedProblem(p)}
                                className="px-2 py-1 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-800 font-semibold rounded"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleOpenSubmit(p)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded"
                              >
                                Submit Proposal
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    No active tasks currently assigned to your institution in the database.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SUBMITTED SOLUTIONS */}
            {activeTab === 'solutions' && (
              <div className="bg-white border border-slate-300 rounded overflow-hidden">
                <div className="p-2.5 border-b border-slate-200 bg-slate-50 font-bold text-slate-800">
                  Submitted Technical Proposals & R&D Blueprints
                </div>
                {solutions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                        <tr>
                          <th className="py-2 px-3 border-r border-slate-200">Problem ID</th>
                          <th className="py-2 px-3 border-r border-slate-200">Proposal Title</th>
                          <th className="py-2 px-3 border-r border-slate-200">Lead Investigator</th>
                          <th className="py-2 px-3 border-r border-slate-200">Estimated Budget</th>
                          <th className="py-2 px-3 border-r border-slate-200">Filing Date</th>
                          <th className="py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        {solutions.map((sol) => (
                          <tr key={sol._id || sol.problemId} className="hover:bg-slate-50">
                            <td className="py-2 px-3 border-r border-slate-200 font-mono font-bold whitespace-nowrap">
                              {sol.problemId}
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200">
                              <div className="font-bold text-slate-900">{sol.title}</div>
                              <div className="text-slate-600 text-[11px] truncate max-w-xs">{sol.description}</div>
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">{sol.submittedBy}</td>
                            <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">{sol.estimatedResources || 'N/A'}</td>
                            <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">
                              {sol.createdAt ? new Date(sol.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                            </td>
                            <td className="py-2 px-3 whitespace-nowrap font-bold text-slate-700">
                              {sol.status || 'Submitted'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    No proposal blueprints filed yet. Select an assigned task to submit one.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: FORM SUBMISSION */}
            {activeTab === 'submit' && targetProblem && (
              <div className="bg-white border border-slate-300 p-4 rounded max-w-3xl mx-auto space-y-3">
                <div className="border-b border-slate-200 pb-2">
                  <div className="text-[10px] font-bold uppercase text-slate-500">Filing Technical Solution</div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Ref: #{targetProblem.problemId || targetProblem._id} - {targetProblem.title}
                  </h2>
                </div>

                <form onSubmit={handleSubmitSolution} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Proposal Title <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={solutionForm.title}
                        onChange={(e) => setSolutionForm({ ...solutionForm, title: e.target.value })}
                        className="w-full p-1.5 border border-slate-300 rounded outline-none focus:border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Lead Faculty / Department Head <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={solutionForm.submittedBy}
                        onChange={(e) => setSolutionForm({ ...solutionForm, submittedBy: e.target.value })}
                        placeholder="e.g., Dr. A. K. Roy, Dept of Civil Eng."
                        className="w-full p-1.5 border border-slate-300 rounded outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Executive Summary <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={solutionForm.description}
                      onChange={(e) => setSolutionForm({ ...solutionForm, description: e.target.value })}
                      placeholder="Summary of proposed solution..."
                      className="w-full p-1.5 border border-slate-300 rounded outline-none focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Technical Methodology & Specifications <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={solutionForm.technicalDetails}
                      onChange={(e) => setSolutionForm({ ...solutionForm, technicalDetails: e.target.value })}
                      placeholder="Provide technical specs, materials needed, digital architecture, or execution blueprint..."
                      className="w-full p-1.5 border border-slate-300 rounded font-mono outline-none focus:border-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Estimated Budget / Cost
                      </label>
                      <input
                        type="text"
                        value={solutionForm.estimatedResources}
                        onChange={(e) => setSolutionForm({ ...solutionForm, estimatedResources: e.target.value })}
                        placeholder="e.g. ₹ 3,50,000"
                        className="w-full p-1.5 border border-slate-300 rounded outline-none focus:border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Blueprint / Document Link
                      </label>
                      <input
                        type="text"
                        value={solutionForm.documents}
                        onChange={(e) => setSolutionForm({ ...solutionForm, documents: e.target.value })}
                        placeholder="https://drive.google.com/..."
                        className="w-full p-1.5 border border-slate-300 rounded outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetProblem(null);
                        setActiveTab('assigned');
                      }}
                      className="px-3 py-1 border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingSolution}
                      className="px-4 py-1 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold rounded"
                    >
                      {submittingSolution ? 'Submitting Proposal...' : 'Submit Official Proposal'}
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