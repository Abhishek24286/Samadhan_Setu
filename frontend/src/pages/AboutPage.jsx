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
  Check,
  Cpu,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';

export const AboutPage = () => {
  const steps = [
    {
      num: '01',
      title: 'Citizen Reports a Problem',
      subtitle: 'Grassroots Community Submission',
      desc: 'A local citizen or representative logs a community issue with a detailed description, media/photos, district, block, and specific geographical location.',
      outcome: 'A unique reference ID is generated immediately for end-to-end tracking.',
      icon: FileText,
      badge: 'Step 1',
    },
    {
      num: '02',
      title: 'AI Detection & Categorization',
      subtitle: 'Smart Triage & Structuring',
      desc: 'Advanced AI engines analyze the reported text and media to automatically detect core problem types, generate a clean standardized title, and tag accurate domains (Water, Roads, Electrical, Healthcare, Tech).',
      outcome: 'Unstructured complaints are instantly converted into structured, categorized technical records.',
      icon: Cpu,
      badge: 'Step 2',
    },
    {
      num: '03',
      title: 'Smart University Routing',
      subtitle: 'Expertise-Based Allocation',
      desc: 'The system automatically forwards the categorized problem to the most appropriate accredited technical university or engineering department based on their specific research and lab domain expertise.',
      outcome: 'Nodal academic units receive targeted problem statements matching their core competencies.',
      icon: Building2,
      badge: 'Step 3',
    },
    {
      num: '04',
      title: 'University Interest & Admin Approval',
      subtitle: 'Institutional Scrutiny & Sanction',
      desc: 'If the university expresses interest and drafts a preliminary approach, it formally requests approval through the central government/admin portal for official greenlighting.',
      outcome: 'Secure administrative authorization to proceed with institutional R&D and prototyping.',
      icon: ShieldCheck,
      badge: 'Step 4',
    },
    {
      num: '05',
      title: 'Prototype Building & Investment',
      subtitle: 'Engineering R&D & Commercial Scaling',
      desc: 'The approved university builds a working technical prototype or engineering model. Startups, industry partners, and investors can review verified prototypes to fund, incubate, or scale them.',
      outcome: 'Grassroots civic issues transform into market-ready innovations, startups, and deployable solutions.',
      icon: TrendingUp,
      badge: 'Step 5',
    },
  ];

  const statuses = [
    { status: 'Submitted', desc: 'Initial problem registered by citizen; awaiting AI triage.' },
    { status: 'AI Categorized', desc: 'Processed by AI engine; assigned standard title, tags, and domain category.' },
    { status: 'Forwarded to University', desc: 'Allocated to an academic institution possessing matching technical expertise.' },
    { status: 'Approval Pending', desc: 'University has shown interest and requested official government/admin portal sanction.' },
    { status: 'Approved for Prototyping', desc: 'Administrative greenlight granted; university authorized to build solution.' },
    { status: 'Prototype Under Development', desc: 'Faculty-student R&D teams engineering hardware/software prototypes.' },
    { status: 'Investment & Scaling', desc: 'Startups and corporations engaged to fund, adopt, or deploy the prototype.' },
    { status: 'Resolved', desc: 'Public issue successfully addressed, field-tested, and closed.' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-black">
      {/* Header Banner - Compact padding for better screen economy */}
      <section className="bg-black text-white border-b border-slate-800 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-slate-800">
            AI-Driven Civic Innovation & Research Framework
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            About SamadhanSetu
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed text-left sm:text-center">
            Connecting grassroots civic challenges with AI triage, higher education institutional intelligence, government governance, and venture investments.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-12">
        
        {/* Detailed Problem Statement Section */}
        <section className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-black text-white rounded-xl">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Comprehensive Analysis</span>
              <h2 className="text-2xl font-black text-black">The Problem Statement</h2>
            </div>
          </div>

          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed text-left">
            <p className="font-semibold text-base text-black border-l-4 border-black pl-4 py-0.5">
              Traditional public grievance handling mechanisms suffer from manual delays, unstructured reporting, disconnected academic R&D, and low commercial visibility for innovative fixes.
            </p>
            
            <p className="text-left">
              Citizens across districts report infrastructure failures, sanitation roadblocks, and technical hurdles using slow, fragmented channels. Because these complaints lack automated triage and intelligent categorization, they bounce across departments without clear ownership. Furthermore, regional universities possessing world-class technical talent remain disconnected from local problems, and breakthrough student prototypes rarely get the structured government approvals or corporate funding needed to scale.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-left">
                <h3 className="font-bold text-black text-sm mb-1">Unstructured Triage</h3>
                <p className="text-xs text-slate-600">
                  Manual sorting of complaints creates processing bottlenecks and misrouted institutional tasks.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-left">
                <h3 className="font-bold text-black text-sm mb-1">Siloed Academia</h3>
                <p className="text-xs text-slate-600">
                  Technical universities operate away from real-world regional engineering challenges and lab-to-market pipelines.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-left">
                <h3 className="font-bold text-black text-sm mb-1">Investment Gaps</h3>
                <p className="text-xs text-slate-600">
                  Promising university prototypes lack streamlined government verification and direct corporate startup investments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Solution Blueprint Section */}
        <section className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-black text-white rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Strategic Framework</span>
              <h2 className="text-2xl font-black text-black">The SamadhanSetu Solution</h2>
            </div>
          </div>

          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed text-left">
            <p className="font-semibold text-base text-black border-l-4 border-black pl-4 py-0.5">
              SamadhanSetu automates the transition from citizen feedback to AI analysis, expert university allocation, administrative sanction, and commercial investment.
            </p>

            <p className="text-left">
              By combining cutting-edge artificial intelligence for semantic classification with automated institutional routing, we bridge the gap between civil administration and academic prowess. Once universities craft functional prototypes under government oversight, venture capitalists, startups, and companies step in to fund and scale them into robust market solutions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-xl border border-slate-300 flex items-start gap-3 bg-slate-50 text-left">
                <Check className="w-4 h-4 text-black shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-black text-sm">AI-Powered Categorization</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Automatic generation of clean titles, domains, and severity indexes for raw citizen reports.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-300 flex items-start gap-3 bg-slate-50 text-left">
                <Check className="w-4 h-4 text-black shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-black text-sm">Expertise-Based Routing</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Intelligent matching mapping civic challenges directly to specialized university departments.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-300 flex items-start gap-3 bg-slate-50 text-left">
                <Check className="w-4 h-4 text-black shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-black text-sm">Admin Portal Approvals</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Seamless workflows allowing interested universities to secure official government sanctions.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-300 flex items-start gap-3 bg-slate-50 text-left">
                <Check className="w-4 h-4 text-black shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-black text-sm">Startup & Corporate Investment</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Providing companies and investors visibility into ready-to-scale university prototypes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5-Step Visual Workflow Section */}
        <section className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-sm">
          <div className="border-b border-slate-200 pb-4 mb-6 text-left">
            <h2 className="text-2xl font-black text-black tracking-tight">
              End-to-End Workflow Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              From citizen problem logging to AI tagging, university development, and corporate investment
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-5 rounded-xl border border-slate-300 bg-slate-50 hover:border-black transition flex flex-col md:flex-row items-start gap-5 text-left"
                >
                  <div className="flex items-center gap-3 md:flex-col md:items-center md:justify-center md:w-20 shrink-0">
                    <span className="text-2xl font-black text-black font-mono">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-black text-white">
                        {step.badge}
                      </span>
                      <h3 className="text-base font-bold text-black">
                        {step.title}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium ml-auto hidden sm:inline">
                        {step.subtitle}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-left">
                      {step.desc}
                    </p>
                    <div className="pt-2 text-xs sm:text-sm text-black font-bold flex items-center gap-2 border-t border-slate-200 mt-2">
                      <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
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
          <div className="border-b border-slate-200 pb-4 mb-6 text-left">
            <h2 className="text-xl font-black text-black tracking-tight">
              Standard Status Classification
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Uniform governance statuses tracking systemic progress across all registered cases
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {statuses.map((item) => (
              <div
                key={item.status}
                className="p-4 rounded-xl border border-slate-300 bg-slate-50 flex flex-col justify-between space-y-2"
              >
                <div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Callout */}
        <section className="bg-black text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-black">Participate in SamadhanSetu</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg text-left">
              Submit a civic problem to kickstart AI categorization and institutional routing, or track existing developments.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 flex-col sm:flex-row w-full md:w-auto">
            <Link
              to="/report"
              className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-slate-200 transition shadow-sm uppercase tracking-wider"
            >
              Report Problem
            </Link>
            <Link
              to="/track"
              className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition uppercase tracking-wider"
            >
              Track Issue
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};