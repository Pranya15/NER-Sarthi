import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, Bell } from 'lucide-react';

export const SubscribePage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    disruptions: true,
    weather: true,
    landslides: true,
    logistics: false,
    emergency: true
  });
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill out all fields');
      return;
    }

    const subData = {
      name,
      email,
      preferences,
      subscribedAt: new Date().toISOString()
    };

    localStorage.setItem('ner_sarthi_subscription', JSON.stringify(subData));
    setSavedMessage('Subscription saved locally for this demo.');
    setTimeout(() => setSavedMessage(null), 5000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Subscribe to Regional Alert Updates</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Receive automated notifications regarding highway corridor blockades, weather alerts, & landslide warnings.
          </p>
        </div>

        {savedMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
            <span>{savedMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Full Name:</label>
            <input
              type="text"
              required
              placeholder="e.g. Officer Vikram Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900/90 text-[var(--text-primary)] dark:text-white text-xs py-2.5 px-3 rounded-xl border border-white/15 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Email Address:</label>
            <input
              type="email"
              required
              placeholder="officer@doner.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/90 text-[var(--text-primary)] dark:text-white text-xs py-2.5 px-3 rounded-xl border border-white/15 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="block text-xs font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
              Alert Subscriptions & Preferences:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
              <label className="flex items-center space-x-2 glass-card p-2.5 rounded-xl border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.disruptions}
                  onChange={(e) => setPreferences({ ...preferences, disruptions: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-cyan-400"
                />
                <span>Route Disruptions</span>
              </label>

              <label className="flex items-center space-x-2 glass-card p-2.5 rounded-xl border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.weather}
                  onChange={(e) => setPreferences({ ...preferences, weather: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-cyan-400"
                />
                <span>Monsoon & Heavy Weather</span>
              </label>

              <label className="flex items-center space-x-2 glass-card p-2.5 rounded-xl border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.landslides}
                  onChange={(e) => setPreferences({ ...preferences, landslides: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-cyan-400"
                />
                <span>Landslide & Terrain Hazards</span>
              </label>

              <label className="flex items-center space-x-2 glass-card p-2.5 rounded-xl border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emergency}
                  onChange={(e) => setPreferences({ ...preferences, emergency: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-cyan-400"
                />
                <span>Critical Red Alerts</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[var(--text-on-action)] font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-transform active:scale-[0.99]"
          >
            Save Subscription Preferences (Local Storage)
          </button>
        </form>

      </div>

    </div>
  );
};
