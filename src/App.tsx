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
import ProtectedRoute from './components/ProtectedRoute';
import EscrowPage from './pages/EscrowPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
            <Route path="/signin" element={<Navigate to="/" replace />} />
            <Route path="/auth" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/dashboard/new-request" element={<ProtectedRoute><NewRequestPage /></ProtectedRoute>} />
            <Route path="/dashboard/emergency" element={<ProtectedRoute><EmergencyPage /></ProtectedRoute>} />
            <Route path="/dashboard/agents" element={<ProtectedRoute><AgentsPage /></ProtectedRoute>} />
            <Route path="/dashboard/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
            <Route path="/dashboard/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
            <Route path="/dashboard/escrow" element={<ProtectedRoute><EscrowPage /></ProtectedRoute>} />
            <Route path="/dashboard/logs" element={<ProtectedRoute><LogsPage /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/dashboard/database" element={<ProtectedRoute><DatabaseInspectorPage /></ProtectedRoute>} />
            <Route path="/dashboard/x402-sandbox" element={<ProtectedRoute><X402DemoPage /></ProtectedRoute>} />
            <Route path="/dashboard/:section" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
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
