import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Mail, MapPin, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Upper Footer: Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Platform Overview & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md shrink-0 overflow-hidden bg-white border border-slate-700">
                <img 
                  src="/images/hero/images.jpg" 
                  alt="Jharkhand Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Samadhan Setu</h3>
                <p className="text-[10px] text-emerald-400 font-medium">Govt. of Jharkhand Initiative</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Public Grievance and Community Innovation Platform. Connecting citizens with district administrations and premier technical institutions.
            </p>
          </div>

          {/* Col 2: Citizen Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/report" className="hover:text-emerald-400 transition-colors block py-0.5">
                  Report a Problem
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-emerald-400 transition-colors block py-0.5">
                  Track Problem Status
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors block py-0.5">
                  How the Platform Works
                </Link>
              </li>
              <li>
                <Link to="/universities" className="hover:text-emerald-400 transition-colors block py-0.5">
                  Participating Technical Institutes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Important Government Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2">
              Important Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="https://jharkhand.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center justify-between py-0.5">
                  <span>Jharkhand State Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                </a>
              </li>
              <li>
                <a href="https://jharsewa.jharkhand.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center justify-between py-0.5">
                  <span>JharSewa Citizen Services</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                </a>
              </li>
              <li>
                <a href="https://digitaljharkhand.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center justify-between py-0.5">
                  <span>Digital Jharkhand</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                </a>
              </li>
              <li className="pt-1">
                <Link to="/admin/login" className="hover:text-amber-300 transition text-slate-300 flex items-center gap-1.5 bg-slate-800/80 p-2 rounded border border-slate-700/60">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-medium">Administrative Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Grievance Support & Helpdesk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2">
              Citizen Helpdesk
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Toll-free CM Helpline: <strong className="text-white">181</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="break-all">samadhan.portal@jharkhand.gov.in</span>
              </div>
              <div className="flex items-start gap-2.5 pt-0.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Project Bhawan, Dhurwa, Ranchi - 834004, Jharkhand</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & compliance bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-4 text-center md:text-left">
          <p>© {new Date().getFullYear()} Government of Jharkhand. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-slate-400">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hidden sm:inline">•</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hidden sm:inline">•</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Accessibility Statement</span>
            <span className="hidden sm:inline">•</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Hyperlinking Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};