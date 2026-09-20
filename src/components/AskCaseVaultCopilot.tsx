import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  FileText,
  Shield,
  Globe,
  CornerDownLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { queryInvestigationCopilot, CopilotQueryResponse } from '../services/aiIntelligence';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  timestamp: string;
}

export const AskCaseVaultCopilot: React.FC = () => {
  const { currentUser } = useSecurity();
  const userRole = currentUser?.role || 'INVESTIGATOR';

  const [language, setLanguage] = useState<'en' | 'ta' | 'hi'>('en');
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Greetings, ${currentUser?.name || 'Officer'}. I am your CASE VAULT AI Investigation Copilot. I analyze authorized evidentiary dockets, detect timeline contradictions, track seized artifacts, and verify cross-case entity overlaps while strictly enforcing Need-To-Know statutory clearance. How may I assist your inquiry today?`,
      sources: ['CASE-1024 Evidence Vault', 'Adaptive Security Ledger'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    'Summarize CASE-1024',
    'What evidence is connected to Ravi Kumar?',
    'What documents mention EV-2048?',
    'Which documents have possible contradictions?',
    'What information is missing?',
    'What changed between version 1 and version 2?',
    'Show potential cross-case connections',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Query copilot engine
    setTimeout(() => {
      const response: CopilotQueryResponse = queryInvestigationCopilot(query, userRole, language);
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        sources: response.sourceReferences,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold font-display text-white tracking-wide">
                ASK CASE VAULT — AI INVESTIGATION COPILOT
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono-code mt-1.5 max-w-2xl">
              Role-aware legal and digital evidence intelligence assistant. Delivers cited factual answers,
              cross-case inferences, and discrepancy warnings exclusively from authorized dockets.
            </p>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <Globe className="w-4 h-4 text-cyan-400 ml-1.5" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono-code font-bold transition ${
                language === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono-code font-bold transition ${
                language === 'ta' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ் (Tamil)
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono-code font-bold transition ${
                language === 'hi' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
        <span className="text-xs font-mono-code text-slate-500 shrink-0 uppercase font-bold">
          Quick Inquiries:
        </span>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 text-slate-300 text-xs font-mono-code shrink-0 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 min-h-[460px] max-h-[560px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 font-mono-code text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-[10px] text-slate-400">
                  <span className="font-bold">
                    {msg.sender === 'user' ? currentUser?.name : 'CASE VAULT INTELLIGENCE'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                    <span className="font-bold uppercase text-slate-500 flex items-center space-x-1">
                      <BookOpen className="w-3 h-3 text-cyan-400" />
                      <span>Evidentiary Source Citations:</span>
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {msg.sources.map((src, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center space-x-3">
          <input
            type="text"
            placeholder={`Ask anything about CASE-1024, entities, ballistics, or version history (${userRole} scope)...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white disabled:text-slate-600 transition shadow-lg shadow-cyan-950/40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
