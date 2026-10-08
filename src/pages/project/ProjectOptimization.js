import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getOptimizationRecommendation } from "../../api";

export default function ProjectOptimization() {
  const { currentProject } = useOutletContext();
  const [aiData, setAiData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  if (!currentProject) return null;

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError(null);
      const res = await getOptimizationRecommendation(currentProject.id);
      setAiData(res.data);
    } catch (err) {
      console.error("AI Optimization Error:", err);
      const msg = err.response?.data?.detail || "Failed to complete AI pipeline analysis.";
      setError(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const getPriorityStyle = (priority = "medium") => {
    switch (priority.toLowerCase()) {
      case "high":
        return { bg: "rgba(255, 77, 109, 0.12)", color: "#ff4d6d", border: "rgba(255, 77, 109, 0.3)", label: "🔴 HIGH IMPACT" };
      case "low":
        return { bg: "rgba(0, 229, 255, 0.12)", color: "#00e5ff", border: "rgba(0, 229, 255, 0.3)", label: "🔵 LOW IMPACT" };
      default:
        return { bg: "rgba(0, 214, 143, 0.12)", color: "#00d68f", border: "rgba(0, 214, 143, 0.3)", label: "🟢 MEDIUM IMPACT" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header Banner */}
      <div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.68rem",
          color: "#00d68f",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "4px"
        }}>
          SUSTAINABILITY OPTIMIZATION
        </div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#d6ede5", letterSpacing: "-0.02em" }}>
          What should I do?
        </h2>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#4a7060", marginTop: "2px" }}>
          Server-side Groq AI pipeline analysis (<code style={{ color: "#00d68f" }}>llama-3.3-70b-versatile</code>) to detect workflow inefficiencies for {currentProject.project_name}.
        </p>
      </div>

      {/* Hero AI Action Bar */}
      <div style={{
        background: "linear-gradient(135deg, rgba(0, 214, 143, 0.06), rgba(0, 229, 255, 0.04))",
        border: "1px solid rgba(0, 214, 143, 0.2)",
        borderRadius: "16px",
        padding: "28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div style={{ maxWidth: "600px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "20px" }}>🤖</span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#d6ede5" }}>
              GreenCICD AI Pipeline Optimizer
            </h3>
          </div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#4a7060", lineHeight: 1.5 }}>
            Runs server-side LLM analysis on <code style={{ color: "#00d68f" }}>.github/workflows/greencicd.yml</code> and empirical CPU, RAM, and duration telemetry data.
          </p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #00d68f, #00a86b)",
            color: "#080f0c",
            border: "none",
            borderRadius: "10px",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: analyzing ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 20px rgba(0, 214, 143, 0.25)"
          }}
        >
          {analyzing ? (
            <>
              <span style={{
                width: "14px", height: "14px",
                border: "2px solid #080f0c",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite"
              }} />
              Analyzing...
            </>
          ) : (
            <>
              <span>✨</span>
              <span>{aiData ? "Re-analyze Pipeline" : "Analyze Pipeline with AI"}</span>
            </>
          )}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div style={{
          background: "rgba(255,77,109,0.1)",
          border: "1px solid rgba(255,77,109,0.3)",
          color: "#ff4d6d",
          padding: "16px 20px",
          borderRadius: "12px",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.8rem"
        }}>
          ⚠️ <strong>AI Analysis Error:</strong> {error}
        </div>
      )}

      {/* Loading State Skeleton */}
      {analyzing && (
        <div style={{
          padding: "48px 24px",
          textAlign: "center",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px"
        }}>
          <div style={{
            width: "36px", height: "36px",
            border: "3px solid rgba(0, 214, 143, 0.2)",
            borderTopColor: "#00d68f",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#d6ede5" }}>
              Analyzing Workflow & Telemetry with Groq AI...
            </h4>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#4a7060", marginTop: "4px" }}>
              Evaluating caching options, job parallelism, and resource utilization.
            </p>
          </div>
        </div>
      )}

      {/* AI Analysis Results */}
      {!analyzing && aiData && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Executive Summary */}
          {aiData.summary && (
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "20px"
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                color: "#00d68f",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "6px"
              }}>
                EXECUTIVE AI SUMMARY
              </div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: "#d6ede5", lineHeight: 1.6 }}>
                {aiData.summary}
              </p>
            </div>
          )}

          {/* Structured Recommendation Cards */}
          <div>
            <h3 style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: "#00d68f",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "14px"
            }}>
              Optimization Recommendations ({aiData.recommendations?.length || 0})
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {aiData.recommendations?.map((rec, idx) => {
                const priorityStyle = getPriorityStyle(rec.priority);

                return (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      borderRadius: "16px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px"
                    }}
                  >
                    {/* Card Top Badge & Title */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                      <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#d6ede5" }}>
                        {rec.title}
                      </h4>
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        padding: "4px 12px",
                        borderRadius: "12px",
                        background: priorityStyle.bg,
                        color: priorityStyle.color,
                        border: `1px solid ${priorityStyle.border}`
                      }}>
                        {priorityStyle.label}
                      </span>
                    </div>

                    {/* Problem & Evidence Grid */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "14px",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem"
                    }}>
                      <div style={{ background: "rgba(0,0,0,0.25)", padding: "12px 14px", borderRadius: "10px" }}>
                        <span style={{ color: "#ff4d6d", display: "block", fontSize: "0.65rem", fontWeight: 600, marginBottom: "4px" }}>
                          ISSUE IDENTIFIED
                        </span>
                        <span style={{ color: "#d6ede5" }}>{rec.problem}</span>
                      </div>

                      <div style={{ background: "rgba(0,0,0,0.25)", padding: "12px 14px", borderRadius: "10px" }}>
                        <span style={{ color: "#00e5ff", display: "block", fontSize: "0.65rem", fontWeight: 600, marginBottom: "4px" }}>
                          EVIDENCE & PROOF
                        </span>
                        <span style={{ color: "#d6ede5" }}>{rec.evidence}</span>
                      </div>
                    </div>

                    {/* Recommendation Steps */}
                    <div style={{ background: "rgba(0, 214, 143, 0.04)", border: "1px solid rgba(0, 214, 143, 0.15)", padding: "14px", borderRadius: "10px" }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", color: "#00d68f", display: "block", fontSize: "0.68rem", fontWeight: 600, marginBottom: "4px" }}>
                        ACTIONABLE STEPS
                      </span>
                      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", color: "#d6ede5", lineHeight: 1.5, margin: 0 }}>
                        {rec.recommendation}
                      </p>
                    </div>

                    {/* Footer Impact & Effort */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      paddingTop: "12px"
                    }}>
                      <span style={{ color: "#4a7060" }}>
                        Expected Impact: <strong style={{ color: "#00d68f" }}>{rec.expected_impact}</strong>
                      </span>
                      <span style={{ color: "#4a7060" }}>
                        Effort: <strong style={{ color: "#d6ede5", textTransform: "capitalize" }}>{rec.effort}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Initial Empty State before Analysis */}
      {!analyzing && !aiData && !error && (
        <div style={{
          padding: "48px 24px",
          textAlign: "center",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{ fontSize: "32px", opacity: 0.8 }}>⚡</span>
          <h4 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#d6ede5" }}>
            Ready for AI Optimization Analysis
          </h4>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#4a7060", maxWidth: "440px", lineHeight: 1.5 }}>
            Click the <strong style={{ color: "#00d68f" }}>Analyze Pipeline with AI</strong> button above to evaluate your GitHub Actions workflow configuration and telemetry.
          </p>
        </div>
      )}
    </div>
  );
}
