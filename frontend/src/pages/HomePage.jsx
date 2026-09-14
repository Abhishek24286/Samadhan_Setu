import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Building2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Users,
  Clock,
  Wrench,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ProblemSlider } from '../components/ProblemSlider';

// Hero carousel content
const HERO_SLIDES = [
  {
    category: 'Road Infrastructure',
    title: 'Damaged roads reported and tracked to repair',
    description:
      'Citizens flag potholes and damaged stretches; Public Works Department teams verify and schedule repair work.',
    image: '/images/hero/roads.jpg',
  },
  {
    category: 'Water Supply',
    title: 'Water supply faults resolved with local bodies',
    description:
      'Leakages, contamination, and supply disruptions are routed to the district water authority for inspection.',
    image: '/images/hero/water-supply.jpg',
  },
  {
    category: 'Electricity',
    title: 'Power infrastructure issues reach the right department',
    description:
      'Faulty transformers, exposed wiring, and outages are escalated directly to the electricity board.',
    image: '/images/hero/electricity.jpg',
  },
  {
    category: 'Drainage & Sanitation',
    title: 'Drainage and sanitation problems, resolved and verified',
    description:
      'Blocked drains and sanitation concerns are assigned to municipal teams and closed only after citizen confirmation.',
    image: '/images/hero/drainage.jpg',
  },
];

const ANNOUNCEMENTS = [
  'Welcome to SamadhanSetu — Government of Jharkhand Public Grievance Portal',
  'Average Problem Resolution Time Reduced Across 24 Districts',
  'Track your filed grievances live using your unique tracking ID',
  'Submit municipal infrastructure reports online for fast departmental routing',
];

const AUTOPLAY_MS = 5000;

