import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Building, 
  FileCode2, 
  Hammer, 
  ShieldCheck 
} from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Submitted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          Submitted
        </span>
      );
    case 'Under Review':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          Under Review
        </span>
      );
    case 'Approved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-300">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          Approved
        </span>
      );
    case 'Assigned':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-300">
          <Building className="w-3.5 h-3.5 text-purple-600" />
          Assigned
        </span>
      );
    case 'Solution Proposed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-300">
          <FileCode2 className="w-3.5 h-3.5 text-indigo-600" />
          Solution Proposed
        </span>
      );
    case 'Work in Progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-300">
          <Hammer className="w-3.5 h-3.5 text-orange-600" />
          Work in Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Resolved
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {status}
        </span>
      );
  }
};
