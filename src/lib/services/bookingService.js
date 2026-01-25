import api from '@/lib/axios';

export const bookingService = {
  createTableBooking: async (data) => {
    return api.post('/api/bookings/table', data);
  },

  createEventBooking: async (data) => {
    return api.post('/api/bookings/event', data);
  }
};