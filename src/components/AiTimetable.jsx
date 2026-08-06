import React, { useState } from 'react';
import { Calendar, Sparkles, Clock, Target, Plus, CheckCircle2, Circle, Edit3, Save, Trash2, Zap, Bell, Check } from 'lucide-react';

export default function AiTimetable() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);

  // Phone Alarm-style Multi-Day Selection
  // Keys: 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
  // Default selected: Mon, Tue, Wed, Thu, Fri (like a weekday alarm)
  const [activeDays, setActiveDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  const daysList = [
    { key: 'Mon', label: 'M', full: 'Monday' },
    { key: 'Tue', label: 'T', full: 'Tuesday' },
    { key: 'Wed', label: 'W', full: 'Wednesday' },
    { key: 'Thu', label: 'T', full: 'Thursday' },
    { key: 'Fri', label: 'F', full: 'Friday' },
    { key: 'Sat', label: 'S', full: 'Saturday' },
    { key: 'Sun', label: 'S', full: 'Sunday' }
  ];

  // The active timetable schedule applied to all selected days
  const [timetableRows, setTimetableRows] = useState([
    { id: 1, time: '6:00 AM', activity: 'Wake up', mcqTarget: '—', isCompleted: true },
    { id: 2, time: '6:00 AM – 6:20 AM', activity: 'Freshen up & Hydrate', mcqTarget: '—', isCompleted: true },
    { id: 3, time: '6:20 AM – 7:30 AM', activity: "Revise previous day's lectures (1 hr 10 min)", mcqTarget: '15 Retrieval MCQs', isCompleted: true },
    { id: 4, time: '7:30 AM – 8:15 AM', activity: 'Breakfast & get ready', mcqTarget: '—', isCompleted: false },
    { id: 5, time: '8:15 AM – 9:00 AM', activity: 'Travel / Quick NCERT Revision', mcqTarget: '10 Formula Flashcards', isCompleted: false },
    { id: 6, time: '9:00 AM – 3:00 PM', activity: 'Coaching / Institute Lectures', mcqTarget: 'Class Notes & Drills', isCompleted: false },
    { id: 7, time: '3:00 PM – 3:45 PM', activity: 'Lunch & Power Rest', mcqTarget: '—', isCompleted: false },
    { id: 8, time: '3:45 PM – 5:45 PM', activity: "Solve today's physics & chem MCQs", mcqTarget: '40 PYQs', isCompleted: false },
    { id: 9, time: '5:45 PM – 6:15 PM', activity: 'Evening Break / Outdoor Walk', mcqTarget: '—', isCompleted: false },
    { id: 10, time: '6:15 PM – 8:15 PM', activity: 'Study concepts & Clear backlog', mcqTarget: '30 Concept MCQs', isCompleted: false },
    { id: 11, time: '8:15 PM – 9:00 PM', activity: 'Dinner with family', mcqTarget: '—', isCompleted: false },
    { id: 12, time: '9:00 PM – 10:30 PM', activity: 'Revision + Timed PYQs', mcqTarget: '25 Timed PYQs', isCompleted: false },
    { id: 13, time: '10:30 PM – 11:45 PM', activity: 'Biology NCERT Line-by-Line / Weak topics', mcqTarget: '35 NCERT MCQs', isCompleted: false },
    { id: 14, time: '11:45 PM – 12:00 AM', activity: 'Plan the next day & wind down', mcqTarget: '2-Tap Closeout Log', isCompleted: false },
    { id: 15, time: '12:00 AM – 6:00 AM', activity: 'Restorative Sleep (6 Hours)', mcqTarget: '—', isCompleted: false }
  ]);

  // Toggle day bubble on/off (Alarm style)
  const toggleDaySelection = (dayKey) => {
    setActiveDays((prev) =>
      prev.includes(dayKey)
        ? prev.filter((d) => d !== dayKey)
        : [...prev, dayKey]
    );
  };

  const selectPreset = (preset) => {
    if (preset === 'EVERYDAY') setActiveDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    else if (preset === 'WEEKDAYS') setActiveDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    else if (preset === 'WEEKENDS') setActiveDays(['Sat', 'Sun']);
  };

  const toggleRowCompletion = (id) => {
    setTimetableRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, isCompleted: !row.isCompleted } : row))
    );
  };

  const handleRowChange = (id, field, value) => {
    setTimetableRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleAiGenerate = (e) => {
    e.preventDefault();
    if (!aiPrompt) return;
    setIsGenerating(true);

    setTimeout(() => {
      const newId = Date.now();
      const newBlock = {
        id: newId,
        time: '8:15 PM – 9:15 PM',
        activity: `AI Custom Focus: ${aiPrompt}`,
        mcqTarget: '30 AI Selected MCQs',
        isCompleted: false
      };
      setTimetableRows((prev) => [...prev.slice(0, 10), newBlock, ...prev.slice(10)]);
      setIsGenerating(false);
      setAiPrompt('');
    }, 700);
  };

  const handleAddSlot = () => {
    const newId = Date.now();
    const newBlock = {
      id: newId,
      time: '07:00 PM – 08:00 PM',
      activity: 'Click Edit button to customize this activity',
      mcqTarget: '20 MCQs',
      isCompleted: false
    };
    setTimetableRows((prev) => [...prev, newBlock]);
    setEditingRowId(newId);
  };

  const handleDeleteRow = (id) => {
    setTimetableRows((prev) => prev.filter((r) => r.id !== id));
  };

  const formatAlarmRecurrence = () => {
    if (activeDays.length === 7) return 'Applies to Everyday (Mon – Sun)';
    if (activeDays.length === 0) return 'No Days Selected (Alarm Off)';
    if (
      activeDays.length === 5 &&
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].every((d) => activeDays.includes(d))
    ) {
      return 'Applies to Weekdays (Mon – Fri)';
    }
    if (
      activeDays.length === 2 &&
      ['Sat', 'Sun'].every((d) => activeDays.includes(d))
    ) {
      return 'Applies to Weekends (Sat, Sun)';
    }

    const orderedDays = daysList.filter(d => activeDays.includes(d.key)).map(d => d.full);
    return `Applies to ${orderedDays.join(', ')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: '#f8fafc', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={24} color="#38bdf8" /> AI Timetable & Alarm Day Selector
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '2px' }}>
          Tap day bubbles (alarm style) to apply this timetable to specific days of the week.
        </p>
      </div>

      {/* Phone Alarm-Style 7-Day Multi-Select Recurrence Card */}
      <div className="glass-card" style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              color: '#ffffff',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
            }}>
              <Bell size={22} />
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Phone Alarm Day Selection
              </div>
              <div style={{ fontSize: '1.1rem', color: '#f8fafc', fontWeight: 800, marginTop: '2px' }}>
                {formatAlarmRecurrence()}
              </div>
            </div>
          </div>

          {/* Alarm Repeat Presets */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => selectPreset('WEEKDAYS')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e2e8f0',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Weekdays
            </button>

            <button
              type="button"
              onClick={() => selectPreset('WEEKENDS')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e2e8f0',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Weekends
            </button>

            <button
              type="button"
              onClick={() => selectPreset('EVERYDAY')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e2e8f0',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Everyday
            </button>
          </div>
        </div>

        {/* 7 Phone Alarm Day Bubbles */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'rgba(255,255,255,0.02)',
          padding: '14px 20px',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
            Tap days to enable/disable schedule:
          </span>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {daysList.map((day) => {
              const isSelected = activeDays.includes(day.key);
              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => toggleDaySelection(day.key)}
                  title={`Toggle ${day.full}`}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: isSelected ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.12)',
                    background: isSelected
                      ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
                      : 'rgba(255,255,255,0.03)',
                    color: isSelected ? '#ffffff' : '#64748b',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 18px rgba(56, 189, 248, 0.5)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}
                >
                  {day.key}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Timetable Prompt Generator Box */}
      <form onSubmit={handleAiGenerate} className="glass-card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(15, 23, 42, 0.9))', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
        <input
          type="text"
          placeholder="Type custom prompt e.g. 'I wake up at 6 AM, coaching 9-3, need 2 hrs Physics MCQs'"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          style={{
            flex: '1 1 240px',
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: '#f8fafc',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={isGenerating}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', whiteSpace: 'nowrap', padding: '10px 18px', flex: '1 1 auto' }}
        >
          <Sparkles size={16} /> {isGenerating ? 'Compiling...' : 'Compile AI Timetable'}
        </button>
      </form>

      {/* 4-Column Editable Timetable Table */}
      <div className="glass-card" style={{ padding: '0px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '16px 20px', color: '#38bdf8', fontWeight: 700, width: '22%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={15} /> Time Slot</div>
              </th>
              <th style={{ padding: '16px 20px', color: '#f8fafc', fontWeight: 700, width: '42%' }}>Activity / Task Description</th>
              <th style={{ padding: '16px 20px', color: '#34d399', fontWeight: 700, width: '22%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Target size={15} /> Target MCQs to Solve</div>
              </th>
              <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 700, width: '14%', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {timetableRows.map((row, idx) => {
              const isEditing = editingRowId === row.id;
              return (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: idx === timetableRows.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                    background: isEditing ? 'rgba(56, 189, 248, 0.08)' : row.isCompleted ? 'rgba(52, 211, 153, 0.04)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    opacity: row.isCompleted && !isEditing ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* 1. Time Column */}
                  <td style={{ padding: '12px 20px', fontWeight: 700, color: row.isCompleted ? '#34d399' : '#38bdf8' }}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.time}
                        onChange={(e) => handleRowChange(row.id, 'time', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          background: '#0f172a',
                          border: '1px solid #38bdf8',
                          borderRadius: '6px',
                          color: '#38bdf8',
                          fontSize: '0.85rem',
                          fontWeight: 700
                        }}
                      />
                    ) : (
                      row.time
                    )}
                  </td>

                  {/* 2. Activity Column */}
                  <td style={{ padding: '12px 20px', color: row.isCompleted ? '#94a3b8' : '#e2e8f0', textDecoration: row.isCompleted && !isEditing ? 'line-through' : 'none', fontWeight: 500 }}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.activity}
                        onChange={(e) => handleRowChange(row.id, 'activity', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          background: '#0f172a',
                          border: '1px solid #38bdf8',
                          borderRadius: '6px',
                          color: '#f8fafc',
                          fontSize: '0.85rem'
                        }}
                      />
                    ) : (
                      row.activity
                    )}
                  </td>

                  {/* 3. Target MCQs Column */}
                  <td style={{ padding: '12px 20px' }}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.mcqTarget}
                        onChange={(e) => handleRowChange(row.id, 'mcqTarget', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          background: '#0f172a',
                          border: '1px solid #34d399',
                          borderRadius: '6px',
                          color: '#34d399',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}
                      />
                    ) : row.mcqTarget !== '—' ? (
                      <span className="badge badge-green">
                        <Zap size={12} /> {row.mcqTarget}
                      </span>
                    ) : (
                      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>—</span>
                    )}
                  </td>

                  {/* 4. Action Column: Complete, Edit/Save, Delete */}
                  <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <button
                        onClick={() => toggleRowCompletion(row.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: row.isCompleted ? '#34d399' : '#64748b', padding: 0 }}
                        title={row.isCompleted ? "Mark Pending" : "Mark Completed"}
                      >
                        {row.isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                      </button>

                      <button
                        onClick={() => setEditingRowId(isEditing ? null : row.id)}
                        style={{
                          background: isEditing ? 'rgba(52, 211, 153, 0.2)' : 'rgba(56, 189, 248, 0.1)',
                          color: isEditing ? '#34d399' : '#38bdf8',
                          border: isEditing ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      >
                        {isEditing ? <><Save size={13} /> Save</> : <><Edit3 size={13} /> Edit</>}
                      </button>

                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fb7185', opacity: 0.7 }}
                        title="Delete Row"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Table Footer Actions */}
        <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleAddSlot}
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} /> Add Custom Time Slot
          </button>

          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {timetableRows.filter(r => r.isCompleted).length} of {timetableRows.length} Slots Completed Today
          </span>
        </div>
      </div>
    </div>
  );
}
