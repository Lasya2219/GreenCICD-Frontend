import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import ProjectList from "../components/ProjectList";
import CarbonChart from "../components/CarbonChart";
import RecommendationCard from "../components/RecommendationCard";
import SummaryCard from "../components/SummaryCard";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --green:       #00d68f;
  --green-dim:   #00a86b;
  --green-glow:  rgba(0, 214, 143, 0.18);
  --cyan:        #00e5ff;
  --cyan-dim:    rgba(0,229,255,0.12);
  --red:         #ff4d6d;
  --red-dim:     rgba(255,77,109,0.12);
  --bg:          #080f0c;
  --bg2:         #0d1710;
  --bg3:         #111e16;
  --surface:     rgba(255,255,255,0.035);
  --surface-up:  rgba(255,255,255,0.06);
  --border:      rgba(255,255,255,0.07);
  --border-up:   rgba(0,214,143,0.22);
  --text:        #d6ede5;
  --text-muted:  #4a7060;
  --text-dim:    #2a4a3a;
  --mono:        'DM Mono', monospace;
  --sans:        'Outfit', sans-serif;
  --radius:      14px;
  --radius-sm:   8px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--text-dim); border-radius: 4px; }

/* ── Root ── */
.db {
  min-height: 100vh;
  background: var(--bg);
  font-family: var(--sans);
  color: var(--text);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* ──────────── BACKGROUND CANVAS ──────────── */
.db-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.db-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
}
.db-bg-orb-1 {
  width: 600px; height: 500px;
  top: -160px; left: -120px;
  background: radial-gradient(circle, rgba(0,214,143,0.22) 0%, transparent 70%);
  animation: orb-drift-1 18s ease-in-out infinite alternate;
}
.db-bg-orb-2 {
  width: 500px; height: 400px;
  bottom: -100px; right: -80px;
  background: radial-gradient(circle, rgba(0,229,255,0.14) 0%, transparent 70%);
  animation: orb-drift-2 22s ease-in-out infinite alternate;
}
.db-bg-orb-3 {
  width: 300px; height: 300px;
  top: 50%; left: 50%;
  background: radial-gradient(circle, rgba(0,214,143,0.07) 0%, transparent 70%);
  animation: orb-drift-3 30s ease-in-out infinite alternate;
}
@keyframes orb-drift-1 {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(60px, 40px) scale(1.12); }
}
@keyframes orb-drift-2 {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(-40px,-30px) scale(1.08); }
}
@keyframes orb-drift-3 {
  from { transform: translate(-50%,-50%) scale(1); }
  to   { transform: translate(-50%,-50%) scale(1.3); }
}

/* Grid noise overlay */
.db-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,214,143,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,214,143,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* ──────────── LAYOUT ──────────── */
.db-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

.db-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;
  align-items: start;
  padding: 0 24px 40px;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
}

/* ──────────── TOPBAR ──────────── */
.db-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 28px;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  gap: 16px;
}

.db-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.db-brand-mark {
  position: relative;
  width: 44px; height: 44px;
  flex-shrink: 0;
}
.db-brand-mark-ring {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  border: 1.5px solid rgba(0,214,143,0.4);
  animation: ring-pulse 3s ease-in-out infinite;
}
@keyframes ring-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(0,214,143,0.3); }
  50% { box-shadow: 0 0 0 6px rgba(0,214,143,0); }
}
.db-brand-mark-inner {
  position: absolute;
  inset: 4px;
  border-radius: 8px;
  background: linear-gradient(135deg, #00d68f, #00a86b);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  box-shadow: 0 0 20px rgba(0,214,143,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
}
.db-brand-copy h1 {
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(100deg, #00d68f 0%, #7df9c7 50%, #00e5ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.db-brand-copy span {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  margin-top: 3px;
}

.db-topbar-center {
  display: flex;
  align-items: center;
  gap: 8px;
}
.db-stat-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 6px 14px;
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
}
.db-stat-pill strong {
  color: var(--green);
  font-weight: 500;
}

.db-topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.db-live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--green);
  background: rgba(0,214,143,0.08);
  border: 1px solid rgba(0,214,143,0.2);
  border-radius: 20px;
  padding: 5px 12px;
  letter-spacing: 0.1em;
}
.db-live-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 8px var(--green);
  animation: dot-blink 1.8s ease-in-out infinite;
}
@keyframes dot-blink {
  0%,100% { opacity:1; }
  50% { opacity:0.3; }
}
.db-logout-btn {
  padding: 8px 16px;
  cursor: pointer;
  background: var(--red-dim);
  color: var(--red);
  border: 1px solid rgba(255,77,109,0.2);
  border-radius: var(--radius-sm);
  font-family: var(--mono);
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: all 0.18s;
}
.db-logout-btn:hover {
  background: rgba(255,77,109,0.2);
  border-color: rgba(255,77,109,0.45);
  box-shadow: 0 0 18px rgba(255,77,109,0.15);
}

