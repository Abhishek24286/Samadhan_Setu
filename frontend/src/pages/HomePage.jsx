import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Clock, 
  Wrench,
  HelpCircle
} from 'lucide-react';
import { apiRequest } from '../utils/api';
import { ProblemSlider } from '../components/ProblemSlider';

export const HomePage = () => {
  const [stats, setStats] = useState({
    problemsReported: 7,
    problemsResolved: 1,
    districtsCovered: 24,
    universitiesParticipating: 5,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiRequest('/problems/stats');
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load live stats:', err.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. SIMPLE HERO SECTION */}
      <section className="bg-gradient-to-b from-emerald-50/60 via-white to-gov-bg border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Government Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-gov-green text-xs font-bold mb-5 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-gov-green"></span>
            Government of Jharkhand • Citizen Redressal & Academic Collaboration
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Connecting Citizens with Solutions
          </h1>

          {/* Short supporting text */}
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Report local problems and help connect communities with government departments and technical institutions for practical solutions.
          </p>

          {/* Two Main Large Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-white bg-gov-green hover:bg-gov-darkgreen active:scale-95 shadow-md shadow-emerald-900/10 transition cursor-pointer"
            >
              <FileText className="w-5 h-5" />
              <span>Report a Problem</span>
            </Link>

            <Link
              to="/track"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-300 active:scale-95 shadow-xs transition cursor-pointer"
            >
              <Search className="w-5 h-5 text-gov-green" />
              <span>Track a Problem</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. REAL WORK SLIDER (COMMUNITY PROBLEMS & SOLUTIONS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProblemSlider />
      </section>

      {/* 3. SIMPLE REALISTIC STATISTICS (FROM BACKEND) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-md mx-auto mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Transparency & Progress
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              Public Service Metrics Across Jharkhand
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                {stats.problemsReported}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                Problems Reported
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">By local citizens</div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">
                {stats.problemsResolved}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                Problems Resolved
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">With citizen sign-off</div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-sky-400">
                {stats.districtsCovered}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                Districts Covered
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Across all Jharkhand</div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-purple-400">
                {stats.universitiesParticipating}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                Universities Participating
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Premier technical hubs</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIMPLE 4-STEP WORKFLOW SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-gov-green bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Transparent Governance
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              How the Platform Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              A transparent public service bridge ensuring community grievances reach technical and administrative resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gov-bg border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-gov-green text-white font-bold flex items-center justify-center text-xs mb-3">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Citizen Reports</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                A citizen submits a local community problem (water, electricity, roads, drainage) and receives an official tracking reference ID.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gov-bg border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-gov-green text-white font-bold flex items-center justify-center text-xs mb-3">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Government Verification</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The district administrator reviews the problem, verifies civic authenticity, and approves it for allocation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gov-bg border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-gov-green text-white font-bold flex items-center justify-center text-xs mb-3">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Institution Assigned</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The problem is assigned to a relevant government department or partnering university (e.g. BIT Mesra, NIT Jamshedpur) for solutions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gov-bg border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-gov-green text-white font-bold flex items-center justify-center text-xs mb-3">
                4
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Practical Resolution</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Technical solutions are proposed, verified, executed in the field, and marked as resolved with visible public timeline updates.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-green hover:text-gov-darkgreen transition"
            >
              <span>Read Full Platform Governance Workflow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