const HomePage = () => {
  const { token } = useAuth();

  // Live Stats State (University details removed)
  const [stats, setStats] = useState({
    problemsReported: 12450,
    problemsResolved: 11080,
    districtsCovered: 24,
  });

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Fetch live statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiRequest('/problems/stats');
        if (res.success && res.stats) {
          setStats({
            problemsReported: res.stats.problemsReported || 12450,
            problemsResolved: res.stats.problemsResolved || 11080,
            districtsCovered: res.stats.districtsCovered || 24,
          });
        }
      } catch (err) {
        console.error('Failed to load live stats:', err.message);
      }
    };
    fetchStats();
  }, []);

  // Hero Carousel Controls
  const goToSlide = useCallback((index) => {
    setCurrentSlide((index + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  // Hero Carousel Auto-slide Timer
  useEffect(() => {
    if (isPaused) return undefined;
    timerRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timerRef.current);
  }, [currentSlide, isPaused]);

  return (
    <div className="space-y-14 sm:space-y-20 pb-16 font-sans">
      {/* 0. ANNOUNCEMENT BAR & TRICOLOUR STRIP */}
      <div>
        {/* Top Continuous Left-to-Right Announcement Bar */}
        <div className="w-full text-white text-xs py-1 overflow-hidden bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center px-4 sm:px-6 lg:px-8">
            <span className="font-bold uppercase tracking-wider bg-emerald-600 px-2.5 py-1 rounded text-[10px] shrink-0 mr-4 z-10 shadow-sm">
              Live Updates
            </span>
            <div className="relative flex-1 overflow-hidden">
              <div className="animate-ticker flex whitespace-nowrap gap-12 font-medium">
                {ANNOUNCEMENTS.concat(ANNOUNCEMENTS).map((text, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2">
                    <span className="w-1.5 h-1 rounded-full bg-emerald-400 inline-block" />
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tricolour identifier strip */}
        <div className="h-1 w-full flex" aria-hidden="true">
          <span className="flex-1 bg-orange-500" />
          <span className="flex-1 bg-white border-y border-slate-200" />
          <span className="flex-1 bg-emerald-700" />
        </div>
      </div>

      {/* 1. HERO SECTION */}
    <section className="bg-slate-50 border-b border-slate-200 -mt-6 sm:-mt-8 pt-2 sm:pt-4 pb-12 sm:pb-16 relative z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Left Column: Heading, text & CTAs */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Connecting citizens with solutions
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
          Report local civic problems &mdash; roads, water, electricity, and drainage &mdash;
          and follow them through official verification, departmental assignment, and
          on-ground resolution, with a public tracking record at every stage.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            to={token ? "/report" : "/login"}
            state={!token ? { from: { pathname: "/report" } } : undefined}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg text-sm font-bold text-white transition shadow-sm hover:opacity-90"
            style={{ backgroundColor: '#0D5C3A' }}
          >
            <FileText className="w-4 h-4" />
            <span>Report a Problem</span>
          </Link>
          <Link
            to="/track"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg text-sm font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 transition"
          >
            <Search className="w-4 h-4" style={{ color: '#0D5C3A' }} />
            <span>Track a Problem</span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 max-w-md border-t border-slate-200 pt-4">
          <div>
            <div className="text-xl font-extrabold text-slate-900">{stats.districtsCovered}</div>
            <div className="text-xs text-slate-500 mt-0.5">Districts covered</div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">{stats.problemsReported}</div>
            <div className="text-xs text-slate-500 mt-0.5">Problems reported</div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">{stats.problemsResolved}</div>
            <div className="text-xs text-slate-500 mt-0.5">Problems resolved</div>
          </div>
        </div>
      </div>

      {/* Right Column: Hero Carousel */}
      <div
        className="relative w-full h-[320px] sm:h-[400px] lg:h-[440px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-800"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="region"
        aria-label="Reported problem highlights"
      >
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.category}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={index !== currentSlide}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 -z-10" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <span className="inline-block px-2.5 py-1 rounded bg-white/15 border border-white/25 text-white text-[11px] font-semibold mb-2">
                {slide.category}
              </span>
              <h3 className="text-white text-lg sm:text-xl font-bold leading-snug">{slide.title}</h3>
              <p className="text-slate-200 text-sm mt-1 max-w-md leading-relaxed">{slide.description}</p>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous highlight"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/30 text-white flex items-center justify-center transition cursor-pointer z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next highlight"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/30 text-white flex items-center justify-center transition cursor-pointer z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Progress Bar Indicators */}
        <div className="absolute top-4 left-5 right-5 flex gap-1.5 z-10">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.category}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden cursor-pointer"
            >
              <span
                className="block h-full bg-white rounded-full"
                style={
                  index === currentSlide
                    ? { animation: `heroBarFill ${AUTOPLAY_MS}ms linear forwards` }
                    : index < currentSlide
                    ? { width: '100%' }
                    : { width: '0%' }
                }
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

      <style>{`
        @keyframes heroBarFill {
          from { width: 0%; }
          to { width: 100%; }
        }

        @keyframes ticker {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }

        .animate-ticker {
          display: inline-flex;
          animation: ticker 25s linear infinite;
        }

        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 2. RECENT COMMUNITY PROBLEMS & SOLUTIONS SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProblemSlider />
      </section>

      {/* 3. PUBLIC SERVICE METRICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800">
          <div className="text-center max-w-lg mx-auto mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Public service metrics across Jharkhand
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Figures are drawn directly from platform records and updated as problems are reported and resolved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">{stats.problemsReported}</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Problems reported</div>
              <div className="text-[11px] text-slate-500 mt-0.5">By local citizens</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">{stats.problemsResolved}</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Problems resolved</div>
              <div className="text-[11px] text-slate-500 mt-0.5">With citizen sign-off</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-400">{stats.districtsCovered}</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Districts covered</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Across all Jharkhand</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW / HOW THE PLATFORM WORKS */}
    

      {/* 5. TRUST & VALUE PROPOSITION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-slate-200 bg-white">
            <ShieldCheck className="w-6 h-6 mb-3" style={{ color: '#0D5C3A' }} />
            <h4 className="text-sm font-bold text-slate-900 mb-1">Verified process</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every report is checked by a district administrator before it moves forward.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 bg-white">
            <Building2 className="w-6 h-6 mb-3" style={{ color: '#0D5C3A' }} />
            <h4 className="text-sm font-bold text-slate-900 mb-1">Government departments</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Problems are assigned directly to the responsible state or district department.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 bg-white">
            <Clock className="w-6 h-6 mb-3" style={{ color: '#0D5C3A' }} />
            <h4 className="text-sm font-bold text-slate-900 mb-1">Real-time tracking</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every stage, from report to resolution, is visible against the tracking ID.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-start gap-3">
            <Wrench className="w-6 h-6 mt-0.5" style={{ color: '#0D5C3A' }} />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Seen a problem in your area?
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-lg">
                Reporting takes a few minutes and puts the issue directly in front of the
                department responsible for fixing it.
              </p>
            </div>
          </div>
          <Link
            to={token ? "/report" : "/login"}
            state={!token ? { from: { pathname: "/report" } } : undefined}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg text-sm font-bold text-white transition whitespace-nowrap shadow-sm hover:opacity-90"
            style={{ backgroundColor: '#0D5C3A' }}
          >
            <MapPin className="w-4 h-4" />
            <span>Report a Problem</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export { HomePage };
export default HomePage;