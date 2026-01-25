import api from "@/lib/axios";

export const menuService = {
  getAll: async (params) => {
    const response = await api.get("/api/foods", { params });
    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get("/api/foods/featured");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/foods/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/api/foods/categories/all");
    return response.data;
  },
};
