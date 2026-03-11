import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

const backgroundImageUrl = `${process.env.PUBLIC_URL}/image.jpg`;

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --green:      #00d68f;
  --green-dim:  #00a86b;
  --green-glow: rgba(0,214,143,0.18);
  --cyan:       #00e5ff;
  --red:        #ff4d6d;
  --bg:         #080f0c;
  --surface:    rgba(255,255,255,0.04);
  --border:     rgba(255,255,255,0.08);
  --border-up:  rgba(0,214,143,0.28);
  --text:       #d6ede5;
  --text-muted: #4a7060;
  --text-dim:   #2a4a3a;
  --mono:       'DM Mono', monospace;
  --sans:       'Outfit', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.login-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--sans);
  color: var(--text);
  position: relative;
  overflow: hidden;
  background-color: var(--bg);
}

/* ── Background image with dark overlay ── */
.login-bg-img {
  position: absolute;
  inset: 0;
  background-image: url(${backgroundImageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.12;
  filter: saturate(0.4);
  z-index: 0;
}

/* ── Ambient orbs ── */
.login-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  z-index: 0;
}
.login-orb-1 {
  width: 520px; height: 420px;
  top: -140px; left: -100px;
  background: radial-gradient(circle, rgba(0,214,143,0.18) 0%, transparent 70%);
  animation: orb1 18s ease-in-out infinite alternate;
}
.login-orb-2 {
  width: 400px; height: 360px;
  bottom: -80px; right: -60px;
  background: radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%);
  animation: orb2 24s ease-in-out infinite alternate;
}
@keyframes orb1 {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(40px,30px) scale(1.1); }
}
@keyframes orb2 {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(-30px,-20px) scale(1.08); }
}

/* ── Grid overlay ── */
.login-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,214,143,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,214,143,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
}

/* ── Card ── */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  margin: 20px;
  background: rgba(13, 23, 18, 0.82);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 40px 36px 36px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow:
    0 0 0 1px rgba(0,214,143,0.06),
    0 24px 60px rgba(0,0,0,0.5),
    0 0 80px rgba(0,214,143,0.05);
  animation: card-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes card-in {
  from { opacity:0; transform: translateY(24px) scale(0.97); }
  to   { opacity:1; transform: translateY(0) scale(1); }
}

/* top shimmer */
.login-card::before {
  content: '';
  position: absolute;
  top: 0; left: 12%; right: 12%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,214,143,0.55), rgba(0,229,255,0.3), transparent);
  border-radius: 1px;
}

/* ── Brand mark ── */
.login-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 32px;
}
.login-brand-mark {
  position: relative;
  width: 40px; height: 40px;
  flex-shrink: 0;
}
.login-brand-ring {
  position: absolute;
  inset: 0;
  border-radius: 11px;
  border: 1.5px solid rgba(0,214,143,0.35);
  animation: ring-pulse 3s ease-in-out infinite;
}
@keyframes ring-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(0,214,143,0.3); }
  50%      { box-shadow: 0 0 0 5px rgba(0,214,143,0); }
}
.login-brand-inner {
  position: absolute;
  inset: 4px;
  border-radius: 7px;
  background: linear-gradient(135deg, #00d68f, #00a86b);
  display: flex; align-items: center; justify-content: center;
  font-size: 17px;
  box-shadow: 0 0 18px rgba(0,214,143,0.45), inset 0 1px 0 rgba(255,255,255,0.18);
}
.login-brand-text h2 {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(100deg, #00d68f 0%, #7df9c7 60%, #00e5ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.login-brand-text span {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  margin-top: 3px;
}

/* ── Headings ── */
.login-heading {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: var(--text);
  line-height: 1.1;
  margin-bottom: 6px;
}
.login-heading span {
  background: linear-gradient(100deg, #00d68f, #7df9c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.login-subheading {
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 28px;
}

/* ── Divider ── */
.login-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(0,214,143,0.18), transparent);
  margin-bottom: 24px;
}

/* ── Form fields ── */
.login-field {
  margin-bottom: 14px;
}
.login-label {
  display: block;
  font-family: var(--mono);
  font-size: 0.62rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.login-input-wrap {
  position: relative;
}
.login-input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  opacity: 0.4;
  pointer-events: none;
}
.login-input {
  width: 100%;
  padding: 11px 14px 11px 36px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 9px;
  color: var(--text);
  font-family: var(--mono);
  font-size: 0.82rem;
  outline: none;
  transition: all 0.2s;
  letter-spacing: 0.02em;
}
.login-input::placeholder { color: var(--text-dim); }
.login-input:focus {
  border-color: rgba(0,214,143,0.38);
  background: rgba(0,214,143,0.04);
  box-shadow: 0 0 0 3px rgba(0,214,143,0.08);
}
.login-input.has-error {
  border-color: rgba(255,77,109,0.4);
  background: rgba(255,77,109,0.04);
}
.login-input.has-error:focus {
  box-shadow: 0 0 0 3px rgba(255,77,109,0.08);
}

/* ── Error message ── */
.login-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,77,109,0.08);
  border: 1px solid rgba(255,77,109,0.2);
  border-radius: 8px;
  padding: 10px 13px;
  font-family: var(--mono);
  font-size: 0.72rem;
  color: #ff8fa3;
  letter-spacing: 0.03em;
  margin-bottom: 16px;
  animation: shake 0.35s ease;
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-6px); }
  40%      { transform: translateX(6px); }
  60%      { transform: translateX(-4px); }
  80%      { transform: translateX(4px); }
}

