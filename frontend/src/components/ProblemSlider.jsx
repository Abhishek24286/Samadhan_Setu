import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Tag, ArrowRight, Loader2, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { StatusBadge } from './StatusBadge';

export const ProblemSlider = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const res = await apiRequest('/problems/slider');
        if (res.success && res.problems && res.problems.length > 0) {
          setProblems(res.problems);
        }
      } catch (err) {
        console.error('Could not fetch slider problems from backend:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSliderData();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, problems.length - 2) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= problems.length - 2 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-gov-green mb-2" />
        <p className="text-xs text-slate-500">Loading active community works from database...</p>
      </div>
    );
  }

  if (!problems || problems.length === 0) {
    return null;
  }

  // Show 2 items per view on desktop, 1 on mobile
  const visibleProblems = problems.slice(currentIndex, currentIndex + 2);
  // Wrap around if at the end and only 1 is remaining
  if (visibleProblems.length === 1 && problems.length > 1) {
    visibleProblems.push(problems[0]);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
      {/* Slider Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gov-green animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-gov-green">
              Live Database Feed
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Work in Progress & Community Solutions
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real community issues currently being examined, engineered, or resolved across Jharkhand
          </p>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
            aria-label="Previous issues"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-slate-500 px-1">
            {currentIndex + 1} - {Math.min(currentIndex + 2, problems.length)} of {problems.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
            aria-label="Next issues"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleProblems.map((item, idx) => (
          <div
            key={`${item._id || item.problemId}-${idx}`}
            className="p-5 rounded-xl border border-slate-200/90 bg-gov-bg hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header meta */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-xs font-mono font-bold text-gov-green bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {item.problemId}
                </span>
                <StatusBadge status={item.status} />
              </div>

              {/* Title */}
              <h4 className="text-base font-bold text-slate-900 mb-2 line-clamp-2">
                {item.title}
              </h4>

              {/* Location & Category */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-3">
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-gov-saffron" />
                  {item.district}, Jharkhand
                </span>
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <Tag className="w-3.5 h-3.5" />
                  {item.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                {item.description}
              </p>

              {/* Assignment Notice if any */}
              {item.assignedUniversityName && (
                <div className="p-2 rounded bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 mb-3 font-medium">
                  Assigned University: <span className="font-bold">{item.assignedUniversityName}</span>
                </div>
              )}
              {item.assignedDepartment && (
                <div className="p-2 rounded bg-purple-50/70 border border-purple-100 text-[11px] text-purple-900 mb-3 font-medium">
                  Department: <span className="font-bold">{item.assignedDepartment}</span>
                </div>
              )}
            </div>

            {/* Card Footer with Track link */}
            <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Updated: {new Date(item.updatedAt || item.createdAt).toLocaleDateString('en-IN')}
              </span>
              <Link
                to={`/track?id=${item.problemId}`}
                className="inline-flex items-center gap-1 text-gov-green hover:text-gov-darkgreen font-bold group"
              >
                <span>Track Progress</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
