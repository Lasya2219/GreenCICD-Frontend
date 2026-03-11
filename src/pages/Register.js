import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

const backgroundImageUrl = `${process.env.PUBLIC_URL}/image.jpg`;

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --green:      #00d68f;
  --green-dim:  #00a86b;
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

.reg-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--sans);
  color: var(--text);
  position: relative;
  overflow: hidden;
  background-color: var(--bg);
  padding: 24px;
}

.reg-bg-img {
  position: absolute;
  inset: 0;
  background-image: url(${backgroundImageUrl});
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  filter: saturate(0.3);
  z-index: 0;
}

.reg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  z-index: 0;
}
.reg-orb-1 {
  width: 480px; height: 380px;
  top: -120px; right: -80px;
  background: radial-gradient(circle, rgba(0,214,143,0.16) 0%, transparent 70%);
  animation: rorb1 20s ease-in-out infinite alternate;
}
.reg-orb-2 {
  width: 380px; height: 320px;
  bottom: -80px; left: -60px;
  background: radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%);
  animation: rorb2 26s ease-in-out infinite alternate;
}
@keyframes rorb1 {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(-40px,30px) scale(1.1); }
}
@keyframes rorb2 {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(30px,-25px) scale(1.08); }
}

.reg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,214,143,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,214,143,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
}

/* ── Card ── */
.reg-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  background: rgba(13,23,18,0.84);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px 36px 32px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow:
    0 0 0 1px rgba(0,214,143,0.06),
    0 24px 60px rgba(0,0,0,0.5),
    0 0 80px rgba(0,214,143,0.04);
  animation: card-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes card-in {
  from { opacity:0; transform: translateY(24px) scale(0.97); }
  to   { opacity:1; transform: translateY(0) scale(1); }
}
.reg-card::before {
  content: '';
  position: absolute;
  top: 0; left: 12%; right: 12%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,214,143,0.55), rgba(0,229,255,0.3), transparent);
}

.reg-corner {
  position: absolute;
  bottom: 20px; right: 20px;
  width: 40px; height: 40px;
  border-right: 1.5px solid rgba(0,214,143,0.13);
  border-bottom: 1.5px solid rgba(0,214,143,0.13);
  border-radius: 0 0 6px 0;
}
.reg-corner-tl {
  position: absolute;
  top: 20px; left: 20px;
  width: 40px; height: 40px;
  border-left: 1.5px solid rgba(0,214,143,0.13);
  border-top: 1.5px solid rgba(0,214,143,0.13);
  border-radius: 6px 0 0 0;
}

