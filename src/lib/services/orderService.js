import api from "@/lib/axios";

export const orderService = {
  // Matches POST /api/orders/create
  create: async (orderData) => {
    // orderData should match { customerName, phone, address, orderType... }
    const response = await api.post("/api/orders/create", orderData);
    return response.data;
  },

  // Matches GET /api/orders/my-orders
  getMyOrders: async (params = {}) => {
    const response = await api.get("/api/orders/my-orders", { params });
    return response.data;
  },

  // Matches GET /api/orders/:orderId
  getById: async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  },

  // Matches PUT /api/orders/:orderId/cancel
  cancel: async (orderId) => {
    const response = await api.put(`/api/orders/${orderId}/cancel`);
    return response.data;
  },
};
