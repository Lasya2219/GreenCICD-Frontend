import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getPipelineRuns } from "../../api";
import DataTable from "../../components/common/DataTable";

export default function ProjectPipelines() {
  const { currentProject } = useOutletContext();
  const [runs, setRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentProject?.id) return;

    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getPipelineRuns(currentProject.id);
        if (isMounted) {
          setRuns(res.data || []);
        }
      } catch (err) {
        console.error("Pipeline runs error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, [currentProject]);

  if (!currentProject) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
          PIPELINE EXECUTION HISTORY
        </div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#d6ede5", letterSpacing: "-0.02em" }}>
          What exactly happened?
        </h2>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#4a7060", marginTop: "2px" }}>
          Detailed telemetry, resource utilization, and emissions data for every CI/CD run in {currentProject.project_name}.
        </p>
      </div>

      {/* Main Table Container */}
      <div style={{
        background: "var(--surface, rgba(255, 255, 255, 0.035))",
        border: "1px solid var(--border, rgba(255, 255, 255, 0.07))",
        borderRadius: "14px",
        padding: "12px",
        overflow: "hidden"
      }}>
        {loading ? (
          <div style={{
            padding: "30px",
            textAlign: "center",
            fontFamily: "'DM Mono', monospace",
            color: "#4a7060",
            fontSize: "0.8rem"
          }}>
            Fetching pipeline runs...
          </div>
        ) : (
          <DataTable
            runs={runs}
            repoUrl={currentProject.repo_url}
            onSelectRun={(run) => setSelectedRun(run)}
          />
        )}
      </div>

      {/* Selected Run Drawer / Modal Inspector */}
      {selectedRun && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "#0d1710",
            border: "1px solid rgba(0, 214, 143, 0.3)",
            borderRadius: "16px",
            maxWidth: "540px",
            width: "100%",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#d6ede5" }}>
                Run Details #{selectedRun.github_run_id}
              </h3>
              <button
                onClick={() => setSelectedRun(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#4a7060",
                  fontSize: "18px",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem"
            }}>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px" }}>
                <span style={{ color: "#4a7060", display: "block", fontSize: "0.65rem" }}>CARBON EMISSIONS</span>
                <strong style={{ color: "#00d68f", fontSize: "1rem" }}>
                  {(selectedRun.carbon_kg * 1000).toFixed(4)} g CO₂
                </strong>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px" }}>
                <span style={{ color: "#4a7060", display: "block", fontSize: "0.65rem" }}>ENERGY CONSUMED</span>
                <strong style={{ color: "#00e5ff", fontSize: "1rem" }}>
                  {selectedRun.energy_kwh ? selectedRun.energy_kwh.toFixed(5) : 0} kWh
                </strong>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px" }}>
                <span style={{ color: "#4a7060", display: "block", fontSize: "0.65rem" }}>DURATION</span>
                <span style={{ color: "#d6ede5" }}>
                  {selectedRun.duration_minutes ? `${selectedRun.duration_minutes.toFixed(2)} mins` : "—"}
                </span>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px" }}>
                <span style={{ color: "#4a7060", display: "block", fontSize: "0.65rem" }}>RUNNER REGION</span>
                <span style={{ color: "#d6ede5" }}>{selectedRun.region || "us-east-1"}</span>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px" }}>
                <span style={{ color: "#4a7060", display: "block", fontSize: "0.65rem" }}>AVG CPU USAGE</span>
                <span style={{ color: "#d6ede5" }}>{selectedRun.cpu_usage ? `${selectedRun.cpu_usage.toFixed(1)}%` : "0%"}</span>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px" }}>
                <span style={{ color: "#4a7060", display: "block", fontSize: "0.65rem" }}>AVG MEMORY USAGE</span>
                <span style={{ color: "#d6ede5" }}>{selectedRun.memory_usage ? `${selectedRun.memory_usage.toFixed(1)}%` : "0%"}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
              <button
                onClick={() => setSelectedRun(null)}
                style={{
                  padding: "8px 16px",
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#d6ede5",
                  cursor: "pointer",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
