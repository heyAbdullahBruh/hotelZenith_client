"use client";
import { useEffect, useState } from "react";
import { bookingService } from "@/lib/services/bookingService";
import SectionHeader from "@/components/ui/SectionHeader";
import { Calendar, Users, Clock, X } from "lucide-react";
import { toast } from "sonner";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyTableBookings();
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await bookingService.cancelTableBooking(id);
      toast.success("Reservation cancelled.");
      fetchBookings(); // Refresh list
    } catch (error) {
      toast.error("Failed to cancel.");
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container max-w-4xl">
        <SectionHeader title="My Reservations" subtitle="Table Bookings" />

        {loading ? (
          <div className="text-center py-20">Loading reservations...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-sm shadow-sm">
            <Calendar size={48} className="mx-auto text-secondary-300 mb-4" />
            <h3 className="text-xl font-bold text-secondary-900 mb-2">
              No upcoming reservations
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-primary-500 relative group"
              >
                {booking.status !== "cancelled" && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="absolute top-4 right-4 text-secondary-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Cancel Booking"
                  >
                    <X size={20} />
                  </button>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-secondary-400 tracking-wider">
                      Date
                    </span>
                    <p className="font-display text-xl font-bold text-secondary-900">
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold uppercase px-2 py-1 rounded-sm ${booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-secondary-600">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-primary-500" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-primary-500" />
                    <span>{booking.guestCount} Guests</span>
                  </div>
                  {booking.occasion && (
                    <div className="mt-4 p-3 bg-secondary-50 text-xs italic text-secondary-500 rounded-sm">
                      "{booking.occasion}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

