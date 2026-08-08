import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Flame, ShieldAlert, Users, 
  ShieldCheck, Award, LogOut, ChevronDown, ChevronUp, Check, GraduationCap 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { id: 'dashboard', label: 'Daily Command', icon: LayoutDashboard },
    { id: 'timetable', label: 'AI Timetable', icon: Calendar },
    { id: 'heatmap', label: 'Syllabus Heatmap', icon: Flame },
    { id: 'costudy', label: 'Silent Co-Study', icon: Users },
    { id: 'backlog', label: 'Debt Ledger', icon: ShieldAlert },
    { id: 'parent', label: 'Parent Portal', icon: ShieldCheck },
  ];

  const currentItem = navItems.find((item) => item.id === activeTab) || navItems[0];
  const CurrentIcon = currentItem.icon;

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setDropdownOpen(false);
  };

  const isParentRole = user?.role === 'PARENT';

  return (
    <header style={{
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(7, 10, 18, 0.95)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      position: 'sticky',
      top: 0,
      zIndex: 200
    }}>
      <div ref={dropdownRef} style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* TIER 1: Clean Top Header Bar (Brand Logo & User Profile / Logout) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          width: '100%'
        }}>
          {/* Brand Logo & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.15rem',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)',
              flexShrink: 0
            }}>
              Dh
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
                Dhruv
              </h1>
            </div>
          </div>

          {/* User Profile Pill & Logout Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: isParentRole ? 'rgba(16, 185, 129, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                border: isParentRole ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                {isParentRole ? <ShieldCheck size={14} color="#34d399" /> : <GraduationCap size={14} color="#38bdf8" />}
                <span style={{ fontSize: '0.78rem', color: isParentRole ? '#34d399' : '#38bdf8', fontWeight: 700 }}>
                  {user.name} ({isParentRole ? 'Parent' : 'Student'})
                </span>
              </div>
            )}

            <button
              onClick={onLogout}
              title="Switch Account / Logout"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#94a3b8',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <LogOut size={15} />
              <span>Switch / Logout</span>
            </button>
          </div>
        </div>

        {/* TIER 2 (DESKTOP & TABLET VIEW): Dedicated Horizontal Sub-Nav Bar */}
        <div 
          className="navbar-desktop-tabs"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '6px 20px',
            width: '100%'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            width: '100%',
            WebkitOverflowScrolling: 'touch'
          }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.18), rgba(37, 99, 235, 0.22))' : 'transparent',
                    color: isActive ? '#38bdf8' : '#94a3b8',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    outline: 'none',
                    borderBottom: isActive ? '2px solid #38bdf8' : '2px solid transparent'
                  }}
                >
                  <Icon size={16} color={isActive ? '#38bdf8' : '#94a3b8'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TIER 2 (MOBILE PHONE VIEW): Dedicated Workspace Dropdown Selector */}
        <div 
          className="navbar-mobile-trigger" 
          style={{ 
            padding: '0 16px 10px 16px', 
            width: '100%', 
            position: 'relative',
            borderTop: '1px solid rgba(255,255,255,0.06)' 
          }}
        >
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '10px 14px',
              marginTop: '8px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(37, 99, 235, 0.2))',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
              outline: 'none',
              minHeight: '44px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CurrentIcon size={18} color="#38bdf8" />
              <span>{currentItem.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#94a3b8' }}>
              <span>Switch Module</span>
              {dropdownOpen ? <ChevronUp size={16} color="#38bdf8" /> : <ChevronDown size={16} color="#38bdf8" />}
            </div>
          </button>

          {/* Mobile Dropdown Popover List */}
          {dropdownOpen && (
            <div 
              className="animate-slide-down"
              style={{
                position: 'absolute',
                left: '16px',
                right: '16px',
                top: 'calc(100% + 4px)',
                background: 'rgba(15, 23, 42, 0.98)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '14px',
                padding: '6px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)',
                zIndex: 300
              }}
            >
              <div style={{ padding: '8px 12px 6px 12px', fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '4px' }}>
                Select Active Workspace
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: isActive ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(37, 99, 235, 0.25))' : 'transparent',
                      color: isActive ? '#38bdf8' : '#e2e8f0',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      minHeight: '44px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon size={18} color={isActive ? '#38bdf8' : '#94a3b8'} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <Check size={18} color="#38bdf8" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
