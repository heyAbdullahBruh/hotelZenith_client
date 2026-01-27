import api from "@/lib/axios";

export const reviewService = {
  // GET /api/reviews/all
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
    const response = await api.get(`/api/reviews/all?${params}`);
    return response.data;
  },

  // GET /api/reviews/my-reviews (Using data in GET as per your backend controller)
  getByEmail: async (email) => {
    // Note: Sending body in GET is non-standard. 
    // If this fails, change backend to use req.query.email
    const response = await api.get("/api/reviews/my-reviews", {
      data: { email }
    });
    return response.data;
  },

  // POST /api/reviews/create
  create: async (data) => {
    return api.post("/api/reviews/create", data);
  },

  // PUT /api/reviews/:id
  update: async (id, data) => {
    return api.put(`/api/reviews/${id}`, data);
  },

  // DELETE /api/reviews/:id
  delete: async (id, email) => {
    // Backend requires email in body for verification
    return api.delete(`/api/reviews/${id}`, {
      data: { email }
    });
  },

  // POST /api/reviews/:id/helpful
  voteHelpful: async (id) => {
    return api.post(`/api/reviews/${id}/helpful`);
  }
};