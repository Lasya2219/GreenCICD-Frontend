import React from "react";

export default function PipelineStatusBadge({ status = "completed" }) {
  const isSuccess = status.toLowerCase() === "completed" || status.toLowerCase() === "success";
  
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "3px 10px",
      borderRadius: "12px",
      fontFamily: "'DM Mono', monospace",
      fontSize: "0.65rem",
      fontWeight: 500,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      background: isSuccess ? "rgba(0, 214, 143, 0.08)" : "rgba(255, 77, 109, 0.1)",
      color: isSuccess ? "#00d68f" : "#ff4d6d",
      border: `1px solid ${isSuccess ? "rgba(0, 214, 143, 0.2)" : "rgba(255, 77, 109, 0.2)"}`
    }}>
      <span style={{
        width: "6px", height: "6px",
        borderRadius: "50%",
        background: isSuccess ? "#00d68f" : "#ff4d6d",
        boxShadow: `0 0 6px ${isSuccess ? "#00d68f" : "#ff4d6d"}`
      }} />
      {isSuccess ? "Completed" : status}
    </span>
  );
}
