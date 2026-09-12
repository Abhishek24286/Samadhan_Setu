import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Users, 
  Search, 
  Filter, 
  Check, 
  X, 
  ArrowRight, 
  Loader2, 
  Server, 
  Database, 
  Lock, 
  Code, 
  Send,
  Eye,
  AlertTriangle,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { ProblemTimeline } from '../components/ProblemTimeline';

export const AdminDashboard = () => {
  const { user, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'problems' | 'universities' | 'solutions'
  const [loading, setLoading] = useState(true);

  const [problems, setProblems] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });
  const [universities, setUniversities] = useState([]);
  const [solutions, setSolutions] = useState([]);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Selected Problem Modal for Full View
  const [viewProblem, setViewProblem] = useState(null);

  // Reject Dialog Modal State
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('Insufficient problem details');
  const [rejectCustom, setRejectCustom] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  // Assign Dialog Modal State
  const [assignTarget, setAssignTarget] = useState(null);
  const [assignType, setAssignType] = useState('University'); // 'University' | 'Department'
  const [selectedUniId, setSelectedUniId] = useState('');
  const [departmentName, setDepartmentName] = useState('District Drinking Water & Sanitation Division');
  const [assignRemarks, setAssignRemarks] = useState('');

  // Status Update Dialog State
  const [statusTarget, setStatusTarget] = useState(null);
  const [newStatus, setNewStatus] = useState('Work in Progress');
  const [statusRemarks, setStatusRemarks] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [probRes, uniRes, solRes] = await Promise.all([
        apiRequest('/admin/problems'),
        apiRequest('/admin/universities'),
        apiRequest('/admin/solutions'),
      ]);

      if (probRes.success) {
        setProblems(probRes.problems || []);
        if (probRes.counts) setCounts(probRes.counts);
      }
      if (uniRes.success) {
        setUniversities(uniRes.universities || []);
        if (uniRes.universities.length > 0 && !selectedUniId) {
          setSelectedUniId(uniRes.universities[0]._id);
        }
      }
      if (solRes.success) {
        setSolutions(solRes.solutions || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err.message);
      showToast(err.message || 'Error fetching admin records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesDistrict = filterDistrict === 'All' || p.district === filterDistrict;
      const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
      const matchesStatus = filterStatus === 'All' || p.status === filterStatus;

      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.problemId.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.citizenName.toLowerCase().includes(q);

      return matchesDistrict && matchesCategory && matchesStatus && matchesSearch;
    });
  }, [problems, filterDistrict, filterCategory, filterStatus, searchTerm]);

  // ACTION: Approve Problem
  const handleApprove = async (id) => {
    setSubmittingAction(true);
    try {
      const res = await apiRequest(`/admin/problems/${id}/approve`, {
        method: 'PATCH',
        body: JSON.stringify({ remarks: 'Verified by District Administration. Approved for resolution.' }),
      });
      if (res.success) {
        showToast(res.message, 'success');
        fetchAdminData();
        if (viewProblem?._id === id) setViewProblem(res.problem);
      }
    } catch (err) {
      showToast(err.message || 'Failed to approve problem.', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  // ACTION: Reject Problem
  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectTarget) return;

    const finalReason = rejectReason === 'Other' ? rejectCustom : rejectReason;
    setSubmittingAction(true);

    try {
      const res = await apiRequest(`/admin/problems/${rejectTarget._id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: finalReason }),
      });
      if (res.success) {
        showToast(res.message, 'info');
        setRejectTarget(null);
        fetchAdminData();
        if (viewProblem?._id === rejectTarget._id) setViewProblem(res.problem);
      }
    } catch (err) {
      showToast(err.message || 'Failed to reject problem.', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  // ACTION: Assign Problem
  const handleConfirmAssign = async (e) => {
    e.preventDefault();
    if (!assignTarget) return;

    setSubmittingAction(true);
    try {
      const res = await apiRequest(`/admin/problems/${assignTarget._id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({
          assignType,
          departmentName,
          universityId: selectedUniId,
          remarks: assignRemarks,
        }),
      });

      if (res.success) {
        showToast(res.message, 'success');
        setAssignTarget(null);
        fetchAdminData();
        if (viewProblem?._id === assignTarget._id) setViewProblem(res.problem);
      }
    } catch (err) {
      showToast(err.message || 'Failed to assign problem.', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  // ACTION: Update Problem Status (Work in Progress / Resolved)
  const handleConfirmStatus = async (e) => {
    e.preventDefault();
    if (!statusTarget) return;

    setSubmittingAction(true);
    try {
      const res = await apiRequest(`/admin/problems/${statusTarget._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus,
          remarks: statusRemarks,
        }),
      });

      if (res.success) {
        showToast(res.message, 'success');
        setStatusTarget(null);
        fetchAdminData();
        if (viewProblem?._id === statusTarget._id) setViewProblem(res.problem);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status.', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gov-bg -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-amber-400">
                Government of Jharkhand
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Public Grievance Administration Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-gov-green" />
              Administrative Verification & Oversight
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Authenticated Session: <strong>{user?.name}</strong> • {user?.institutionName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
            >
              Refresh Records
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gov-green hover:bg-gov-darkgreen transition inline-flex items-center gap-1.5"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 15. SYSTEM STACK SECTION */}
        <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Platform System Architecture & Operational Stack
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Active Environment
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Frontend</span>
              <strong className="text-white">React.js</strong>
              <div className="text-[10px] text-emerald-400 mt-0.5">Vite + Tailwind CSS</div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Backend</span>
              <strong className="text-white">Node.js</strong>
              <div className="text-[10px] text-emerald-400 mt-0.5">Express.js REST Server</div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Database</span>
              <strong className="text-white">MongoDB</strong>
              <div className="text-[10px] text-emerald-400 mt-0.5">Mongoose ODM (Port 27017)</div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Security</span>
              <strong className="text-white">JWT + bcrypt</strong>
              <div className="text-[10px] text-emerald-400 mt-0.5">Role-Based Access Control</div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">API Protocol</span>
              <strong className="text-white">REST API</strong>
              <div className="text-[10px] text-emerald-400 mt-0.5">JSON Payloads & Endpoints</div>
            </div>
          </div>
        </div>

        {/* OVERVIEW TOP KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div
            onClick={() => {
              setFilterStatus('All');
              setActiveTab('problems');
            }}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-400 transition cursor-pointer"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Problems
            </span>
            <div className="text-2xl font-black text-slate-900">{counts.total}</div>
            <span className="text-[10px] text-slate-500">In MongoDB</span>
          </div>

          <div
            onClick={() => {
              setFilterStatus('Under Review');
              setActiveTab('problems');
            }}
            className="p-4 bg-white rounded-xl border border-amber-300 bg-amber-50/40 shadow-2xs hover:border-amber-500 transition cursor-pointer"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
              Pending Verification
            </span>
            <div className="text-2xl font-black text-amber-800">{counts.pending}</div>
            <span className="text-[10px] text-amber-700">Requires Scrutiny</span>
          </div>

          <div
            onClick={() => {
              setFilterStatus('Approved');
              setActiveTab('problems');
            }}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 transition cursor-pointer"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
              Approved
            </span>
            <div className="text-2xl font-black text-blue-800">{counts.approved}</div>
            <span className="text-[10px] text-slate-500">Ready to Assign</span>
          </div>

          <div
            onClick={() => {
              setFilterStatus('Assigned');
              setActiveTab('problems');
            }}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-purple-400 transition cursor-pointer"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-1">
              Assigned
            </span>
            <div className="text-2xl font-black text-purple-800">{counts.assigned}</div>
            <span className="text-[10px] text-slate-500">To Univ / Dept</span>
          </div>

          <div
            onClick={() => {
              setFilterStatus('Work in Progress');
              setActiveTab('problems');
            }}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-orange-400 transition cursor-pointer"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block mb-1">
              Under Work
            </span>
            <div className="text-2xl font-black text-orange-800">{counts.inProgress}</div>
            <span className="text-[10px] text-slate-500">Active R&D / Civil</span>
          </div>

          <div
            onClick={() => {
              setFilterStatus('Resolved');
              setActiveTab('problems');
            }}
            className="p-4 bg-white rounded-xl border border-emerald-300 bg-emerald-50/40 shadow-2xs hover:border-emerald-500 transition cursor-pointer"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-gov-green block mb-1">
              Resolved
            </span>
            <div className="text-2xl font-black text-gov-green">{counts.resolved}</div>
            <span className="text-[10px] text-gov-green">Fully Verified</span>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 rounded-xl shadow-2xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-gov-green text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Overview & Action Queue
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'problems'
                ? 'bg-gov-green text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Problem Repository ({filteredProblems.length})
          </button>
          <button
            onClick={() => setActiveTab('universities')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'universities'
                ? 'bg-gov-green text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            University Management ({universities.length})
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'solutions'
                ? 'bg-gov-green text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Academic Solutions Submitted ({solutions.length})
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gov-green mb-2" />
            <p className="text-xs text-slate-500 font-medium">Synchronizing with MongoDB collections...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW & ACTION QUEUE */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Pending Verification Notice */}
                {counts.pending > 0 && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-700" />
                      <div>
                        <h4 className="text-sm font-bold text-amber-950">
                          {counts.pending} Citizen Grievances Pending Review
                        </h4>
                        <p className="text-xs text-amber-800">
                          Inspect and assign to district nodal bodies or engineering universities.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFilterStatus('Under Review');
                        setActiveTab('problems');
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                    >
                      Review Queue
                    </button>
                  </div>
                )}

                {/* Recent Unapproved Problems Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Immediate Action Queue (Pending Scrutiny)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Problems submitted by citizens needing administrative approval or assignment
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      Showing up to 5 items
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Ref ID</th>
                          <th className="py-3 px-4">Title & District</th>
                          <th className="py-3 px-4">Citizen</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {problems
                          .filter((p) => p.status === 'Submitted' || p.status === 'Under Review')
                          .slice(0, 5)
                          .map((p) => (
                            <tr key={p._id} className="hover:bg-slate-50 transition">
                              <td className="py-3.5 px-4 font-mono font-bold text-gov-green">
                                {p.problemId}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-slate-900 line-clamp-1">{p.title}</div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {p.district}, Jharkhand
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-slate-600 font-medium">
                                {p.citizenName}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                                  {p.category}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <StatusBadge status={p.status} />
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => setViewProblem(p)}
                                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleApprove(p._id)}
                                    className="px-2.5 py-1 rounded bg-gov-green hover:bg-gov-darkgreen text-white font-bold inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Check className="w-3 h-3" /> Approve
                                  </button>
                                  <button
                                    onClick={() => setRejectTarget(p)}
                                    className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <X className="w-3 h-3" /> Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FULL PROBLEMS REPOSITORY */}
            {activeTab === 'problems' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
                {/* Filters Row */}
                <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search title, Ref ID, citizen..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white outline-none focus:border-gov-green"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="p-2 rounded-lg border border-slate-300 bg-white outline-none"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Solution Proposed">Solution Proposed</option>
                        <option value="Work in Progress">Work in Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <select
                        value={filterDistrict}
                        onChange={(e) => setFilterDistrict(e.target.value)}
                        className="p-2 rounded-lg border border-slate-300 bg-white outline-none"
                      >
                        <option value="All">All Districts</option>
                        <option value="Palamu">Palamu</option>
                        <option value="Ranchi">Ranchi</option>
                        <option value="Dhanbad">Dhanbad</option>
                        <option value="East Singhbhum">East Singhbhum</option>
                        <option value="Bokaro">Bokaro</option>
                        <option value="Hazaribagh">Hazaribagh</option>
                      </select>
                    </div>

                    <div>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="p-2 rounded-lg border border-slate-300 bg-white outline-none"
                      >
                        <option value="All">All Categories</option>
                        <option value="Drinking Water">Drinking Water</option>
                        <option value="Roads & Transport">Roads & Transport</option>
                        <option value="Electricity & Power">Electricity & Power</option>
                        <option value="Sanitation & Waste">Sanitation & Waste</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Agriculture & Irrigation">Agriculture & Irrigation</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Problems Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Ref ID</th>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">District</th>
                        <th className="py-3 px-4">Citizen</th>
                        <th className="py-3 px-4">Assigned To</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Management</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProblems.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-gov-green">
                            {p.problemId}
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-bold text-slate-900 line-clamp-1">{p.title}</div>
                            <div className="text-[10px] text-slate-400">{p.category}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {p.district}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {p.citizenName}
                          </td>
                          <td className="py-3.5 px-4">
                            {p.assignedUniversityName ? (
                              <span className="text-[11px] font-semibold text-indigo-700">
                                {p.assignedUniversityName.split(',')[0]}
                              </span>
                            ) : p.assignedDepartment ? (
                              <span className="text-[11px] font-semibold text-purple-700">
                                {p.assignedDepartment}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={p.status} />
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => setViewProblem(p)}
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                                title="View Complete Specs"
                              >
                                View
                              </button>

                              {p.status === 'Submitted' || p.status === 'Under Review' ? (
                                <>
                                  <button
                                    onClick={() => handleApprove(p._id)}
                                    className="px-2 py-1 rounded bg-gov-green hover:bg-gov-darkgreen text-white font-bold"
                                    title="Approve Problem"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => setRejectTarget(p)}
                                    className="px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold"
                                    title="Reject Problem"
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : null}

                              {p.status === 'Approved' ? (
                                <button
                                  onClick={() => {
                                    setAssignTarget(p);
                                    setAssignRemarks('');
                                  }}
                                  className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-bold"
                                  title="Assign to University or Department"
                                >
                                  Assign
                                </button>
                              ) : null}

                              {p.status === 'Assigned' || p.status === 'Solution Proposed' || p.status === 'Work in Progress' ? (
                                <button
                                  onClick={() => {
                                    setStatusTarget(p);
                                    setNewStatus(p.status === 'Assigned' ? 'Work in Progress' : 'Resolved');
                                    setStatusRemarks('');
                                  }}
                                  className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold"
                                  title="Update Status"
                                >
                                  Update
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: UNIVERSITIES MANAGEMENT */}
            {activeTab === 'universities' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Technical Academic Institutions Management
                    </h3>
                    <p className="text-xs text-slate-500">
                      Accredited universities and engineering colleges registered for problem solving
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {universities.map((u) => (
                    <div
                      key={u._id}
                      className="p-4 rounded-xl border border-slate-200 bg-gov-bg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h4 className="font-bold text-slate-900 text-sm">{u.name}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {u.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">{u.institutionName}</p>
                        <div className="text-xs text-slate-500 space-y-0.5 mb-3">
                          <div>Official Email: <strong>{u.email}</strong></div>
                          <div>Nodal Mobile: <strong>{u.mobile}</strong></div>
                          <div>District: <strong>{u.district}</strong></div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-600">
                          Active Problems: <strong>{u.activeAssignedCount || 0}</strong>
                        </span>
                        <span className="text-gov-green">
                          Resolved: <strong>{u.resolvedCount || 0}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SUBMITTED SOLUTIONS */}
            {activeTab === 'solutions' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    Academic Solution Proposals Archive
                  </h3>
                  <p className="text-xs text-slate-500">
                    Blueprints and resource estimates proposed by participating university research teams
                  </p>
                </div>

                {solutions.length > 0 ? (
                  <div className="space-y-4">
                    {solutions.map((sol) => (
                      <div
                        key={sol._id}
                        className="p-4 rounded-xl border border-slate-200 bg-gov-bg space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-gov-green">
                              {sol.problemId}
                            </span>
                            <span className="font-semibold text-slate-800">
                              {sol.institutionName}
                            </span>
                          </div>
                          <span className="text-slate-400">
                            {new Date(sol.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900">
                          {sol.title}
                        </h4>
                        <p className="text-slate-600 leading-relaxed">
                          {sol.description}
                        </p>

                        <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700">
                          <strong>Technical Methodology:</strong> {sol.technicalDetails}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span>Lead: <strong>{sol.submittedBy}</strong></span>
                          <span>Budget: <strong>{sol.estimatedResources || 'N/A'}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-slate-500">
                    No solutions submitted by universities yet.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* VIEW PROBLEM DETAIL MODAL */}
        {viewProblem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
              <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                      {viewProblem.problemId}
                    </span>
                    <StatusBadge status={viewProblem.status} />
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {viewProblem.title}
                  </h3>
                  <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gov-saffron" />
                    <span>{viewProblem.location}, {viewProblem.district}, Jharkhand</span>
                  </div>
                </div>

                <button
                  onClick={() => setViewProblem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto text-xs text-slate-700">
                <div>
                  <h5 className="font-bold uppercase text-slate-400 mb-1">Problem Description</h5>
                  <p className="bg-gov-bg p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                    {viewProblem.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <strong>Citizen:</strong> {viewProblem.citizenName} ({viewProblem.citizenMobile})
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <strong>Category:</strong> {viewProblem.category}
                  </div>
                </div>

                {viewProblem.assignedUniversityName && (
                  <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-medium">
                    Assigned Academic Partner: <strong>{viewProblem.assignedUniversityName}</strong>
                  </div>
                )}
                {viewProblem.assignedDepartment && (
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 font-medium">
                    Assigned Municipal Department: <strong>{viewProblem.assignedDepartment}</strong>
                  </div>
                )}

                {/* Timeline */}
                <ProblemTimeline currentStatus={viewProblem.status} timeline={viewProblem.timeline} />
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Government Portal Scrutiny</span>
                <button
                  onClick={() => setViewProblem(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REJECT DIALOG MODAL */}
        {rejectTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reject Community Problem</h3>
                  <p className="text-xs text-slate-500">{rejectTarget.problemId}</p>
                </div>
              </div>

              <form onSubmit={handleConfirmReject} className="space-y-3 text-xs">
                <label className="block font-bold text-slate-700">Documented Rejection Justification:</label>
                <div className="space-y-1.5">
                  {[
                    'Insufficient problem details',
                    'Commercial private enterprise request not eligible for public platform',
                    'Problem is outside technological and public service remit',
                    'Duplicate grievance already registered for this ward/panchayat',
                  ].map((r) => (
                    <label key={r} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name="rejReason"
                        value={r}
                        checked={rejectReason === r}
                        onChange={() => setRejectReason(r)}
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="rejReason"
                      value="Other"
                      checked={rejectReason === 'Other'}
                      onChange={() => setRejectReason('Other')}
                    />
                    <span>Custom Reason...</span>
                  </label>
                </div>

                {rejectReason === 'Other' && (
                  <textarea
                    required
                    rows={3}
                    value={rejectCustom}
                    onChange={(e) => setRejectCustom(e.target.value)}
                    placeholder="Enter detailed reason..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 outline-none text-xs"
                  />
                )}

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectTarget(null)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingAction}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ASSIGN PROBLEM DIALOG MODAL */}
        {assignTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <Building2 className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Assign Problem</h3>
                  <p className="text-xs text-slate-500">{assignTarget.problemId} - {assignTarget.title}</p>
                </div>
              </div>

              <form onSubmit={handleConfirmAssign} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign Target Category:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`p-2.5 rounded-lg border text-center font-bold cursor-pointer ${assignType === 'University' ? 'border-purple-600 bg-purple-50 text-purple-900' : 'border-slate-200 text-slate-600'}`}>
                      <input
                        type="radio"
                        name="assignType"
                        value="University"
                        checked={assignType === 'University'}
                        onChange={() => setAssignType('University')}
                        className="sr-only"
                      />
                      Technical University
                    </label>
                    <label className={`p-2.5 rounded-lg border text-center font-bold cursor-pointer ${assignType === 'Department' ? 'border-purple-600 bg-purple-50 text-purple-900' : 'border-slate-200 text-slate-600'}`}>
                      <input
                        type="radio"
                        name="assignType"
                        value="Department"
                        checked={assignType === 'Department'}
                        onChange={() => setAssignType('Department')}
                        className="sr-only"
                      />
                      Government Dept.
                    </label>
                  </div>
                </div>

                {assignType === 'University' ? (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Technical Institution:</label>
                    <select
                      value={selectedUniId}
                      onChange={(e) => setSelectedUniId(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 outline-none bg-white text-xs"
                    >
                      {universities.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.district})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department Name:</label>
                    <input
                      type="text"
                      required
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                      placeholder="e.g. Drinking Water and Sanitation Department"
                      className="w-full p-2.5 rounded-lg border border-slate-300 outline-none text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Instructions / Remit Remarks:</label>
                  <textarea
                    rows={2}
                    value={assignRemarks}
                    onChange={(e) => setAssignRemarks(e.target.value)}
                    placeholder="Specific directives or timeframe for feasibility blueprint..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 outline-none text-xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAssignTarget(null)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingAction}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Confirm Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* UPDATE STATUS DIALOG MODAL */}
        {statusTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Update Problem Status</h3>
                <p className="text-xs text-slate-500">{statusTarget.problemId}</p>
              </div>

              <form onSubmit={handleConfirmStatus} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Status:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white outline-none"
                  >
                    <option value="Work in Progress">Work in Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Administrative Remarks / Field Notes:</label>
                  <textarea
                    required
                    rows={3}
                    value={statusRemarks}
                    onChange={(e) => setStatusRemarks(e.target.value)}
                    placeholder="Detail the work carried out, physical verification, or citizen sign-off..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setStatusTarget(null)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingAction}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-gov-green hover:bg-gov-darkgreen"
                  >
                    Update Status
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
