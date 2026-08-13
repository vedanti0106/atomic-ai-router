import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import DashboardPage from './pages/DashboardPage';
import NewRequestPage from './pages/NewRequestPage';
import EmergencyPage from './pages/EmergencyPage';
import AgentsPage from './pages/AgentsPage';
import TasksPage from './pages/TasksPage';
import PaymentsPage from './pages/PaymentsPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';
import DatabaseInspectorPage from './pages/DatabaseInspectorPage';
import X402DemoPage from './pages/X402DemoPage';
import { AuthProvider } from './context/AuthContext';
import EscrowPage from './pages/EscrowPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
            <Route path="/signin" element={<Navigate to="/" replace />} />
            <Route path="/auth" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/new-request" element={<NewRequestPage />} />
            <Route path="/dashboard/emergency" element={<EmergencyPage />} />
            <Route path="/dashboard/agents" element={<AgentsPage />} />
            <Route path="/dashboard/tasks" element={<TasksPage />} />
            <Route path="/dashboard/payments" element={<PaymentsPage />} />
            <Route path="/dashboard/escrow" element={<EscrowPage />} />
            <Route path="/dashboard/logs" element={<LogsPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/database" element={<DatabaseInspectorPage />} />
            <Route path="/dashboard/x402-sandbox" element={<X402DemoPage />} />
            <Route path="/dashboard/:section" element={<DashboardPage />} />
            {/* Placeholder routes */}
            <Route path="/about" element={<div className="p-8 text-center text-slate-500 font-bold">About Page</div>} />
            <Route path="/services" element={<div className="p-8 text-center text-slate-500 font-bold">Services Page</div>} />
            <Route path="/destinations" element={<div className="p-8 text-center text-slate-500 font-bold">Destinations Page</div>} />
            <Route path="/contact" element={<div className="p-8 text-center text-slate-500 font-bold">Contact Page</div>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
