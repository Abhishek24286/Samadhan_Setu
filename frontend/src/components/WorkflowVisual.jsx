import React from 'react';
import { 
  AlertOctagon, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Cpu, 
  HeartHandshake, 
  ArrowRight,
  ArrowDown,
  Sparkles
} from 'lucide-react';

export const WorkflowVisual = () => {
  const steps = [
    {
      id: 1,
      title: "Community Problem",
      subtitle: "Identified by Society / Civic Bodies",
      icon: AlertOctagon,
      bgColor: "bg-amber-500",
      textColor: "text-amber-600",
      ringColor: "ring-amber-200",
      bgLight: "bg-amber-50/80",
      borderColor: "border-amber-200"
    },
    {
      id: 2,
      title: "SamadhanSetu",
      subtitle: "Admin Verification & Vetting",
      icon: ShieldCheck,
      bgColor: "bg-indigo-600",
      textColor: "text-indigo-600",
      ringColor: "ring-indigo-200",
      bgLight: "bg-indigo-50/80",
      borderColor: "border-indigo-200",
      highlight: true
    },
    {
      id: 3,
      title: "Academic Institution",
      subtitle: "Allocated to Partner Colleges",
      icon: Building2,
      bgColor: "bg-blue-600",
      textColor: "text-blue-600",
      ringColor: "ring-blue-200",
      bgLight: "bg-blue-50/80",
      borderColor: "border-blue-200"
    },
    {
      id: 4,
      title: "Students & Faculty",
      subtitle: "R&D Teams & Hackathon Pods",
      icon: GraduationCap,
      bgColor: "bg-purple-600",
      textColor: "text-purple-600",
      ringColor: "ring-purple-200",
      bgLight: "bg-purple-50/80",
      borderColor: "border-purple-200"
    },
    {
      id: 5,
      title: "Innovative Solution",
      subtitle: "Hardware / Software Prototypes",
      icon: Cpu,
      bgColor: "bg-sky-600",
      textColor: "text-sky-600",
      ringColor: "ring-sky-200",
      bgLight: "bg-sky-50/80",
      borderColor: "border-sky-200"
    },
    {
      id: 6,
      title: "Social Impact",
      subtitle: "Deployment in Villages & Towns",
      icon: HeartHandshake,
      bgColor: "bg-emerald-600",
      textColor: "text-emerald-600",
      ringColor: "ring-emerald-200",
      bgLight: "bg-emerald-50/80",
      borderColor: "border-emerald-200"
    }
  ];

  return (
    <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-lg shadow-slate-100/80">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5" /> End-to-End Innovation Pipeline
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
          From Societal Pain Point to Scalable Impact
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Bridging real grassroots demands with the best engineering minds across India
        </p>
      </div>

      {/* Process flow container */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative items-stretch">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div 
                className={`relative flex flex-col items-center text-center p-4 rounded-xl border ${step.borderColor} ${step.bgLight} transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                  step.highlight ? 'ring-2 ring-indigo-500/30' : ''
                }`}
              >
                {/* Step number badge */}
                <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-xs">
                  0{step.id}
                </span>

                {/* Icon circle */}
                <div className={`w-12 h-12 rounded-xl ${step.bgColor} text-white flex items-center justify-center shadow-md mb-3`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {step.subtitle}
                </p>

                {step.highlight && (
                  <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                    Verification Bridge
                  </span>
                )}
              </div>

              {/* Connecting arrow for mobile / desktop */}
              {!isLast && (
                <div className="hidden md:flex items-center justify-center -mx-2 z-10">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
              {!isLast && (
                <div className="flex md:hidden items-center justify-center py-1">
                  <ArrowDown className="w-4 h-4 text-indigo-400" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
