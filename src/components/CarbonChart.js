import { useRef, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

/* ── date label helper (unchanged logic) ── */
function getDayLabel(item) {
  const raw = item?.day ?? item?.date ?? item?.created_at ?? item?.month ?? "";
  if (!raw) return "";
  if (typeof raw === "string") {
    const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
    }
  }
  const parsed = new Date(raw);
  return isNaN(parsed.getTime())
    ? String(raw)
    : parsed.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

/* ── custom Chart.js plugin: vertical crosshair ── */
const crosshairPlugin = {
  id: "crosshair",
  afterDraw(chart) {
    if (chart._hoveredX == null) return;
    const { ctx, chartArea: { top, bottom } } = chart;
    ctx.save();
    ctx.strokeStyle = "rgba(0,214,143,0.25)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(chart._hoveredX, top);
    ctx.lineTo(chart._hoveredX, bottom);
    ctx.stroke();
    ctx.restore();
  }
};

/* ── custom plugin: glowing dot on hover ── */
const glowDotPlugin = {
  id: "glowDot",
  afterDraw(chart) {
    if (chart._hoveredDataIndex == null) return;
    const ds = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);
    const point = meta.data[chart._hoveredDataIndex];
    if (!point) return;
    const { ctx } = chart;
    const x = point.x, y = point.y;
    ctx.save();
    // outer glow ring
    const grad = ctx.createRadialGradient(x, y, 2, x, y, 18);
    grad.addColorStop(0, "rgba(0,214,143,0.35)");
    grad.addColorStop(1, "rgba(0,214,143,0)");
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    // solid dot
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#00d68f";
    ctx.shadowColor = "#00d68f";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#002818";
    ctx.shadowBlur = 0;
    ctx.fill();
    ctx.restore();
  }
};

const css = `
  .cc-wrap {
    font-family: 'Outfit', 'DM Mono', sans-serif;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .cc-wrap:hover {
    border-color: rgba(0,214,143,0.22);
    box-shadow: 0 8px 40px rgba(0,214,143,0.07);
  }
  /* top shimmer */
  .cc-wrap::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,214,143,0.5), transparent);
  }
  /* left accent bar */
  .cc-wrap::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 2px; height: 100%;
    background: linear-gradient(180deg, #00d68f, transparent);
    border-radius: 2px 0 0 2px;
  }

  .cc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 0;
    flex-wrap: wrap;
    gap: 10px;
  }

  .cc-title-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cc-icon {
    width: 28px; height: 28px;
    border-radius: 7px;
    background: rgba(0,214,143,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }
  .cc-title {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #00d68f;
  }
  .cc-subtitle {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    color: #4a7060;
    letter-spacing: 0.08em;
    margin-top: 1px;
  }

  .cc-stats {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .cc-stat {
    text-align: right;
  }
  .cc-stat-val {
    font-family: 'DM Mono', monospace;
    font-size: 1.05rem;
    font-weight: 500;
    color: #d6ede5;
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .cc-stat-val.up   { color: #ff6b8a; }
  .cc-stat-val.down { color: #00d68f; }
  .cc-stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem;
    color: #4a7060;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .cc-divider {
    height: 1px;
    background: linear-gradient(90deg, rgba(0,214,143,0.15), transparent);
    margin: 14px 20px 0;
  }

  .cc-chart-area {
    padding: 12px 16px 16px;
    height: 300px;
    position: relative;
  }

  .cc-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px 14px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .cc-legend {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    color: #4a7060;
    letter-spacing: 0.06em;
  }
  .cc-legend-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #00d68f;
    box-shadow: 0 0 6px #00d68f;
    flex-shrink: 0;
  }
  .cc-range-pills {
    display: flex;
    gap: 4px;
  }
  .cc-range-pill {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.06em;
    padding: 3px 10px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.07);
    color: #4a7060;
    background: transparent;
    cursor: pointer;
    transition: all 0.15s;
  }
  .cc-range-pill.active {
    color: #00d68f;
    background: rgba(0,214,143,0.08);
    border-color: rgba(0,214,143,0.25);
  }
  .cc-range-pill:hover:not(.active) {
    border-color: rgba(255,255,255,0.15);
    color: #d6ede5;
  }

  .cc-empty {
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 20px;
  }
  .cc-empty-icon { font-size: 28px; opacity: 0.25; }
  .cc-empty-text {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: #2a4a3a;
    letter-spacing: 0.08em;
  }
`;

const RANGES = ["7D", "14D", "30D", "ALL"];

