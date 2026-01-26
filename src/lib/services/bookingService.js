import api from "@/lib/axios";

export const bookingService = {
  // --- TABLE BOOKINGS ---
  createTableBooking: async (data) => {
    return api.post("/api/bookings/table", data);
  },

  getMyTableBookings: async () => {
    // Returns array directly based on your previous controller
    const response = await api.get("/api/bookings/table/my-bookings");
    return response.data;
  },

  cancelTableBooking: async (bookingId) => {
    return api.put(`/api/bookings/table/${bookingId}/cancel`);
  },

  // --- EVENT BOOKINGS ---
  createEventBooking: async (data) => {
    return api.post("/api/bookings/event", data);
  },

  getMyEventBookings: async (filters = {}) => {
    // Endpoint: /api/bookings/event/my-bookings?upcoming=true
    const response = await api.get("/api/bookings/event/my-bookings", {
      params: filters,
    });
    // Returns { success: true, data: [...], pagination: {} }
    return response.data;
  },

  cancelEventBooking: async (bookingId) => {
    return api.put(`/api/bookings/event/${bookingId}/cancel`);
  },
};
