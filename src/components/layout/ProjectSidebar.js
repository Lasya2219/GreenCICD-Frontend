import React from "react";
import { NavLink, useParams } from "react-router-dom";

export default function ProjectSidebar({ currentProject }) {
  const { projectId } = useParams();

  const navItems = [
    {
      path: `/projects/${projectId}/overview`,
      label: "Overview",
      icon: "📊",
      question: "What is happening?"
    },
    {
      path: `/projects/${projectId}/pipelines`,
      label: "Pipeline Runs",
      icon: "⚡",
      question: "What exactly happened?"
    },
    {
      path: `/projects/${projectId}/carbon`,
      label: "Carbon Insights",
      icon: "📈",
      question: "How is my impact changing?"
    },
    {
      path: `/projects/${projectId}/optimization`,
      label: "Optimization",
      icon: "🌿",
      question: "What should I do?"
    },
    {
      path: `/projects/${projectId}/settings`,
      label: "Settings",
      icon: "⚙️",
      question: "How is this configured?"
    }
  ];

  return (
    <aside style={{
      width: "240px",
      flexShrink: 0,
      padding: "20px 16px 20px 0",
      display: "flex",
      flexDirection: "column",
      gap: "18px"
    }}>
      {/* Project Meta Card */}
      <div style={{
        background: "var(--surface, rgba(255,255,255,0.035))",
        border: "1px solid var(--border, rgba(255,255,255,0.07))",
        borderRadius: "12px",
        padding: "14px 16px"
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.62rem",
          color: "var(--text-muted, #4a7060)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "4px"
        }}>
          ACTIVE WORKSPACE
        </div>
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.95rem",
          fontWeight: 700,
          color: "var(--text, #d6ede5)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          {currentProject?.project_name || "Select Project"}
        </div>
        {currentProject?.repo_url && (
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.68rem",
            color: "var(--green, #00d68f)",
            marginTop: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {currentProject.repo_url.replace("https://github.com/", "")}
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "8px",
              textDecoration: "none",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.85rem",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "#00d68f" : "var(--text-muted, #4a7060)",
              background: isActive ? "rgba(0, 214, 143, 0.08)" : "transparent",
              border: `1px solid ${isActive ? "rgba(0, 214, 143, 0.2)" : "transparent"}`,
              transition: "all 0.15s ease"
            })}
          >
            <span style={{ fontSize: "14px" }}>{item.icon}</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>{item.label}</span>
            </div>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
