// Styling lives in AdminSidebar.css (.admin-stat-card etc.), already loaded
// by <AdminSidebar /> on every page that renders this.
const StatsCard = ({ icon, value, label }) => (
  <div className="admin-stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  </div>
);

export default StatsCard;
