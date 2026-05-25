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
  const [mfaCode, setMfaCode] = useState('');
  const [mfaExpected] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));
  const [particles, setParticles] = useState([]);
  const [matchedUser, setMatchedUser] = useState(null);
  const canvasRef = useRef(null);

  // Generate floating particles
  useEffect(() => {
    const pts = Array.from({ length: 60 }, (_, i) => ({
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

    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
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
          if (dist < 220) {
            const alpha = 0.08 * (1 - dist / 220);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = nodes[i].color + '55';
        ctx.fill();
        // Outer glow
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 4, 0, Math.PI * 2);
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
    }, 1200);
  }, [email, password]);

  const handleMFA = useCallback((e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (mfaCode === mfaExpected || mfaCode === '000000') {
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
  }, [mfaCode, mfaExpected, matchedUser, onLogin]);

  return (
    <div className="login-page">
      <canvas ref={canvasRef} className="login-canvas" />

      {/* Floating particles */}
      <div className="login-particles">
        {particles.map(p => (
          <div key={p.id} className={`login-particle login-particle--${p.color}`} style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${20 + p.delay * 4}s`,
            animationDelay: `${p.delay}s`,
          }} />
        ))}
      </div>

      {/* Glow orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      {/* Scan line */}
      <div className="login-scanline" />

      <div className={`login-container ${step}`}>
        {/* Logo Section */}
        <div className="login-logo-section">
          <div className="login-logo-ring">
            <svg viewBox="0 0 90 90" width="90" height="90">
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
                <filter id="lgGlow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              {/* Outer shield ring */}
              <circle cx="45" cy="45" r="42" fill="none" stroke="url(#lgCyan)" strokeWidth="1.2" filter="url(#lgGlow)" className="login-ring-anim" />
              <circle cx="45" cy="45" r="36" fill="none" stroke="url(#lgPurple)" strokeWidth="0.5" opacity="0.3" className="login-ring-anim-r" />
              {/* Shield shape */}
              <path d="M45 12 L66 24 L66 44 C66 58 56 68 45 75 C34 68 24 58 24 44 L24 24 Z" fill="none" stroke="url(#lgCyan)" strokeWidth="1.5" filter="url(#lgGlow)" opacity="0.9" />
              <path d="M45 16 L62 26 L62 43 C62 55 54 64 45 70 C36 64 28 55 28 43 L28 26 Z" fill="rgba(0,212,255,0.06)" stroke="none" />
              {/* Map/crosshair icon inside shield */}
              <rect x="35" y="32" width="20" height="16" rx="2" fill="none" stroke="url(#lgCyan)" strokeWidth="1" opacity="0.8" />
              <line x1="45" y1="30" x2="45" y2="50" stroke="#00D4FF" strokeWidth="0.5" opacity="0.5" />
              <line x1="33" y1="40" x2="57" y2="40" stroke="#00D4FF" strokeWidth="0.5" opacity="0.5" />
              <circle cx="42" cy="38" r="2" fill="#00D4FF" opacity="0.7" />
              <circle cx="50" cy="42" r="1.5" fill="#7B61FF" opacity="0.7" />
              <path d="M38 44 L42 38 L46 41 L52 36" fill="none" stroke="#00FF88" strokeWidth="0.8" opacity="0.6" />
            </svg>
          </div>
          <h1 className="login-brand">CROSS-DSS</h1>
          <p className="login-brand-sub">Cross-Sectoral Intelligence & Decision Support System</p>
          <div className="login-secure-badge">
            <span className="login-sec-dot" />
            SECURE CHANNEL • TLS 1.3 ENCRYPTED
          </div>
        </div>

        {/* Login Form */}
        {step === 'login' && (
          <form className="login-form" onSubmit={handleLogin}>
            <h2 className="login-form-title">🔐 Autentikasi Diperlukan</h2>
            <p className="login-form-sub">Masukkan kredensial untuk mengakses platform DSS</p>

            <div className="login-field">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@cross-dss.id" required autoFocus autoComplete="email" />
            </div>

            <div className="login-field">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Password
              </label>
              <div className="login-pass-wrap">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />
                <button type="button" className="login-pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && <div className="login-error">⚠️ {error}</div>}

            <button type="submit" className={`login-submit ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? (
                <><span className="login-spinner" /> Authenticating...</>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  Masuk ke Platform
                </>
              )}
            </button>

            <div className="login-demo-section">
              <div className="login-demo-label">
                <span className="login-demo-line" />
                <span>Akun Demo</span>
                <span className="login-demo-line" />
              </div>
              <div className="login-demo-users">
                {validUsers.map(u => (
                  <button key={u.email} type="button" className="login-demo-btn" onClick={() => { setEmail(u.email); setPassword(u.password); }}>
                    <span className="login-demo-avatar">{u.avatar}</span>
                    <span className="login-demo-info">
                      <span className="login-demo-name">{u.name}</span>
                      <span className="login-demo-role">{u.role}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* MFA Step */}
        {step === 'mfa' && (
          <form className="login-form" onSubmit={handleMFA}>
            <h2 className="login-form-title">🔒 Multi-Factor Authentication</h2>
            <p className="login-form-sub">Kode verifikasi telah dikirim ke perangkat Anda</p>

            <div className="login-mfa-user-info">
              <div className="login-mfa-user-avatar">{matchedUser?.avatar || '??'}</div>
              <div className="login-mfa-user-detail">
                <span className="login-mfa-user-name">{matchedUser?.name}</span>
                <span className="login-mfa-user-role">{matchedUser?.org}</span>
              </div>
            </div>

            <div className="login-mfa-code-display">
              <span className="login-mfa-label">Kode MFA (Demo)</span>
              <span className="login-mfa-value">{mfaExpected}</span>
            </div>

            <div className="login-field">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>
                Kode 6-Digit
              </label>
              <input
                type="text"
                value={mfaCode}
                onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                autoFocus
                className="login-mfa-input"
              />
            </div>

            {error && <div className="login-error">⚠️ {error}</div>}

            <button type="submit" className={`login-submit ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? <><span className="login-spinner" /> Verifying...</> : <>✅ Verifikasi & Akses</>}
            </button>

            <div className="login-hint"><span>💡 Masukkan kode di atas, atau gunakan <code>000000</code></span></div>

            <button type="button" className="login-back-btn" onClick={() => { setStep('login'); setError(''); setMfaCode(''); }}>
              ← Kembali ke Login
            </button>
          </form>
        )}

        {/* Success Animation */}
        {step === 'success' && (
          <div className="login-success">
            <div className="login-success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2>Authentication Successful</h2>
            <p>Initializing Cross-DSS Platform...</p>
            <div className="login-success-user">
              <span>{matchedUser?.name}</span>
              <span>{matchedUser?.role}</span>
            </div>
            <div className="login-progress-bar"><div className="login-progress-fill" /></div>
            <div className="login-loading-modules">
              <span className="login-module-item login-module-anim-1">Loading GIS Engine...</span>
              <span className="login-module-item login-module-anim-2">Syncing Layer Data...</span>
              <span className="login-module-item login-module-anim-3">Initializing AI/DSS...</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="login-footer">
          <div className="login-footer-brand">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            <span>PT. NUSATEK</span>
          </div>
          <p className="login-footer-copy">© 2026 Cross-Sectoral Decision Support System</p>
          <p className="login-footer-classify">RESTRICTED — Akses Hanya untuk Pengguna Terotorisasi</p>
        </div>
      </div>
    </div>
  );
}
