import React from "react";

export default function MetricCard({ title, value, unit, icon, subtitle, color = "green", trend }) {
  const accentColor = color === "cyan" ? "var(--cyan, #00e5ff)" : color === "red" ? "var(--red, #ff4d6d)" : "var(--green, #00d68f)";
  const iconBg = color === "cyan" ? "rgba(0, 229, 255, 0.12)" : color === "red" ? "rgba(255, 77, 109, 0.12)" : "rgba(0, 214, 143, 0.12)";

  return (
    <div style={{
      background: "var(--surface, rgba(255, 255, 255, 0.035))",
      border: "1px solid var(--border, rgba(255, 255, 255, 0.07))",
      borderRadius: "14px",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.25s ease",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }}>
      {/* Top shimmer accent */}
      <div style={{
        position: "absolute",
        top: 0, left: "10%", right: "10%",
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.68rem",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-muted, #4a7060)"
        }}>
          {title}
        </span>
        {icon && (
          <div style={{
            width: "30px", height: "30px",
            borderRadius: "8px",
            background: iconBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px",
            flexShrink: 0
          }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "6px", margin: "4px 0" }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "1.6rem",
          fontWeight: 600,
          color: "var(--text, #d6ede5)",
          letterSpacing: "-0.03em",
          lineHeight: 1
        }}>
          {value}
        </span>
        {unit && (
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.78rem",
            color: accentColor,
            fontWeight: 500
          }}>
            {unit}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem",
          color: "var(--text-dim, #2a4a3a)",
          marginTop: "auto"
        }}>
          {trend && (
            <span style={{
              color: trend.startsWith("-") || trend.startsWith("▼") ? "var(--green, #00d68f)" : "var(--red, #ff4d6d)",
              fontWeight: 600
            }}>
              {trend}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
