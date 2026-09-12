import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Building2, 
  Wrench, 
  CheckCircle2, 
  HelpCircle, 
  Tag, 
  ArrowRight,
  MapPin,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';

export const AboutPage = () => {
  const steps = [
    {
      num: '01',
      title: 'Citizen Reports a Problem',
      subtitle: 'Grassroots Community Submission',
      desc: 'A local citizen or panchayat representative logs a community issue with problem title, description, category (Water, Roads, Electricity, Healthcare), district, block, and specific location.',
      outcome: 'A unique reference ID (e.g., JH-2026-000001) is issued immediately to the citizen for tracking.',
      icon: FileText,
      badge: 'Step 1',
    },
    {
      num: '02',
      title: 'Government Verification',
      subtitle: 'Administrative Due Diligence',
      desc: 'The district administration reviews the submitted issue to confirm civic legitimacy, public interest, and technical feasibility. The administrator can Approve, Reject with documented reasons, or request additional data.',
      outcome: 'Only verified and approved problems become publicly listed for institutional action.',
      icon: ShieldCheck,
      badge: 'Step 2',
    },
    {
      num: '03',
      title: 'Problem Assigned',
      subtitle: 'Strategic Allocation',
      desc: 'Approved problems are formally allocated to either a concerned municipal department or an accredited technical institution (e.g. BIT Mesra, NIT Jamshedpur, IIT ISM Dhanbad) matching the domain.',
      outcome: 'Department or university nodal officer receives notification and technical remit.',
      icon: Building2,
      badge: 'Step 3',
    },
    {
      num: '04',
      title: 'University / Department Works on Solution',
      subtitle: 'Engineering & Feasibility Prototyping',
      desc: 'The assigned institution conducts on-ground feasibility, and faculty-student research teams design practical technical proposals, bill of materials, estimated resources, and implementation blueprints.',
      outcome: 'Solution proposal and documentation uploaded securely through University Portal.',
      icon: Wrench,
      badge: 'Step 4',
    },
    {
      num: '05',
      title: 'Government Reviews & Updates Status',
      subtitle: 'Field Execution & Transparent Closure',
      desc: 'The administrator examines the proposed technical solution, sanctions administrative and municipal execution, tracks work-in-progress, and officially closes the problem once field-tested.',
      outcome: 'The citizen and public see verified timeline progress until final resolution.',
      icon: CheckCircle2,
      badge: 'Step 5',
    },
  ];

  const statuses = [
    { status: 'Submitted', desc: 'Initial problem registered by citizen; awaiting administrative scrutiny.' },
    { status: 'Under Review', desc: 'District administration or block development cell evaluating problem scope.' },
    { status: 'Approved', desc: 'Formally accepted as an authentic civic issue requiring structured solution.' },
    { status: 'Assigned', desc: 'Allocated to an academic technical institute or municipal engineering wing.' },
    { status: 'Solution Proposed', desc: 'Technical blueprint and resource estimate submitted by university experts.' },
    { status: 'Work in Progress', desc: 'Ground implementation, civil works, or hardware deployment underway.' },
    { status: 'Resolved', desc: 'Public issue verified as successfully completed with citizen sign-off.' },
    { status: 'Rejected', desc: 'Disqualified with documented reason (e.g., private commercial request).' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-gov-green text-xs font-bold mb-3 border border-emerald-300">
          Governance Model
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About SamadhanSetu
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          A transparent bridge connecting local citizens facing community challenges with district administrations and premier technical institutions for sustainable, practical solutions.
        </p>
      </div>

      {/* 5-Step Visual Workflow Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        <div className="border-b border-slate-200 pb-4 mb-8">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            5-Stage Resolution Workflow
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            How a community issue moves from citizen report to permanent resolution
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-5 sm:p-6 rounded-xl border border-slate-200/80 bg-gov-bg hover:border-emerald-300 transition flex flex-col md:flex-row items-start gap-5"
              >
                <div className="flex items-center gap-3 md:flex-col md:items-center md:justify-center md:w-24 shrink-0">
                  <span className="text-2xl font-black text-gov-green font-mono">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-gov-green flex items-center justify-center shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-gov-green">
                      {step.badge}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                  <div className="pt-1 text-xs text-gov-darkgreen font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Outcome: {step.outcome}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Status Glossary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Standard Status Classification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every reported problem carries one of these standardized statuses across its lifecycle
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {statuses.map((item) => (
            <div
              key={item.status}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between"
            >
              <div className="mb-2">
                <StatusBadge status={item.status} />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Bottom Bar */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Have a community problem to report?</h3>
          <p className="text-xs text-emerald-200 mt-0.5">
            Submit with location details to initiate verification by the district administration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/report"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition shadow-sm"
          >
            Report Problem Now
          </Link>
          <Link
            to="/track"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 transition"
          >
            Track Existing Issue
          </Link>
        </div>
      </div>
    </div>
  );
};
