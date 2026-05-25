import { useState, useEffect, useRef, useCallback } from 'react';

const validUsers = [
  { email: 'admin@cross-dss.id', password: 'crossdss2026!', name: 'Dr. Irfan Hakim', role: 'Administrator', level: 'Super Admin', avatar: 'IH', org: 'Cross-DSS Platform' },
  { email: 'analis@atr-bpn.go.id', password: 'crossdss2026!', name: 'Ratna Kumalasari, S.Si', role: 'Analis Spasial ATR/BPN', level: 'Analis', avatar: 'RK', org: 'Kementerian ATR/BPN' },
  { email: 'operator@esdm.go.id', password: 'crossdss2026!', name: 'Budi Santoso, S.T.', role: 'Operator ESDM Minerba', level: 'Operator', avatar: 'BS', org: 'Kementerian ESDM' },
  { email: 'pengamat@klhk.go.id', password: 'crossdss2026!', name: 'Siti Nurhaliza, M.Sc', role: 'Pengamat KLHK', level: 'Pengamat', avatar: 'SN', org: 'Kementerian LHK' },
  { email: 'demo@nusatek.id', password: 'crossdss2026!', name: 'Demo User', role: 'Demo User', level: 'Viewer', avatar: 'DU', org: 'PT. NUSATEK' },
];

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('login'); // login | mfa | success
  const [mfaDigits, setMfaDigits] = useState(['', '', '', '', '', '']);
  const [mfaExpected] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));
  const [particles, setParticles] = useState([]);
  const [matchedUser, setMatchedUser] = useState(null);
  const canvasRef = useRef(null);

  // Generate floating particles
  useEffect(() => {
    const pts = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.5 + 0.1,
      delay: Math.random() * 5,
      color: Math.random() > 0.5 ? 'cyan' : 'purple',
    }));
    setParticles(pts);
  }, []);

  // Canvas network animation — cyan/purple theme
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const nodes = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: Math.random() > 0.5 ? '#00D4FF' : '#7B61FF',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const alpha = 0.07 * (1 - dist / 200);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = nodes[i].color + '55';
        ctx.fill();
        // Outer glow
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = nodes[i].color + '15';
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = validUsers.find(u => u.email === email && u.password === password);
      if (!user) {
        setError('Email atau password salah. Periksa kembali kredensial Anda.');
        setLoading(false);
        return;
      }
      setMatchedUser(user);
      setStep('mfa');
      setLoading(false);
    }, 1000);
  }, [email, password]);

  const handleMfaDigitChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...mfaDigits];
    newDigits[index] = cleanValue;
    setMfaDigits(newDigits);

    // Auto focus next input
    if (cleanValue && index < 5) {
      const nextInput = document.getElementById(`mfa-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleMfaDigitKeyDown = (index, e) => {
    // On backspace, focus previous input if current is empty
    if (e.key === 'Backspace' && !mfaDigits[index] && index > 0) {
      const prevInput = document.getElementById(`mfa-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newDigits = [...mfaDigits];
        newDigits[index - 1] = '';
        setMfaDigits(newDigits);
      }
    }
  };

  const handleMFA = useCallback((e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const enteredCode = mfaDigits.join('');
    setTimeout(() => {
      if (enteredCode === mfaExpected || enteredCode === '000000') {
        setStep('success');
        setTimeout(() => {
          if (matchedUser) {
            const { password: _, ...safeUser } = matchedUser;
            onLogin(safeUser);
          }
        }, 2000);
      } else {
        setError('Kode MFA tidak valid. Silakan coba lagi.');
      }
      setLoading(false);
    }, 800);
  }, [mfaDigits, mfaExpected, matchedUser, onLogin]);

  return (
    <div className="login-page">
      <canvas ref={canvasRef} className="login-canvas" />

      {/* Floating particles */}
      <div className="login-particles">
        {particles.map(p => (
          <div key={p.id} className="login-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            opacity: p.opacity,
            background: p.color === 'cyan' ? '#00D4FF' : '#7B61FF',
            boxShadow: `0 0 8px ${p.color === 'cyan' ? '#00D4FF' : '#7B61FF'}`,
            animationDuration: `${20 + p.delay * 4}s`,
            animationDelay: `${p.delay}s`,
          }} />
        ))}
      </div>

      {/* Glow orbs */}
      <div className="login-orb login-orb-1" style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, rgba(0,0,0,0) 70%)', top: '10%', left: '10%', zIndex: 1, pointerEvents: 'none' }} />
      <div className="login-orb login-orb-2" style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,97,255,0.08) 0%, rgba(0,0,0,0) 70%)', bottom: '10%', right: '10%', zIndex: 1, pointerEvents: 'none' }} />

      {/* Scan line */}
      <div className="login-scanline" style={{ position: 'absolute', width: '100%', height: '2px', background: 'linear-gradient(90deg, rgba(0,212,255,0) 0%, rgba(0,212,255,0.15) 50%, rgba(0,212,255,0) 100%)', zIndex: 2, pointerEvents: 'none', animation: 'scanLine 8s linear infinite' }} />

      <div className="login-card">
        {/* Logo Section */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <svg viewBox="0 0 90 90" width="48" height="48">
              <defs>
                <linearGradient id="lgCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D4FF" />
                  <stop offset="50%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#7B61FF" />
                </linearGradient>
                <linearGradient id="lgPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7B61FF" />
                  <stop offset="100%" stopColor="#00D4FF" />
                </linearGradient>
                <filter id="lgGlow"><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              {/* Shield shape */}
              <path d="M45 12 L66 24 L66 44 C66 58 56 68 45 75 C34 68 24 58 24 44 L24 24 Z" fill="rgba(0,212,255,0.05)" stroke="url(#lgCyan)" strokeWidth="2" filter="url(#lgGlow)" />
              {/* Crosshair/Map symbol inside */}
              <rect x="35" y="32" width="20" height="16" rx="2" fill="none" stroke="#7B61FF" strokeWidth="1.2" />
              <line x1="45" y1="28" x2="45" y2="52" stroke="#00D4FF" strokeWidth="0.8" />
              <line x1="30" y1="40" x2="60" y2="40" stroke="#00D4FF" strokeWidth="0.8" />
              <circle cx="45" cy="40" r="3" fill="#00D4FF" />
            </svg>
          </div>
          <h1 className="login-logo-title">CROSS-DSS</h1>
          <p className="login-logo-sub">Cross-Sectoral Intelligence & Decision Support System</p>
          <div style={{ marginTop: '8px', fontSize: '9px', color: '#00D4FF', letterSpacing: '1px', fontWeight: 'bold', background: 'rgba(0, 212, 255, 0.08)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
            SECURE CHANNEL • TLS 1.3
          </div>
        </div>

        {/* Login Form */}
        {step === 'login' && (
          <form className="login-form" onSubmit={handleLogin}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '14px', color: 'var(--text-bright)', fontWeight: '600' }}>🔐 Autentikasi Sistem</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Gunakan kredensial terdaftar Anda</p>
            </div>

            <div className="login-field">
              <svg className="login-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <input className="login-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Alamat Email" required autoFocus autoComplete="email" />
            </div>

            <div className="login-field">
              <svg className="login-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input className="login-input" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Kata Sandi" required autoComplete="current-password" style={{ paddingRight: '40px' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>

            {error && <div className="login-error">⚠️ {error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                  Mengotentikasi...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  Masuk ke Platform
                </span>
              )}
            </button>

            {/* Quick Demo Autocomplete */}
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <span style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                <span>AKUN UJI COBA (KLIK UNTUK AUTOFIL)</span>
                <span style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {validUsers.map(u => (
                  <button key={u.email} type="button" onClick={() => { setEmail(u.email); setPassword(u.password); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%' }} className="demo-user-selector-btn">
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#fff', flexShrink: 0 }}>{u.avatar}</span>
                    <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.role}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* MFA Step */}
        {step === 'mfa' && (
          <form className="login-form login-mfa" onSubmit={handleMFA}>
            <h2 className="login-mfa-title">🔒 Multi-Factor Authentication</h2>
            <p className="login-mfa-desc">Masukkan kode verifikasi 6-digit untuk melanjutkan</p>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', marginBottom: '18px', textAlign: 'left' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>{matchedUser?.avatar || '??'}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{matchedUser?.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{matchedUser?.org}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(0, 212, 255, 0.05)', border: '1px dashed rgba(0, 212, 255, 0.2)', padding: '10px', borderRadius: '6px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Kode Verifikasi (Demo)</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '14px' }}>{mfaExpected}</span>
            </div>

            <div className="login-mfa-inputs">
              {mfaDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`mfa-input-${idx}`}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="login-mfa-digit"
                  value={digit}
                  maxLength={1}
                  onChange={e => handleMfaDigitChange(idx, e.target.value)}
                  onKeyDown={e => handleMfaDigitKeyDown(idx, e)}
                  required
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            {error && <div className="login-error">⚠️ {error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span>Memverifikasi...</span> : <span>✅ Verifikasi & Masuk</span>}
            </button>

            <div style={{ marginTop: '14px', fontSize: '10.5px', color: 'var(--text-muted)', textAlign: 'center' }}>
              <span>💡 Gunakan kode di atas atau <code>000000</code> untuk bypass</span>
            </div>

            <button type="button" onClick={() => { setStep('login'); setError(''); setMfaDigits(['', '', '', '', '', '']); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', marginTop: '16px', textDecoration: 'underline', width: '100%', textAlign: 'center' }}>
              ← Kembali ke Form Login
            </button>
          </form>
        )}

        {/* Success Animation */}
        {step === 'success' && (
          <div className="login-success">
            <div className="login-success-icon" style={{ color: '#00FF88' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="login-success-text">Autentikasi Berhasil</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Memuat modul Cross-DSS...</p>
            
            <div style={{ margin: '16px 0', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', display: 'inline-block', minWidth: '180px' }}>
              <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>{matchedUser?.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{matchedUser?.role}</div>
            </div>

            {/* Fake progress bar */}
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', margin: '20px auto', width: '90%' }}>
              <div className="login-progress-fill" style={{ height: '100%', width: '0%', background: 'var(--accent-gradient)', animation: 'spin 2s ease-in-out forwards' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'left', width: '80%', margin: '0 auto' }}>
              <span className="login-module-item">✓ GIS Engine Initialized</span>
              <span className="login-module-item">✓ Spatial Data Cache Sync Finished</span>
              <span className="login-module-item">✓ AI Analytics Model Ready</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="login-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            <span>PT. NUSATEK</span>
          </div>
          <p style={{ margin: 0 }}>© 2026 Cross-Sectoral Decision Support System</p>
          <p style={{ margin: '2px 0 0 0', color: 'var(--alert-conflict)', letterSpacing: '0.5px' }}>RESTRICTED ACCESS ONLY</p>
        </div>
      </div>
    </div>
  );
}
