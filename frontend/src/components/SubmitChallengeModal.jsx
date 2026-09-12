import React, { useState } from 'react';
import { X, Send, PlusCircle, Sparkles, Building2, MapPin, Tag, Users, CheckCircle } from 'lucide-react';
import { useChallenges } from '../context/ChallengeContext';

export const SubmitChallengeModal = () => {
  const { submitModalOpen, setSubmitModalOpen, submitChallenge } = useChallenges();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Environment',
    location: 'Palamu',
    organization: '',
    orgType: 'Gram Panchayat / Civic Body',
    description: '',
    targetBeneficiaries: '',
    requiredSkills: 'IoT, Web Development, Data Analytics',
    expectedSolution: '',
    expectedImpact: ''
  });

  if (!submitModalOpen) return null;

  const categories = [
    'Environment',
    'Water & Sanitation',
    'Healthcare',
    'Agriculture',
    'Education',
    'Women Safety',
    'Infrastructure',
    'Renewable Energy'
  ];

  const districts = [
    'Palamu',
    'Ranchi',
    'Jamshedpur (East Singhbhum)',
    'Dhanbad',
    'Bokaro',
    'Hazaribagh',
    'Dumka',
    'Latehar',
    'Giridih',
    'Deoghar',
    'Chaibasa (West Singhbhum)'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = formData.requiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    submitChallenge({
      ...formData,
      requiredSkills: skillsArray.length > 0 ? skillsArray : ['Innovation', 'Tech Prototyping']
    });

    // Reset form
    setFormData({
      title: '',
      category: 'Environment',
      location: 'Palamu',
      organization: '',
      orgType: 'Gram Panchayat / Civic Body',
      description: '',
      targetBeneficiaries: '',
      requiredSkills: 'IoT, Web Development, Data Analytics',
      expectedSolution: '',
      expectedImpact: ''
    });
  };

  const handleFillDemo = () => {
    setFormData({
      title: 'Solar-Powered Cold Storage for Rural Vegetable Farmers',
      category: 'Agriculture',
      location: 'Palamu',
      organization: 'Palamu Kisan Samiti & Block Agricultural Office',
      orgType: 'Farmer Producer Co-op',
      description: 'Smallholder tomato and green chili farmers in Daltonganj lack affordable cold storage, resulting in 40% post-harvest spoilage during hot summer months.',
      targetBeneficiaries: '3,200 marginal vegetable farming families across 8 villages',
      requiredSkills: 'IoT Sensors, Thermal Cooling, Solar Inverter Integration, Mobile Telemetry',
      expectedSolution: 'Decentralized 5-tonne phase-change material (PCM) solar cold storage micro-unit with remote temperature monitoring.',
      expectedImpact: 'Prevents distress sales, reducing crop spoilage from 40% down to under 5% and boosting farmer income by Rs 45,000 annually.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                SIH Public Gateway
              </span>
              <span className="text-xs text-slate-300">
                Societal Problem Ingestion
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Submit a Real-World Societal Challenge
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Submitted challenges enter administrative verification before being matched with universities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-600/60 hover:bg-indigo-600 text-indigo-100 border border-indigo-400/40 transition"
              title="Click to auto-populate a realistic demo challenge"
            >
              Fill Sample Demo
            </button>
            <button
              onClick={() => setSubmitModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Challenge Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Challenge Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Smart Waste Management for Rural Communities"
              className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Category & District Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Domain / Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                District / Location <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                {districts.map((dst) => (
                  <option key={dst} value={dst}>
                    {dst}, Jharkhand
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Organization & Org Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Submitting Organization / Body <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g., District Municipal Authority, Palamu"
                className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Organization Type
              </label>
              <select
                value={formData.orgType}
                onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
                className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                <option value="Gram Panchayat / Civic Body">Gram Panchayat / Civic Body</option>
                <option value="District Administration / Municipal Body">District Administration / Municipal Body</option>
                <option value="Non-Governmental Organization (NGO)">Non-Governmental Organization (NGO)</option>
                <option value="Self-Help Group (SHG) / FPO">Self-Help Group (SHG) / FPO</option>
                <option value="Healthcare Center / Educational Trust">Healthcare Center / Educational Trust</option>
              </select>
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Societal Problem Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain the specific grassroots problem, its day-to-day consequences on citizens, and why current methods fail..."
              className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Target Beneficiaries */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Beneficiaries & Population Affected
            </label>
            <input
              type="text"
              value={formData.targetBeneficiaries}
              onChange={(e) => setFormData({ ...formData, targetBeneficiaries: e.target.value })}
              placeholder="e.g., 45,000 rural residents across 14 Gram Panchayats"
              className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Required Technical Skills (comma-separated)
            </label>
            <input
              type="text"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              placeholder="IoT, Web Development, Data Analytics, Mobile App"
              className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Expected Solution & Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Expected Solution Prototype
              </label>
              <textarea
                rows={2}
                value={formData.expectedSolution}
                onChange={(e) => setFormData({ ...formData, expectedSolution: e.target.value })}
                placeholder="Brief technical prototype expectations..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Projected Societal Impact
              </label>
              <textarea
                rows={2}
                value={formData.expectedImpact}
                onChange={(e) => setFormData({ ...formData, expectedImpact: e.target.value })}
                placeholder="Quantifiable benefit to the community..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              ⚡ Live demo: Challenge will enter admin review immediately.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/30 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit for Verification
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
