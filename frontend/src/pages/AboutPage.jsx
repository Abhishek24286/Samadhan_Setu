import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Building2, 
  Wrench, 
  CheckCircle2, 
  ArrowRight,
  Target,
  Layers,
  Sparkles,
  Search,
  Check
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
    <div className="bg-slate-50 min-h-screen text-black">
      {/* Header Banner */}
      <section className="bg-black text-white border-b border-slate-800 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-700">
            Institutional Infrastructure Framework
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            About SamadhanSetu
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Bridging the structural divide between grassroots civic challenges, municipal governance execution, and higher education technical expertise.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        
        {/* Detailed Problem Statement Section */}
        <section className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-black text-white rounded-xl">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Comprehensive Analysis</span>
              <h2 className="text-2xl sm:text-3xl font-black text-black">The Problem Statement</h2>
            </div>
          </div>

          <div className="space-y-6 text-black text-sm sm:text-base leading-relaxed">
            <p className="font-semibold text-lg text-black border-l-4 border-black pl-4">
              Modern civic administration frequently suffers from systemic information asymmetry, fragmented task delegation, and underutilized institutional intelligence.
            </p>
            
            <p>
              In traditional public administration pipelines, grassroots issues—ranging from localized water contamination and structural road degradation to power grid instability—are often captured through inefficient paper-based mechanisms or disconnected helplines. These legacy submission models introduce significant processing delays, lack systematic classification, and routinely obscure the tracking visibility required by citizens.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 pt-2">
              <div className="p-5 rounded-xl border border-slate-300 bg-slate-100">
                <h3 className="font-bold text-black text-base mb-2">Fragmented Accountability</h3>
                <p className="text-xs sm:text-sm text-slate-800">
                  Civic reports wander across uncoordinated administrative layers without designated ownership or automated status transitions.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-slate-300 bg-slate-100">
                <h3 className="font-bold text-black text-base mb-2">Isolated Academic Capability</h3>
                <p className="text-xs sm:text-sm text-slate-800">
                  Regional engineering and technical universities operate in research silos, isolated from real-world local engineering challenges.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-slate-300 bg-slate-100">
                <h3 className="font-bold text-black text-base mb-2">Execution Bottlenecks</h3>
                <p className="text-xs sm:text-sm text-slate-800">
                  District authorities lack standardized, verified technical design proposals needed to issue actionable tenders and municipal budgets promptly.
                </p>
              </div>
            </div>

            <p>
              Consequently, citizens experience persistent civic deficits while municipal authorities struggle with backlogged verification queues and a scarcity of contextual field engineering data.
            </p>
          </div>
        </section>

        {/* Detailed Solution Blueprint Section */}
        <section className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-black text-white rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Strategic Framework</span>
              <h2 className="text-2xl sm:text-3xl font-black text-black">The SamadhanSetu Solution</h2>
            </div>
          </div>

          <div className="space-y-6 text-black text-sm sm:text-base leading-relaxed">
            <p className="font-semibold text-lg text-black border-l-4 border-black pl-4">
              SamadhanSetu introduces a unified digital orchestration layer connecting citizens, district administrators, and university researchers into a single operational pipeline.
            </p>

            <p>
              By standardizing the end-to-end lifecycle of civic grievances, SamadhanSetu converts raw citizen complaints into structured engineering tasks. Verified district needs are directly mapped to accredited technical universities (such as BIT Mesra, NIT Jamshedpur, and IIT ISM Dhanbad). Student-faculty teams develop actionable blueprints, resource estimates, and prototyping designs, which are then handed back to government departments for swift administrative execution.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-xl border border-slate-300 flex items-start gap-3 bg-slate-50">
                <Check className="w-5 h-5 text-black shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-black text-sm">Transparent Verification</h4>
                  <p className="text-xs text-slate-800 mt-1">Multi-stage administrative review ensuring legitimacy and public interest before resource allocation.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-300 flex items-start gap-3 bg-slate-50">
                <Check className="w-5 h-5 text-black shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-black text-sm">Institutional R&D Integration</h4>
                  <p className="text-xs text-slate-800 mt-1">Direct deployment of academic technical capital to solve regional infrastructure challenges.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-300 flex items-start gap-3 bg-slate-50">
                <Check className="w-5 h-5 text-black shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-black text-sm">Real-Time Auditing</h4>
                  <p className="text-xs text-slate-800 mt-1">Unique tracking reference IDs allowing public visibility across every stage of problem resolution.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-300 flex items-start gap-3 bg-slate-50">
                <Check className="w-5 h-5 text-black shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-black text-sm">Standardized Lifecycle</h4>
                  <p className="text-xs text-slate-800 mt-1">Structured transitions from initial registration to technical blueprinting and field sign-off.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5-Step Visual Workflow Section */}
        <section className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-sm">
          <div className="border-b border-slate-200 pb-4 mb-8">
            <h2 className="text-2xl font-black text-black tracking-tight">
              5-Stage Resolution Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              Operational lifecycle from citizen submission to technical deployment and verified closure
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-6 rounded-xl border border-slate-300 bg-slate-50 hover:border-black transition flex flex-col md:flex-row items-start gap-6"
                >
                  <div className="flex items-center gap-4 md:flex-col md:items-center md:justify-center md:w-24 shrink-0">
                    <span className="text-3xl font-black text-black font-mono">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-2.5 py-1 rounded text-xs font-bold bg-black text-white">
                        {step.badge}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-black">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                      {step.desc}
                    </p>
                    <div className="pt-2 text-xs sm:text-sm text-black font-bold flex items-center gap-2 border-t border-slate-200 mt-3">
                      <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                      <span>Outcome: {step.outcome}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Official Status Glossary */}
        <section className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-xl font-black text-black tracking-tight">
              Standard Status Classification
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              Uniform governance statuses tracking systemic progress across all registered cases
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {statuses.map((item) => (
              <div
                key={item.status}
                className="p-4 rounded-xl border border-slate-300 bg-slate-50 flex flex-col justify-between space-y-3"
              >
                <div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Callout */}
        <section className="bg-black text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-black">Initiate A Civic Report</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Submit an issue with location data and imagery to begin official administrative verification and technical assignment.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 flex-col sm:flex-row w-full md:w-auto">
            <Link
              to="/report"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-xl text-xs font-bold text-black bg-white hover:bg-slate-200 transition shadow-sm uppercase tracking-wider"
            >
              Report Problem
            </Link>
            <Link
              to="/track"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition uppercase tracking-wider"
            >
              Track Issue
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
