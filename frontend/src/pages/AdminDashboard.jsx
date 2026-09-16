import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

export const AdminDashboard = () => {
  const { user, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  // Detailed View State
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Administrative Modal Action
  const [actionModal, setActionModal] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', remarks: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/admin/problems');
      let fetchedProblems = [];
      if (res && res.success && res.problems) {
        fetchedProblems = res.problems;
      } else if (Array.isArray(res)) {
        fetchedProblems = res;
      }
      setProblems(fetchedProblems);

      if (selectedProblem) {
        const updatedCurrent = fetchedProblems.find(
          (p) => (p._id || p.problemId) === (selectedProblem._id || selectedProblem.problemId)
        );
        if (updatedCurrent) setSelectedProblem(updatedCurrent);
      }
    } catch (err) {
      console.error('Failed to load portal data:', err.message);
      if (showToast) showToast('Failed to fetch problem records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter Logic
  const filteredProblems = problems.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'All' || p.district === selectedDistrict;

    let matchesTab = true;
    if (activeTab === 'pending') {
      matchesTab = p.status === 'Submitted' || p.status === 'Under Review' || p.status === 'Approved';
    } else if (activeTab === 'assigned') {
      matchesTab = p.status === 'Assigned' || p.status === 'Work in Progress' || p.status === 'Solution Proposed';
    } else if (activeTab === 'resolved') {
      matchesTab = p.status === 'Resolved' || p.status === 'Rejected';
    }

    return matchesCategory && matchesDistrict && matchesTab;
  });

  const categories = ['All', ...new Set(problems.map((p) => p.category).filter(Boolean))];
  const districts = ['All', ...new Set(problems.map((p) => p.district).filter(Boolean))];

  // Calculations for Status Pie Chart
  const statusCounts = problems.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const totalSegmentsCount = problems.length || 1;

  const pieSegments = [
    { label: 'Submitted / Review', count: (statusCounts['Submitted'] || 0) + (statusCounts['Under Review'] || 0) + (statusCounts['Approved'] || 0), color: '#0f172a' },
    { label: 'In Execution', count: (statusCounts['Assigned'] || 0) + (statusCounts['Work in Progress'] || 0) + (statusCounts['Solution Proposed'] || 0), color: '#475569' },
    { label: 'Resolved', count: statusCounts['Resolved'] || 0, color: '#059669' },
    { label: 'Rejected', count: statusCounts['Rejected'] || 0, color: '#dc2626' },
  ];

  const renderPieSegments = () => {
    let cumulativeAngle = 0;
    return pieSegments.map((segment, index) => {
      const sliceAngle = (segment.count / totalSegmentsCount) * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += sliceAngle;

      const x1 = 50 + 40 * Math.cos((Math.PI * (startAngle - 90)) / 180);
      const y1 = 50 + 40 * Math.sin((Math.PI * (startAngle - 90)) / 180);
      const x2 = 50 + 40 * Math.cos((Math.PI * (cumulativeAngle - 90)) / 180);
      const y2 = 50 + 40 * Math.sin((Math.PI * (cumulativeAngle - 90)) / 180);

      const largeArcFlag = sliceAngle > 180 ? 1 : 0;
      const pathData = sliceAngle >= 360
        ? `M 50 10 A 40 40 0 1 1 49.99 10 Z`
        : `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      return <path key={index} d={pathData} fill={segment.color} stroke="#ffffff" strokeWidth="1" />;
    });
  };

  const categoryCounts = categories.filter(c => c !== 'All').map(cat => ({
    name: cat,
    count: problems.filter(p => p.category === cat).length
  }));

  const districtCounts = districts.filter(d => d !== 'All').map(dist => ({
    name: dist,
    count: problems.filter(p => p.district === dist).length
  }));

  const pipelineStages = [
    { title: 'Intake Stage', label: 'Submitted', count: statusCounts['Submitted'] || 0 },
    { title: 'Review Stage', label: 'Under Review', count: (statusCounts['Under Review'] || 0) + (statusCounts['Approved'] || 0) },
    { title: 'Allocation', label: 'Assigned', count: statusCounts['Assigned'] || 0 },
    { title: 'Execution', label: 'In Progress', count: (statusCounts['Work in Progress'] || 0) + (statusCounts['Solution Proposed'] || 0) },
    { title: 'Final Closure', label: 'Resolved', count: statusCounts['Resolved'] || 0 },
  ];

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!actionModal?.problem) return;

    setSubmitting(true);
    try {
      const problemId = actionModal.problem._id || actionModal.problem.problemId;
      const res = await apiRequest(`/admin/problems/${problemId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: statusForm.status,
          remarks: statusForm.remarks,
        }),
      });

      if (res && res.success) {
        if (showToast) showToast(`Problem status updated to ${statusForm.status}.`, 'success');
        setActionModal(null);
        await fetchData();
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to update status.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 text-xs p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Executive Header */}
        <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold border-b border-slate-200 pb-1 inline-block">
                Executive Portal &bull; Central Oversight & R&D Monitoring
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                State Grievance, University R&D & Impact Analytics Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-6 bg-slate-100 border border-slate-200 px-4 py-2 rounded text-[11px]">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Authorized Officer</span>
                <span className="font-bold text-slate-900">{user?.name || 'Administrator'}</span>
              </div>
              <div className="h-7 w-px bg-slate-300"></div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">System Domain</span>
                <span className="text-slate-700 font-mono font-semibold">{user?.email || 'admin@gov.in'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics & Metrics Grid */}
        <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Statewide Analytics, Status Breakdown & Distributions</h2>
            <span className="text-[10px] font-mono text-slate-500">Total Entries: {problems.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Status Pie Chart Breakdown */}
            <div className="md:col-span-5 flex items-center justify-center sm:justify-start gap-6 p-4 bg-slate-50 border border-slate-200 rounded-md">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {renderPieSegments()}
                </svg>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <span className="font-bold text-slate-700 uppercase text-[9px] block mb-1">Status Distribution</span>
                {pieSegments.map((segment, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-3 h-3 border border-slate-400 rounded-sm" style={{ backgroundColor: segment.color }} />
                    <span className="text-slate-600 font-medium">{segment.label}:</span>
                    <span className="font-bold font-mono text-slate-900">{segment.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Total Submissions</span>
                <span className="text-xl font-bold font-mono text-slate-900">{problems.length}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Action Required</span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  {(statusCounts['Submitted'] || 0) + (statusCounts['Under Review'] || 0) + (statusCounts['Approved'] || 0)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">In Execution</span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  {(statusCounts['Assigned'] || 0) + (statusCounts['Work in Progress'] || 0) + (statusCounts['Solution Proposed'] || 0)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Resolution Rate</span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  {problems.length ? Math.round(((statusCounts['Resolved'] || 0) / problems.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Graphical Distributions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">Category-wise Problem Distribution</span>
              <div className="space-y-1.5 pt-1">
                {categoryCounts.length > 0 ? categoryCounts.map((cat, idx) => {
                  const maxCount = Math.max(...categoryCounts.map(c => c.count), 1);
                  const widthPercent = Math.round((cat.count / maxCount) * 100);
                  return (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium text-slate-800 truncate max-w-[200px]">{cat.name}</span>
                        <span className="font-mono font-bold text-slate-900">{cat.count}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-sm overflow-hidden">
                        <div className="bg-slate-800 h-full rounded-sm" style={{ width: `${widthPercent}%` }}></div>
                      </div>
                    </div>
                  );
                }) : <div className="text-slate-500 text-center py-2">No category metrics available</div>}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">District-wise Problem Distribution</span>
              <div className="space-y-1.5 pt-1">
                {districtCounts.length > 0 ? districtCounts.map((dist, idx) => {
                  const maxCount = Math.max(...districtCounts.map(d => d.count), 1);
                  const widthPercent = Math.round((dist.count / maxCount) * 100);
                  return (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium text-slate-800 truncate max-w-[200px]">{dist.name}</span>
                        <span className="font-mono font-bold text-slate-900">{dist.count}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-sm overflow-hidden">
                        <div className="bg-emerald-700 h-full rounded-sm" style={{ width: `${widthPercent}%` }}></div>
                      </div>
                    </div>
                  );
                }) : <div className="text-slate-500 text-center py-2">No district metrics available</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Progression Pipeline */}
        <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm space-y-3">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Workflow Progression Pipeline</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
            {pipelineStages.map((stage, idx) => (
              <div key={idx} className="relative p-3 bg-slate-50 border border-slate-300 rounded flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">{stage.title}</span>
                  <span className="font-bold text-slate-900 text-xs block">{stage.label}</span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-medium">Volume</span>
                  <span className="font-mono font-bold text-xs bg-white border border-slate-300 px-2 py-0.5 rounded text-slate-900">
                    {stage.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white border border-slate-300 rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">State Records Filter</div>
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-bold text-slate-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-1.5 border border-slate-300 rounded text-xs bg-white text-slate-900 font-semibold outline-none focus:border-black"
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] font-bold text-slate-700">District:</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="p-1.5 border border-slate-300 rounded text-xs bg-white text-slate-900 font-semibold outline-none focus:border-black"
              >
                {districts.map((dist, i) => (
                  <option key={i} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Detailed View Panel */}
        {selectedProblem && (
          <div className="bg-white border border-slate-400 p-5 rounded-md space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="px-3 py-1 border border-slate-300 bg-white hover:bg-slate-100 text-black font-bold rounded text-[11px]"
                >
                  Return to Table
                </button>
                <span className="font-mono font-bold text-slate-900 text-sm">#{selectedProblem.problemId || selectedProblem._id}</span>
                <StatusBadge status={selectedProblem.status} />
              </div>
              <button
                onClick={() => setSelectedProblem(null)}
                className="text-black font-bold hover:bg-slate-100 px-3 py-1 border border-slate-300 rounded text-xs"
              >
                Close View
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selectedProblem.title}</h2>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Category: <span className="font-bold text-slate-800">{selectedProblem.category}</span> | District: <span className="font-bold text-slate-800">{selectedProblem.district}</span>
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider block mb-1">Detailed Issue Description</span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-line">{selectedProblem.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                    <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block border-b border-slate-200 pb-1">University Partnership Details</span>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Assigned Institution:</span>
                      <span className="font-bold text-slate-900">{selectedProblem.assignedUniversityName || selectedProblem.universityName || 'Not yet assigned'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Preliminary Approach Notes:</span>
                      <span className="text-slate-800 text-[11px]">{selectedProblem.proposalDetails || 'Pending faculty review'}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                    <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block border-b border-slate-200 pb-1">Innovation, Outcome & Social Impact</span>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Expected R&D Outcome:</span>
                      <span className="text-slate-800 text-[11px]">{selectedProblem.expectedOutcome || 'Prototype deployment & technical validation'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Social Impact Index:</span>
                      <span className="font-bold text-emerald-700 text-[11px]">{selectedProblem.socialImpactScore || 'High Priority Civic Intervention'}</span>
                    </div>
                  </div>
                </div>

                {selectedProblem.timeline && selectedProblem.timeline.length > 0 && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                    <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider block border-b border-slate-200 pb-1">Escalation Audit Log</span>
                    <div className="space-y-2 pt-1">
                      {selectedProblem.timeline.map((item, idx) => (
                        <div key={idx} className="border-l-2 border-slate-400 pl-3 text-[11px] space-y-0.5">
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{item.status}</span>
                            <span className="text-slate-500 font-normal font-mono text-[10px]">
                              {item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : ''}
                            </span>
                          </div>
                          <p className="text-slate-600">{item.message}</p>
                          <div className="text-slate-500 text-[10px] font-mono">Updated By: {item.updatedBy || 'System'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-3 flex flex-col justify-between">
                <div className="space-y-2 text-[11px]">
                  <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider block border-b border-slate-200 pb-1">Complainant & District Metadata</span>
                  
                  {/* Attached Image Preview (Handles both imageUrl and image keys) */}
                  {(selectedProblem.imageUrl || selectedProblem.image) && (
                    <div className="space-y-1 pt-1">
                      <span className="text-slate-500 block">Attached Evidence / Photo:</span>
                      <div className="border border-slate-300 rounded overflow-hidden bg-white p-1">
                        <img 
                          src={selectedProblem.imageUrl || selectedProblem.image} 
                          alt="Issue Evidence" 
                          className="w-full h-36 object-cover rounded hover:opacity-95 transition cursor-pointer"
                          onClick={() => window.open(selectedProblem.imageUrl || selectedProblem.image, '_blank')}
                        />
                        <span className="text-[9px] text-slate-400 block text-center mt-1">Click image to open full size</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-500 block">Complainant Name:</span>
                    <span className="font-bold text-slate-800">{selectedProblem.citizenName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Contact Info:</span>
                    <span className="text-slate-800 font-mono">{selectedProblem.citizenMobile || 'N/A'} {selectedProblem.citizenEmail ? `| ${selectedProblem.citizenEmail}` : ''}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Location Hierarchy:</span>
                    <span className="font-bold text-slate-800 block">
                      {selectedProblem.village ? `${selectedProblem.village}, ` : ''}
                      {selectedProblem.block ? `${selectedProblem.block}, ` : ''}
                      {selectedProblem.district}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Full Site Address:</span>
                    <span className="text-slate-800">{selectedProblem.location || 'N/A'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider block">Administrative Action</span>
                  <button
                    onClick={() => {
                      setStatusForm({ status: selectedProblem.status, remarks: '' });
                      setActionModal({ type: 'status', problem: selectedProblem });
                    }}
                    className="w-full text-center px-4 py-2 bg-black hover:bg-slate-800 text-white font-bold rounded text-[11px]"
                  >
                    Update Status & Action
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-300 bg-white px-3 py-2 rounded-md shadow-sm">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 font-bold text-xs rounded transition ${
              activeTab === 'all' ? 'bg-black text-white' : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            All Issues ({filteredProblems.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 font-bold text-xs rounded transition ${
              activeTab === 'pending' ? 'bg-black text-white' : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            Pending Review ({problems.filter((p) => p.status === 'Submitted' || p.status === 'Under Review' || p.status === 'Approved').length})
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-3 py-1.5 font-bold text-xs rounded transition ${
              activeTab === 'assigned' ? 'bg-black text-white' : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            In Execution ({problems.filter((p) => p.status === 'Assigned' || p.status === 'Work in Progress' || p.status === 'Solution Proposed').length})
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-3 py-1.5 font-bold text-xs rounded transition ${
              activeTab === 'resolved' ? 'bg-black text-white' : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            Resolved / Closed ({problems.filter((p) => p.status === 'Resolved' || p.status === 'Rejected').length})
          </button>
        </div>

        {/* Issues Table */}
        {loading ? (
          <div className="py-12 text-center bg-white border border-slate-300 rounded-md text-slate-500 font-medium shadow-sm">
            Fetching central database records...
          </div>
        ) : (
          <div className="bg-white border border-slate-300 rounded-md overflow-hidden shadow-sm">
            <div className="p-3 border-b border-slate-200 bg-slate-50 font-bold text-slate-900 text-xs uppercase tracking-wider">
              State Civic & Technical Task Master Roster
            </div>
            {filteredProblems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                    <tr>
                      <th className="py-2.5 px-3 border-r border-slate-200">ID</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Issue & Description</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Category</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">District</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Assigned University</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {filteredProblems.map((p) => (
                      <tr key={p._id || p.problemId} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {p.problemId || p._id}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-200 max-w-sm">
                          <div className="font-bold text-slate-900">{p.title}</div>
                          <div className="text-slate-500 truncate text-[11px] mt-0.5">{p.description}</div>
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">{p.category}</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap font-bold text-slate-900">
                          {p.district}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-slate-700 font-medium">
                          {p.assignedUniversityName || p.universityName || 'Unassigned'}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedProblem(p)}
                            className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-black font-bold rounded"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                No matching records found for the applied filters.
              </div>
            )}
          </div>
        )}

        {/* Action Modal */}
        {actionModal && actionModal.type === 'status' && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-slate-400 rounded-md p-5 max-w-md w-full space-y-4 shadow-xl">
              <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm">Update Workflow Status</h3>
                <button
                  onClick={() => setActionModal(null)}
                  className="text-black hover:bg-slate-100 px-2.5 py-1 border border-slate-300 rounded font-bold text-xs"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Status</label>
                  <select
                    value={statusForm.status}
                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:border-black font-medium"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Work in Progress">Work in Progress</option>
                    <option value="Solution Proposed">Solution Proposed</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Remarks</label>
                  <textarea
                    rows={3}
                    required
                    value={statusForm.remarks}
                    onChange={(e) => setStatusForm({ ...statusForm, remarks: e.target.value })}
                    placeholder="Provide administrative justification..."
                    className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:border-black"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActionModal(null)}
                    className="px-4 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 text-black font-bold rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-1.5 bg-black hover:bg-slate-800 text-white font-bold rounded disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};