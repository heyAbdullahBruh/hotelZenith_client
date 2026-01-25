import api from "@/lib/axios";

export const menuService = {
  // Matches: GET /api/foods
  getAll: async (filters = {}) => {
    // Clean undefined/null values before sending
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== ""),
    );

    const response = await api.get("/api/foods", { params });
    return response.data; // Returns { success, data: [], pagination: {} }
  },

  // Matches: GET /api/foods/featured
  getFeatured: async (limit = 6) => {
    const response = await api.get("/api/foods/featured", {
      params: { limit },
    });
    return response.data;
  },

  // Matches: GET /api/foods/:foodId
  getById: async (id) => {
    const response = await api.get(`/api/foods/${id}`);
    return response.data;
  },

  // Matches: GET /api/foods/categories/all
  getCategories: async () => {
    const response = await api.get("/api/foods/categories/all", {
      params: { isActive: true },
    });
    return response.data;
  },
};
