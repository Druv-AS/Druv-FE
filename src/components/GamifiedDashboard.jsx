import React, { useState } from 'react';
import { 
  Award, Flame, Play, Clock, ArrowUpRight, Zap, Target, 
  Users, CheckCircle2, Check, ShieldAlert, ArrowRight, Activity, Stethoscope, Cpu, GraduationCap, Sparkles, Shield, RefreshCw
} from 'lucide-react';

import neetDoctorImg from '../assets/neet_doctor.png';
import jeeEngineerImg from '../assets/jee_engineer.png';

export default function GamifiedDashboard({ user, setActiveTab }) {
  const [selectedCareer, setSelectedCareer] = useState('NEET'); // 'NEET' or 'JEE'
  const [xp, setXp] = useState(user?.xp || 3450);
  const [level, setLevel] = useState(user?.level || 12);
  const [streak, setStreak] = useState(user?.streak || 47);
  const [freezeBuffer, setFreezeBuffer] = useState(1);
  const [checkedInToday, setCheckedInToday] = useState(true);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [showXpAnim, setShowXpAnim] = useState(false);

  const careerConfig = {
    NEET: {
      title: "Medical Doctor (MBBS)",
      targetCollege: "AIIMS New Delhi • NEET 2027",
      image: neetDoctorImg,
      heroTask: "Organic Reaction Mechanisms (Decay Halt)",
      topLeverage: "Decay Radar predicted a 14% mastery drop in Organic Mechanism step-by-step retrieval if unrevised tonight.",
      badgeColor: "badge-green"
    },
    JEE: {
      title: "Aerospace & AI Engineer (IITian)",
      targetCollege: "IIT Bombay Computer Science • JEE 2027",
      image: jeeEngineerImg,
      heroTask: "Rotational Dynamics & Quantum Physics Calculus",
      topLeverage: "Decay Radar detected pacing casualties in Rotational Mechanics integrals during last week's mock.",
      badgeColor: "badge-indigo"
    }
  };

  const currentCareer = careerConfig[selectedCareer];

  const weeklyStreakDays = [
    { day: 'Mon', date: 'Aug 2', status: 'COMPLETED' },
    { day: 'Tue', date: 'Aug 3', status: 'COMPLETED' },
    { day: 'Wed', date: 'Aug 4', status: 'COMPLETED' },
    { day: 'Thu', date: 'Aug 5', status: 'COMPLETED' },
    { day: 'Fri', date: 'Aug 6', status: 'COMPLETED' },
    { day: 'Sat', date: 'Aug 7', status: 'TODAY_ACTIVE' },
    { day: 'Sun', date: 'Aug 8', status: 'UPCOMING' }
  ];

  const quests = [
    { id: 'Q1', title: 'Solve 40 MCQs in Organic Chemistry / Physics', xp: 150, tag: 'Daily Quest' },
    { id: 'Q2', title: 'Complete 50-Min Silent Focus Room Session', xp: 200, tag: 'Focus Mission' },
    { id: 'Q3', title: 'Confirm 2-Tap Evening Log & Next Day Plan', xp: 100, tag: 'Consistency' },
  ];

  const handleCompleteQuest = (qId, qXp) => {
    if (completedQuests.includes(qId)) return;
    setCompletedQuests([...completedQuests, qId]);
    setXp((prev) => prev + qXp);
    setShowXpAnim(true);
    setTimeout(() => setShowXpAnim(false), 1200);
  };

  const handleCheckInToggle = () => {
    if (!checkedInToday) {
      setCheckedInToday(true);
      setStreak((prev) => prev + 1);
      setXp((prev) => prev + 50);
      setShowXpAnim(true);
      setTimeout(() => setShowXpAnim(false), 1200);
    }
  };

  const nextLevelXp = 4000;
  const xpProgress = Math.min(100, Math.round(((xp % 1000) / 1000) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1140px', margin: '0 auto' }}>
      
      {/* Gamification Header: XP & Level Bar */}
      <div className="glass-card" style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        position: 'relative'
      }}>
        {showXpAnim && (
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#34d399',
            color: '#070a12',
            fontWeight: 800,
            padding: '6px 16px',
            borderRadius: '20px',
            boxShadow: '0 0 20px #34d399',
            animation: 'bounce 0.6s ease',
            whiteSpace: 'nowrap'
          }}>
            +50 XP STREAK BONUS! 🔥
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', width: '100%' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.3rem',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
            flexShrink: 0
          }}>
            L{level}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#f8fafc' }}>
                {user?.name || 'Aarav Sharma'}
              </h2>
              <span className="badge badge-green">Level {level} Scholar</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
              <div style={{ width: '180px', maxWidth: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${xpProgress}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #34d399)', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                {xp} / {nextLevelXp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Badges & Career Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
          <span className="badge badge-orange" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            <Flame size={15} color="#f59e0b" /> {streak}-Day Streak Active
          </span>

          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '10px' }}>
            <button
              onClick={() => setSelectedCareer('NEET')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: selectedCareer === 'NEET' ? 'rgba(52, 211, 153, 0.2)' : 'transparent',
                color: selectedCareer === 'NEET' ? '#34d399' : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Doctor (NEET)
            </button>
            <button
              onClick={() => setSelectedCareer('JEE')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: selectedCareer === 'JEE' ? 'rgba(129, 140, 248, 0.2)' : 'transparent',
                color: selectedCareer === 'JEE' ? '#818cf8' : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              IITian (JEE)
            </button>
          </div>
        </div>
      </div>

      {/* PROMINENT DAILY STREAK & CONSISTENCY RIBBON WIDGET */}
      <div className="glass-card" style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(15, 23, 42, 0.95))',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '16px', width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.5)',
              color: '#fff',
              flexShrink: 0
            }}>
              <Flame size={32} fill="#fff" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#f8fafc', lineHeight: 1 }}>
                  {streak} Day Streak!
                </h2>
                <span className="badge badge-orange">
                  Unbroken Focus
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px', textAlign: 'center' }}>
                Shown up 47 of the last 52 days • 100% Gap Recovery Rate
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '8px 14px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px'
            }}>
              <Shield size={16} color="#34d399" />
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Streak Freeze</span>
                <span style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 700 }}>{freezeBuffer} Active</span>
              </div>
            </div>

            <button
              onClick={handleCheckInToggle}
              className="btn-primary"
              style={{
                background: checkedInToday ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                padding: '10px 16px',
                fontSize: '0.85rem'
              }}
            >
              {checkedInToday ? 'Today Logged ✓' : 'Log Today\'s Session +50 XP'}
            </button>
          </div>
        </div>

        {/* Weekly Consistency Ribbon (7 Day Bubbles) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: '4px',
          background: 'rgba(255,255,255,0.02)',
          padding: '10px 6px',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {weeklyStreakDays.map((item, idx) => {
            const isCompleted = item.status === 'COMPLETED';
            const isToday = item.status === 'TODAY_ACTIVE';

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 2px',
                  borderRadius: '8px',
                  background: isToday
                    ? 'rgba(245, 158, 11, 0.18)'
                    : isCompleted
                    ? 'rgba(52, 211, 153, 0.08)'
                    : 'transparent',
                  border: isToday
                    ? '1px solid rgba(245, 158, 11, 0.45)'
                    : isCompleted
                    ? '1px solid rgba(52, 211, 153, 0.2)'
                    : '1px solid transparent'
                }}
              >
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: isToday ? '#fbbf24' : isCompleted ? '#34d399' : '#64748b' }}>
                  {item.day}
                </span>

                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isToday
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                    : isCompleted
                    ? 'linear-gradient(135deg, #34d399, #10b981)'
                    : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  color: isToday || isCompleted ? '#070a12' : '#64748b',
                  fontWeight: 800,
                  boxShadow: isToday ? '0 0 12px rgba(245, 158, 11, 0.6)' : isCompleted ? '0 0 8px rgba(52, 211, 153, 0.3)' : 'none',
                  flexShrink: 0
                }}>
                  {isToday ? (
                    <Flame size={15} fill="#070a12" color="#070a12" />
                  ) : isCompleted ? (
                    <Check size={16} strokeWidth={3.5} color="#070a12" />
                  ) : (
                    <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>{idx + 1}</span>
                  )}
                </div>

                <span style={{ fontSize: '0.6rem', color: '#94a3b8', whiteSpace: 'nowrap', textAlign: 'center' }}>
                  {item.date.replace('Aug ', '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hero Career Vision & Command Card */}
      <div className="glass-card" style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span className={`badge ${currentCareer.badgeColor}`}>
              {currentCareer.targetCollege}
            </span>
          </div>

          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#f8fafc', lineHeight: 1.2 }}>
            Daily Command • {currentCareer.title}
          </h1>

          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '8px', lineHeight: 1.5 }}>
            "Measured readiness is the product; identity survives a bad mock day."
          </p>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('costudy')}
              className="btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Play size={16} fill="#fff" /> Start 50-Min Co-Study Block
            </button>

            <button
              onClick={() => setActiveTab('timetable')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#e2e8f0',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              View AI Timetable →
            </button>
          </div>
        </div>

        {/* Dynamic Career Hologram */}
        <div style={{ position: 'relative', height: '180px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <img src={currentCareer.image} alt={currentCareer.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(7,10,18,0.95), transparent)', padding: '10px 14px' }}>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Chosen Career Vision</span>
            <div style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>{currentCareer.title}</div>
          </div>
        </div>
      </div>

      {/* Daily Gamified Quests & Mission Cards */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-heading)', color: '#f8fafc', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={17} color="#38bdf8" /> Today's XP Quests & Missions
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {quests.map((q) => {
            const isDone = completedQuests.includes(q.id);
            return (
              <div
                key={q.id}
                className="glass-card"
                style={{
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  gap: '14px',
                  borderLeft: isDone ? '4px solid #34d399' : '4px solid #38bdf8'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-indigo">{q.tag}</span>
                    <span className="badge badge-green">+{q.xp} XP</span>
                  </div>

                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: isDone ? '#94a3b8' : '#f8fafc', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {q.title}
                  </h4>
                </div>

                <button
                  onClick={() => handleCompleteQuest(q.id, q.xp)}
                  disabled={isDone}
                  className="btn-primary"
                  style={{
                    background: isDone ? 'rgba(52, 211, 153, 0.2)' : 'linear-gradient(135deg, #0284c7, #2563eb)',
                    color: isDone ? '#34d399' : '#fff',
                    border: isDone ? '1px solid rgba(52, 211, 153, 0.4)' : 'none',
                    padding: '8px 14px',
                    fontSize: '0.82rem'
                  }}
                >
                  {isDone ? 'Quest Completed ✓' : `Complete & Claim +${q.xp} XP`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Silent Co-Study Room Activity Bar */}
      <div 
        onClick={() => setActiveTab('costudy')}
        className="glass-card" 
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.08), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(52, 211, 153, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 12px #34d399', animation: 'pulse 2s infinite', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Users size={16} color="#34d399" />
              <span>142 Aspirants Currently in Silent Focus Rooms</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
              Shared 50-minute focus block • Zero audio/video distraction
            </p>
          </div>
        </div>

        <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.82rem', padding: '8px 14px' }}>
          Join Silent Focus Room →
        </button>
      </div>

    </div>
  );
}
