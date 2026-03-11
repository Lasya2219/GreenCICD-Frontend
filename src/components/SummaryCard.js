export default function SummaryCard({ summary }) {

  if (!summary) return null;

  return (
    <div style={{
      marginTop: "20px",
      padding: "15px",
      border: "1px solid #ccc"
    }}>
      <h3>Project Summary</h3>
      <p><strong>Total Carbon:</strong> {summary.total_carbon.toFixed(2)} kg</p>
      <p><strong>Total Energy:</strong> {summary.total_energy.toFixed(2)} kWh</p>
      <p><strong>Latest Region:</strong> {summary.latest_region}</p>
    </div>
  );
}