import api from '@/lib/axios';

export const orderService = {
  // Create a new order from the current cart
  create: async (orderData) => {
    return api.post('/api/orders/create', orderData);
  },

  // Get current guest's order history
  getMyOrders: async (params) => {
    const response = await api.get('/api/orders/my-orders', { params });
    return response.data;
  },

  // Get specific order details
  getById: async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  },

  // Cancel an order
  cancel: async (orderId) => {
    return api.put(`/api/orders/${orderId}/cancel`);
  }
};