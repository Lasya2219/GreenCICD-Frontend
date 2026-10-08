import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { getPipelineRuns, getOptimizationRecommendation } from "../../api";
import MetricCard from "../../components/common/MetricCard";
import DataTable from "../../components/common/DataTable";
import RecommendationCard from "../../components/RecommendationCard";

export default function ProjectOverview() {
  const { currentProject } = useOutletContext();
  const navigate = useNavigate();
  const [runs, setRuns] = useState([]);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    if (!currentProject?.id) return;
    
    let isMounted = true;
    (async () => {
      try {
        const [runRes, optRes] = await Promise.all([
          getPipelineRuns(currentProject.id).catch(() => ({ data: [] })),
          getOptimizationRecommendation(currentProject.id).catch(() => ({ data: null }))
        ]);
        if (isMounted) {
          setRuns(runRes.data || []);
          setRecommendation(optRes.data);
        }
      } catch (err) {
        console.error("Overview error:", err);
      }
    })();

    return () => { isMounted = false; };
  }, [currentProject]);

  if (!currentProject) return null;

  // Project Health & Execution Metrics
  const totalRuns = runs.length;
  const avgDuration = totalRuns > 0
    ? (runs.reduce((acc, r) => acc + (r.duration_minutes || 0), 0) / totalRuns).toFixed(2)
    : "0.00";

  const totalEnergyKwh = runs.reduce((acc, r) => acc + (r.energy_kwh || 0), 0).toFixed(4);
  const latestRegion = totalRuns > 0 ? (runs[0].region || "us-east-1") : "us-east-1";

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
          PROJECT OVERVIEW
        </div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#d6ede5", letterSpacing: "-0.02em" }}>
          How is my project doing right now?
        </h2>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#4a7060", marginTop: "2px" }}>
          Overall project execution health, runtime performance, and recent activity for {currentProject.project_name}.
        </p>
      </div>

      {/* Overview KPI Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px"
      }}>
        <MetricCard
          title="Pipeline Runs"
          value={totalRuns}
          unit="runs"
          icon="🚀"
          subtitle="Total recorded executions"
          color="green"
        />

        <MetricCard
          title="Avg. Duration"
          value={avgDuration}
          unit="min"
          icon="⏱️"
          subtitle="Mean build runtime"
          color="cyan"
        />

        <MetricCard
          title="Total Energy"
          value={totalEnergyKwh}
          unit="kWh"
          icon="⚡"
          subtitle="Power consumed"
          color="cyan"
        />

        <MetricCard
          title="Active Region"
          value={latestRegion}
          unit=""
          icon="🌍"
          subtitle="CI runner location"
          color="green"
        />
      </div>

      {/* Recent Pipeline Runs Table */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            color: "#00d68f",
            textTransform: "uppercase",
            letterSpacing: "0.1em"
          }}>
            Recent Pipeline Runs
          </h3>
          <button
            onClick={() => navigate(`/projects/${currentProject.id}/pipelines`)}
            style={{
              background: "transparent",
              border: "none",
              color: "#00d68f",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              cursor: "pointer"
            }}
          >
            View All Runs ({totalRuns}) ➔
          </button>
        </div>

        <div style={{
          background: "var(--surface, rgba(255, 255, 255, 0.035))",
          border: "1px solid var(--border, rgba(255, 255, 255, 0.07))",
          borderRadius: "14px",
          padding: "8px",
          overflow: "hidden"
        }}>
          <DataTable runs={runs.slice(0, 5)} repoUrl={currentProject.repo_url} />
        </div>
      </div>

      {/* Top Optimization Opportunity */}
      {recommendation && (
        <div>
          <h3 style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            color: "#00d68f",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "10px"
          }}>
            Top Optimization Opportunity
          </h3>
          <RecommendationCard recommendation={recommendation} />
        </div>
      )}
    </div>
  );
}
