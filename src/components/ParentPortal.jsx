import React, { useEffect, useState } from 'react';
import { ShieldCheck, HeartHandshake, CheckCircle2, Clock, Target, Award, UserPlus, GraduationCap, Zap, Activity, ChevronRight, RefreshCw } from 'lucide-react';
import { apiFetch } from '../api';
import { PanelLoading, PanelError } from './PanelState';

export default function ParentPortal({ user }) {
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [linkMessage, setLinkMessage] = useState(null);
  const [error, setError] = useState(null);

  // Display only. The server resolves the parent from the session; it no longer accepts
  // a phone number from the client, which is what allowed any caller to read any
  // parent's children.
  const parentPhone = user?.phoneNumber || '';

  const fetchStudents = () => {
    setLoading(true);
    setError(null);
    apiFetch('/api/v1/parent/students')
      .then((data) => setStudentsList(Array.isArray(data) ? data : []))
      .catch((err) => {
        // No demo fallback: showing invented children to a real parent is worse than
        // showing an error.
        setError(err);
        setStudentsList([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, [user]);

  const handleLinkStudent = async (e) => {
    e.preventDefault();
    const identifier = linkInput.trim();
    if (!identifier) return;

    setLinkMessage(null);
    try {
      // parentPhoneNumber is deliberately not sent: the server uses the session.
      const data = await apiFetch('/api/v1/parent/link-student', {
        method: 'POST',
        body: { studentIdentifier: identifier },
      });
      setLinkMessage({ type: 'success', text: data?.message || 'Student linked.' });
      setTimeout(() => {
        setShowLinkModal(false);
        setLinkInput('');
        setLinkMessage(null);
        fetchStudents();
      }, 1200);
    } catch (err) {
      setLinkMessage({ type: 'error', text: err.message });
    }
  };

  if (loading) return <PanelLoading label="Loading Parent Transparency Portal…" />;
  if (error) {
    return <PanelError error={error} onRetry={fetchStudents} label="Could not load your children's reports." />;
  }

  const activeStudent = studentsList[selectedStudentIndex] || studentsList[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '920px', margin: '0 auto' }}>
      
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '22px 26px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.95))', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-green">
                <ShieldCheck size={14} /> Parent Transparency Portal
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Parent: {user?.name}{parentPhone ? ` (${parentPhone})` : ''}</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: '#f8fafc', fontWeight: 800 }}>
              Multi-Student Progress Monitor
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
              Monitor verified study telemetry, ERI scores, and parent coaching prompts for all your registered children.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={fetchStudents}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#e2e8f0',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={15} /> Refresh Telemetry
            </button>

            <button
              onClick={() => setShowLinkModal(true)}
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                padding: '10px 16px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <UserPlus size={16} /> Link Another Child
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Student Selection Tabs */}
      <div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <GraduationCap size={16} color="#38bdf8" /> Select Student / Child ({studentsList.length} Connected)
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {studentsList.map((st, idx) => {
            const isSelected = idx === selectedStudentIndex;
            return (
              <button
                key={st.studentId || idx}
                onClick={() => setSelectedStudentIndex(idx)}
                className="glass-card"
                style={{
                  flex: '1 1 240px',
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #34d399' : '1px solid rgba(255,255,255,0.08)',
                  background: isSelected ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9))' : 'rgba(15, 23, 42, 0.6)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: isSelected ? '#34d399' : '#f8fafc' }}>
                    {st.studentName}
                  </span>
                  <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                    ERI {(st.overallEri ?? 0).toFixed(1)}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Target: {st.examTarget}
                </div>
                <div style={{ fontSize: '0.72rem', color: st.sentToParent ? '#34d399' : '#e2e8f0', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> {st.sentToParent ? `Report Received (${st.sentAt || 'Recently'})` : 'Live Telemetry Active'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Student Active Report Card */}
      {!activeStudent && (
        <div className="glass-card" style={{ padding: '32px 26px', textAlign: 'center', color: '#94a3b8' }}>
          <GraduationCap size={26} color="#34d399" style={{ marginBottom: '10px' }} />
          <h3 style={{ color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
            No students linked yet
          </h3>
          <p style={{ fontSize: '0.85rem', maxWidth: '460px', margin: '0 auto' }}>
            Use “Link Student” above and enter your child's Dhruv User ID or mobile number.
            They must have listed your mobile number as their parent contact when registering.
          </p>
        </div>
      )}

      {activeStudent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Student Banner Header */}
          <div className="glass-card" style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="badge badge-green" style={{ marginBottom: '6px' }}>
                  Showing Progress for {activeStudent.studentName}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: '#f8fafc', fontWeight: 800, marginTop: '4px' }}>
                  {activeStudent.studentName}'s Progress Summary
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                  User ID: <code style={{ color: '#38bdf8' }}>{activeStudent.studentUserId || 'student_id'}</code> • Target: {activeStudent.examTarget}
                </p>
              </div>

              <div style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '10px 16px', borderRadius: '12px', textAlign: 'right' }}>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Effort Rating</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                  {activeStudent.effortRating}
                </div>
              </div>
            </div>
          </div>

          {/* Verified Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            
            {/* ERI Score */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Zap size={16} /> Exam Readiness Index (ERI)
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                {(activeStudent.overallEri ?? 0).toFixed(1)} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 100</span>
              </div>
              {typeof activeStudent.deltaWeekly === 'number' && (
                <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '4px', fontWeight: 600 }}>
                  ↑ +{activeStudent.deltaWeekly.toFixed(1)} pts growth this week
                </div>
              )}
            </div>

            {/* Study Time */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Clock size={16} /> Verified Focus Time
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                {((activeStudent.verifiedStudyMinutes ?? 0) / 60).toFixed(1)} Hours
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                {activeStudent.verifiedStudyMinutes ?? 0} mins logged in timed focus blocks
              </div>
            </div>

            {/* Consistency */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Award size={16} /> Consistency Milestone
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                6 / 7 Days
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                Active daily study check-ins
              </div>
            </div>

            {/* PYQs Solved */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Target size={16} /> Verified PYQs Practice
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#818cf8', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                140 PYQs
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                Tracked practice correctness
              </div>
            </div>

          </div>

          {/* Weekly Win */}
          <div className="glass-card" style={{ padding: '20px', background: 'rgba(52, 211, 153, 0.05)', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              🏆 Major Weekly Win Highlight
            </span>
            <p style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 600 }}>
              "{activeStudent.weeklyWin}"
            </p>
          </div>

          {/* Parent Coaching Script Card */}
          <div className="glass-card" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <HeartHandshake size={22} color="#38bdf8" />
              <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700 }}>
                Parent Coaching Script (How to Support {activeStudent.studentName})
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'rgba(52, 211, 153, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.25)' }}>
                <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  ✅ Recommended Conversation Prompt
                </span>
                <p style={{ fontSize: '0.92rem', color: '#f8fafc', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{activeStudent.scriptWhatToSay}"
                </p>
              </div>

              <div style={{ background: 'rgba(251, 113, 133, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(251, 113, 133, 0.25)' }}>
                <span style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  🛑 What NOT to Say (Avoid High Anxiety Triggers)
                </span>
                <p style={{ fontSize: '0.92rem', color: '#f8fafc', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{activeStudent.scriptWhatNotToSay}"
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Link Child Modal */}
      {showLinkModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(7, 10, 18, 0.9)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '440px',
            width: '100%',
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 800, marginBottom: '6px' }}>
              Link Another Student / Child
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '16px' }}>
              Enter the Student's User ID (e.g. <code>ananya_2027</code>) or Mobile Phone Number to link them to your parent portal.
            </p>

            <form onSubmit={handleLinkStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                required
                placeholder="Enter Student User ID or Phone Number"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />

              {linkMessage && (
                <div style={{
                  fontSize: '0.82rem',
                  padding: '10px',
                  borderRadius: '8px',
                  background: linkMessage.type === 'success' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 113, 133, 0.15)',
                  color: linkMessage.type === 'success' ? '#34d399' : '#fb7185',
                  border: linkMessage.type === 'success' ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(251, 113, 133, 0.3)'
                }}>
                  {linkMessage.text}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Confirm & Link Child
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
