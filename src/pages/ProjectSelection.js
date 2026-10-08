import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { getProjects, connectGitHub, getGitHubStatus } from "../api";

export default function ProjectSelection() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Project Form state
  const [projectName, setProjectName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState(null);

  // GitHub App state
  const [githubConnected, setGithubConnected] = useState(false);
  const [connectingGitHub, setConnectingGitHub] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projRes, ghRes] = await Promise.all([
        getProjects(),
        getGitHubStatus().catch(() => ({ data: { connected: false } }))
      ]);
      setProjects(projRes.data || []);
      setGithubConnected(ghRes.data?.connected || false);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConnectGitHub = async () => {
    try {
      setConnectingGitHub(true);
      setFormError(null);
      const res = await connectGitHub();
      const installUrl = res.data.install_url;
      const stateToken = res.data.state;

      if (stateToken) {
        sessionStorage.setItem("github_setup_state", stateToken);
      }

      if (installUrl) {
        window.location.href = installUrl;
      } else {
        setFormError("Could not retrieve GitHub App installation URL.");
        setConnectingGitHub(false);
      }
    } catch (err) {
      console.error("Connect GitHub failed:", err);
      setFormError("Failed to initiate GitHub App connection.");
      setConnectingGitHub(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !repoUrl.trim()) {
      setFormError("Please enter project name and repository URL.");
      return;
    }

    try {
      setCreating(true);
      setFormError(null);
      const res = await API.post("/projects", {
        project_name: projectName,
        repo_url: repoUrl
      });
      const newProj = res.data;
      setProjectName("");
      setRepoUrl("");
      // Navigate directly into new project workspace
      navigate(`/projects/${newProj.id}/overview`);
    } catch (err) {
      console.error("Create project error:", err);
      const detail = err.response?.data?.detail || "Failed to create project.";
      setFormError(detail);
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080f0c",
      color: "#d6ede5",
      fontFamily: "'Outfit', sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Top Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 32px",
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        borderBottom: "1px solid rgba(255, 255, 255, 0.07)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #00d68f, #00a86b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px"
          }}>
            🌿
          </div>
          <div>
            <h1 style={{
              fontSize: "1.15rem",
              fontWeight: 800,
              background: "linear-gradient(100deg, #00d68f, #00e5ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Green CI/CD
            </h1>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              color: "#4a7060",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}>
              Project Hub
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "6px 14px",
            cursor: "pointer",
            background: "rgba(255,77,109,0.12)",
            color: "#ff4d6d",
            border: "1px solid rgba(255,77,109,0.2)",
            borderRadius: "8px",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.68rem"
          }}
        >
          Logout
        </button>
      </header>

      <main style={{
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        padding: "40px 32px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "36px"
      }}>
        {/* Title Banner */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#d6ede5", letterSpacing: "-0.02em" }}>
              Select a Project Workspace
            </h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#4a7060", marginTop: "4px" }}>
              Manage pipeline carbon emissions, energy performance, and optimizations per repository.
            </p>
          </div>

          <button
            onClick={handleConnectGitHub}
            disabled={connectingGitHub}
            style={{
              padding: "10px 18px",
              background: githubConnected ? "rgba(0, 214, 143, 0.1)" : "linear-gradient(135deg, #00d68f, #00a86b)",
              color: githubConnected ? "#00d68f" : "#080f0c",
              border: `1px solid ${githubConnected ? "rgba(0, 214, 143, 0.3)" : "transparent"}`,
              borderRadius: "10px",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: connectingGitHub ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>{githubConnected ? "✓ GitHub App Connected" : "Connect GitHub App"}</span>
          </button>
        </div>

        {formError && (
          <div style={{
            background: "rgba(255,77,109,0.1)",
            border: "1px solid rgba(255,77,109,0.3)",
            color: "#ff4d6d",
            padding: "12px 16px",
            borderRadius: "10px",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.78rem"
          }}>
            ⚠️ {formError}
          </div>
        )}

        {/* Existing Projects Grid */}
        <div>
          <h3 style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            color: "#00d68f",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "16px"
          }}>
            Projects ({projects.length})
          </h3>

          {loading ? (
            <div style={{ fontFamily: "'DM Mono', monospace", color: "#4a7060", fontSize: "0.8rem" }}>
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "40px",
              textAlign: "center"
            }}>
              <p style={{ color: "#4a7060", fontFamily: "'DM Mono', monospace", fontSize: "0.85rem" }}>
                No projects registered yet. Use the form below to connect your first GitHub repository.
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "18px"
            }}>
              {projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}/overview`)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "14px",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0, 214, 143, 0.3)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#d6ede5" }}>
                      {p.project_name}
                    </h4>
                    <span style={{ fontSize: "14px", color: "#00d68f" }}>➜</span>
                  </div>

                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    color: "#4a7060",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {p.repo_url.replace("https://github.com/", "")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Project Section */}
        <div style={{
          background: "rgba(255, 255, 255, 0.025)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          borderRadius: "16px",
          padding: "28px"
        }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#d6ede5", marginBottom: "6px" }}>
            Add New Repository Project
          </h3>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#4a7060", marginBottom: "20px" }}>
            GreenCICD will verify repository access and automatically configure <code style={{ color: "#00d68f" }}>.github/workflows/greencicd.yml</code>.
          </p>

          <form onSubmit={handleCreateProject} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "14px", alignItems: "end" }}>
            <div>
              <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#4a7060", marginBottom: "6px" }}>
                PROJECT NAME
              </label>
              <input
                type="text"
                placeholder="e.g. My Backend Pipeline"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#d6ede5",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#4a7060", marginBottom: "6px" }}>
                GITHUB REPOSITORY URL
              </label>
              <input
                type="text"
                placeholder="https://github.com/owner/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#d6ede5",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #00d68f, #00a86b)",
                color: "#080f0c",
                border: "none",
                borderRadius: "8px",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: creating ? "wait" : "pointer"
              }}
            >
              {creating ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
