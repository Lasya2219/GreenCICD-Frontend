import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getCarbonTrend, getPipelineRuns } from "../../api";
import CarbonChart from "../../components/CarbonChart";
import MetricCard from "../../components/common/MetricCard";

export default function ProjectCarbon() {
  const { currentProject } = useOutletContext();
  const [trendData, setTrendData] = useState([]);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentProject?.id) return;

    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const [trendRes, runRes] = await Promise.all([
          getCarbonTrend(currentProject.id).catch(() => ({ data: [] })),
          getPipelineRuns(currentProject.id).catch(() => ({ data: [] }))
        ]);
        if (isMounted) {
          setTrendData(trendRes.data || []);
          setRuns(runRes.data || []);
        }
      } catch (err) {
        console.error("Carbon analytics error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, [currentProject]);

  if (!currentProject) return null;

  // Run-level calculations
  const totalRuns = runs.length;
  const runCarbonGrams = runs.map((r) => Number(r?.carbon_kg ?? 0) * 1000);
  const totalGrams = runCarbonGrams.reduce((a, b) => a + b, 0);
  const avgGrams = totalRuns > 0 ? (totalGrams / totalRuns).toFixed(3) : "0.000";
  const latestGrams = totalRuns > 0 ? runCarbonGrams[0].toFixed(3) : "0.000";

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
          CARBON ANALYTICS & TRENDS
        </div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#d6ede5", letterSpacing: "-0.02em" }}>
          How is my impact changing?
        </h2>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#4a7060", marginTop: "2px" }}>
          Daily aggregated carbon emissions trend over time for {currentProject.project_name}.
        </p>
      </div>

      {/* Run-Level Carbon KPI Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px"
        }}>
          <MetricCard
            title="Total Carbon"
            value={totalGrams.toFixed(3)}
            unit="g CO₂"
            icon="🌿"
            subtitle={`Sum across ${totalRuns} run(s)`}
            color="green"
          />

          <MetricCard
            title="Avg. per Pipeline"
            value={avgGrams}
            unit="g CO₂"
            icon="📊"
            subtitle="Mean carbon per build run"
            color="cyan"
          />

          <MetricCard
            title="Latest Pipeline"
            value={latestGrams}
            unit="g CO₂"
            icon="⚡"
            subtitle="Most recent build run"
            color="green"
          />
        </div>

        {/* Supporting Indicator */}
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.72rem",
          color: "#00d68f",
          letterSpacing: "0.06em",
          textAlign: "right",
          paddingRight: "4px"
        }}>
          ✓ {totalRuns} pipeline run(s) tracked
        </div>
      </div>

      {/* Carbon Emissions Daily Aggregated Trend Line Chart */}
      <div>
        {loading ? (
          <div style={{
            padding: "40px",
            textAlign: "center",
            fontFamily: "'DM Mono', monospace",
            color: "#4a7060",
            fontSize: "0.8rem",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.07)"
          }}>
            Loading carbon trend analysis...
          </div>
        ) : (
          <CarbonChart data={trendData} />
        )}
      </div>
    </div>
  );
}