/* ──────────── SIDEBAR ──────────── */
.db-sidebar {
  padding: 20px 16px 20px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 20px;
}

/* ──────────── MAIN CONTENT ──────────── */
.db-main {
  padding: 20px 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-left: 1px solid var(--border);
  min-height: 60vh;
}

/* ──────────── PANEL / CARD BASE ──────────── */
.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  position: relative;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s;
  animation: panel-in 0.4s ease both;
}
.panel:hover {
  border-color: var(--border-up);
  box-shadow: 0 8px 40px rgba(0,214,143,0.07);
}
@keyframes panel-in {
  from { opacity:0; transform:translateY(8px); }
  to   { opacity:1; transform:translateY(0); }
}

/* Accent line variants */
.panel-green::after {
  content:'';
  position:absolute;
  top:0; left:0;
  width:2px; height:100%;
  background: linear-gradient(180deg, var(--green), transparent);
}
.panel-cyan::after {
  content:'';
  position:absolute;
  top:0; left:0;
  width:2px; height:100%;
  background: linear-gradient(180deg, var(--cyan), transparent);
}
/* Top shimmer line */
.panel-shimmer::before {
  content:'';
  position:absolute;
  top:0; left:10%; right:10%;
  height:1px;
  background: linear-gradient(90deg, transparent, rgba(0,214,143,0.5), transparent);
}

.panel-body { padding: 18px 20px; }

/* ──────────── PANEL HEADER ──────────── */
.ph {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.ph-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ph-icon {
  width: 26px; height: 26px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}
.ph-icon-green { background: rgba(0,214,143,0.12); }
.ph-icon-cyan  { background: rgba(0,229,255,0.1); }
.ph-title {
  font-family: var(--mono);
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.ph-title-green { color: var(--green); }
.ph-title-cyan  { color: var(--cyan); }
.ph-badge {
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid;
}
.ph-badge-green {
  color: var(--green);
  background: rgba(0,214,143,0.08);
  border-color: rgba(0,214,143,0.2);
}

.ph-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(0,214,143,0.15), transparent);
  margin-bottom: 16px;
}

/* ──────────── FORM ──────────── */
.form-field { margin-bottom: 10px; }
.form-label {
  display: block;
  font-family: var(--mono);
  font-size: 0.62rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 5px;
}
.form-input {
  width: 100%;
  padding: 10px 12px;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-family: var(--mono);
  font-size: 0.78rem;
  outline: none;
  transition: all 0.18s;
}
.form-input::placeholder { color: var(--text-dim); }
.form-input:focus {
  border-color: rgba(0,214,143,0.35);
  background: rgba(0,214,143,0.04);
  box-shadow: 0 0 0 3px rgba(0,214,143,0.07);
}

.create-btn {
  width: 100%;
  margin-top: 6px;
  padding: 11px 16px;
  background: linear-gradient(135deg, #00d68f, #00a86b);
  color: #002818;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: var(--sans);
  font-weight: 700;
  font-size: 0.82rem;
  letter-spacing: 0.02em;
  transition: all 0.18s;
  box-shadow: 0 4px 20px rgba(0,214,143,0.3);
  position: relative;
  overflow: hidden;
}
.create-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  opacity: 0;
  transition: opacity 0.18s;
}
.create-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 30px rgba(0,214,143,0.45); }
.create-btn:hover::before { opacity: 1; }
.create-btn:active { transform: translateY(0); }

