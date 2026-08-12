import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import GamifiedDashboard from './components/GamifiedDashboard';
import AiTimetable from './components/AiTimetable';
import SyllabusHeatmap from './components/SyllabusHeatmap';
import CoStudyRoom from './components/CoStudyRoom';
import BacklogDebt from './components/BacklogDebt';
import ParentPortal from './components/ParentPortal';
import ErrorBoundary from './components/ErrorBoundary';
import { apiFetch, clearCsrfToken } from './api';

const TAB_FOR_ROLE = { PARENT: 'parent', STUDENT: 'dashboard' };

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  // Nothing is rendered until the server has confirmed (or denied) a session, so the UI
  // never briefly shows a signed-in state that turns out to be stale.
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // The session lives in an HttpOnly cookie the page cannot read, so the only way to
    // know who is signed in is to ask. The previous version trusted a localStorage blob,
    // which any user could edit to change their own name, id, or role.
    apiFetch('/api/v1/auth/session')
      .then((session) => {
        if (cancelled) return;
        setUser(session);
        setActiveTab(TAB_FOR_ROLE[session.role] || 'dashboard');
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsRestoringSession(false);
      });

    return () => { cancelled = true; };
  }, []);

  const handleLogin = useCallback((userData) => {
    setUser(userData);
    setActiveTab(TAB_FOR_ROLE[userData.role] || 'dashboard');
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await apiFetch('/api/v1/auth/logout', { method: 'POST' });
    } catch {
      // Even if the call fails, clear local state: the cookie may already be gone.
    }
    clearCsrfToken();
    // Purge anything an earlier build of the app left behind.
    localStorage.removeItem('dhruv_user');
    sessionStorage.clear();

    setUser(null);
    setActiveTab('dashboard');
  }, []);

  if (isRestoringSession) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        color: '#64748b',
        fontSize: '0.9rem',
      }}>
        Loading your workspace…
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!user && <AuthModal onLogin={handleLogin} />}

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />

      <main className="main-container">
        {/* A crash in one panel must not blank the whole application. */}
        <ErrorBoundary>
          {user && activeTab === 'dashboard' && <GamifiedDashboard user={user} setActiveTab={setActiveTab} />}
          {user && activeTab === 'timetable' && <AiTimetable />}
          {user && activeTab === 'heatmap' && <SyllabusHeatmap />}
          {user && activeTab === 'costudy' && <CoStudyRoom />}
          {user && activeTab === 'backlog' && <BacklogDebt />}
          {user && activeTab === 'parent' && <ParentPortal user={user} />}
        </ErrorBoundary>
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '16px 12px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontSize: '0.78rem',
        color: '#64748b',
      }}>
        Dhruv Platform • AI Customisable Timetable & Gamified Readiness Engine • Student & Parent Modes
      </footer>
    </div>
  );
}
