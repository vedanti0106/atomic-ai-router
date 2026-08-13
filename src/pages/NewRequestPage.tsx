import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const suggestions = [
  'Plan a trip',
  'Book a hotel',
  'Compare flights',
  'Budget planning',
  'Travel itinerary',
  'Restaurant suggestions',
];

const agents = [
  { name: 'Flight AI', icon: '✈', desc: 'Finds and books optimal flight routes.' },
  { name: 'Hotel AI', icon: '🛏', desc: 'Searches and reserves accommodations.' },
  { name: 'Weather AI', icon: '☀', desc: 'Provides real-time weather forecasts.' },
  { name: 'Maps AI', icon: '🗺', desc: 'Calculates routes and distances.' },
  { name: 'Finance AI', icon: '💳', desc: 'Handles budgets and secure payments.' },
];

const NewRequestPage: React.FC = () => {
  const [budget, setBudget] = useState(55000);
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [simulationOutcome, setSimulationOutcome] = useState<'SUCCESS' | 'ROLLED_BACK'>('SUCCESS');

  const { refreshUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSuggestionClick = (s: string) => {
    setGoal(prev => prev ? `${prev} and ${s.toLowerCase()}` : `I want to ${s.toLowerCase()}`);
  };

  const handleCreateRequest = async () => {
    if (!goal.trim()) {
      showError('Please describe your request.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: goal,
          outcome: simulationOutcome,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create task');
      }

      showSuccess(`Task launched successfully! Task ID: ${data.taskId}`);
      setGoal('');
      
      // Refresh user balance in header
      await refreshUser();
      
      setTimeout(() => {
        navigate('/dashboard/tasks');
      }, 1500);

    } catch (err: any) {
      showError(err.message || 'Failed to connect to Hono backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[24px] md:text-[32px] font-bold font-display text-navy leading-tight">Create New Request</h1>
          <p className="text-[14px] md:text-[15px] text-slate-500 mt-1">
            Describe what you need and AI Router will automatically coordinate the best AI agents to complete your request.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-6">
          
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            
            {/* 1. Request Description */}
            <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
              <h3 className="text-[16px] font-bold text-navy mb-4">1. Request Description</h3>


              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full h-[140px] bg-slate-50 border border-line rounded-[16px] p-5 text-[14px] text-ink focus:outline-none focus:border-blue-brand focus:bg-white transition-colors resize-none placeholder-slate-400"
                placeholder={'Example:\nPlan a 5-day trip to Japan under ₹80,000 including flights, hotels, local transport, restaurants and weather updates.'}
              ></textarea>
              <div className="flex flex-wrap gap-2 mt-4">
                {suggestions.map(s => (
                  <span 
                    key={s} 
                    onClick={() => handleSuggestionClick(s)}
                    className="px-3 py-1.5 bg-sky text-blue-brand text-[12px] font-medium rounded-full cursor-pointer hover:bg-blue-brand hover:text-white transition-colors border border-transparent"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>


            {/* 2. Execution Mode */}
            <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
              <h3 className="text-[16px] font-bold text-navy mb-4">2. Execution Mode</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="border-[2px] border-blue-brand bg-sky/30 rounded-[16px] p-5 cursor-pointer relative">
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-blue-brand flex items-center justify-center text-white">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h4 className="text-[14px] font-bold text-navy mb-1 pr-6">Smart Routing <span className="text-[11px] font-semibold text-blue-brand bg-sky px-2 py-0.5 rounded-full ml-1">Recommended</span></h4>
                  <p className="text-[12.5px] text-slate-500">Automatically selects the best AI agents.</p>
                </div>
                
                <div className="border border-line bg-white rounded-[16px] p-5 cursor-pointer hover:border-slate-300 transition-colors">
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center"></div>
                  <h4 className="text-[14px] font-bold text-navy mb-1">Manual Selection</h4>
                  <p className="text-[12.5px] text-slate-500">Choose agents yourself.</p>
                </div>
              </div>
            </div>

            {/* 3. Budget */}
            <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[16px] font-bold text-navy">3. Budget</h3>
                <div className="text-[18px] font-display font-bold text-blue-brand">
                  ₹{budget.toLocaleString()}
                </div>
              </div>
              
              <div className="relative pt-2 pb-6">
                <input 
                  type="range" 
                  min="10000" 
                  max="100000" 
                  step="1000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-1.5 bg-line rounded-full appearance-none cursor-pointer accent-blue-brand outline-none"
                />
                <div className="flex justify-between items-center mt-3 text-[12px] font-medium text-slate-400">
                  <span>₹10K</span>
                  <span>₹1L</span>
                </div>
              </div>
            </div>
            
            {/* 4. Simulation Outcome */}
            <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
              <h3 className="text-[16px] font-bold text-navy mb-4">4. Simulation Outcome</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div 
                  onClick={() => setSimulationOutcome('SUCCESS')}
                  className={`border-[2px] rounded-[16px] p-5 cursor-pointer relative transition-all ${
                    simulationOutcome === 'SUCCESS' 
                      ? 'border-blue-brand bg-sky/30' 
                      : 'border-line bg-white hover:border-slate-300'
                  }`}
                >
                  {simulationOutcome === 'SUCCESS' && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-blue-brand flex items-center justify-center text-white">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                  <h4 className="text-[14px] font-bold text-navy mb-1 pr-6">Outcome A: Success</h4>
                  <p className="text-[12.5px] text-slate-500">Simulate successful execution across all agents. Escrow is released.</p>
                </div>
                
                <div 
                  onClick={() => setSimulationOutcome('ROLLED_BACK')}
                  className={`border-[2px] rounded-[16px] p-5 cursor-pointer relative transition-all ${
                    simulationOutcome === 'ROLLED_BACK' 
                      ? 'border-blue-brand bg-sky/30' 
                      : 'border-line bg-white hover:border-slate-300'
                  }`}
                >
                  {simulationOutcome === 'ROLLED_BACK' && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-blue-brand flex items-center justify-center text-white">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                  <h4 className="text-[14px] font-bold text-navy mb-1 pr-6">Outcome B: Rollback</h4>
                  <p className="text-[12.5px] text-slate-500">Simulate sub-agent failure. Escrow triggers refund of all transactions.</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleCreateRequest}
              disabled={loading}
              className="w-full bg-blue-brand hover:bg-blue-dark text-white rounded-full py-4 text-[15px] font-bold transition-colors shadow-md mt-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Processing Atomic Request...' : 'Create Request'}
            </button>


          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            
            {/* Card 1: Selected AI Agents */}
            <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
              <h3 className="text-[16px] font-bold text-navy mb-5">Selected AI Agents</h3>
              <div className="flex flex-col gap-4">
                {agents.map((agent) => (
                  <div key={agent.name} className="flex items-start gap-3 border-b border-line pb-4 last:border-b-0 last:pb-0">
                    <div className="w-9 h-9 rounded-full bg-sky flex items-center justify-center text-[16px] text-blue-brand shrink-0">
                      {agent.icon}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-[14px] font-bold text-navy">{agent.name}</div>
                        <span className="text-[10px] font-bold text-[#0E7D69] bg-[#E3FBF5] px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Available
                        </span>
                      </div>
                      <p className="text-[12px] text-slate-500 leading-snug">{agent.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Request Summary */}
            <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
              <h3 className="text-[16px] font-bold text-navy mb-5">Request Summary</h3>
              
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Execution Mode</span>
                  <span className="font-bold text-navy">Smart Routing</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Estimated Cost</span>
                  <span className="font-bold text-navy">₹45 - ₹120</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Estimated Time</span>
                  <span className="font-bold text-navy">4 - 8 seconds</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Agents Selected</span>
                  <span className="font-bold text-navy">5</span>
                </div>
              </div>

              <div className="pt-5 border-t border-line">
                <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Security</div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="text-[16px]">🔒</div>
                  <div className="text-[13px] font-bold text-navy">x402 Secure Payments</div>
                </div>
                <div className="flex items-center gap-2 pl-6">
                  <div className="text-[12px] text-slate-500">Powered by Algorand</div>
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
