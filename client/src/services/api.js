const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Customers
  getCustomers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/customers?${query}`);
  },
  getCustomerStats: () => request('/customers/stats/summary'),
  getCustomerById: (id) => request(`/customers/${id}`),
  createCustomer: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  addCustomerNote: (id, text, author) => request(`/customers/${id}/notes`, { method: 'POST', body: JSON.stringify({ text, author }) }),
  addCustomerTag: (id, tag) => request(`/customers/${id}/tags`, { method: 'POST', body: JSON.stringify({ tag }) }),

  // Orders
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders?${query}`);
  },
  getOrderById: (id) => request(`/orders/${id}`),
  createOrder: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrderStatus: (id, status, note) => request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, note }) }),
  updateOrderTracking: (id, tracking) => request(`/orders/${id}/tracking`, { method: 'PATCH', body: JSON.stringify(tracking) }),

  // Workflows
  getWorkflows: () => request('/workflows'),
  getWorkflowLogs: () => request('/workflows/logs/recent'),
  createWorkflow: (data) => request('/workflows', { method: 'POST', body: JSON.stringify(data) }),
  updateWorkflow: (id, data) => request(`/workflows/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWorkflow: (id) => request(`/workflows/${id}`, { method: 'DELETE' }),
  testWorkflow: (id) => request(`/workflows/${id}/test`, { method: 'POST' }),

  // Communications
  getCommunications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/communications?${query}`);
  },
  sendCommunication: (data) => request('/communications/send', { method: 'POST', body: JSON.stringify(data) }),
  generateAIDraft: (data) => request('/communications/ai-draft', { method: 'POST', body: JSON.stringify(data) }),

  // WooCommerce Integration
  getStoreSettings: () => request('/woocommerce/settings'),
  updateStoreSettings: (data) => request('/woocommerce/settings', { method: 'POST', body: JSON.stringify(data) }),
  testConnection: (data) => request('/woocommerce/test-connection', { method: 'POST', body: JSON.stringify(data) }),
  syncData: () => request('/woocommerce/sync', { method: 'POST' }),
  simulateWebhook: (eventType, customData = {}) => request('/woocommerce/simulate-webhook', { method: 'POST', body: JSON.stringify({ eventType, customData }) }),
  resetDemoStore: () => request('/woocommerce/reset-demo', { method: 'POST' }),
};
