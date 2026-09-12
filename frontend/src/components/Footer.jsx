import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Mail, MapPin, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Upper Footer: Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Platform Overview */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gov-green text-white flex items-center justify-center font-serif font-black text-sm border border-amber-400">
                झार
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                समाधान <span className="text-emerald-400">सेतु</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Public Grievance and Community Innovation Platform. Connecting citizens with district administrations and premier technical institutions.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold">
              Government of Jharkhand Public-Service Initiative
            </div>
          </div>

          {/* Col 2: Citizen Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/report" className="hover:text-emerald-400 transition-colors">
                  Report a Problem
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-emerald-400 transition-colors">
                  Track Problem Status
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  How the Platform Works
                </Link>
              </li>
              <li>
                <Link to="/universities" className="hover:text-emerald-400 transition-colors">
                  Participating Technical Institutes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Important Government Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Important Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="https://jharkhand.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">
                  <span>Jharkhand State Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://jharsewa.jharkhand.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">
                  <span>JharSewa Citizen Services</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://digitaljharkhand.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">
                  <span>Digital Jharkhand</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-amber-300 transition text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Administrative Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Grievance Support & Helpdesk */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Citizen Helpdesk
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Toll-free CM Helpline: <strong>181</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>samadhan.portal@jharkhand.gov.in</span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Project Bhawan, Dhurwa, Ranchi - 834004, Jharkhand</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & compliance bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Government of Jharkhand. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Accessibility Statement</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Hyperlinking Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