/* ── Submit button ── */
.login-btn {
  width: 100%;
  margin-top: 6px;
  padding: 13px 16px;
  background: linear-gradient(135deg, #00d68f, #00a86b);
  color: #002818;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: var(--sans);
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  transition: all 0.2s;
  box-shadow: 0 4px 24px rgba(0,214,143,0.3);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.login-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent);
  opacity: 0;
  transition: opacity 0.2s;
}
.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,214,143,0.45);
}
.login-btn:hover:not(:disabled)::before { opacity: 1; }
.login-btn:active:not(:disabled) { transform: translateY(0); }
.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Spinner ── */
.login-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(0,40,24,0.3);
  border-top-color: #002818;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Footer link ── */
.login-footer {
  text-align: center;
  margin-top: 22px;
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
}
.login-footer a {
  color: var(--green);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}
.login-footer a:hover { color: #7df9c7; }

/* ── Decorative corner accent ── */
.login-corner {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 40px; height: 40px;
  border-right: 1.5px solid rgba(0,214,143,0.15);
  border-bottom: 1.5px solid rgba(0,214,143,0.15);
  border-radius: 0 0 6px 0;
}
.login-corner-tl {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px; height: 40px;
  border-left: 1.5px solid rgba(0,214,143,0.15);
  border-top: 1.5px solid rgba(0,214,143,0.15);
  border-radius: 6px 0 0 0;
}
`;

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <>
      <style>{css}</style>
      <div className="login-root">
        {/* Layers */}
        <div className="login-bg-img" />
        <div className="login-grid" />
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />

        {/* Card */}
        <div className="login-card">
          <div className="login-corner-tl" />
          <div className="login-corner" />

          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-mark">
              <div className="login-brand-ring" />
              <div className="login-brand-inner">🌿</div>
            </div>
            <div className="login-brand-text">
              <h2>Green CI/CD</h2>
              <span>emissions · insights · optimization</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="login-heading">
            Welcome <span>back.</span>
          </h1>
          <p className="login-subheading">Sign in to your account to continue</p>
          <div className="login-divider" />

          {/* Email */}
          <div className="login-field">
            <label className="login-label" htmlFor="login-email">Email Address</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">✉</span>
              <input
                id="login-email"
                type="email"
                className={`login-input${error ? " has-error" : ""}`}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label" htmlFor="login-password">Password</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">🔒</span>
              <input
                id="login-password"
                type="password"
                className={`login-input${error ? " has-error" : ""}`}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error" key={error}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="login-submit"
            onClick={handleLogin}
            disabled={loading}
            className="login-btn"
          >
            {loading ? (
              <><div className="login-spinner" /> Signing in…</>
            ) : (
              "Sign In →"
            )}
          </button>

          {/* Footer */}
          <p className="login-footer">
            Don&apos;t have an account?&nbsp;
            <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </>
  );
}