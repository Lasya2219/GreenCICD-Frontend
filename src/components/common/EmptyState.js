import React from "react";

export default function EmptyState({ icon = "📡", title = "No data available", message = "No records found for this view.", action }) {
  return (
    <div style={{
      padding: "48px 24px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "14px",
      background: "var(--surface, rgba(255, 255, 255, 0.035))",
      border: "1px solid var(--border, rgba(255, 255, 255, 0.07))",
      borderRadius: "14px"
    }}>
      <div style={{
        position: "relative",
        width: "64px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "28px"
      }}>
        {icon}
      </div>
      <div>
        <h4 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--text, #d6ede5)",
          marginBottom: "4px"
        }}>
          {title}
        </h4>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.75rem",
          color: "var(--text-muted, #4a7060)",
          maxWidth: "360px",
          lineHeight: 1.5
        }}>
          {message}
        </p>
      </div>
      {action && (
        <div style={{ marginTop: "8px" }}>
          {action}
        </div>
      )}
    </div>
  );
}
