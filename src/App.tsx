import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AgentsPage from './pages/AgentsPage';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white relative flex flex-col justify-between overflow-x-hidden">
      {/* Decorative top-right curved backdrop */}
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
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/new-request" element={<NewRequestPage />} />
        <Route path="/dashboard/agents" element={<AgentsPage />} />
        <Route path="/dashboard/:section" element={<DashboardPage />} />
        {/* Placeholder routes */}
        <Route path="/about" element={<div className="p-8 text-center text-slate-500 font-bold">About Page</div>} />
        <Route path="/services" element={<div className="p-8 text-center text-slate-500 font-bold">Services Page</div>} />
        <Route path="/destinations" element={<div className="p-8 text-center text-slate-500 font-bold">Destinations Page</div>} />
        <Route path="/contact" element={<div className="p-8 text-center text-slate-500 font-bold">Contact Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
