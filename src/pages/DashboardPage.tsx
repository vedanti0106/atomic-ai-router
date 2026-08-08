import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardMetrics from '../components/dashboard/DashboardMetrics';
import ActivityAndAgents from '../components/dashboard/ActivityAndAgents';
import HealthAndExecutions from '../components/dashboard/HealthAndExecutions';

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[24px] md:text-[32px] font-bold font-display text-navy leading-tight">Dashboard Overview</h1>
          <p className="text-[14px] md:text-[15px] text-slate-500 mt-1">Monitor your AI Router network in real time.</p>
        </div>

        {/* Top Metrics */}
        <DashboardMetrics />

        {/* Second Section: Timeline and Agents */}
        <ActivityAndAgents />

        {/* Bottom Section: Health and Executions */}
        <HealthAndExecutions />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
