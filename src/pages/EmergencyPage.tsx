import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useToast } from '../context/ToastContext';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const emergencyTemplates = [
  'Find available ICU beds near my location',
  'Locate O-negative blood supply in Pune',
  'Emergency medical response: ICU bed and blood supply',
  'Disaster response: Multiple ICU beds required'
];

const EmergencyPage: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [location, setLocation] = useState('Pune City Center');
  const [selectedBloodType, setSelectedBloodType] = useState('O-');
  const [requestType, setRequestType] = useState<'icu' | 'blood' | 'both'>('both');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Build request text based on selections
      let requestText = '';
      if (requestType === 'icu' || requestType === 'both') {
        requestText += `Find available ICU beds `;
      }
      if (requestType === 'blood' || requestType === 'both') {
        requestText += `and ${selectedBloodType} blood supply `;
      }
      requestText += `near ${location} right now`;
      
      // In a real implementation, this would call the backend API
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showSuccess(`Emergency request dispatched: ${requestText}`);
      
      // Simulate results
      setTimeout(() => {
        showSuccess('Found 5 hospitals with ICU beds and 3 blood banks with O- blood');
      }, 500);
      
    } catch (error) {
      showError('Failed to process emergency request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10">
        
        {/* Emergency Header with Red Theme */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              🚑
            </div>
            <h1 className="text-[24px] md:text-[32px] font-bold font-display text-red-700 leading-tight">
              Emergency Response Router
            </h1>
          </div>
          <p className="text-[14px] md:text-[15px] text-slate-600">
            <span className="font-semibold text-red-600">Same infrastructure, new domain:</span> 
            {' '}Coordinate emergency medical resources using the exact same Router, Escrow, and Reputation system.
          </p>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <span className="font-bold">Demo for judges:</span> "Find an available ICU bed and O-negative blood near Pune City Center right now"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-6">
          
          {/* Left Column: Emergency Request Form */}
          <div className="flex flex-col gap-6">
            
            {/* 1. Emergency Type Selection */}
            <div className="bg-white rounded-[24px] p-7 border border-red-200 shadow-[0_4px_24px_rgba(220,38,38,0.05)]">
              <h3 className="text-[16px] font-bold text-red-700 mb-4 flex items-center gap-2">
                <span className="text-red-500">⚠</span> 1. Emergency Resources Needed
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'icu', label: 'ICU Beds Only', icon: '🏥', desc: 'Find available ICU beds' },
                  { id: 'blood', label: 'Blood Supply Only', icon: '💉', desc: 'Locate blood banks' },
                  { id: 'both', label: 'Both Resources', icon: '🚑', desc: 'ICU beds + blood supply' }
                ].map((type) => (
                  <div
                    key={type.id}
                    className={`border-2 rounded-[16px] p-5 cursor-pointer transition-all ${
                      requestType === type.id 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                    onClick={() => setRequestType(type.id as any)}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <h4 className="text-[14px] font-bold text-gray-800 mb-1">{type.label}</h4>
                    <p className="text-[12.5px] text-gray-600">{type.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Location & Blood Type */}
            <div className="bg-white rounded-[24px] p-7 border border-red-200 shadow-[0_4px_24px_rgba(220,38,38,0.05)]">
              <h3 className="text-[16px] font-bold text-red-700 mb-4">2. Location & Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 Emergency Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-red-500 focus:bg-white"
                    placeholder="Enter location or use current position"
                  />
                </div>
                
                {(requestType === 'blood' || requestType === 'both') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🩸 Blood Type Required
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {bloodTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedBloodType(type)}
                          className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedBloodType === type
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Quick Templates */}
            <div className="bg-white rounded-[24px] p-7 border border-red-200 shadow-[0_4px_24px_rgba(220,38,38,0.05)]">
              <h3 className="text-[16px] font-bold text-red-700 mb-4">3. Quick Emergency Templates</h3>
              <div className="flex flex-wrap gap-2">
                {emergencyTemplates.map((template, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      // Parse template to set appropriate state
                      if (template.includes('ICU')) setRequestType('icu');
                      if (template.includes('blood')) setRequestType('blood');
                      if (template.includes('both') || template.includes('ICU bed and blood')) setRequestType('both');
                      if (template.includes('O-negative')) setSelectedBloodType('O-');
                    }}
                    className="px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-full border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-[16px] text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Dispatching Emergency Response...
                </>
              ) : (
                <>
                  🚨 Dispatch Emergency Response
                </>
              )}
            </button>

          </div>

          {/* Right Column: Demo Info & Infrastructure */}
          <div className="space-y-6">
            
            {/* Infrastructure Comparison */}
            <div className="bg-white rounded-[24px] p-6 border border-blue-200">
              <h3 className="text-[16px] font-bold text-blue-700 mb-4">⚙️ Same Infrastructure</h3>
              <div className="space-y-3">
                {[
                  { label: 'Router', desc: 'Coordinates medical agents', same: true },
                  { label: 'Escrow System', desc: 'Handles 402 payments', same: true },
                  { label: 'Reputation Registry', desc: 'Tracks agent performance', same: true },
                  { label: 'Smart Contracts', desc: 'Algorand blockchain', same: true },
                  { label: 'Payment Flow', desc: 'Atomic transactions', same: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      item.same ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.same ? '✓' : '✗'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{item.label}</div>
                      <div className="text-xs text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-blue-700 font-medium">
                  Zero new payment/blockchain code needed.
                </p>
              </div>
            </div>

            {/* Demo Scenario */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-[24px] p-6 border border-red-300">
              <h3 className="text-[16px] font-bold text-red-800 mb-3">🎯 Judge Demo Scenario</h3>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-red-200">
                  <p className="text-sm text-red-800 italic">
                    "Find an available ICU bed and O-negative blood near Pune City Center right now"
                  </p>
                </div>
                <div className="text-xs text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Same natural language parsing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Same 402 escrow funding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Same reputation updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>New medical agents, same infrastructure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Comparison */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-200">
              <h3 className="text-[16px] font-bold text-gray-800 mb-4">🔄 Domain Comparison</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-blue-600 mb-2">Travel Domain</div>
                  <div className="space-y-2">
                    {['✈️ Flight AI', '🛏 Hotel AI', '☀️ Weather AI', '🗺 Maps AI'].map((agent) => (
                      <div key={agent} className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                        {agent}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-red-600 mb-2">Emergency Domain</div>
                  <div className="space-y-2">
                    {['🏥 Hospital Bed AI', '💉 Blood Bank AI', '🚑 Ambulance AI*'].map((agent) => (
                      <div key={agent} className="text-xs text-gray-600 bg-red-50 p-2 rounded">
                        {agent}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">
                *Same router infrastructure, different agent types
              </p>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmergencyPage;