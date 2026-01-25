import api from "@/lib/axios";

export const bookingService = {
  createTableBooking: async (data) => {
    return api.post("/api/bookings/table", data);
  },

  createEventBooking: async (data) => {
    return api.post("/api/bookings/event", data);
  },

  getMyTableBookings: async () => {
    const response = await api.get("/api/bookings/table/my-bookings");
    return response.data;
  },

  cancelTableBooking: async (bookingId) => {
    return api.put(`/api/bookings/table/${bookingId}/cancel`);
  },
};
