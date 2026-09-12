import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Building, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Tag, 
  Sparkles,
  Share2,
  BookmarkCheck
} from 'lucide-react';
import { useChallenges } from '../context/ChallengeContext';

export const ChallengeDetailModal = () => {
  const { 
    selectedChallenge, 
    setSelectedChallenge, 
    approveChallenge, 
    setRejectModalTarget,
    showToast 
  } = useChallenges();

  const [interestSubmitted, setInterestSubmitted] = useState(false);

  if (!selectedChallenge) return null;

  const isPending = selectedChallenge.status === 'pending';
  const isApproved = selectedChallenge.status === 'approved';
  const isRejected = selectedChallenge.status === 'rejected';

  const handleApprove = () => {
    approveChallenge(selectedChallenge.id);
  };

  const handleOpenReject = () => {
    setRejectModalTarget(selectedChallenge);
  };

  const handleExpressInterest = () => {
    setInterestSubmitted(true);
    showToast(`Interest registered! Nodal department at ${selectedChallenge.organization} has been notified.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  {selectedChallenge.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedChallenge.id}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isApproved
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : isPending
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                  }`}
                >
                  {isApproved
                    ? 'Verified & Approved'
                    : isPending
                    ? 'Verification Pending'
                    : 'Rejected'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                {selectedChallenge.title}
              </h2>
            </div>

            <button
              onClick={() => setSelectedChallenge(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick meta row */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>{selectedChallenge.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" />
              <span>{selectedChallenge.organization}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Submitted: {selectedChallenge.submittedDate}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Rejection notice if rejected */}
          {isRejected && selectedChallenge.rejectionReason && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm">
              <span className="font-bold flex items-center gap-1.5 mb-1">
                <XCircle className="w-4 h-4 text-rose-600" />
                Administrative Rejection Notice:
              </span>
              <p>{selectedChallenge.rejectionReason}</p>
            </div>
          )}

          {/* Section 1: Problem Statement */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Societal Problem Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {selectedChallenge.description}
            </p>
          </div>

          {/* Section 2: Target Beneficiaries */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-500" /> Target Beneficiaries & Ground Reality
            </h3>
            <p className="text-sm text-slate-800 font-medium bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
              {selectedChallenge.targetBeneficiaries}
            </p>
          </div>

          {/* Section 3: Two Column Specs (Required Skills & Expected Solution) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" /> Required Skills & Disciplines
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedChallenge.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Expected Solution
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed mt-1">
                {selectedChallenge.expectedSolution}
              </p>
            </div>
          </div>

          {/* Section 4: Expected Impact */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Projected Societal Impact
            </h4>
            <p className="text-sm text-emerald-950 font-medium">
              {selectedChallenge.expectedImpact}
            </p>
          </div>

          {selectedChallenge.assignedUniversity && (
            <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-900">
                Partner Academic Institute:
              </span>
              <span className="font-bold text-indigo-700">
                {selectedChallenge.assignedUniversity}
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer: Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Platform: <span className="font-semibold text-slate-700">SamadhanSetu SIH Verification Core</span>
          </div>

          <div className="flex items-center gap-2">
            {/* If pending: give admin approve/reject buttons */}
            {isPending && (
              <>
                <button
                  onClick={handleOpenReject}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  Reject Challenge
                </button>
                <button
                  onClick={handleApprove}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Challenge
                </button>
              </>
            )}

            {/* If approved: show academic adoption button */}
            {isApproved && (
              <button
                onClick={handleExpressInterest}
                disabled={interestSubmitted}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm ${
                  interestSubmitted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                }`}
              >
                {interestSubmitted ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                    Adoption Request Registered
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Express Academic Adoption Interest
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => setSelectedChallenge(null)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
