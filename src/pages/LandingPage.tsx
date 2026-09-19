import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, MapPin, Compass, Truck, BarChart3, LogIn, Sun, Moon, ArrowRight, Activity, BrainCircuit, ShieldAlert, Network, Radar, Cpu, Menu, X } from 'lucide-react';
import { Footer } from '../components/layout/Footer';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const { theme, toggleTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Overview', id: 'overview' },
    { label: 'Capabilities', id: 'capabilities' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'About', id: 'about' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] font-sans selection:bg-cyan-600 selection:text-white">
      {/* Header */}
      <header className="fixed top-0 z-[2000] w-full glass-panel border-b border-[var(--border-default)] px-4 sm:px-6 py-3 shadow-sm transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2.5 flex-shrink-0 cursor-pointer" onClick={() => scrollToSection('top')}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-[var(--text-on-action)] shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  NER-Sarthi
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-400 dark:border-cyan-500/30">
                  DoNER
                </span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => scrollToSection(item.id)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all duration-300 shadow-sm flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-slate-900 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:scale-105'
                  : 'bg-white border-amber-300 text-amber-600 hover:bg-amber-50 hover:scale-105 shadow-amber-500/10'
              }`}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-cyan-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>
            
            <button 
              onClick={onLoginClick}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-4 py-2 text-xs font-extrabold text-[var(--text-on-action)] shadow-md transition hover:from-cyan-400 hover:to-blue-500 active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Official Login</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl glass-panel-light border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:text-cyan-600 transition-colors"
              aria-label="Toggle Landing Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-b border-[var(--border-default)] px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-cyan-500/15 rounded-xl transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main id="top" className="pt-20 sm:pt-24 pb-0 overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 mb-6 text-[10px] sm:text-xs font-bold text-cyan-800 dark:text-cyan-300">
            <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>AI-Powered Logistics & Accessibility Intelligence • Northeast India</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-5 max-w-4xl leading-tight">
            Smarter Logistics. <br className="hidden sm:block" />
            Safer Routes. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Connected Northeast.</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-8 max-w-2xl">
            NER-Sarthi combines real-time field intelligence, advanced route analytics, and AI-powered planning to support resilient and accessible logistics operations across Northeast India.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              onClick={() => scrollToSection('overview')}
              className="px-6 py-3 text-xs font-extrabold text-[var(--text-primary)] glass-panel border border-[var(--border-default)] hover:border-[var(--border-accent)] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              Explore Platform
            </button>
            <button 
              onClick={onLoginClick}
              className="px-6 py-3 text-xs font-extrabold text-[var(--text-on-action)] bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Official Login <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Overview Section */}
        <section id="overview" className="py-12 border-y border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3">Platform Overview</h3>
              <p className="text-[var(--text-secondary)] text-xs sm:text-sm">
                A comprehensive intelligence platform engineered for the unique logistical and accessibility challenges of the Northeast. We empower decision-makers with data-driven insights for robust operational continuity.
              </p>
            </div>

            <div id="capabilities" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {[
                { icon: MapPin, title: "Route Intelligence", desc: "Real-time visibility into route conditions, terrain challenges, and accessibility metrics." },
                { icon: BrainCircuit, title: "AI Logistics Planner", desc: "Smart dispatching and resource allocation powered by predictive algorithms." },
                { icon: ShieldAlert, title: "Field Intelligence", desc: "Crowdsourced reports and verified data from on-ground officers and sensors." },
                { icon: BarChart3, title: "Analytics & Reports", desc: "Comprehensive dashboards for performance tracking and operational auditing." },
                { icon: Activity, title: "Accessibility & Logistics", desc: "Proactive monitoring of infrastructure constraints and hazard zones." },
                { icon: Truck, title: "Operational Intelligence", desc: "Specialized models adapted specifically for the topological realities of the NER." }
              ].map((feature, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl flex flex-col items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm group-hover:bg-cyan-500/20 transition-colors">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h4>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">How It Works</h3>
            <p className="text-[var(--text-secondary)] text-xs sm:text-sm">Seamlessly transforming raw data into actionable command intelligence.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4 glass-card p-6 sm:p-10 rounded-3xl border border-[var(--border-default)] shadow-sm">
            {[
              { icon: Radar, label: "Field Reports" },
              { icon: Network, label: "Data Intelligence" },
              { icon: Cpu, label: "AI Analysis" },
              { icon: ShieldAlert, label: "Risk & Route Insights" },
              { icon: BrainCircuit, label: "Operational Decision Support" }
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center text-center w-full lg:w-40 relative group">
                  <div className="w-14 h-14 bg-[var(--bg-panel)] rounded-2xl border border-[var(--border-default)] flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm mb-3 relative z-10 group-hover:scale-110 group-hover:border-cyan-500/50 transition-all">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{step.label}</span>
                </div>
                {idx < arr.length - 1 && (
                  <div className="hidden lg:flex flex-1 h-px bg-[var(--border-strong)] relative items-center justify-center min-w-[30px]">
                    <ArrowRight className="absolute text-[var(--border-strong)] w-4 h-4" />
                  </div>
                )}
                {idx < arr.length - 1 && (
                  <div className="lg:hidden h-6 w-px bg-[var(--border-strong)] my-1 relative flex items-center justify-center">
                    <ArrowRight className="absolute text-[var(--border-strong)] w-4 h-4 rotate-90" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-12 border-t border-[var(--border-subtle)] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-[var(--border-default)] shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  About NER-Saarthi
                </h3>
                <p className="text-xs text-cyan-700 dark:text-cyan-300 font-semibold">
                  Ministry of DoNER • Logistics & Accessibility Command Intelligence
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              <div className="space-y-3">
                <p>
                  <strong className="text-slate-900 dark:text-white">NER-Saarthi</strong> is an integrated command and accessibility intelligence platform engineered specifically for the North Eastern Region of India under the Ministry of DoNER.
                </p>
                <p>
                  Its core purpose is to maintain resilient supply chain operations and essential transit accessibility across all 8 Northeast states, minimizing delivery delays and safeguarding mountain highway corridors against seasonal hazards.
                </p>
              </div>

              <div className="space-y-3">
                <p>
                  By unifying ground-level <strong>field officer intelligence</strong>, real-time <strong>route information</strong>, <strong>AI predictive analysis</strong>, and <strong>operational decision support</strong>, NER-Saarthi ensures swift incident response and strategic logistics coordination.
                </p>

                <div className="grid grid-cols-2 gap-2.5 pt-1 text-[11px] font-bold">
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] p-2.5 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>Field Intelligence</span>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] p-2.5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>Route Information</span>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] p-2.5 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>AI Predictive Analysis</span>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] p-2.5 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>Operational Insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Official Access Section */}
        <section id="official-access" className="py-12 border-t border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Access the NER-Saarthi Operations Portal
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
              Authorized personnel can access the operational command center using their registered credentials.
            </p>
            <div className="pt-2">
              <button 
                onClick={onLoginClick}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-6 py-3 text-xs font-extrabold text-[var(--text-on-action)] shadow-md transition hover:from-cyan-400 hover:to-blue-500 active:scale-95"
              >
                <span>Official Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Shared Footer */}
      <Footer onLoginClick={onLoginClick} />
    </div>
  );
};