export default function CarbonChart({ data = [] }) {
  const chartRef = useRef(null);
  const safeData = Array.isArray(data) ? data : [];

  // Range filter state (visual only — slices from the tail)
  const [range, setRange] = useState("ALL");

  const sliced = useMemo(() => {
    const map = { "7D": 7, "14D": 14, "30D": 30, ALL: Infinity };
    const n = map[range] ?? Infinity;
    return safeData.slice(-n);
  }, [safeData, range]);

  // Derived stats
  const values = sliced.map(d => Number(d?.total_carbon ?? 0));
  const latest  = values.at(-1) ?? 0;
  const prev    = values.at(-2) ?? latest;
  const delta   = latest - prev;
  const pct     = prev !== 0 ? ((delta / prev) * 100).toFixed(1) : null;
  const total   = values.reduce((a, b) => a + b, 0);
  const avg     = values.length ? (total / values.length).toFixed(2) : 0;

  // Build gradient inside component so it updates with chart
  const getGradient = (ctx, chartArea) => {
    if (!chartArea) return "rgba(0,214,143,0.15)";
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0,   "rgba(0,214,143,0.28)");
    gradient.addColorStop(0.5, "rgba(0,214,143,0.08)");
    gradient.addColorStop(1,   "rgba(0,214,143,0)");
    return gradient;
  };

  const chartData = useMemo(() => ({
    labels: sliced.map(getDayLabel),
    datasets: [{
      label: "CO₂ Emissions",
      data: sliced.map(d => Number(d?.total_carbon ?? 0)),
      borderColor: "#00d68f",
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return "rgba(0,214,143,0.1)";
        return getGradient(ctx, chartArea);
      },
      borderWidth: 2,
      tension: 0.42,
      fill: true,
      pointRadius: 0,          // hidden by default; glowDotPlugin handles hover
      pointHoverRadius: 0,
      pointBackgroundColor: "#00d68f",
      pointBorderColor: "#080f0c",
      pointBorderWidth: 2,
    }]
  }), [sliced]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    animation: {
      duration: 600,
      easing: "easeOutQuart"
    },
    onHover: (event, elements, chart) => {
      if (elements.length) {
        chart._hoveredDataIndex = elements[0].index;
        chart._hoveredX = elements[0].element.x;
      } else {
        chart._hoveredDataIndex = null;
        chart._hoveredX = null;
      }
      chart.draw();
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#0d1710",
        borderColor: "rgba(0,214,143,0.25)",
        borderWidth: 1,
        titleColor: "#00d68f",
        bodyColor: "#d6ede5",
        padding: { top: 10, bottom: 10, left: 14, right: 14 },
        titleFont: { family: "'DM Mono', monospace", size: 11, weight: "500" },
        bodyFont:  { family: "'DM Mono', monospace", size: 12 },
        displayColors: false,
        callbacks: {
          title: (items) => items[0]?.label ?? "",
          label: (ctx) => {
            const v = ctx.parsed.y;
            return `${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg CO₂`;
          },
          afterLabel: (ctx) => {
            const idx = ctx.dataIndex;
            const prev = ctx.dataset.data[idx - 1];
            if (prev == null) return "";
            const diff = ctx.parsed.y - prev;
            return diff >= 0
              ? `▲ +${diff.toFixed(2)} vs prev`
              : `▼ ${diff.toFixed(2)} vs prev`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#4a7060",
          font: { family: "'DM Mono', monospace", size: 10 },
          maxRotation: 0,
          maxTicksLimit: 8,
        }
      },
      y: {
        position: "right",
        beginAtZero: false,
        grid: {
          color: "rgba(255,255,255,0.04)",
          drawBorder: false,
        },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: "#4a7060",
          font: { family: "'DM Mono', monospace", size: 10 },
          padding: 8,
          callback: (v) => `${v}kg`
        }
      }
    }
  }), []);

  const trendClass = delta > 0 ? "up" : delta < 0 ? "down" : "";
  const trendArrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "—";
  const trendColor = delta > 0 ? "#ff6b8a" : delta < 0 ? "#00d68f" : "#4a7060";

  return (
    <>
      <style>{css}</style>
      <div className="cc-wrap">
        {/* ── Header ── */}
        <div className="cc-header">
          <div className="cc-title-group">
            <div className="cc-icon">📈</div>
            <div>
              <div className="cc-title">Carbon Emissions Trend</div>
              <div className="cc-subtitle">{sliced.length} data points · kg CO₂ equivalent</div>
            </div>
          </div>

          <div className="cc-stats">
            {pct !== null && (
              <div className="cc-stat">
                <div className={`cc-stat-val ${trendClass}`}>
                  {trendArrow} {Math.abs(pct)}%
                </div>
                <div className="cc-stat-label">vs prev</div>
              </div>
            )}
            <div className="cc-stat">
              <div className="cc-stat-val">{avg}</div>
              <div className="cc-stat-label">avg kg</div>
            </div>
            <div className="cc-stat">
              <div className="cc-stat-val" style={{ color: trendColor }}>
                {latest.toFixed(2)}
              </div>
              <div className="cc-stat-label">latest</div>
            </div>
          </div>
        </div>

        <div className="cc-divider" />

        {/* ── Chart ── */}
        <div className="cc-chart-area">
          {sliced.length === 0 ? (
            <div className="cc-empty">
              <div className="cc-empty-icon">🌿</div>
              <div className="cc-empty-text">NO EMISSIONS DATA AVAILABLE</div>
            </div>
          ) : (
            <Line
              ref={chartRef}
              data={chartData}
              options={options}
              plugins={[crosshairPlugin, glowDotPlugin]}
            />
          )}
        </div>

        {/* ── Footer ── */}
        <div className="cc-footer">
          <div className="cc-legend">
            <div className="cc-legend-dot" />
            CO₂ emissions per pipeline run
          </div>
          <div className="cc-range-pills">
            {RANGES.map(r => (
              <button
                key={r}
                className={`cc-range-pill ${range === r ? "active" : ""}`}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}