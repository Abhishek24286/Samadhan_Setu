import React, { useState } from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';
import { useChallenges } from '../context/ChallengeContext';

export const RejectModal = () => {
  const { rejectModalTarget, setRejectModalTarget, rejectChallenge } = useChallenges();
  const [reason, setReason] = useState('Insufficient problem details');
  const [customReason, setCustomReason] = useState('');

  if (!rejectModalTarget) return null;

  const defaultReasons = [
    'Insufficient problem details',
    'Commercial project not eligible for public platform',
    'Problem is purely administrative / lacks technological scope',
    'Duplicate challenge already registered for this panchayat/ward',
    'Safety or regulatory compliance concerns'
  ];

  const handleConfirmReject = (e) => {
    e.preventDefault();
    const finalReason = reason === 'Other' ? customReason : reason;
    rejectChallenge(rejectModalTarget.id, finalReason || 'Administrative rejection');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-rose-50 border-b border-rose-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Reject Challenge
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[240px]">
                {rejectModalTarget.title}
              </p>
            </div>
          </div>

          <button
            onClick={() => setRejectModalTarget(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleConfirmReject} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Rejection Reason:
            </label>
            <div className="space-y-2">
              {defaultReasons.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                    reason === r
                      ? 'border-rose-300 bg-rose-50/50 text-rose-900 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectionReason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span>{r}</span>
                </label>
              ))}

              <label
                className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                  reason === 'Other'
                    ? 'border-rose-300 bg-rose-50/50 text-rose-900 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="rejectionReason"
                  value="Other"
                  checked={reason === 'Other'}
                  onChange={() => setReason('Other')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>Specify Custom Reason...</span>
              </label>
            </div>
          </div>

          {reason === 'Other' && (
            <div>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Explain why this challenge cannot be approved..."
                rows={3}
                required
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setRejectModalTarget(null)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
