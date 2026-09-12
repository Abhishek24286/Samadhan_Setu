import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Mail, 
  Phone, 
  GraduationCap, 
  ExternalLink, 
  ArrowRight,
  Loader2,
  FileCode2,
  Layers
} from 'lucide-react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const UniversitiesPage = () => {
  const { user, isUniversity } = useAuth();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await apiRequest('/university/directory');
        if (res.success && res.universities) {
          setUniversities(res.universities);
        }
      } catch (err) {
        console.error('Failed to load university directory:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <GraduationCap className="w-4 h-4" /> Academic-Government Synergy
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Partnering Technical Institutions
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Premier universities, IITs, NITs, and engineering colleges across Jharkhand actively collaborating with the government to solve verified grassroots community issues.
          </p>
        </div>

        {/* Action card for Universities */}
        <div className="w-full md:w-auto bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 text-center shrink-0">
          <h4 className="text-sm font-bold text-white mb-1">
            Are you a University Nodal Department?
          </h4>
          <p className="text-[11px] text-slate-300 mb-4 max-w-xs mx-auto">
            Access assigned community issues and submit technical solution blueprints.
          </p>
          {isUniversity ? (
            <Link
              to="/university/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-sm transition"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Go to University Dashboard</span>
            </Link>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-gov-green hover:bg-gov-darkgreen transition"
              >
                University Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/30 transition"
              >
                Register Institute
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Institutional Directory List */}
      <div>
        <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Accredited University Directory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Institutions onboarded with verified research labs and district assignments
            </p>
          </div>
          <span className="text-xs font-bold text-gov-green bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {universities.length} Institutions Enrolled
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-gov-green mb-2" />
            <p className="text-xs text-slate-500">Loading participating institutions from database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((uni) => (
              <div
                key={uni.id || uni._id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-gov-green border border-emerald-200">
                      Accredited Partner
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-gov-saffron" />
                      {uni.district}, Jharkhand
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {uni.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    {uni.institutionName}
                  </p>

                  {/* Impact Stats */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-gov-bg border border-slate-100 text-center mb-4">
                    <div>
                      <div className="text-base font-black text-slate-900">
                        {uni.assignedCount}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">
                        Assigned Issues
                      </div>
                    </div>
                    <div>
                      <div className="text-base font-black text-gov-green">
                        {uni.resolvedCount}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">
                        Solutions Resolved
                      </div>
                    </div>
                  </div>

                  {/* Sample problem preview */}
                  {uni.recentProblems && uni.recentProblems.length > 0 && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-3">
                      <span className="font-bold text-slate-700 block mb-1">
                        Active Technical Engagement:
                      </span>
                      <p className="text-slate-600 italic line-clamp-1">
                        "{uni.recentProblems[0].title}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate max-w-[170px]">{uni.email}</span>
                  <a
                    href={`mailto:${uni.email}`}
                    className="text-gov-green hover:text-gov-darkgreen font-bold flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
