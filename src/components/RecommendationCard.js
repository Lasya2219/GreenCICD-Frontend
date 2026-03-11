export default function RecommendationCard({ recommendation }) {
  if (!recommendation) return null;

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
      }}
    >
      <h3 style={{ marginTop: 0, color: "#333" }}>
        Optimization Recommendation
      </h3>
      <p style={{ color: "#666", lineHeight: "1.5" }}>
        {recommendation.recommendation}
      </p>
    </div>
  );
}