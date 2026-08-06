import React, { useState } from 'react';
import { Phone, User, GraduationCap, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthModal({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('NEET 2027 Repeater');
  const [role, setRole] = useState('STUDENT'); // 'STUDENT' or 'PARENT'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || !name) return;

    const userData = {
      name,
      phone,
      course,
      role,
      level: 12,
      xp: 3450,
      streak: 47,
      isLoggedIn: true
    };

    localStorage.setItem('dhruv_user', JSON.stringify(userData));
    onLogin(userData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(7, 10, 18, 0.92)',
      backdropFilter: 'blur(24px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '24px 20px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.4rem',
            margin: '0 auto 10px'
          }}>
            Dh
          </div>
          <h2 style={{ fontSize: '1.45rem', fontFamily: 'var(--font-heading)', color: '#f8fafc', fontWeight: 800 }}>
            Welcome to Dhruv
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
            The Readiness Layer for High-Stakes Exam Prep
          </p>
        </div>

        {/* Role Switcher */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          background: 'rgba(255,255,255,0.03)',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            style={{
              flex: '1 1 140px',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: role === 'STUDENT' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
              color: role === 'STUDENT' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <GraduationCap size={16} /> Student Login
          </button>

          <button
            type="button"
            onClick={() => setRole('PARENT')}
            style={{
              flex: '1 1 140px',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: role === 'PARENT' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: role === 'PARENT' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={16} /> Parent Portal
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                required
                placeholder={role === 'STUDENT' ? "Aarav Sharma" : "Parent of Aarav"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Mobile Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {role === 'STUDENT' && (
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Select Target Exam / Course
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="NEET 2027 Repeater">NEET 2027 Repeater (Medical Doctor)</option>
                <option value="JEE Advanced 2027">JEE Advanced 2027 (IITian Engineer)</option>
                <option value="UPSC Civil Services 2027">UPSC Civil Services 2027</option>
                <option value="GATE 2027">GATE 2027 Engineering</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{
              marginTop: '12px',
              padding: '12px',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Create Account & Enter Platform <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
