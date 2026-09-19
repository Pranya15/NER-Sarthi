import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  SUPPORTED_LANGUAGES, 
  STATE_TO_LANGUAGES, 
  LanguageCode, 
  getUIText 
} from '../../data/translations';
import { Globe, ChevronDown, Check, Sparkles } from 'lucide-react';

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { currentLanguage, setCurrentLanguage, selectedRoute, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  // Derive suggested languages from currently selected route's sector/state
  const currentSector = selectedRoute?.sector || '';
  let suggestedCodes: LanguageCode[] = [];
  let suggestedStateName = '';

  for (const [stateName, langCodes] of Object.entries(STATE_TO_LANGUAGES)) {
    if (currentSector.toLowerCase().includes(stateName.toLowerCase()) || 
        selectedRoute?.origin.toLowerCase().includes(stateName.toLowerCase()) ||
        selectedRoute?.destination.toLowerCase().includes(stateName.toLowerCase())) {
      suggestedCodes = langCodes.filter(c => c !== 'en');
      suggestedStateName = stateName;
      break;
    }
  }

  const handleSelectLanguage = (code: LanguageCode) => {
    setCurrentLanguage(code);
    const selected = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (selected) {
      showToast(`🌐 Language changed to ${selected.name} (${selected.nativeName})`);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 text-xs font-semibold ${
          isOpen
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-800 dark:text-cyan-300 shadow-md shadow-cyan-500/20'
            : 'bg-[var(--bg-card)] dark:bg-black/60 border-[var(--border-default)] dark:border-white/15 text-[var(--text-secondary)] dark:text-slate-200 hover:text-cyan-700 dark:hover:text-white hover:border-cyan-500/40'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Select Regional Language for Alerts"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-300 shrink-0" />
        {!compact && (
          <span className="hidden xl:inline-block text-[11px] text-[var(--text-muted)] dark:text-slate-400">
            {getUIText('language', currentLanguage)}:
          </span>
        )}
        <span className="flex items-center space-x-1 text-[var(--text-primary)] dark:text-white font-bold">
          <span>{currentLangInfo.flag}</span>
          <span className="max-w-[80px] sm:max-w-none truncate">{currentLangInfo.name}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 max-h-[460px] overflow-y-auto rounded-2xl bg-[var(--bg-dropdown)] dark:bg-black/95 backdrop-blur-2xl border border-[var(--border-default)] dark:border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.6)] z-[3000] p-2 space-y-1 font-sans text-xs text-[var(--text-primary)]">
          
          {/* Header strip */}
          <div className="px-3 py-2 border-b border-[var(--border-subtle)] dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[var(--text-secondary)] dark:text-slate-300">
              <Globe className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-300" />
              <span>Regional Languages (14 Supported)</span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] dark:text-slate-500 font-mono">Auto-Alert Sync</span>
          </div>

          {/* Region Smart Suggestion Banner if available */}
          {suggestedCodes.length > 0 && (
            <div className="p-2 mx-1 my-1 rounded-xl bg-cyan-500/10 border border-cyan-500/25 space-y-1">
              <div className="flex items-center space-x-1 text-[10px] font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-cyan-700 dark:text-cyan-300 animate-pulse" />
                <span>Suggested for {suggestedStateName}</span>
              </div>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {suggestedCodes.map(code => {
                  const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
                  if (!lang) return null;
                  return (
                    <button
                      key={code}
                      onClick={() => handleSelectLanguage(code)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors ${
                        currentLanguage === code
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-[var(--bg-card-subtle)] dark:bg-slate-900/90 hover:bg-cyan-500/20 text-cyan-800 dark:text-cyan-200 border-cyan-500/30'
                      }`}
                    >
                      {lang.flag} {lang.name} ({lang.nativeName})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Languages List */}
          <div className="space-y-0.5 py-1">
            {SUPPORTED_LANGUAGES.map(lang => {
              const isSelected = currentLanguage === lang.code;
              const isSuggested = suggestedCodes.includes(lang.code);

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 text-left ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/40 text-[var(--text-primary)] dark:text-white shadow-sm'
                      : 'hover:bg-[var(--bg-card-hover)] dark:hover:bg-white/5 text-[var(--text-secondary)] dark:text-slate-300 hover:text-[var(--text-primary)] dark:hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="text-base shrink-0">{lang.flag}</span>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs truncate text-[var(--text-primary)] dark:text-white">{lang.name}</span>
                        {isSuggested && (
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                            REGIONAL
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] dark:text-slate-400 font-medium truncate">
                        {lang.nativeName} • <span className="text-[var(--text-muted)] dark:text-slate-500">{lang.state}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 ml-2">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="px-3 py-1.5 border-t border-[var(--border-subtle)] dark:border-white/10 text-[10px] text-[var(--text-muted)] dark:text-slate-500 text-center">
            Emergency alerts automatically render in chosen script
          </div>

        </div>
      )}

    </div>
  );
};
