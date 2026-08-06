import React from 'react';
import { LayoutDashboard, Calendar, Flame, ShieldAlert, Users, ShieldCheck, Award, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Daily Command', icon: LayoutDashboard },
    { id: 'timetable', label: 'AI Timetable', icon: Calendar },
    { id: 'heatmap', label: 'Syllabus Heatmap', icon: Flame },
    { id: 'costudy', label: 'Silent Co-Study', icon: Users },
    { id: 'backlog', label: 'Debt Ledger', icon: ShieldAlert },
    { id: 'parent', label: 'Parent Portal', icon: ShieldCheck },
  ];

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      padding: '16px 32px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(7, 10, 18, 0.88)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & User Profile Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          boxShadow: '0 0 16px rgba(56, 189, 248, 0.3)'
        }}>
          Dh
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
              Dhruv
            </h1>
            <span style={{ fontSize: '0.7rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
              {user?.course || 'NEET 2027'}
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '-2px' }}>
            {user?.name ? `${user.name} • L${user.level || 12} Scholar` : 'Student Readiness Engine'}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.18), rgba(37, 99, 235, 0.22))' : 'transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="badge badge-green">
          <Award size={14} /> {user?.streak || 47} Day Streak
        </span>

        <button
          onClick={onLogout}
          title="Switch Account / Logout"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
