import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardMetrics from '../components/dashboard/DashboardMetrics';
import ActivityAndAgents from '../components/dashboard/ActivityAndAgents';
import HealthAndExecutions from '../components/dashboard/HealthAndExecutions';

interface DashboardData {
  metrics: {
    totalRequests: string;
    activeAgents: string;
    successRate: string;
    settledVolume: string;
    paymentCount: string;
  } | null;
  recentExecutions: Array<{ time: string; req: string; agent: string; status: string }>;
  timelineActivity: Array<{ agent: string; time: string; status: string }>;
  agentOverview: Array<{ name: string; status: string; latency: string; avail: string }>;
}

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    metrics: null,
    recentExecutions: [],
    timelineActivity: [],
    agentOverview: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/task/dashboard', {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to load dashboard metrics.');
      }
      const result = await response.json();
      setData({
        metrics: result.metrics || null,
        recentExecutions: result.recentExecutions || [],
        timelineActivity: result.timelineActivity || [],
        agentOverview: result.agentOverview || []
      });
      setError('');
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to Hono backend. Ensure the server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh metrics every 5 seconds for a dynamic live demo experience
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[24px] md:text-[32px] font-bold font-display text-navy leading-tight">Dashboard Overview</h1>
            <p className="text-[14px] md:text-[15px] text-slate-500 mt-1">Monitor your AI Router network in real time.</p>
          </div>
          <button
            onClick={() => { setLoading(true); fetchDashboardData(); }}
            className="px-4 py-2 bg-blue-brand text-white text-xs font-bold rounded-full hover:bg-blue-brand/90 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-[24px] border border-line p-12 text-center shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="w-10 h-10 border-4 border-sky border-t-blue-brand rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Loading Router Telemetry...</p>
          </div>
        ) : (
          <>
            {/* Top Metrics */}
            <DashboardMetrics metrics={data.metrics} />

            {/* Second Section: Timeline and Agents */}
            <ActivityAndAgents requests={data.timelineActivity} overview={data.agentOverview} />

            {/* Bottom Section: Health and Executions */}
            <HealthAndExecutions executions={data.recentExecutions} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
