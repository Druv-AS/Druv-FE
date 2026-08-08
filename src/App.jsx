import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import GamifiedDashboard from './components/GamifiedDashboard';
import AiTimetable from './components/AiTimetable';
import SyllabusHeatmap from './components/SyllabusHeatmap';
import CoStudyRoom from './components/CoStudyRoom';
import BacklogDebt from './components/BacklogDebt';
import ParentPortal from './components/ParentPortal';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('dhruv_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.role === 'PARENT') {
          setActiveTab('parent');
        }
      } catch (err) {
        setShowAuthModal(true);
      }
    } else {
      setShowAuthModal(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
    if (userData.role === 'PARENT') {
      setActiveTab('parent');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' }).catch(() => {});
    } catch (err) {}

    // Completely purge both localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    setUser(null);
    setActiveTab('dashboard');
    setShowAuthModal(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showAuthModal && <AuthModal onLogin={handleLogin} />}

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />

      <main className="main-container">
        {activeTab === 'dashboard' && <GamifiedDashboard user={user} setActiveTab={setActiveTab} />}
        {activeTab === 'timetable' && <AiTimetable />}
        {activeTab === 'heatmap' && <SyllabusHeatmap />}
        {activeTab === 'costudy' && <CoStudyRoom />}
        {activeTab === 'backlog' && <BacklogDebt />}
        {activeTab === 'parent' && <ParentPortal user={user} />}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '16px 12px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontSize: '0.78rem',
        color: '#64748b'
      }}>
        Dhruv Platform • AI Customisable Timetable & Gamified Readiness Engine • Student & Parent Modes
      </footer>
    </div>
  );
}
