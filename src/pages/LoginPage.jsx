import { useState, useEffect, useRef } from 'react';
import { systemSettings } from '../data/hospitalData';

const validUsers = [
  { username:'kolonel.romli', password:'ikhi2026!', ...systemSettings.users[0] },
  { username:'mayor.sari', password:'ikhi2026!', ...systemSettings.users[1] },
  { username:'kapten.budi', password:'ikhi2026!', ...systemSettings.users[2] },
  { username:'lettu.ahmad', password:'ikhi2026!', ...systemSettings.users[3] },
  { username:'serka.rini', password:'ikhi2026!', ...systemSettings.users[4] },
];

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('login'); // login | mfa | success
  const [mfaCode, setMfaCode] = useState('');
  const [mfaExpected] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);

  // Generate particles
  useEffect(() => {
    const pts = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.5 + 0.1,
      delay: Math.random() * 5,
    }));
    setParticles(pts);
  }, []);

  // Canvas grid animation
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
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(212,175,55,${0.08 * (1 - dist / 200)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212,175,55,0.3)';
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = validUsers.find(u => u.username === username && u.password === password);
      if (!user) {
        setError('Username atau password salah');
        setLoading(false);
        return;
      }
      setStep('mfa');
      setLoading(false);
    }, 1200);
  };

  const handleMFA = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (mfaCode === mfaExpected || mfaCode === '000000') {
        setStep('success');
        setTimeout(() => {
          const user = validUsers.find(u => u.username === username);
          onLogin(user);
        }, 1500);
      } else {
        setError('Kode MFA tidak valid');
      }
      setLoading(false);
    }, 800);
  };

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
        {/* Logo */}
        <div className="login-logo-section">
          <div className="login-logo-ring">
            <svg viewBox="0 0 80 80" width="80" height="80">
              <defs>
                <linearGradient id="lgGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#f0d65b" />
                  <stop offset="100%" stopColor="#c9a02e" />
                </linearGradient>
                <filter id="lgGlow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <circle cx="40" cy="40" r="36" fill="none" stroke="url(#lgGold)" strokeWidth="1.5" filter="url(#lgGlow)" className="login-ring-anim" />
              <circle cx="40" cy="40" r="30" fill="none" stroke="url(#lgGold)" strokeWidth="0.5" opacity="0.3" className="login-ring-anim-r" />
              <path d="M40 10 L44.5 27 L62 27 L48 37 L52 54 L40 44 L28 54 L32 37 L18 27 L35.5 27 Z" fill="url(#lgGold)" filter="url(#lgGlow)" />
            </svg>
          </div>
          <h1 className="login-brand">IKHI COMMAND CENTER</h1>
          <p className="login-brand-sub">Integrated Kemhan Health Intelligence</p>
          <div className="login-secure-badge">
            <span className="login-sec-dot" />
            SECURE MILITARY NETWORK • AES-256 ENCRYPTED
          </div>
        </div>

        {/* Login Form */}
        {step === 'login' && (
          <form className="login-form" onSubmit={handleLogin}>
            <h2 className="login-form-title">🔐 Authentication Required</h2>
            <p className="login-form-sub">Masukkan kredensial untuk mengakses Command Center</p>

            <div className="login-field">
              <label>👤 Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="kolonel.romli" required autoFocus />
            </div>

            <div className="login-field">
              <label>🔑 Password</label>
              <div className="login-pass-wrap">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                <button type="button" className="login-pass-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            {error && <div className="login-error">⚠️ {error}</div>}

            <button type="submit" className={`login-submit ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? (
                <><span className="login-spinner" /> Authenticating...</>
              ) : (
                <>🚀 Login to Command Center</>
              )}
            </button>

            <div className="login-hint">
              <span>💡 Demo: <code>kolonel.romli</code> / <code>ikhi2026!</code></span>
            </div>
          </form>
        )}

        {/* MFA Step */}
        {step === 'mfa' && (
          <form className="login-form" onSubmit={handleMFA}>
            <h2 className="login-form-title">🔒 Multi-Factor Authentication</h2>
            <p className="login-form-sub">Kode verifikasi telah dikirim ke perangkat Anda</p>

            <div className="login-mfa-code-display">
              <span className="login-mfa-label">Kode MFA (Demo)</span>
              <span className="login-mfa-value">{mfaExpected}</span>
            </div>

            <div className="login-field">
              <label>🔢 Kode 6-Digit</label>
              <input type="text" value={mfaCode} onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} required autoFocus className="login-mfa-input" />
            </div>

            {error && <div className="login-error">⚠️ {error}</div>}

            <button type="submit" className={`login-submit ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? <><span className="login-spinner" /> Verifying...</> : <>✅ Verify & Access</>}
            </button>

            <div className="login-hint"><span>💡 Masukkan kode di atas, atau gunakan <code>000000</code></span></div>
          </form>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="login-success">
            <div className="login-success-icon">✅</div>
            <h2>Authentication Successful</h2>
            <p>Initializing Command Center...</p>
            <div className="login-progress-bar"><div className="login-progress-fill" /></div>
          </div>
        )}

        {/* Footer */}
        <div className="login-footer">
          <p>© 2026 Kementerian Pertahanan Republik Indonesia</p>
          <p>CLASSIFIED — Untuk Kalangan Terbatas</p>
        </div>
      </div>
    </div>
  );
}
