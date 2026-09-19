import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTimeFriendly } from '../../utils/timeUtils';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Minimize2,
  Trash2,
  Navigation,
  Activity,
  ShieldAlert,
  Zap,
  HelpCircle,
  Truck,
  Sun,
  Moon,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  options?: { label: string; query: string }[];
}

const INITIAL_SUGGESTIONS = [
  'What is NER-Sarthi?',
  'Check high-risk routes',
  'Run Landslide Simulation',
  'Go to Route Intelligence',
  'Show active shipments',
  'Toggle dark/light theme'
];

export const AIChatbot: React.FC = () => {
  const {
    routes,
    vehicles,
    officers,
    disruptions,
    kpiStats,
    theme,
    toggleTheme,
    setActiveTab,
    simulateLandslide,
    simulateHeavyRain,
    simulateVehicleDelay,
    clearRoute,
    showToast
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: '👋 Hello! I am **Sarthi AI**, your intelligent assistant for North Eastern Railway & Corridor Intelligence.',
      timestamp: new Date().toISOString(),
      options: [
        { label: '📊 System Summary', query: 'What is NER-Sarthi?' },
        { label: '⚠️ High-Risk Routes', query: 'Check high-risk routes' },
        { label: '🔴 Run Landslide Demo', query: 'Run Landslide Simulation' }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnread(false);
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay for natural conversational experience
    setTimeout(() => {
      const response = processUserQuery(text);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  const clearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: '🧹 Chat history reset. How else can I help you navigate or analyze NER-Sarthi?',
        timestamp: new Date().toISOString(),
        options: [
          { label: '📊 System Summary', query: 'What is NER-Sarthi?' },
          { label: '⚠️ High-Risk Routes', query: 'Check high-risk routes' }
        ]
      }
    ]);
  };

  const processUserQuery = (query: string): ChatMessage => {
    const lower = query.toLowerCase();
    const timeStr = new Date().toISOString();

    // 1. Theme Toggling
    if (lower.includes('theme') || lower.includes('dark') || lower.includes('light') || lower.includes('mode')) {
      toggleTheme();
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🎨 Theme switched! Current mode is **${theme === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}**.`,
        timestamp: timeStr
      };
    }

    // 2. Landslide Simulation
    if (lower.includes('landslide') || lower.includes('block') || lower.includes('mudslide')) {
      simulateLandslide('R-001');
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🔴 **Landslide Simulation Triggered!**\nGuwahati – Shillong Corridor (R-001) is now blocked. Risk elevated to **94%**. Live alert pushed to disruption feed.',
        timestamp: timeStr,
        action: {
          label: 'View Blocked Route on Map',
          onClick: () => setActiveTab('routes')
        }
      };
    }

    // 3. Heavy Rain Simulation
    if (lower.includes('rain') || lower.includes('monsoon') || lower.includes('downpour')) {
      simulateHeavyRain('R-002');
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🟡 **Heavy Rain Simulation Triggered!**\nTezpur Highway (R-002) weather set to severe rainfall. Visibility reduced to 2.8km.',
        timestamp: timeStr,
        action: {
          label: 'Open Route Intelligence',
          onClick: () => setActiveTab('routes')
        }
      };
    }

    // 4. Vehicle Delay Simulation
    if (lower.includes('delay') || lower.includes('slow') || lower.includes('vehicle delay')) {
      simulateVehicleDelay('V-001');
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🚚 **Vehicle Delay Simulated!**\nVehicle V-001 marked delayed on Guwahati-Shillong Corridor due to steep terrain slowdown.',
        timestamp: timeStr,
        action: {
          label: 'Check Logistics Planner',
          onClick: () => setActiveTab('logistics')
        }
      };
    }

    // 5. Clear Route Simulation
    if (lower.includes('clear') || lower.includes('restore') || lower.includes('unblock')) {
      clearRoute('R-001');
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '✅ **Corridor Cleared!**\nGuwahati – Shillong Corridor (R-001) status restored to CLEAR. All associated shipments resumed normal ETA.',
        timestamp: timeStr,
        action: {
          label: 'Inspect Live Map',
          onClick: () => setActiveTab('dashboard')
        }
      };
    }

    // 6. Navigation Intents
    if (lower.includes('analytics') || lower.includes('chart') || lower.includes('graph') || lower.includes('report')) {
      setActiveTab('analytics');
      showToast('📊 Navigated to Analytics Page');
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '📈 Navigated you to **Analytics Page**. Here you can view historical risk trends, weather correlations, and corridor performance metrics.',
        timestamp: timeStr
      };
    }

    if (lower.includes('route') || lower.includes('corridor') || lower.includes('risk score')) {
      setActiveTab('routes');
      showToast('🗺️ Navigated to Route Intelligence');
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🗺️ Switched to **Route Intelligence**. There are **${routes.filter(r => r.risk >= 50).length} high-risk routes** currently being monitored.`,
        timestamp: timeStr,
        action: {
          label: 'View High Risk Corridors',
          onClick: () => setActiveTab('routes')
        }
      };
    }

    if (lower.includes('logistics') || lower.includes('vehicle') || lower.includes('truck') || lower.includes('shipment')) {
      setActiveTab('logistics');
      showToast('🚚 Navigated to Logistics Planner');
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🚚 Switched to **Logistics Planner**.\n- **Active Shipments:** ${kpiStats.activeShipments}\n- **Delayed Shipments:** ${kpiStats.delayedShipments}\n- **Avg Time Saved:** ${kpiStats.avgTimeSaved}`,
        timestamp: timeStr
      };
    }

    if (lower.includes('officer') || lower.includes('personnel') || lower.includes('staff') || lower.includes('field')) {
      setActiveTab('officers');
      showToast('👮 Navigated to Officers Roster');
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `👮 Switched to **Field Officers Roster**. Currently **${officers.length} officers** are stationed along critical NER electrification sectors.`,
        timestamp: timeStr
      };
    }

    if (lower.includes('about') || lower.includes('project') || lower.includes('what is ner') || lower.includes('sarthi')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'ℹ️ **NER-Sarthi** is an AI-powered North Eastern Railway Electrification & Logistics Intelligence system. It provides real-time landslide predictions, weather risk monitoring, automated rerouting, and field officer dispatching.',
        timestamp: timeStr
      };
    }

    if (lower.includes('dashboard') || lower.includes('home') || lower.includes('main')) {
      setActiveTab('dashboard');
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🏠 Returned to **Main Dashboard**. You can see live map polylines, KPI cards, and active disruption feeds here.',
        timestamp: timeStr
      };
    }

    // 7. System & Risk Queries
    if (lower.includes('high risk') || lower.includes('danger') || lower.includes('risk')) {
      const highRisk = routes.filter(r => r.risk >= 50);
      const listStr = highRisk.map(r => `• **${r.name}** (Risk: ${r.risk}%, Status: ${r.status.toUpperCase()})`).join('\n');

      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `⚠️ **Current High-Risk Routes (${highRisk.length}):**\n${listStr}\n\nWould you like to trigger a simulation or reroute?`,
        timestamp: timeStr,
        action: {
          label: 'Go to Route Intelligence',
          onClick: () => setActiveTab('routes')
        }
      };
    }

    if (lower.includes('alert') || lower.includes('disruption') || lower.includes('warning')) {
      const latestAlerts = disruptions.slice(0, 3);
      const alertStr = latestAlerts.map(a => `• **[${a.severity.toUpperCase()}]** ${a.title} - ${a.description}`).join('\n');
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🚨 **Top Disruption Alerts:**\n${alertStr}`,
        timestamp: timeStr,
        action: {
          label: 'View All Disruption Feeds',
          onClick: () => setActiveTab('dashboard')
        }
      };
    }

    if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('help')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '👋 Hello! I can help you with:\n1️⃣ Navigating to any page (Routes, Analytics, Logistics, Officers)\n2️⃣ Checking live high-risk routes and disruption feeds\n3️⃣ Running demo simulations (Landslide, Rain, Vehicle Delay)\n4️⃣ Explaining NER-Sarthi features',
        timestamp: timeStr,
        options: [
          { label: '🗺️ Route Intelligence', query: 'Go to Route Intelligence' },
          { label: '📊 System Analytics', query: 'Go to Analytics' },
          { label: '🔴 Landslide Demo', query: 'Run Landslide Simulation' }
        ]
      };
    }

    // Fallback response with suggested questions
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `I'm here to help! I can control the website or give you live data. Here are some quick things you can ask me:`,
      timestamp: timeStr,
      options: [
        { label: '📊 What is NER-Sarthi?', query: 'What is NER-Sarthi?' },
        { label: '⚠️ Check High-Risk Routes', query: 'Check high-risk routes' },
        { label: '🔴 Simulate Landslide', query: 'Run Landslide Simulation' },
        { label: '📈 Go to Analytics', query: 'Go to Analytics' }
      ]
    };
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!isOpen && unread && (
          <div className="mb-2 px-3 py-1.5 rounded-full bg-cyan-500 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-500/30 animate-bounce flex items-center gap-1.5 border border-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Need help? Ask Sarthi AI!</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center ${
            isOpen
              ? 'bg-rose-600 hover:bg-rose-500 text-[var(--text-on-action)] ring-4 ring-rose-500/30'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-[var(--text-on-action)] ring-4 ring-cyan-500/30'
          }`}
          aria-label="Toggle Sarthi AI Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200 rotate-90 group-hover:rotate-0" />
          ) : (
            <>
              <Bot className="w-7 h-7 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
            </>
          )}
        </button>
      </div>

      {/* Chat Pop-up Window */}
      {isOpen && (
        <div className="theme-dark-surface fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[80vh] z-50 flex flex-col rounded-2xl shadow-2xl border transition-all duration-300 overflow-hidden backdrop-blur-xl bg-slate-900/95 border-slate-800 text-slate-100 dark:bg-slate-950/95 dark:border-slate-800">
          
          {/* Header */}
          <div className="theme-dark-surface p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-[var(--text-on-action)] shadow-md shadow-cyan-500/20">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-100 tracking-wide">Sarthi AI Assistant</h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    Live
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Website & Operations Guide</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearHistory}
                title="Clear Chat"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Suggestion Chips Bar */}
          <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {INITIAL_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 border border-slate-700/60 transition-all duration-200"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm bg-slate-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-[var(--text-on-action)] rounded-br-none'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
                    }`}
                  >
                    {msg.text.split('\n').map((line, lIdx) => (
                      <p key={lIdx} className={lIdx > 0 ? 'mt-1.5' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Optional Action Button inside Bot Message */}
                  {msg.action && (
                    <button
                      onClick={msg.action.onClick}
                      className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-between transition-all group"
                    >
                      <span>{msg.action.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}

                  {/* Options Chips inside Bot Message */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleSend(opt.query)}
                          className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-blue-600/30 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-colors"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`block text-[10px] text-slate-500 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTimeFriendly(msg.timestamp)}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-[var(--text-on-action)] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    You
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                <div className="w-7 h-7 rounded-lg bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-150" />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-300" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Sarthi AI or request an action..."
              className="flex-1 bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 placeholder-slate-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-[var(--text-on-action)] font-medium hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
