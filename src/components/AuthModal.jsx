import React, { useState } from 'react';
import { 
  Phone, User, GraduationCap, ShieldCheck, ArrowRight, Hash, 
  HeartHandshake, Zap, Lock, Eye, EyeOff, CheckCircle2, 
  AlertCircle, LogIn, UserPlus, Sparkles, KeyRound 
} from 'lucide-react';

export default function AuthModal({ onLogin }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('STUDENT'); // 'STUDENT' or 'PARENT'
  
  // Form fields
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [phone, setPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [course, setCourse] = useState('NEET 2027 Repeater');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass) || /[A-Z]/.test(pass)) score += 25;

    if (score <= 25) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 50) return { score, label: 'Fair', color: '#f59e0b' };
    if (score <= 75) return { score, label: 'Strong', color: '#3b82f6' };
    return { score, label: 'Unstoppable', color: '#10b981' };
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  // Preset demo handlers
  const handleQuickDemoStudent = () => {
    setRole('STUDENT');
    setName('Aarav Sharma');
    setUserId('aarav_2027');
    setPhone('+919876543210');
    setParentPhone('+919876543211');
    setCourse('NEET 2027 Repeater');
    setPassword('Dhruv#2027');
    setConfirmPassword('Dhruv#2027');
    setErrorMessage('');
  };

  const handleQuickDemoParent = () => {
    setRole('PARENT');
    setName('Rajesh Sharma');
    setUserId('parent_rajesh');
    setPhone('+919876543211');
    setPassword('DhruvParent#2027');
    setConfirmPassword('DhruvParent#2027');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (authMode === 'register' && password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your passwords.');
      return;
    }

    if (!phone && !userId) {
      setErrorMessage('Please enter your Mobile Number or User ID.');
      return;
    }

    if (authMode === 'register' && !name) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);

    const effectiveName = name.trim() || (role === 'STUDENT' ? 'Student User' : 'Parent User');
    const generatedUserId = userId.trim() || effectiveName.toLowerCase().replace(/\s+/g, '_') + '_' + (phone.length > 4 ? phone.slice(-4) : '1234');
    const targetParentPhone = role === 'STUDENT' ? (parentPhone.trim() || '+919876543211') : phone.trim();

    try {
      if (role === 'STUDENT') {
        const res = await fetch('/api/v1/auth/student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: authMode,
            name: effectiveName,
            userId: generatedUserId,
            phoneNumber: phone.trim() || '+919876543210',
            parentPhoneNumber: targetParentPhone,
            examTarget: course,
            password: password
          })
        });
        
        let data = {};
        try {
          data = await res.json();
        } catch(err) {
          data = {};
        }

        if (!res.ok || data.error) {
          const errText = data.error || 'Authentication failed.';
          if (errText.includes('ACCOUNT_NOT_FOUND')) {
            setErrorMessage('Account not found for this Mobile/User ID. Redirecting to Create Account...');
            setTimeout(() => {
              setAuthMode('register');
              setErrorMessage('');
            }, 1200);
            return;
          } else if (errText.includes('INVALID_PASSWORD')) {
            setErrorMessage('Incorrect password. Please verify and try again.');
            return;
          } else {
            setErrorMessage(errText);
            return;
          }
        }

        const userData = {
          id: data.id || 'std_' + Date.now(),
          name: data.name || effectiveName,
          userId: data.userId || generatedUserId,
          phone: data.phoneNumber || phone || '+919876543210',
          parentPhone: data.parentPhoneNumber || targetParentPhone,
          course: data.targetCourse || course,
          role: 'STUDENT',
          level: data.level || 12,
          xp: data.xp || 3450,
          streak: data.streakCount || 47,
          isLoggedIn: true
        };

        localStorage.setItem('dhruv_user', JSON.stringify(userData));
        onLogin(userData);
      } else {
        const res = await fetch('/api/v1/auth/parent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: authMode,
            name: effectiveName,
            userId: generatedUserId,
            phoneNumber: phone.trim() || '+919876543211',
            password: password
          })
        });

        let data = {};
        try {
          data = await res.json();
        } catch(err) {
          data = {};
        }

        if (!res.ok || data.error) {
          const errText = data.error || 'Authentication failed.';
          if (errText.includes('ACCOUNT_NOT_FOUND')) {
            setErrorMessage('Account not found for this Mobile/User ID. Redirecting to Create Account...');
            setTimeout(() => {
              setAuthMode('register');
              setErrorMessage('');
            }, 1200);
            return;
          } else if (errText.includes('INVALID_PASSWORD')) {
            setErrorMessage('Incorrect password. Please verify and try again.');
            return;
          } else {
            setErrorMessage(errText);
            return;
          }
        }

        const userData = {
          id: data.id || 'prt_' + Date.now(),
          name: data.name || effectiveName,
          userId: data.userId || generatedUserId,
          phone: data.phoneNumber || phone || '+919876543211',
          role: 'PARENT',
          isLoggedIn: true
        };

        localStorage.setItem('dhruv_user', JSON.stringify(userData));
        onLogin(userData);
      }
    } catch (err) {
      if (authMode === 'login') {
        setErrorMessage('Account not found or server offline. Redirecting to Create Account...');
        setTimeout(() => {
          setAuthMode('register');
          setErrorMessage('');
        }, 1200);
      } else {
        const fallbackData = {
          name: effectiveName,
          userId: generatedUserId,
          phone: phone || '+919876543210',
          parentPhone: targetParentPhone,
          course,
          role,
          isLoggedIn: true
        };
        localStorage.setItem('dhruv_user', JSON.stringify(fallbackData));
        onLogin(fallbackData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(7, 10, 18, 0.94)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div className="glass-card" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '28px 24px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.96))',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(56, 189, 248, 0.15)',
        borderRadius: '20px',
        maxHeight: '92vh',
        overflowY: 'auto'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.4rem',
            margin: '0 auto 10px',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
          }}>
            Dh
          </div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: '#f8fafc', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Welcome to Dhruv
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
            AI Readiness & Parent Transparency Platform
          </p>
        </div>

        {/* Auth Mode Switcher Tabs: Login vs Create Account */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '4px',
          borderRadius: '14px',
          marginBottom: '14px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: authMode === 'login' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
              color: authMode === 'login' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: authMode === 'login' ? '0 4px 12px rgba(2, 132, 199, 0.35)' : 'none'
            }}
          >
            <LogIn size={16} /> Login
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: authMode === 'register' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
              color: authMode === 'register' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: authMode === 'register' ? '0 4px 12px rgba(2, 132, 199, 0.35)' : 'none'
            }}
          >
            <UserPlus size={16} /> Create Account
          </button>
        </div>

        {/* Role Switcher: Student vs Parent */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '10px',
              border: role === 'STUDENT' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              background: role === 'STUDENT' ? 'rgba(2, 132, 199, 0.15)' : 'rgba(255, 255, 255, 0.02)',
              color: role === 'STUDENT' ? '#38bdf8' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <GraduationCap size={15} /> Student
          </button>

          <button
            type="button"
            onClick={() => setRole('PARENT')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '10px',
              border: role === 'PARENT' ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.08)',
              background: role === 'PARENT' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
              color: role === 'PARENT' ? '#34d399' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={15} /> Parent Portal
          </button>
        </div>

        {/* Quick Demo Preset Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          padding: '8px 12px',
          background: 'rgba(56, 189, 248, 0.05)',
          borderRadius: '12px',
          border: '1px dashed rgba(56, 189, 248, 0.3)',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={14} /> Quick Demo:
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={handleQuickDemoStudent}
              style={{
                padding: '5px 10px',
                fontSize: '0.72rem',
                borderRadius: '6px',
                background: 'rgba(2, 132, 199, 0.25)',
                border: '1px solid rgba(2, 132, 199, 0.5)',
                color: '#38bdf8',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              ⚡ Student
            </button>
            <button
              type="button"
              onClick={handleQuickDemoParent}
              style={{
                padding: '5px 10px',
                fontSize: '0.72rem',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.25)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                color: '#34d399',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              ⚡ Parent
            </button>
          </div>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div style={{
            padding: '10px 14px',
            marginBottom: '14px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '10px',
            color: '#f87171',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
          
          {/* Full Name (For Registration) */}
          {authMode === 'register' && (
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={17} color="#64748b" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                <input
                  type="text"
                  required
                  placeholder={role === 'STUDENT' ? "e.g. Aarav Sharma" : "e.g. Rajesh Sharma"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 38px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          {/* User ID / Phone Input */}
          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              {authMode === 'login' ? (role === 'STUDENT' ? "Mobile Number or User ID *" : "Parent Mobile Number or User ID *") : (role === 'STUDENT' ? "Student Mobile Number *" : "Parent Mobile Number *")}
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={17} color="#64748b" style={{ position: 'absolute', left: '12px', top: '11px' }} />
              <input
                type="text"
                required
                placeholder={role === 'STUDENT' ? "+91 98765 43210 or aarav_2027" : "+91 98765 43211 or parent_rajesh"}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 38px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* User ID (Optional during Registration) */}
          {authMode === 'register' && (
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                {role === 'STUDENT' ? "Custom User ID (Optional)" : "Parent User ID (Optional)"}
              </label>
              <div style={{ position: 'relative' }}>
                <Hash size={17} color="#64748b" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                <input
                  type="text"
                  placeholder={role === 'STUDENT' ? "e.g. aarav_2027" : "e.g. parent_rajesh"}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 38px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          {/* Parent Phone Number (For Student Registration) */}
          {authMode === 'register' && role === 'STUDENT' && (
            <div>
              <label style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Parent Mobile Number (For Weekly Progress Sharing) *
              </label>
              <div style={{ position: 'relative' }}>
                <HeartHandshake size={17} color="#38bdf8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43211"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 38px',
                    background: 'rgba(56, 189, 248, 0.06)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '10px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          {/* Target Exam (For Student Registration) */}
          {authMode === 'register' && role === 'STUDENT' && (
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Target Exam / Goal
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
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

          {/* Password Input (Login & Register) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                {authMode === 'register' ? "Create Password *" : "Password *"}
              </label>
              {authMode === 'login' && (
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', cursor: 'pointer' }} onClick={() => alert('Feature hint: Demo users can enter any password or click Quick Demo above.')}>
                  Forgot Password?
                </span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={17} color="#64748b" style={{ position: 'absolute', left: '12px', top: '11px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={authMode === 'register' ? "Create a strong password" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 38px 9px 38px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '9px',
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Strength Meter (Only in Register mode when user is typing) */}
            {authMode === 'register' && password && (
              <div style={{ marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '3px' }}>
                  <span style={{ color: '#64748b' }}>Password Strength:</span>
                  <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${strength.score}%`,
                    height: '100%',
                    background: strength.color,
                    transition: 'all 0.3s ease'
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Input (Only in Register mode) */}
          {authMode === 'register' && (
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={17} color="#64748b" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 38px 9px 38px',
                    background: 'rgba(255,255,255,0.04)',
                    border: confirmPassword && !passwordsMatch ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '9px',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Match Status Badge */}
              {confirmPassword.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  marginTop: '4px',
                  color: passwordsMatch ? '#34d399' : '#f87171'
                }}>
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 size={13} color="#34d399" />
                      <span>Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={13} color="#f87171" />
                      <span>Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              marginTop: '8px',
              padding: '12px',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              boxShadow: '0 4px 18px rgba(2, 132, 199, 0.4)',
              cursor: 'pointer'
            }}
          >
            {isSubmitting ? (
              'Authenticating...'
            ) : authMode === 'login' ? (
              <>Sign In <ArrowRight size={16} /></>
            ) : (
              <>Create Account <Sparkles size={16} /></>
            )}
          </button>
        </form>

        {/* Bottom Mode Switch Link */}
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: '#94a3b8' }}>
          {authMode === 'login' ? (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Create Account
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
