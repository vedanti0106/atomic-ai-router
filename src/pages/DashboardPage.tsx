import React from 'react';
import DashboardNav from '../components/dashboard/DashboardNav';
import StatsCards from '../components/dashboard/StatsCards';
import RequestsByAgent from '../components/dashboard/RequestsByAgent';
import AgentReliability from '../components/dashboard/AgentReliability';
import LiveLogs from '../components/dashboard/LiveLogs';
import AlertsLogs from '../components/dashboard/AlertsLogs';
import SystemHealth from '../components/dashboard/SystemHealth';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen p-7" style={{ background: '#EFEDF9' }}>
      <div className="rounded-[28px] p-5 pb-[26px] px-[26px]" style={{ background: '#F7F6FC' }}>

        {/* Top Navigation */}
        <DashboardNav />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[22px] gap-4">
          <div>
            <h1 className="text-[23px] font-semibold font-display text-[#1E1B33]">
              Orchestration overview{' '}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-[10px] py-1 rounded-full ml-2.5 align-middle"
                style={{ background: '#FFE9D1', color: '#B5651D' }}>
                ● Router live
              </span>
            </h1>
            <p className="text-[13px] mt-1.5 max-w-[520px]" style={{ color: '#8B87A3' }}>
              Real-time visibility into agent routing, payments, and system reliability across the AI Router network.
            </p>
          </div>

          <div className="flex items-center gap-[22px] flex-wrap">
            {['Overview', 'Agents', 'Payments', 'Logs'].map((c) => (
              <span key={c}
                className={`text-[13px] font-medium cursor-pointer ${c === 'Overview' ? 'text-[#1E1B33]' : ''}`}
                style={{ color: c !== 'Overview' ? '#B4B1C6' : undefined }}>
                {c}
              </span>
            ))}
            <button className="text-[12.5px] font-medium px-4 py-2 rounded-[10px] border"
              style={{ background: '#fff', borderColor: '#EAE8F5', color: '#8B87A3' }}>
              Display recent mode ›
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <StatsCards />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 mb-4">
          <RequestsByAgent />
          <AgentReliability />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <LiveLogs />
          <AlertsLogs />
          <SystemHealth />
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