/* ── Brand ── */
.reg-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 28px;
}
.reg-brand-mark {
  position: relative;
  width: 40px; height: 40px;
  flex-shrink: 0;
}
.reg-brand-ring {
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
.reg-brand-inner {
  position: absolute;
  inset: 4px;
  border-radius: 7px;
  background: linear-gradient(135deg, #00d68f, #00a86b);
  display: flex; align-items: center; justify-content: center;
  font-size: 17px;
  box-shadow: 0 0 18px rgba(0,214,143,0.45), inset 0 1px 0 rgba(255,255,255,0.18);
}
.reg-brand-text h2 {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(100deg, #00d68f 0%, #7df9c7 60%, #00e5ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.reg-brand-text span {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  margin-top: 3px;
}

/* ── Heading ── */
.reg-heading {
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: var(--text);
  line-height: 1.1;
  margin-bottom: 5px;
}
.reg-heading span {
  background: linear-gradient(100deg, #00d68f, #7df9c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.reg-subheading {
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 24px;
}

/* ── Strength meter ── */
.reg-strength-wrap {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.reg-strength-bars {
  display: flex;
  gap: 3px;
  flex: 1;
}
.reg-strength-bar {
  height: 3px;
  flex: 1;
  border-radius: 2px;
  background: rgba(255,255,255,0.07);
  transition: background 0.3s;
}
.reg-strength-bar.s1 { background: #ff4d6d; }
.reg-strength-bar.s2 { background: #ff9f43; }
.reg-strength-bar.s3 { background: #ffd32a; }
.reg-strength-bar.s4 { background: #00d68f; }
.reg-strength-label {
  font-family: var(--mono);
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  min-width: 44px;
  text-align: right;
}
.reg-strength-label.s0 { color: var(--text-dim); }
.reg-strength-label.s1 { color: #ff4d6d; }
.reg-strength-label.s2 { color: #ff9f43; }
.reg-strength-label.s3 { color: #ffd32a; }
.reg-strength-label.s4 { color: #00d68f; }

/* ── Divider ── */
.reg-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(0,214,143,0.18), transparent);
  margin-bottom: 22px;
}

/* ── Fields ── */
.reg-field { margin-bottom: 13px; }
.reg-label {
  display: block;
  font-family: var(--mono);
  font-size: 0.62rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 5px;
}
.reg-input-wrap { position: relative; }
.reg-input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  opacity: 0.38;
  pointer-events: none;
}
.reg-input {
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
.reg-input::placeholder { color: var(--text-dim); }
.reg-input:focus {
  border-color: rgba(0,214,143,0.38);
  background: rgba(0,214,143,0.04);
  box-shadow: 0 0 0 3px rgba(0,214,143,0.08);
}
.reg-input.has-error {
  border-color: rgba(255,77,109,0.4);
  background: rgba(255,77,109,0.04);
}
.reg-input.has-error:focus {
  box-shadow: 0 0 0 3px rgba(255,77,109,0.08);
}

/* ── Error ── */
.reg-error {
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
  margin-bottom: 14px;
  animation: shake 0.35s ease;
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-6px); }
  40%      { transform: translateX(6px); }
  60%      { transform: translateX(-4px); }
  80%      { transform: translateX(4px); }
}

/* ── Success toast ── */
.reg-success {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,214,143,0.08);
  border: 1px solid rgba(0,214,143,0.22);
  border-radius: 8px;
  padding: 10px 13px;
  font-family: var(--mono);
  font-size: 0.72rem;
  color: #7df9c7;
  letter-spacing: 0.03em;
  margin-bottom: 14px;
  animation: fadein 0.3s ease;
}
@keyframes fadein {
  from { opacity:0; transform: translateY(-4px); }
  to   { opacity:1; transform: translateY(0); }
}

/* ── Submit button ── */
.reg-btn {
  width: 100%;
  margin-top: 4px;
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
.reg-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent);
  opacity: 0;
  transition: opacity 0.2s;
}
.reg-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,214,143,0.45);
}
.reg-btn:hover:not(:disabled)::before { opacity: 1; }
.reg-btn:active:not(:disabled) { transform: translateY(0); }
.reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.reg-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(0,40,24,0.3);
  border-top-color: #002818;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Footer ── */
.reg-footer {
  text-align: center;
  margin-top: 20px;
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
}
.reg-footer a {
  color: var(--green);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}
.reg-footer a:hover { color: #7df9c7; }

/* ── Terms note ── */
.reg-terms {
  text-align: center;
  margin-top: 12px;
  font-family: var(--mono);
  font-size: 0.58rem;
  color: var(--text-dim);
  letter-spacing: 0.05em;
  line-height: 1.6;
}
`;

/* password strength scorer */
function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

export default function Register() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const strength = getStrength(password);

  const handleRegister = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/users/register", { name, email, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleRegister(); };

  const hasErr = Boolean(error);

  return (
    <>
      <style>{css}</style>
      <div className="reg-root">
        <div className="reg-bg-img" />
        <div className="reg-grid" />
        <div className="reg-orb reg-orb-1" />
        <div className="reg-orb reg-orb-2" />

        <div className="reg-card">
          <div className="reg-corner-tl" />
          <div className="reg-corner" />

          {/* Brand */}
          <div className="reg-brand">
            <div className="reg-brand-mark">
              <div className="reg-brand-ring" />
              <div className="reg-brand-inner">🌿</div>
            </div>
            <div className="reg-brand-text">
              <h2>Green CI/CD</h2>
              <span>emissions · insights · optimization</span>
            </div>
          </div>

          <h1 className="reg-heading">Create an <span>account.</span></h1>
          <p className="reg-subheading">Start tracking your pipeline emissions</p>
          <div className="reg-divider" />

          {/* Full Name */}
          <div className="reg-field">
            <label className="reg-label" htmlFor="register-name">Full Name</label>
            <div className="reg-input-wrap">
              <span className="reg-input-icon">👤</span>
              <input
                id="register-name"
                type="text"
                className={`reg-input${hasErr && !name ? " has-error" : ""}`}
                placeholder="Jane Smith"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="reg-field">
            <label className="reg-label" htmlFor="register-email">Email Address</label>
            <div className="reg-input-wrap">
              <span className="reg-input-icon">✉</span>
              <input
                id="register-email"
                type="email"
                className={`reg-input${hasErr && !email ? " has-error" : ""}`}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="reg-field">
            <label className="reg-label" htmlFor="register-password">Password</label>
            <div className="reg-input-wrap">
              <span className="reg-input-icon">🔒</span>
              <input
                id="register-password"
                type="password"
                className={`reg-input${hasErr && !password ? " has-error" : ""}`}
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="new-password"
              />
            </div>
            {/* Strength meter */}
            {password.length > 0 && (
              <div className="reg-strength-wrap">
                <div className="reg-strength-bars">
                  {[1,2,3,4].map(i => (
                    <div
                      key={i}
                      className={`reg-strength-bar${strength >= i ? ` s${strength}` : ""}`}
                    />
                  ))}
                </div>
                <span className={`reg-strength-label s${strength}`}>
                  {STRENGTH_LABELS[strength]}
                </span>
              </div>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="reg-error" key={error}>
              <span>⚠</span> {error}
            </div>
          )}
          {success && (
            <div className="reg-success">
              <span>✓</span> Account created! Redirecting to login…
            </div>
          )}

          {/* Submit */}
          <button
            id="register-submit"
            onClick={handleRegister}
            disabled={loading || success}
            className="reg-btn"
          >
            {loading
              ? <><div className="reg-spinner" /> Creating account…</>
              : success
              ? "✓ Registered!"
              : "Create Account →"
            }
          </button>

          <p className="reg-footer">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
          <p className="reg-terms">
            By registering you agree to our terms of service<br />and privacy policy.
          </p>
        </div>
      </div>
    </>
  );
}