import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, Building2, Wrench } from 'lucide-react';

export const ProblemTimeline = ({ currentStatus, timeline = [] }) => {
  const steps = [
    { label: 'Submitted', key: 'Submitted' },
    { label: 'Under Review', key: 'Under Review' },
    { label: 'Approved', key: 'Approved' },
    { label: 'Assigned', key: 'Assigned' },
    { label: 'Solution Proposed', key: 'Solution Proposed' },
    { label: 'Work in Progress', key: 'Work in Progress' },
    { label: 'Resolved', key: 'Resolved' },
  ];

  const isRejected = currentStatus === 'Rejected';

  const getStepIndex = (status) => {
    return steps.findIndex((s) => s.key === status);
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="space-y-6">
      {/* High-level progress tracker bar */}
      {!isRejected ? (
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
            Resolution Pipeline Progress
          </h4>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center justify-between min-w-[650px] relative">
              {/* Connecting line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 -z-0"></div>
              <div
                className="absolute top-4 left-4 h-0.5 bg-gov-green transition-all duration-500 -z-0"
                style={{
                  width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%`,
                }}
              ></div>

              {steps.map((step, idx) => {
                const isPassed = idx < currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center relative z-10 text-center w-24">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-gov-green text-white ring-4 ring-emerald-100 shadow-md scale-110'
                          : isPassed
                          ? 'bg-gov-green text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-300'
                      }`}
                    >
                      {isPassed || isCurrent ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] mt-2 font-medium leading-tight ${
                        isCurrent
                          ? 'text-gov-darkgreen font-bold'
                          : isPassed
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3">
          <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Application / Problem Not Approved</h4>
            <p className="text-xs text-rose-700">
              This submission was reviewed by the administration and marked as rejected. See remarks below.
            </p>
          </div>
        </div>
      )}

      {/* Detailed Chronological History */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Official Action History
        </h4>

        {timeline && timeline.length > 0 ? (
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
            {timeline.map((event, index) => (
              <div key={index} className="relative flex items-start gap-4 pl-8">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white border-2 border-gov-green"></div>
                <div className="flex-1 bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">
                      {event.status}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(event.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {event.message}
                  </p>
                  <div className="mt-1 text-[10px] font-medium text-slate-400">
                    Logged by: <span className="text-slate-600">{event.updatedBy || 'Administration'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No historical action events logged yet.</p>
        )}
      </div>
    </div>
  );
};
