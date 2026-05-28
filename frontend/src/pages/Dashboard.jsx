import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.get();
      setData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="card"><p>Loading dashboard...</p></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#1a1a2e' }}>Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{data.total_products}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <h3>{data.total_customers}</h3>
          <p>Total Customers</p>
        </div>
        <div className="stat-card">
          <h3>{data.total_orders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3>{data.low_stock_products.length}</h3>
          <p>Low Stock Products</p>
        </div>
      </div>

      {data.low_stock_products.length > 0 && (
        <div className="card">
          <h2>Low Stock Products (Stock &le; 10)</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {data.low_stock_products.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td><span className="badge-warning">{product.quantity_in_stock}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
