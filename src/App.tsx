import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchSection from './components/SearchSection';
import Statistics from './components/Statistics';
import Destinations from './components/Destinations';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import NewRequestPage from './pages/NewRequestPage';
import EmergencyPage from './pages/EmergencyPage';
import AgentsPage from './pages/AgentsPage';
import TasksPage from './pages/TasksPage';
import PaymentsPage from './pages/PaymentsPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import EscrowPage from './pages/EscrowPage';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white relative flex flex-col justify-between overflow-x-hidden">
      <div className="absolute top-0 right-0 w-[55%] h-[85%] bg-gradient-to-bl from-[#EBF2FF] to-transparent rounded-bl-[10rem] pointer-events-none z-0"></div>
      <div className="z-10 flex flex-col flex-1">
        <Navbar />
        <Hero />
        <SearchSection />
        <Statistics />
        <Destinations />
        <Services />
        <Testimonials />
        <CTA />
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/new-request" element={<NewRequestPage />} />
          <Route path="/dashboard/emergency" element={<EmergencyPage />} />
          <Route path="/dashboard/agents" element={<AgentsPage />} />
          <Route path="/dashboard/tasks" element={<TasksPage />} />
          <Route path="/dashboard/payments" element={<PaymentsPage />} />
          <Route path="/dashboard/escrow" element={<EscrowPage />} />
          <Route path="/dashboard/logs" element={<LogsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/:section" element={<DashboardPage />} />
          <Route path="/about" element={<div className="p-8 text-center text-slate-500 font-bold">About Page</div>} />
          <Route path="/services" element={<div className="p-8 text-center text-slate-500 font-bold">Services Page</div>} />
          <Route path="/destinations" element={<div className="p-8 text-center text-slate-500 font-bold">Destinations Page</div>} />
          <Route path="/contact" element={<div className="p-8 text-center text-slate-500 font-bold">Contact Page</div>} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
