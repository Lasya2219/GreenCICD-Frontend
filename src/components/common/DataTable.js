import React from "react";
import PipelineStatusBadge from "./PipelineStatusBadge";

export default function DataTable({ runs = [], repoUrl, onSelectRun }) {
  if (!runs || runs.length === 0) {
    return (
      <div style={{
        padding: "30px",
        textAlign: "center",
        color: "var(--text-muted, #4a7060)",
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.8rem"
      }}>
        No pipeline runs recorded for this project yet.
      </div>
    );
  }

  const formatTimestamp = (raw) => {
    if (!raw) return "—";
    try {
      const d = new Date(raw);
      return d.toLocaleString(undefined, {
        month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit"
      });
    } catch {
      return String(raw);
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.78rem"
      }}>
        <thead>
          <tr style={{
            borderBottom: "1px solid var(--border, rgba(255,255,255,0.07))",
            color: "var(--text-muted, #4a7060)",
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em"
          }}>
            <th style={{ padding: "12px 14px" }}>Run ID</th>
            <th style={{ padding: "12px 14px" }}>Status</th>
            <th style={{ padding: "12px 14px" }}>Timestamp</th>
            <th style={{ padding: "12px 14px" }}>Duration</th>
            <th style={{ padding: "12px 14px" }}>CPU</th>
            <th style={{ padding: "12px 14px" }}>Memory</th>
            <th style={{ padding: "12px 14px" }}>Energy</th>
            <th style={{ padding: "12px 14px" }}>Carbon</th>
            <th style={{ padding: "12px 14px" }}>Region</th>
            <th style={{ padding: "12px 14px", textAlign: "right" }}>GitHub</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => {
            const carbonGrams = (run.carbon_kg * 1000).toFixed(3);
            const githubLink = repoUrl && run.github_run_id
              ? `${repoUrl.replace(/\/$/, "")}/actions/runs/${run.github_run_id}`
              : null;

            return (
              <tr
                key={run.id || run.github_run_id}
                onClick={() => onSelectRun && onSelectRun(run)}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  cursor: onSelectRun ? "pointer" : "default",
                  transition: "background 0.15s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "12px 14px", color: "var(--cyan, #00e5ff)", fontWeight: 500 }}>
                  #{run.github_run_id ? run.github_run_id.slice(-7) : run.id?.slice(0, 7)}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <PipelineStatusBadge status="completed" />
                </td>
                <td style={{ padding: "12px 14px", color: "var(--text-muted, #4a7060)" }}>
                  {formatTimestamp(run.created_at)}
                </td>
                <td style={{ padding: "12px 14px", color: "var(--text, #d6ede5)" }}>
                  {run.duration_minutes ? `${run.duration_minutes.toFixed(2)}m` : "—"}
                </td>
                <td style={{ padding: "12px 14px", color: "var(--text, #d6ede5)" }}>
                  {run.cpu_usage ? `${run.cpu_usage.toFixed(1)}%` : "0%"}
                </td>
                <td style={{ padding: "12px 14px", color: "var(--text, #d6ede5)" }}>
                  {run.memory_usage ? `${run.memory_usage.toFixed(1)}%` : "0%"}
                </td>
                <td style={{ padding: "12px 14px", color: "var(--text, #d6ede5)" }}>
                  {run.energy_kwh ? `${run.energy_kwh.toFixed(4)} kWh` : "0 kWh"}
                </td>
                <td style={{ padding: "12px 14px", color: "var(--green, #00d68f)", fontWeight: 600 }}>
                  {carbonGrams} g
                </td>
                <td style={{ padding: "12px 14px", color: "var(--text-muted, #4a7060)" }}>
                  {run.region || "us-east-1"}
                </td>
                <td style={{ padding: "12px 14px", textAlign: "right" }}>
                  {githubLink ? (
                    <a
                      href={githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: "var(--green, #00d68f)",
                        textDecoration: "none",
                        fontSize: "0.72rem"
                      }}
                    >
                      View ↗
                    </a>
                  ) : (
                    <span style={{ color: "var(--text-dim, #2a4a3a)" }}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
