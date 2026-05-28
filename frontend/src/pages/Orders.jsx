import { useState, useEffect } from 'react';
import { orderAPI, customerAPI, productAPI } from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    customer_id: '',
    items: [{ product_id: '', quantity: '' }]
  });

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (err) {}
  };

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (err) {}
  };

  const resetForm = () => {
    setFormData({ customer_id: '', items: [{ product_id: '', quantity: '' }] });
    setShowForm(false);
    setError('');
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', quantity: '' }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;
    const items = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items });
  };

  const updateItem = (index, field, value) => {
    const items = [...formData.items];
    items[index] = { ...items[index], [field]: value };
    setFormData({ ...formData, items });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      customer_id: parseInt(formData.customer_id),
      items: formData.items.map(item => ({
        product_id: parseInt(item.product_id),
        quantity: parseInt(item.quantity)
      }))
    };

    try {
      await orderAPI.create(payload);
      setSuccess('Order created successfully');
      resetForm();
      fetchOrders();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderAPI.delete(id);
      setSuccess('Order cancelled successfully');
      fetchOrders();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to cancel order');
    }
  };

  const viewOrderDetails = async (id) => {
    try {
      const response = await orderAPI.getById(id);
      setShowDetail(response.data);
    } catch (err) {
      setError('Failed to load order details');
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.full_name : `Customer #${customerId}`;
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Product #${productId}`;
  };

  return (
    <div>
      <div className="page-header">
        <h2>Orders</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Create Order
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Create New Order</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer</label>
                <select
                  value={formData.customer_id}
                  onChange={e => setFormData({...formData, customer_id: e.target.value})}
                  required
                >
                  <option value="">Select a customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              </div>

              <div className="order-items-section">
                <label style={{fontWeight: '600', marginBottom: '10px', display: 'block'}}>Order Items</label>
                {formData.items.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <div className="form-group">
                      <select
                        value={item.product_id}
                        onChange={e => updateItem(index, 'product_id', e.target.value)}
                        required
                      >
                        <option value="">Select product</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Stock: {p.quantity_in_stock})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{maxWidth: '100px'}}>
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={e => updateItem(index, 'quantity', e.target.value)}
                        required
                      />
                    </div>
                    {formData.items.length > 1 && (
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => removeItem(index)}>
                        X
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-success" onClick={addItem}>
                  + Add Item
                </button>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && (
        <div className="modal-overlay" onClick={() => setShowDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Order #{showDetail.id} Details</h3>
            <p><strong>Customer:</strong> {getCustomerName(showDetail.customer_id)}</p>
            <p><strong>Status:</strong> {showDetail.status}</p>
            <p><strong>Total:</strong> ${showDetail.total_amount.toFixed(2)}</p>
            <p><strong>Date:</strong> {new Date(showDetail.created_at).toLocaleDateString()}</p>

            <table style={{marginTop: '15px'}}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {showDetail.items.map(item => (
                  <tr key={item.id}>
                    <td>{getProductName(item.product_id)}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unit_price.toFixed(2)}</td>
                    <td>${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setShowDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>No orders found</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{getCustomerName(order.customer_id)}</td>
                    <td>${order.total_amount.toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => viewOrderDetails(order.id)} style={{marginRight: '5px'}}>
                        View
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(order.id)}>
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;
