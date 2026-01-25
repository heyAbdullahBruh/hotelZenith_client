import api from "@/lib/axios";

export const cartService = {
  get: async () => {
    const response = await api.get("/api/cart");
    return response.data; // { success, data: { items, summary } }
  },

  add: async (foodId, quantity = 1, specialInstructions = "") => {
    // Matches your Controller: { foodId, quantity, specialInstructions }
    return api.post("/api/cart/add", { foodId, quantity, specialInstructions });
  },

  update: async (cartItemId, quantity, specialInstructions) => {
    return api.put(`/api/cart/item/${cartItemId}`, {
      quantity,
      specialInstructions,
    });
  },

  remove: async (cartItemId) => {
    return api.delete(`/api/cart/item/${cartItemId}`);
  },

  clear: async () => {
    return api.delete("/api/cart/clear");
  },
};
