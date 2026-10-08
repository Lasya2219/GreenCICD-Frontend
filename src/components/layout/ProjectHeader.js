import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectHeader({ currentProject, projects = [], onSelectProject, githubConnected }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 28px",
      maxWidth: "1280px",
      width: "100%",
      margin: "0 auto",
      gap: "16px",
      borderBottom: "1px solid var(--border, rgba(255, 255, 255, 0.07))"
    }}>
      {/* Brand & Project Selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div 
          onClick={() => navigate("/projects")}
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
        >
          <div style={{
            position: "relative",
            width: "38px", height: "38px",
            flexShrink: 0
          }}>
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: "10px",
              border: "1.5px solid rgba(0, 214, 143, 0.4)"
            }} />
            <div style={{
              position: "absolute",
              inset: "3px",
              borderRadius: "7px",
              background: "linear-gradient(135deg, #00d68f, #00a86b)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px"
            }}>
              🌿
            </div>
          </div>
          <div>
            <h1 style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              background: "linear-gradient(100deg, #00d68f 0%, #7df9c7 50%, #00e5ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1
            }}>
              Green CI/CD
            </h1>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              color: "var(--text-muted, #4a7060)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "block",
              marginTop: "2px"
            }}>
              workspace
            </span>
          </div>
        </div>

        {/* Project Selector Dropdown */}
        {projects.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "var(--border-up, rgba(0,214,143,0.3))" }}>/</span>
            <select
              value={currentProject?.id || ""}
              onChange={(e) => {
                const selected = projects.find(p => p.id === e.target.value);
                if (selected && onSelectProject) {
                  onSelectProject(selected);
                }
              }}
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid var(--border-up, rgba(0, 214, 143, 0.3))",
                borderRadius: "8px",
                color: "var(--green, #00d68f)",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                padding: "6px 12px",
                outline: "none",
                cursor: "pointer"
              }}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} style={{ background: "#0d1710", color: "#d6ede5" }}>
                  {p.project_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {githubConnected && (
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.62rem",
            color: "var(--green, #00d68f)",
            background: "rgba(0, 214, 143, 0.08)",
            border: "1px solid rgba(0, 214, 143, 0.2)",
            borderRadius: "12px",
            padding: "4px 10px",
            letterSpacing: "0.06em"
          }}>
            ✓ GitHub Connected
          </span>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem",
          color: "var(--green, #00d68f)",
          background: "rgba(0,214,143,0.08)",
          border: "1px solid rgba(0,214,143,0.2)",
          borderRadius: "20px",
          padding: "5px 12px"
        }}>
          <span style={{
            width: "5px", height: "5px",
            borderRadius: "50%",
            background: "var(--green, #00d68f)",
            boxShadow: "0 0 8px #00d68f"
          }} />
          LIVE
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "6px 14px",
            cursor: "pointer",
            background: "var(--red-dim, rgba(255,77,109,0.12))",
            color: "var(--red, #ff4d6d)",
            border: "1px solid rgba(255,77,109,0.2)",
            borderRadius: "8px",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.68rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            transition: "all 0.18s"
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
