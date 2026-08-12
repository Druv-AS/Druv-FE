import React, { useState } from 'react';
import { 
  Phone, User, GraduationCap, ShieldCheck, ArrowRight, Hash, 
  HeartHandshake, Zap, Lock, Eye, EyeOff, CheckCircle2, 
  AlertCircle, LogIn, UserPlus, Sparkles, KeyRound 
} from 'lucide-react';
import { apiFetch, ApiError } from '../api';

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
    if (pass.length >= 8) score += 25;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();
    const trimmedUserId = userId.trim();
    const trimmedParentPhone = parentPhone.trim();

    if (!trimmedPhone) {
      setErrorMessage('Please enter your Mobile Number or User ID.');
      return;
    }

    if (!trimmedPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (authMode === 'register') {
      if (!trimmedName) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your passwords.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const isStudent = role === 'STUDENT';
      const endpoint = isStudent ? '/api/v1/auth/student' : '/api/v1/auth/parent';

      const body = {
        mode: authMode,
        userId: trimmedUserId,
        phoneNumber: trimmedPhone,
        password,
      };
      if (authMode === 'register') {
        body.name = trimmedName;
        if (isStudent) {
          body.parentPhoneNumber = trimmedParentPhone;
          body.examTarget = course;
        }
      }

      // The session cookie is set by this response; the returned object is profile data,
      // not a credential. Nothing is written to localStorage.
      const session = await apiFetch(endpoint, { method: 'POST', body });
      onLogin(session);
    } catch (err) {
      setErrorMessage(messageForError(err, authMode));
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

          {/* Target Exam / Goal (For Student Login & Registration) */}
          {role === 'STUDENT' && (
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Target Exam / Pattern Goal
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  background: '#0f172a',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
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
              authMode === 'login' ? 'Signing In...' : 'Creating Account...'
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

/**
 * Turns an API failure into user-facing copy, keyed on the server's stable `code`.
 * The previous implementation matched substrings of the message text, so any rewording
 * on the server silently broke the UI's branching.
 */
function messageForError(err, authMode) {
  if (!(err instanceof ApiError)) {
    return 'Something went wrong. Please try again.';
  }

  switch (err.code) {
    case 'INVALID_CREDENTIALS':
      return 'Incorrect mobile number, user ID, or password. If you have not registered yet, switch to Create Account.';
    case 'ACCOUNT_ALREADY_EXISTS':
      return 'An account already exists with this mobile number. Please switch to Sign In.';
    case 'USER_ID_TAKEN':
      return err.message;
    case 'INVALID_PHONE':
      return 'Enter a valid 10-digit Indian mobile number.';
    case 'INVALID_PARENT_PHONE':
      return 'Enter a valid 10-digit parent mobile number, or leave it blank.';
    case 'VALIDATION_FAILED':
      return err.fields ? Object.values(err.fields)[0] : err.message;
    case 'RATE_LIMITED':
      return 'Too many attempts. Please wait a few minutes before trying again.';
    case 'NETWORK_ERROR':
      return 'Cannot reach the Dhruv server. Check your connection and try again.';
    default:
      return err.message || (authMode === 'login' ? 'Sign in failed.' : 'Account creation failed.');
  }
}
