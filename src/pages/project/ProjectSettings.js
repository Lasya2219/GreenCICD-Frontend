import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { connectGitHub } from "../../api";

export default function ProjectSettings() {
  const { currentProject, githubConnected } = useOutletContext();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  if (!currentProject) return null;

  const handleConnectGitHub = async () => {
    try {
      setConnecting(true);
      setError(null);
      const res = await connectGitHub();
      const installUrl = res.data.install_url;
      const stateToken = res.data.state;

      if (stateToken) {
        sessionStorage.setItem("github_setup_state", stateToken);
      }

      if (installUrl) {
        window.location.href = installUrl;
      } else {
        setError("Failed to obtain GitHub App installation URL.");
        setConnecting(false);
      }
    } catch (err) {
      console.error("Connect GitHub error:", err);
      setError("Failed to initiate GitHub App connection.");
      setConnecting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.68rem",
          color: "#00d68f",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "4px"
        }}>
          PROJECT CONFIGURATION
        </div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#d6ede5", letterSpacing: "-0.02em" }}>
          How is this project configured?
        </h2>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#4a7060", marginTop: "2px" }}>
          Settings, GitHub App integration, and telemetry configurations for {currentProject.project_name}.
        </p>
      </div>

      {error && (
        <div style={{
          background: "rgba(255,77,109,0.1)",
          border: "1px solid rgba(255,77,109,0.3)",
          color: "#ff4d6d",
          padding: "12px 16px",
          borderRadius: "10px",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.78rem"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Project Details Card */}
      <div style={{
        background: "var(--surface, rgba(255, 255, 255, 0.035))",
        border: "1px solid var(--border, rgba(255, 255, 255, 0.07))",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px"
      }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#d6ede5" }}>
          Repository & Workspace Metadata
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.8rem"
        }}>
          <div style={{ background: "rgba(255,255,255,0.025)", padding: "14px", borderRadius: "10px" }}>
            <span style={{ color: "#4a7060", display: "block", fontSize: "0.65rem", marginBottom: "4px" }}>
              PROJECT NAME
            </span>
            <strong style={{ color: "#d6ede5" }}>{currentProject.project_name}</strong>
          </div>

          <div style={{ background: "rgba(255,255,255,0.025)", padding: "14px", borderRadius: "10px" }}>
            <span style={{ color: "#4a7060", display: "block", fontSize: "0.65rem", marginBottom: "4px" }}>
              REPOSITORY URL
            </span>
            <a
              href={currentProject.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00d68f", textDecoration: "none" }}
            >
              {currentProject.repo_url} ↗
            </a>
          </div>

          <div style={{ background: "rgba(255,255,255,0.025)", padding: "14px", borderRadius: "10px" }}>
            <span style={{ color: "#4a7060", display: "block", fontSize: "0.65rem", marginBottom: "4px" }}>
              PROJECT ID
            </span>
            <span style={{ color: "#00e5ff" }}>{currentProject.id}</span>
          </div>

          <div style={{ background: "rgba(255,255,255,0.025)", padding: "14px", borderRadius: "10px" }}>
            <span style={{ color: "#4a7060", display: "block", fontSize: "0.65rem", marginBottom: "4px" }}>
              GITHUB INSTALLATION ID
            </span>
            <span style={{ color: "#d6ede5" }}>{currentProject.github_installation_id || "Connected"}</span>
          </div>
        </div>
      </div>

      {/* GitHub Integration Card */}
      <div style={{
        background: "var(--surface, rgba(255, 255, 255, 0.035))",
        border: "1px solid var(--border, rgba(255, 255, 255, 0.07))",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#d6ede5", marginBottom: "4px" }}>
            GitHub App Authorization
          </h3>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#4a7060" }}>
            {githubConnected
              ? "Your GreenCICD GitHub App installation is active and authorized for telemetry collection."
              : "Authorize GreenCICD to access repository workflow contents and telemetry."}
          </p>
        </div>

        <button
          onClick={handleConnectGitHub}
          disabled={connecting}
          style={{
            padding: "10px 18px",
            background: githubConnected ? "rgba(0,214,143,0.12)" : "linear-gradient(135deg, #00d68f, #00a86b)",
            color: githubConnected ? "#00d68f" : "#080f0c",
            border: `1px solid ${githubConnected ? "rgba(0,214,143,0.3)" : "transparent"}`,
            borderRadius: "10px",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: connecting ? "wait" : "pointer"
          }}
        >
          {connecting ? "Connecting..." : githubConnected ? "Manage GitHub App Settings" : "Connect GitHub App"}
        </button>
      </div>

      {/* Workflow Information */}
      <div style={{
        background: "var(--surface, rgba(255, 255, 255, 0.035))",
        border: "1px solid var(--border, rgba(255, 255, 255, 0.07))",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#d6ede5" }}>
          Workflow Configuration
        </h3>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#4a7060", lineHeight: 1.5 }}>
          GreenCICD automatically maintains <code style={{ color: "#00d68f" }}>.github/workflows/greencicd.yml</code> in your repository to measure CPU, memory, and duration on every push to <code style={{ color: "#00d68f" }}>main</code> or <code style={{ color: "#00d68f" }}>master</code>.
        </p>
      </div>
    </div>
  );
}
