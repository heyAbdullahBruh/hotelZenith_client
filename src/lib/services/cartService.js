import api from '@/lib/axios';

export const cartService = {
  get: async () => {
    const response = await api.get('/api/cart');
    return response.data; // Expects { items, summary }
  },

  add: async (foodId, quantity = 1, specialInstructions = '') => {
    return api.post('/api/cart/add', { foodId, quantity, specialInstructions });
  },

  update: async (cartItemId, quantity) => {
    return api.put(`/api/cart/item/${cartItemId}`, { quantity });
  },

  remove: async (cartItemId) => {
    return api.delete(`/api/cart/item/${cartItemId}`);
  },

  clear: async () => {
    return api.delete('/api/cart/clear');
  }
};