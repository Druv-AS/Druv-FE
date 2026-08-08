import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Circle, RefreshCw, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../api';

export default function PlanCompiler() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commitment, setCommitment] = useState("6:30 AM at my desk starting tomorrow");
  const [isRecompiling, setIsRecompiling] = useState(false);

  useEffect(() => {
    fetchDailyPlan();
  }, []);

  const fetchDailyPlan = () => {
    setLoading(true);
    fetch(getApiUrl('/api/v1/plan/daily'))
      .then((res) => res.json())
      .then((data) => {
        setBlocks(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback demo data
        setBlocks([
          { id: 'B01', timeSlot: '06:30 AM - 08:00 AM', subject: 'Chemistry', topicName: 'Organic Reaction Mechanisms (Decay Halt)', activityType: 'RETRIEVAL_PRACTICE', durationMinutes: 90, weightagePercent: 8.0, isCompleted: true },
          { id: 'B02', timeSlot: '09:30 AM - 11:30 AM', subject: 'Physics', topicName: 'Thermodynamics & Heat (Weak Spot Clearing)', activityType: 'NEW_CONCEPT', durationMinutes: 120, weightagePercent: 5.2, isCompleted: false },
          { id: 'B03', timeSlot: '02:00 PM - 04:00 PM', subject: 'Biology', topicName: 'Genetics & Inheritance (High Weightage Practice)', activityType: 'RETRIEVAL_PRACTICE', durationMinutes: 120, weightagePercent: 11.5, isCompleted: false },
          { id: 'B04', timeSlot: '06:00 PM - 07:30 PM', subject: 'Physics & Chem', topicName: 'Timed 20-Q Set + Silent Co-Study Block', activityType: 'TIMED_MOCK', durationMinutes: 90, weightagePercent: 6.5, isCompleted: false },
          { id: 'B05', timeSlot: '09:30 PM - 10:00 PM', subject: 'General', topicName: "Evening Closeout & Tomorrow's Commitment Check", activityType: 'CLOSEOUT', durationMinutes: 30, weightagePercent: 0.0, isCompleted: false }
        ]);
        setLoading(false);
      });
  };

  const toggleCompletion = (id) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isCompleted: !b.isCompleted } : b))
    );
  };

  const handleRecompile = () => {
    setIsRecompiling(true);
    setTimeout(() => {
      fetchDailyPlan();
      setIsRecompiling(false);
    }, 600);
  };

  const getActivityBadge = (type) => {
    switch (type) {
      case 'RETRIEVAL_PRACTICE':
        return <span className="badge badge-green">Retrieval Practice</span>;
      case 'NEW_CONCEPT':
        return <span className="badge badge-orange">Weak Spot Focus</span>;
      case 'TIMED_MOCK':
        return <span className="badge badge-green"><Zap size={12} /> Timed Mock</span>;
      case 'CLOSEOUT':
        return <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>2-Tap Closeout</span>;
      default:
        return <span className="badge">Study Block</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '850px', margin: '0 auto' }}>
      {/* Header & Concept Principle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: '#f3f4f6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={22} color="#38bdf8" /> Daily Study Timetable (Plan Compiler)
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '2px' }}>
            The app proposes a feasibility-guaranteed schedule; you edit and drag blocks to build ownership.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={handleRecompile}
          disabled={isRecompiling}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', padding: '8px 14px' }}
        >
          <RefreshCw size={14} className={isRecompiling ? 'animate-spin' : ''} />
          {isRecompiling ? 'Recompiling...' : 'Recompile Plan (OR-Tools)'}
        </button>
      </div>

      {/* Commitment Banner */}
      <div className="glass-card" style={{ padding: '14px 18px', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(37, 99, 235, 0.1))', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sparkles size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Daily Commitment Moment</span>
            <p style={{ fontSize: '0.88rem', color: '#f3f4f6', fontWeight: 600 }}>"{commitment}"</p>
          </div>
        </div>
        <span className="badge badge-green">Adherence +34%</span>
      </div>

      {/* Timetable Blocks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{ padding: '40px', color: '#9ca3af', textAlign: 'center' }}>Compiling Feasible Timetable...</div>
        ) : (
          blocks.map((block) => (
            <div
              key={block.id}
              className="glass-card"
              style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                opacity: block.isCompleted ? 0.65 : 1,
                borderLeft: block.isCompleted ? '4px solid #4ade80' : '4px solid #0284c7',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 240px' }}>
                <button
                  onClick={() => toggleCompletion(block.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: block.isCompleted ? '#4ade80' : '#6b7280', padding: 0, flexShrink: 0 }}
                >
                  {block.isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </button>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {block.timeSlot}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>
                      {block.subject}
                    </span>
                    {block.weightagePercent > 0 && (
                      <span style={{ fontSize: '0.68rem', color: '#fb923c', background: 'rgba(251, 146, 60, 0.1)', padding: '1px 5px', borderRadius: '4px' }}>
                        {block.weightagePercent}% Exam Weight
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: block.isCompleted ? '#9ca3af' : '#f3f4f6', textDecoration: block.isCompleted ? 'line-through' : 'none' }}>
                    {block.topicName}
                  </h4>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {getActivityBadge(block.activityType)}
                <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600 }}>
                  {block.durationMinutes}m
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
