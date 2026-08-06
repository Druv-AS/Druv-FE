import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Flame, Play, Clock, ArrowUpRight, Zap, Target, 
  Users, CheckCircle2, ShieldAlert, ArrowRight, Activity, Stethoscope, Cpu, GraduationCap
} from 'lucide-react';

import neetDoctorImg from '../assets/neet_doctor.png';
import jeeEngineerImg from '../assets/jee_engineer.png';

export default function DailyDashboard({ setActiveTab }) {
  const [selectedCareer, setSelectedCareer] = useState('NEET'); // 'NEET' or 'JEE'
  const [checkedIn, setCheckedIn] = useState(false);
  const [eriData, setEriData] = useState(null);

  useEffect(() => {
    fetch('/api/v1/readiness/eri')
      .then((res) => res.json())
      .then((data) => setEriData(data))
      .catch(() => {
        setEriData({
          overallEri: 71.2,
          deltaWeekly: 2.4,
          coverage: 68.5,
          mastery: 74.0,
          retention: 62.0,
          examSkill: 70.5,
          consistency: 88.0,
          topLeverageAction: "Solve 20 timed PYQs to halt decay in core concepts."
        });
      });
  }, []);

  const careerConfig = {
    NEET: {
      title: "Medical Doctor (MBBS)",
      targetCollege: "AIIMS New Delhi • NEET 2027",
      image: neetDoctorImg,
      heroTask: "Organic Reaction Mechanisms (Decay Halt)",
      topLeverage: "Decay Radar predicted a 14% mastery drop in Organic Mechanism step-by-step retrieval if unrevised tonight.",
      subjectFocus: "Biology & Chemistry Heavy",
      badgeColor: "badge-green"
    },
    JEE: {
      title: "Aerospace & AI Engineer (IITian)",
      targetCollege: "IIT Bombay Computer Science • JEE 2027",
      image: jeeEngineerImg,
      heroTask: "Rotational Dynamics & Quantum Physics Calculus",
      topLeverage: "Decay Radar detected pacing casualties in Rotational Mechanics integrals during last week's mock.",
      subjectFocus: "Physics & Mathematics Heavy",
      badgeColor: "badge-indigo"
    }
  };

  const currentCareer = careerConfig[selectedCareer];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1140px', margin: '0 auto' }}>
      
      {/* Career Path Selector Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <GraduationCap size={20} color="#38bdf8" />
          <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600 }}>Target Career Path:</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setSelectedCareer('NEET')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '10px',
              border: selectedCareer === 'NEET' ? '1px solid rgba(52, 211, 153, 0.5)' : '1px solid transparent',
              background: selectedCareer === 'NEET' ? 'rgba(52, 211, 153, 0.15)' : 'transparent',
              color: selectedCareer === 'NEET' ? '#34d399' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Stethoscope size={16} /> Medical / Doctor (NEET)
          </button>

          <button
            onClick={() => setSelectedCareer('JEE')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '10px',
              border: selectedCareer === 'JEE' ? '1px solid rgba(129, 140, 248, 0.5)' : '1px solid transparent',
              background: selectedCareer === 'JEE' ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
              color: selectedCareer === 'JEE' ? '#818cf8' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Cpu size={16} /> Engineer / IITian (JEE)
          </button>
        </div>
      </div>

      {/* 1. Dynamic Hero Banner with Chosen Career Asset */}
      <div className="glass-card" style={{ 
        padding: '32px', 
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        display: 'grid',
        gridTemplateColumns: '1fr 280px',
        gap: '32px',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span className={`badge ${currentCareer.badgeColor}`}>
              <Flame size={14} /> 47-Day Streak Active
            </span>
            <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              {currentCareer.targetCollege}
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Aarav's Daily Command • {currentCareer.title}
          </h1>

          <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '8px', lineHeight: 1.5 }}>
            "You've shown up 47 of the last 52 days. Measured readiness is the product; identity survives a bad mock day."
          </p>

          {/* 2-Tap Quick Daily Check-in */}
          <div style={{
            marginTop: '20px',
            background: checkedIn ? 'rgba(52, 211, 153, 0.12)' : 'rgba(255,255,255,0.03)',
            border: checkedIn ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(255,255,255,0.08)',
            padding: '14px 20px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            maxWidth: '520px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: checkedIn ? '#34d399' : '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                {checkedIn ? 'Daily Log Verified ✓' : '2-Tap Daily Check-in'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '2px' }}>
                {checkedIn ? 'Shown up today! Streak preserved.' : 'Tap to log today\'s effort in 3 seconds'}
              </div>
            </div>

            <button
              onClick={() => setCheckedIn(!checkedIn)}
              className="btn-primary"
              style={{
                background: checkedIn ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #0284c7, #2563eb)',
                padding: '9px 18px',
                fontSize: '0.85rem'
              }}
            >
              {checkedIn ? 'Logged ✓' : 'Confirm Check-in'}
            </button>
          </div>
        </div>

        {/* Career Asset Showcase Image */}
        <div style={{ position: 'relative', height: '220px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(56, 189, 248, 0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <img 
            src={currentCareer.image} 
            alt={currentCareer.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.4s ease' }} 
          />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(7,10,18,0.95), transparent)', padding: '12px 14px' }}>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
              Chosen Career Vision
            </span>
            <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
              {currentCareer.title}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Highest Leverage Task Card */}
      <div className="glass-card" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '24px',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="#38bdf8" />
            <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Tonight's Single Most Impactful Task
            </span>
            <span className="badge badge-orange">
              Highest Leverage
            </span>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#f8fafc', lineHeight: 1.3 }}>
            {currentCareer.heroTask}
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px', lineHeight: 1.5 }}>
            {currentCareer.topLeverage}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px', fontSize: '0.85rem', color: '#e2e8f0' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={15} color="#38bdf8" /> 40 Minutes Target
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={15} color="#34d399" /> 15 Calibrated Questions
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('costudy')}
            className="btn-primary"
            style={{
              padding: '14px 28px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              whiteSpace: 'nowrap'
            }}
          >
            <Play size={18} fill="#fff" /> Start Focused Session
          </button>

          <button
            onClick={() => setActiveTab('timetable')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#94a3b8',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            View Full Timetable Schedule →
          </button>
        </div>
      </div>

      {/* 3. Live Metrics Command Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        
        <div 
          onClick={() => setActiveTab('heatmap')}
          className="glass-card" 
          style={{ padding: '22px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Exam Readiness Index</span>
            <span className="badge badge-green">+2.4 Wk</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#38bdf8' }}>
              {eriData ? eriData.overallEri : '71.2'}
            </span>
            <span style={{ fontSize: '1rem', color: '#64748b' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Consistency driven growth</span> <ArrowUpRight size={14} color="#34d399" />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Verified Study Time</span>
            <span className="badge badge-green">This Week</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#34d399' }}>
              8.0
            </span>
            <span style={{ fontSize: '1rem', color: '#94a3b8' }}>Hours</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            480 verified minutes logged via in-app practice
          </div>
        </div>

        <div onClick={() => setActiveTab('heatmap')} className="glass-card" style={{ padding: '22px', cursor: 'pointer', borderColor: 'rgba(251, 191, 36, 0.35)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600, textTransform: 'uppercase' }}>Decay Radar Signal</span>
            <span className="badge badge-orange">3 Topics</span>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
            Rotational Mechanics & Org Chem
          </div>
          <div style={{ fontSize: '0.78rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} /> Decay predicted if unrevised in 48h
          </div>
        </div>

        <div onClick={() => setActiveTab('backlog')} className="glass-card" style={{ padding: '22px', cursor: 'pointer', borderColor: 'rgba(251, 113, 133, 0.35)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#fb7185', fontWeight: 600, textTransform: 'uppercase' }}>Backlog Debt</span>
            <span className="badge badge-red">6.5 Hours</span>
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0' }}>
            2 Low-Yield Topics proposed for write-off
          </div>
          <div style={{ fontSize: '0.78rem', color: '#fb7185', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={14} /> Manageable balance sheet item →
          </div>
        </div>

      </div>

      {/* 4. Live Silent Co-Study Room Bar */}
      <div 
        onClick={() => setActiveTab('costudy')}
        className="glass-card" 
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.08), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(52, 211, 153, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#34d399',
            boxShadow: '0 0 12px #34d399',
            animation: 'pulse 2s infinite'
          }} />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#34d399" />
              <span>142 {selectedCareer} Aspirants Currently in Silent Focus Rooms</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              Room #4 Focus Block: 40 minutes remaining • Zero audio/video distraction
            </p>
          </div>
        </div>

        <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.85rem', padding: '8px 16px' }}>
          Join Silent Focus Room →
        </button>
      </div>

    </div>
  );
}
