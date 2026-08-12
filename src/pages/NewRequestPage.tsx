import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { Check, Sparkles, Sliders, ShieldCheck, Plane, Hotel, Sun, MapPin, CreditCard } from 'lucide-react';

const suggestions = [
  'Plan a 5-day trip to Tokyo under ₹90,000',
  'Book a luxury hotel in Paris with breakfast',
  'Compare flight prices to London for next week',
  'Calculate travel budget for family trip to Goa',
  'Generate 3-day sight-seeing itinerary for Rome',
  'Find top-rated seafood restaurants in Barcelona',
];

interface AgentOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  desc: string;
  baseCost: number;
  iconBg: string;
  hoverColor: string;
}

const defaultAgents: AgentOption[] = [
  { 
    id: 'flight', 
    name: 'Flight AI', 
    icon: <Plane className="w-4 h-4 text-blue-600" />, 
    desc: 'Finds and books optimal flight routes.', 
    baseCost: 25, 
    iconBg: 'bg-blue-100 border border-blue-200',
    hoverColor: 'hover:border-blue-400 hover:shadow-blue-500/10'
  },
  { 
    id: 'hotel', 
    name: 'Hotel AI', 
    icon: <Hotel className="w-4 h-4 text-emerald-600" />, 
    desc: 'Searches and reserves accommodations.', 
    baseCost: 30, 
    iconBg: 'bg-emerald-100 border border-emerald-200',
    hoverColor: 'hover:border-emerald-400 hover:shadow-emerald-500/10'
  },
  { 
    id: 'weather', 
    name: 'Weather AI', 
    icon: <Sun className="w-4 h-4 text-amber-600" />, 
    desc: 'Provides real-time weather forecasts.', 
    baseCost: 10, 
    iconBg: 'bg-amber-100 border border-amber-200',
    hoverColor: 'hover:border-amber-400 hover:shadow-amber-500/10'
  },
  { 
    id: 'maps', 
    name: 'Maps AI', 
    icon: <MapPin className="w-4 h-4 text-rose-600" />, 
    desc: 'Calculates routes and distances.', 
    baseCost: 15, 
    iconBg: 'bg-rose-100 border border-rose-200',
    hoverColor: 'hover:border-rose-400 hover:shadow-rose-500/10'
  },
  { 
    id: 'finance', 
    name: 'Finance AI', 
    icon: <CreditCard className="w-4 h-4 text-purple-600" />, 
    desc: 'Handles budgets and secure payments.', 
    baseCost: 20, 
    iconBg: 'bg-purple-100 border border-purple-200',
    hoverColor: 'hover:border-purple-400 hover:shadow-purple-500/10'
  },
];

const NewRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showInfo, showWarning } = useToast();
  const [budget, setBudget] = useState(55000);
  const [requestText, setRequestText] = useState('');
  const [executionMode, setExecutionMode] = useState<'smart' | 'manual'>('smart');
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(defaultAgents.map(a => a.id));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Suggestion click
  const handleSuggestionClick = (suggestionText: string) => {
    setRequestText(suggestionText);
    showInfo(`Selected suggestion: "${suggestionText}"`);
  };

  // Execution mode toggle
  const handleModeSelect = (mode: 'smart' | 'manual') => {
    setExecutionMode(mode);
    if (mode === 'smart') {
      setSelectedAgentIds(defaultAgents.map(a => a.id));
      showInfo('Smart Routing enabled: All optimal AI agents auto-selected.');
    } else {
      showInfo('Manual Selection enabled: Customise your agent workflow.');
    }
  };

  // Toggle individual agent
  const handleAgentToggle = (id: string) => {
    if (executionMode === 'smart') {
      setExecutionMode('manual');
      showInfo('Switched to Manual Selection mode.');
    }

    setSelectedAgentIds(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) {
          showWarning('At least 1 AI agent must be selected for routing.');
          return prev;
        }
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Dynamic calculations for request summary
  const activeAgentsCount = selectedAgentIds.length;
  const estMinCost = activeAgentsCount * 12;
  const estMaxCost = activeAgentsCount * 24;
  const estTimeMin = Math.max(2, Math.round(activeAgentsCount * 0.8));
  const estTimeMax = Math.max(4, Math.round(activeAgentsCount * 1.6));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) {
      showWarning('Please enter a request description or pick a suggestion first.');
      return;
    }
    if (selectedAgentIds.length === 0) {
      showWarning('Please select at least 1 AI agent.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showSuccess(`Request created successfully! ${activeAgentsCount} AI Agents dispatched atomically.`);
      navigate('/dashboard/tasks');
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10">
        
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-[24px] md:text-[32px] font-bold font-display text-navy leading-tight">Create New Request</h1>
          <p className="text-[13.5px] md:text-[15px] text-slate-500 mt-1">
            Describe what you need and AI Router will automatically coordinate the best AI agents to complete your request.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-6">
          
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            
            {/* 1. Request Description */}
            <div className="bg-white rounded-[24px] p-5 sm:p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:border-purple-300 hover:shadow-purple-500/10 hover:-translate-y-0.5">
              <div className="flex justify-between items-center mb-3.5">
                <h3 className="text-[16px] font-bold text-navy">1. Request Description</h3>
                <span className="text-[11px] font-semibold text-slate-400">Click suggestions below</span>
              </div>
              <textarea
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                className="w-full h-[140px] bg-slate-50 border border-slate-200 rounded-[16px] p-4 sm:p-5 text-[14px] text-ink focus:outline-none focus:border-purple-500 focus:bg-white transition-all resize-none placeholder-slate-400 shadow-xs"
                placeholder={'Example:\nPlan a 5-day trip to Japan under ₹80,000 including flights, hotels, local transport, restaurants and weather updates.'}
              ></textarea>

              <div className="mt-4">
                <div className="text-[12px] font-semibold text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Popular Prompts & Suggestions:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map(s => {
                    const isSelected = requestText === s;
                    return (
                      <button
                        type="button"
                        key={s} 
                        onClick={() => handleSuggestionClick(s)}
                        className={`px-3.5 py-1.5 text-[12px] font-medium rounded-full cursor-pointer transition-all duration-200 border text-left active:scale-95 ${
                          isSelected 
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm font-semibold' 
                            : 'bg-purple-50/70 text-purple-700 border-purple-100 hover:bg-purple-600 hover:text-white hover:border-purple-600'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button directly after Request Description Selection */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[12.5px] text-slate-500 font-medium">
                  {requestText ? (
                    <span className="text-purple-700 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-purple-600" /> 
                      <span>Ready: "{requestText.length > 40 ? requestText.slice(0, 40) + '...' : requestText}"</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">Select a prompt or type your request description above</span>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-[14px] font-bold transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2 shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Dispatching Agents...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2. Execution Mode */}
            <div className="bg-white rounded-[24px] p-5 sm:p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:border-blue-300 hover:shadow-blue-500/10 hover:-translate-y-0.5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[16px] font-bold text-navy">2. Execution Mode</h3>
                <span className="text-[12px] font-bold text-blue-brand capitalize">{executionMode} Mode Active</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Smart Routing Option */}
                <div 
                  onClick={() => handleModeSelect('smart')}
                  className={`rounded-[16px] p-5 cursor-pointer relative transition-all duration-300 border-[2px] ${
                    executionMode === 'smart' 
                      ? 'border-blue-brand bg-sky/30 shadow-sm' 
                      : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-md'
                  }`}
                >
                  <div className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    executionMode === 'smart' ? 'bg-blue-brand text-white' : 'border border-slate-300 bg-white'
                  }`}>
                    {executionMode === 'smart' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <h4 className="text-[14px] font-bold text-navy mb-1 pr-6 flex items-center gap-1.5">
                    <span>Smart Routing</span> 
                    <span className="text-[10px] font-bold text-blue-brand bg-sky px-2 py-0.5 rounded-full">Recommended</span>
                  </h4>
                  <p className="text-[12.5px] text-slate-500 leading-snug">Automatically selects and chains optimal AI agents based on task complexity.</p>
                </div>
                
                {/* Manual Selection Option */}
                <div 
                  onClick={() => handleModeSelect('manual')}
                  className={`rounded-[16px] p-5 cursor-pointer relative transition-all duration-300 border-[2px] ${
                    executionMode === 'manual' 
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' 
                      : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 hover:shadow-md'
                  }`}
                >
                  <div className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    executionMode === 'manual' ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white'
                  }`}>
                    {executionMode === 'manual' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <h4 className="text-[14px] font-bold text-navy mb-1 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Manual Selection</span>
                  </h4>
                  <p className="text-[12.5px] text-slate-500 leading-snug">Handpick specific agents and customize individual AI routing parameters.</p>
                </div>

              </div>
            </div>

            {/* 3. Budget */}
            <div className="bg-white rounded-[24px] p-5 sm:p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:border-emerald-300 hover:shadow-emerald-500/10 hover:-translate-y-0.5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[16px] font-bold text-navy">3. Budget Limit</h3>
                <div className="text-[18px] font-display font-bold text-emerald-600 bg-[#E3FBF5] px-3.5 py-1 rounded-xl border border-emerald-200">
                  ₹{budget.toLocaleString()}
                </div>
              </div>
              
              <div className="relative pt-2 pb-2">
                <input 
                  type="range" 
                  min="10000" 
                  max="100000" 
                  step="1000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-500 outline-none"
                />
                <div className="flex justify-between items-center mt-3 text-[12px] font-medium text-slate-400">
                  <span>₹10,000</span>
                  <span>₹50,000</span>
                  <span>₹100,000</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-brand hover:bg-blue-dark text-white rounded-full py-4 text-[15px] font-bold transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] mt-1 cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Dispatching AI Agents...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create & Execute Request</span>
                </>
              )}
            </button>

          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            
            {/* Card 1: Selected AI Agents */}
            <div className="bg-white rounded-[24px] p-5 sm:p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:border-amber-300 hover:shadow-amber-500/10 hover:-translate-y-0.5">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[16px] font-bold text-navy">AI Agents Selection</h3>
                <span className="text-[11px] font-bold bg-blue-50 text-blue-brand px-2.5 py-0.5 rounded-full border border-blue-100">
                  {activeAgentsCount} / {defaultAgents.length} Active
                </span>
              </div>

              <p className="text-[12px] text-slate-400 mb-4">Click any agent below to toggle inclusion in this request workflow:</p>

              <div className="flex flex-col gap-3">
                {defaultAgents.map((agent) => {
                  const isChecked = selectedAgentIds.includes(agent.id);
                  return (
                    <div 
                      key={agent.id} 
                      onClick={() => handleAgentToggle(agent.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-[16px] border cursor-pointer transition-all duration-300 ${agent.hoverColor} ${
                        isChecked 
                          ? 'bg-blue-50/40 border-blue-200/80 hover:bg-blue-50/70 shadow-xs' 
                          : 'bg-slate-50/60 border-slate-200/60 opacity-60 hover:opacity-100 hover:bg-white'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${agent.iconBg}`}>
                        {agent.icon}
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-[13.5px] font-bold text-navy flex items-center gap-1.5">
                            <span>{agent.name}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide transition-colors ${
                            isChecked 
                              ? 'bg-[#E3FBF5] text-[#0E7D69] border border-emerald-200' 
                              : 'bg-slate-200 text-slate-500'
                          }`}>
                            {isChecked ? 'Selected' : 'Excluded'}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-slate-500 leading-snug">{agent.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Request Summary */}
            <div className="bg-white rounded-[24px] p-5 sm:p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:border-cyan-300 hover:shadow-cyan-500/10 hover:-translate-y-0.5">
              <h3 className="text-[16px] font-bold text-navy mb-5">Request Summary</h3>
              
              <div className="flex flex-col gap-3.5 mb-6">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Execution Mode</span>
                  <span className="font-bold text-navy capitalize">{executionMode === 'smart' ? 'Smart Routing' : 'Manual Selection'}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Estimated Micro-Cost</span>
                  <span className="font-bold text-navy">₹{estMinCost} - ₹{estMaxCost}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Estimated Latency</span>
                  <span className="font-bold text-navy">{estTimeMin} - {estTimeMax} seconds</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Agents Selected</span>
                  <span className="font-bold text-blue-brand bg-sky px-2 py-0.5 rounded-md">{activeAgentsCount} Agents</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Budget Limit</span>
                  <span className="font-bold text-navy">₹{budget.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-200">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Security & Settlement</div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <div className="text-[13px] font-bold text-navy">x402 Trustless Escrow</div>
                </div>
                <div className="text-[12px] text-slate-500 pl-6 leading-relaxed">
                  Settled natively on Algorand with 100% atomic rollback safety.
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewRequestPage;


