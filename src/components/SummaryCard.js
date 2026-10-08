export default function SummaryCard({ summary }) {

  if (!summary) return null;

  const totalCarbonGrams = (summary.total_carbon * 1000).toFixed(3);

  return (
    <div style={{
      marginTop: "20px",
      padding: "15px",
      border: "1px solid #ccc"
    }}>
      <h3>Project Summary</h3>
      <p><strong>Total Carbon:</strong> {totalCarbonGrams} g CO₂</p>
      <p><strong>Total Energy:</strong> {summary.total_energy.toFixed(3)} kWh</p>
      <p><strong>Latest Region:</strong> {summary.latest_region}</p>
    </div>
  );
}