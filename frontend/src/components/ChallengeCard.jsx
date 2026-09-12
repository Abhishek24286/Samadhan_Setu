import React from 'react';
import { 
  MapPin, 
  Building, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Tag, 
  Cpu, 
  Briefcase 
} from 'lucide-react';
import { useChallenges } from '../context/ChallengeContext';

export const ChallengeCard = ({ challenge }) => {
  const { setSelectedChallenge } = useChallenges();

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Environment':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Water & Sanitation':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Healthcare':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Women Safety':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Agriculture':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Education':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Infrastructure':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Renewable Energy':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  const isApproved = challenge.status === 'approved';
  const isPending = challenge.status === 'pending';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div className="p-6">
        {/* Card Top: Category and Status badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
              challenge.category
            )}`}
          >
            <Tag className="w-3 h-3" />
            {challenge.category}
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isApproved
                ? 'bg-emerald-100 text-emerald-800'
                : isPending
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {isApproved ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Open for Academia
              </>
            ) : isPending ? (
              <>
                <Clock className="w-3 h-3 text-amber-600" />
                Under Admin Review
              </>
            ) : (
              'Archived'
            )}
          </span>
        </div>

        {/* Challenge Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2.5">
          {challenge.title}
        </h3>

        {/* Location and Organization Meta */}
        <div className="space-y-1.5 mb-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{challenge.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium text-slate-600">{challenge.organization}</span>
          </div>
        </div>

        {/* Short Problem Description */}
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {challenge.description}
        </p>

        {/* Required Skills Badges */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Required Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {challenge.requiredSkills.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: View Details CTA */}
      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          ID: {challenge.id}
        </span>
        <button
          onClick={() => setSelectedChallenge(challenge)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 group/btn transition cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