/* ──────────── STATUS MESSAGES ──────────── */
.status-msg {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-family: var(--mono);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.03em;
}
.status-error {
  background: var(--red-dim);
  border: 1px solid rgba(255,77,109,0.2);
  color: #ff8fa3;
}
.status-loading {
  background: var(--cyan-dim);
  border: 1px solid rgba(0,229,255,0.18);
  color: #67e8f9;
}
.spinner {
  width: 14px; height: 14px;
  border: 1.5px solid rgba(0,229,255,0.2);
  border-top-color: var(--cyan);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ──────────── EMPTY STATE ──────────── */
.empty-state {
  padding: 48px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.empty-state-graphic {
  position: relative;
  width: 64px; height: 64px;
}
.empty-state-circle {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px dashed rgba(0,214,143,0.2);
  animation: empty-spin 20s linear infinite;
}
.empty-state-circle-2 {
  position: absolute;
  inset: 12px;
  border-radius: 50%;
  border: 1px dashed rgba(0,214,143,0.12);
  animation: empty-spin 14s linear infinite reverse;
}
@keyframes empty-spin { to { transform: rotate(360deg); } }
.empty-state-icon-inner {
  position: absolute;
  inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  opacity: 0.35;
}
.empty-state p {
  font-family: var(--mono);
  font-size: 0.72rem;
  color: var(--text-dim);
  letter-spacing: 0.08em;
  line-height: 1.6;
}
.empty-state p strong {
  display: block;
  color: var(--text-muted);
  font-size: 0.78rem;
  margin-bottom: 4px;
}

/* ──────────── PROJECT COUNT TAG ──────────── */
.proj-count {
  font-family: var(--mono);
  font-size: 0.62rem;
  color: var(--text-muted);
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 2px 9px;
  letter-spacing: 0.06em;
}

/* ──────────── RESPONSIVE ──────────── */
@media (max-width: 860px) {
  .db-body { grid-template-columns: 1fr; gap: 0; }
  .db-sidebar { position: static; padding: 16px 0; }
  .db-main { border-left: none; border-top: 1px solid var(--border); padding: 16px 0; }
  .db-topbar-center { display: none; }
}
`;

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function Dashboard() {
  const [projects, setProjects]           = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [trend, setTrend]                 = useState([]);
  const [summary, setSummary]             = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [projectName, setProjectName]     = useState("");
  const [repoUrl, setRepoUrl]             = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects.");
      }
    })();
  }, []);

  const fetchProjectData = useCallback(
    async (project, withOptimize = false, showLoader = false) => {
      if (!project?.id) return;
      if (showLoader) setLoading(true);
      setError(null);
      try {
        const trendReq   = API.get(`/carbon-trend/${project.id}`,    { params: { _t: Date.now() } });
        const summaryReq = API.get(`/project-summary/${project.id}`, { params: { _t: Date.now() } });
        if (withOptimize) {
          const [tRes, oRes, sRes] = await Promise.allSettled([
            trendReq, API.post(`/optimize/${project.id}`, {}), summaryReq
          ]);
          if (tRes.status === "fulfilled") setTrend(tRes.value.data);
          if (sRes.status === "fulfilled") setSummary(sRes.value.data);
          setRecommendation(oRes.status === "fulfilled" ? oRes.value.data : null);
        } else {
          const [tRes, sRes] = await Promise.all([trendReq, summaryReq]);
          setTrend(tRes.data);
          setSummary(sRes.data);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "Failed to load project data.");
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    []
  );

  const handleCreateProject = async () => {
    if (!projectName.trim() || !repoUrl.trim()) return;
    try {
      const res = await API.post("/projects", { project_name: projectName, repo_url: repoUrl });
      setProjects(prev => [...prev, res.data]);
      setProjectName("");
      setRepoUrl("");
    } catch (err) {
      console.error(err);
      setError("Failed to create project.");
    }
  };

  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    setTrend([]);
    setRecommendation(null);
    setSummary(null);
    await fetchProjectData(project, true, true);
  };

  useEffect(() => {
    if (!selectedProject) return;
    const id = setInterval(() => fetchProjectData(selectedProject, false, false), 15000);
    return () => clearInterval(id);
  }, [selectedProject, fetchProjectData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <style>{css}</style>
      <div className="db">
        {/* ── Animated background ── */}
        <div className="db-bg">
          <div className="db-bg-orb db-bg-orb-1" />
          <div className="db-bg-orb db-bg-orb-2" />
          <div className="db-bg-orb db-bg-orb-3" />
        </div>

        <div className="db-inner">
          {/* ══════════ TOPBAR ══════════ */}
          <header className="db-topbar">
            <div className="db-brand">
              <div className="db-brand-mark">
                <div className="db-brand-mark-ring" />
                <div className="db-brand-mark-inner">🌿</div>
              </div>
              <div className="db-brand-copy">
                <h1>Green CI/CD</h1>
                <span>emissions · insights · optimization</span>
              </div>
            </div>

            <div className="db-topbar-center">
              <div className="db-stat-pill">
                PROJECTS&nbsp;<strong>{projects.length}</strong>
              </div>
              {selectedProject && (
                <div className="db-stat-pill">
                  ACTIVE&nbsp;<strong style={{ color: "var(--cyan)" }}>
                    {selectedProject.project_name || selectedProject.name}
                  </strong>
                </div>
              )}
            </div>

            <div className="db-topbar-right">
              <div className="db-live-badge">
                <div className="db-live-dot" />
                LIVE
              </div>
              <button id="logout-btn" onClick={handleLogout} className="db-logout-btn">
                Logout
              </button>
            </div>
          </header>

          {/* ══════════ BODY ══════════ */}
          <div className="db-body">

            {/* ────────── SIDEBAR ────────── */}
            <aside className="db-sidebar">

              {/* — Create Project — */}
              <div className="panel panel-green panel-shimmer">
                <div className="panel-body">
                  <div className="ph">
                    <div className="ph-left">
                      <div className="ph-icon ph-icon-green">＋</div>
                      <span className="ph-title ph-title-green">New Project</span>
                    </div>
                  </div>
                  <div className="ph-divider" />

                  <div className="form-field">
                    <label className="form-label">Project Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="my-service"
                      value={projectName}
                      onChange={e => setProjectName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleCreateProject()}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Repository URL</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="https://github.com/user/repo"
                      value={repoUrl}
                      onChange={e => setRepoUrl(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleCreateProject()}
                    />
                  </div>
                  <button onClick={handleCreateProject} className="create-btn">
                    ＋ Create Project
                  </button>
                </div>
              </div>

              {/* — Project List — */}
              <div className="panel panel-cyan">
                <div className="panel-body">
                  <div className="ph">
                    <div className="ph-left">
                      <div className="ph-icon ph-icon-cyan">◈</div>
                      <span className="ph-title ph-title-cyan">Projects</span>
                    </div>
                    {projects.length > 0 && (
                      <span className="proj-count">{projects.length}</span>
                    )}
                  </div>
                  <div className="ph-divider" />
                  <ProjectList
                    projects={projects}
                    onSelect={handleSelectProject}
                    selectedProject={selectedProject}
                  />
                </div>
              </div>

            </aside>

            {/* ────────── MAIN ────────── */}
            <main className="db-main">

              {/* Status messages */}
              {error && (
                <div className="status-msg status-error">
                  <span style={{ fontSize: "1rem" }}>⚠</span>
                  {error}
                </div>
              )}
              {loading && (
                <div className="status-msg status-loading">
                  <div className="spinner" />
                  Analyzing project emissions…
                </div>
              )}

              {/* Empty state */}
              {!loading && !selectedProject && !error && (
                <div className="panel">
                  <div className="panel-body">
                    <div className="empty-state">
                      <div className="empty-state-graphic">
                        <div className="empty-state-circle" />
                        <div className="empty-state-circle-2" />
                        <div className="empty-state-icon-inner">📡</div>
                      </div>
                      <p>
                        <strong>No project selected</strong>
                        Select a project from the sidebar to view<br />
                        live emissions data and optimization insights
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Data panels */}
              {!loading && summary && <SummaryCard summary={summary} />}
              {!loading && trend.length > 0 && <CarbonChart data={trend} />}
              {!loading && recommendation && <RecommendationCard recommendation={recommendation} />}

            </main>
          </div>
        </div>
      </div>
    </>
  );
}