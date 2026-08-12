import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

interface DBUser {
  id: string;
  name: string;
  email: string;
  balance: number;
  createdAt: string;
}

interface DBTask {
  id: string;
  userId: string;
  goal: string;
  status: string;
  createdAt: string;
}

interface DBEscrow {
  id: string;
  taskId: string;
  appId: string;
  boxKey: string;
  amount: number;
  status: string;
  txidFund: string;
  createdAt: string;
}

const DatabaseInspectorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'tasks' | 'escrows'>('users');
  const [users, setUsers] = useState<DBUser[]>([]);
  const [tasks, setTasks] = useState<DBTask[]>([]);
  const [escrows, setEscrows] = useState<DBEscrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDBData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/task/db-inspector', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch database information.');
      }
      const data = await response.json();
      setUsers(data.users || []);
      setTasks(data.tasks || []);
      setEscrows(data.escrows || []);
      setError('');
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to Hono backend. Make sure the backend server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDBData();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10 font-sans">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[24px] md:text-[32px] font-bold font-display text-navy leading-tight">Live SQLite Database</h1>
            <p className="text-[14px] md:text-[15px] text-slate-500 mt-1">
              Visual database explorer displaying live SQLite state updates from the backend.
            </p>
          </div>
          <button 
            onClick={() => { setLoading(true); fetchDBData(); }}
            className="px-4 py-2.5 bg-blue-brand text-white text-xs font-bold rounded-full hover:bg-blue-dark transition-colors cursor-pointer"
          >
            🔄 Refresh Data
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mb-6 border-b border-line pb-px">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 font-display font-bold text-sm border-b-[2px] transition-all cursor-pointer ${
              activeTab === 'users' ? 'border-blue-brand text-blue-brand' : 'border-transparent text-slate-400 hover:text-navy'
            }`}
          >
            Users Table ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-3 px-4 font-display font-bold text-sm border-b-[2px] transition-all cursor-pointer ${
              activeTab === 'tasks' ? 'border-blue-brand text-blue-brand' : 'border-transparent text-slate-400 hover:text-navy'
            }`}
          >
            Tasks Table ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('escrows')}
            className={`pb-3 px-4 font-display font-bold text-sm border-b-[2px] transition-all cursor-pointer ${
              activeTab === 'escrows' ? 'border-blue-brand text-blue-brand' : 'border-transparent text-slate-400 hover:text-navy'
            }`}
          >
            Escrow Contracts Table ({escrows.length})
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-[24px] border border-line p-12 text-center shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="w-10 h-10 border-4 border-sky border-t-blue-brand rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Loading Database State...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[24px] border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)] overflow-hidden">
            
            {/* Users Table */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-line text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <th className="p-4 px-6">User ID</th>
                      <th className="p-4 px-6">Name</th>
                      <th className="p-4 px-6">Email</th>
                      <th className="p-4 px-6">Balance</th>
                      <th className="p-4 px-6">Registered At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-sm text-slate-700">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-400">No users registered in the database yet.</td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="p-4 px-6 font-mono text-[11px] text-blue-brand">{u.id}</td>
                          <td className="p-4 px-6 font-bold text-navy">{u.name}</td>
                          <td className="p-4 px-6">{u.email}</td>
                          <td className="p-4 px-6 font-bold text-emerald-600">${Number(u.balance).toFixed(2)} USDC</td>
                          <td className="p-4 px-6 text-xs text-slate-400">{new Date(u.createdAt).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tasks Table */}
            {activeTab === 'tasks' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-line text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <th className="p-4 px-6">Task ID</th>
                      <th className="p-4 px-6">User ID</th>
                      <th className="p-4 px-6">Goal Description</th>
                      <th className="p-4 px-6">Status</th>
                      <th className="p-4 px-6">Launched At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-sm text-slate-700">
                    {tasks.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-400">No tasks created in the database yet.</td>
                      </tr>
                    ) : (
                      tasks.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50">
                          <td className="p-4 px-6 font-mono text-[11px] text-blue-brand">{t.id}</td>
                          <td className="p-4 px-6 font-mono text-[11px] text-slate-400">{t.userId.slice(0, 18)}...</td>
                          <td className="p-4 px-6 font-medium text-navy">{t.goal}</td>
                          <td className="p-4 px-6">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                              t.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' :
                              t.status === 'IN_PROGRESS' ? 'bg-sky text-blue-brand animate-pulse' :
                              'bg-rose-50 text-rose-700'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="p-4 px-6 text-xs text-slate-400">{new Date(t.createdAt).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Escrows Table */}
            {activeTab === 'escrows' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-line text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <th className="p-4 px-6">Task ID</th>
                      <th className="p-4 px-6">Escrow App ID</th>
                      <th className="p-4 px-6">Box Key</th>
                      <th className="p-4 px-6">Amount Funded</th>
                      <th className="p-4 px-6">On-Chain Status</th>
                      <th className="p-4 px-6">Funding TxID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-sm text-slate-700">
                    {escrows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-slate-400">No escrow contracts funded in the database yet.</td>
                      </tr>
                    ) : (
                      escrows.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50/50">
                          <td className="p-4 px-6 font-mono text-[11px] text-blue-brand">{e.taskId}</td>
                          <td className="p-4 px-6 font-mono text-[11px] text-navy font-bold">{e.appId}</td>
                          <td className="p-4 px-6 font-mono text-[11px] text-slate-500">{e.boxKey}</td>
                          <td className="p-4 px-6 font-bold text-navy">${Number(e.amount).toFixed(2)} USDC</td>
                          <td className="p-4 px-6">
                            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                              {e.status}
                            </span>
                          </td>
                          <td className="p-4 px-6 font-mono text-[11px] text-slate-400 truncate max-w-[150px]">{e.txidFund}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default DatabaseInspectorPage;
