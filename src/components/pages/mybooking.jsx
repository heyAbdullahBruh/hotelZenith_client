"use client";
import { useEffect, useState } from "react";
import { bookingService } from "@/lib/services/bookingService";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  Calendar,
  Users,
  Clock,
  X,
  Wine,
  Building2,
  Hash,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Helper for status badge colors
const getStatusColor = (status) => {
  switch (status) {
    case "confirmed":
    case "deposit_paid":
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "quotation_sent":
      return "bg-primary-100 text-primary-800 border-primary-200";
    case "pending":
    case "under_review":
    default:
      return "bg-secondary-100 text-secondary-800 border-secondary-200";
  }
};

const formatStatus = (status) => {
  return status.replace(/_/g, " ");
};

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState("table"); // 'table' | 'event'
  const [tableBookings, setTableBookings] = useState([]);
  const [eventBookings, setEventBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parallel Fetching
  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const [tableData, eventRes] = await Promise.allSettled([
        bookingService.getMyTableBookings(),
        bookingService.getMyEventBookings({ upcoming: "true", limit: 50 }),
      ]);

      // Handle Table Data (Array)
      if (tableData.status === "fulfilled") {
        setTableBookings(tableData.value?.data  || []);
      }

      // Handle Event Data (Object with .data array)
      if (eventRes.status === "fulfilled") {
        setEventBookings(eventRes.value?.data || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Could not load some bookings.");
    } finally {
      setLoading(false);
    }
  };
console.log(tableBookings);
  useEffect(() => {
    fetchAllBookings();
  }, []);

  // --- Handlers ---

  const handleTableCancel = async (id) => {
    if (!confirm("Cancel this dining reservation?")) return;
    try {
      await bookingService.cancelTableBooking(id);
      toast.success("Reservation cancelled.");
      fetchAllBookings();
    } catch (error) {
      toast.error("Failed to cancel reservation.");
    }
  };

  const handleEventCancel = async (id) => {
    if (
      !confirm(
        "Are you sure? Event cancellations are subject to policy review.",
      )
    )
      return;
    try {
      await bookingService.cancelEventBooking(id);
      toast.success("Event booking cancelled.");
      fetchAllBookings();
    } catch (error) {
      // Backend returns specific message (e.g., "7 days notice required")
      const msg = error.response?.data?.message || "Failed to cancel event.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container max-w-5xl">
        <SectionHeader
          title="My Dashboard"
          subtitle="Manage Reservations"
          center={true}
          className="mb-10"
        />

        {/* TABS */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1 rounded-full shadow-sm border border-secondary-200 inline-flex">
            <button
              onClick={() => setActiveTab("table")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all",
                activeTab === "table"
                  ? "bg-secondary-900 text-white shadow-md"
                  : "text-secondary-500 hover:text-secondary-900",
              )}
            >
              Dining
            </button>
            <button
              onClick={() => setActiveTab("event")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all",
                activeTab === "event"
                  ? "bg-primary-500 text-white shadow-md"
                  : "text-secondary-500 hover:text-secondary-900",
              )}
            >
              Events
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-secondary-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p>Retrieving your bookings...</p>
          </div>
        ) : (
          <div className="min-h-400px">
            <AnimatePresence mode="wait">
              {/* --- TABLE BOOKINGS VIEW --- */}
              {activeTab === "table" && (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {tableBookings.length === 0 ? (
                    <EmptyState
                      title="No Dining Reservations"
                      msg="You haven't booked a table yet."
                      link="/bookings/table"
                      linkText="Book a Table"
                    />
                  ) : (
                    tableBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="bg-white p-6 rounded-lg shadow-sm border border-secondary-100 relative group overflow-hidden"
                      >
                        <div
                          className={`absolute top-0 left-0 w-1 h-full ${booking.status === "cancelled" ? "bg-red-400" : "bg-secondary-900"}`}
                        />

                        {booking.status !== "cancelled" &&
                          booking.status !== "completed" && (
                            <button
                              onClick={() => handleTableCancel(booking._id)}
                              className="absolute top-4 right-4 text-secondary-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                              title="Cancel Reservation"
                            >
                              <X size={18} />
                            </button>
                          )}

                        <div className="flex justify-between items-start mb-4 pr-8">
                          <div>
                            <span className="text-xs font-bold uppercase text-secondary-400">
                              Dining
                            </span>
                            <h4 className="font-display text-xl font-bold text-secondary-900">
                              {new Date(booking.date).toLocaleDateString(
                                undefined,
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </h4>
                          </div>
                          <Badge status={booking.status} />
                        </div>

                        <div className="space-y-3 text-sm text-secondary-600">
                          <div className="flex items-center gap-3">
                            <Clock size={16} className="text-primary-500" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Users size={16} className="text-primary-500" />
                            <span>{booking.guestCount} Guests</span>
                          </div>
                          {booking.occasion && (
                            <div className="flex items-center gap-3">
                              <Wine size={16} className="text-primary-500" />
                              <span className="capitalize">
                                {booking.occasion}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {/* --- EVENT BOOKINGS VIEW --- */}
              {activeTab === "event" && (
                <motion.div
                  key="event"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {eventBookings.length === 0 ? (
                    <EmptyState
                      title="No Event Inquiries"
                      msg="Plan your next grand celebration with us."
                      link="/bookings/event"
                      linkText="Plan an Event"
                    />
                  ) : (
                    eventBookings.map((event) => (
                      <div
                        key={event._id}
                        className="bg-white rounded-lg shadow-sm border border-secondary-100 overflow-hidden"
                      >
                        {/* Header */}
                        <div className="bg-secondary-50 p-4 border-b border-secondary-100 flex flex-wrap justify-between items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-md border border-secondary-200">
                              <Hash size={16} className="text-primary-600" />
                            </div>
                            <div>
                              <p className="text-xs text-secondary-500 font-bold uppercase">
                                Booking ID
                              </p>
                              <p className="font-mono text-sm font-bold text-secondary-900">
                                {event.bookingNumber}
                              </p>
                            </div>
                          </div>
                          <Badge status={event.status} />
                        </div>

                        {/* Body */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Col 1: Main Info */}
                          <div className="space-y-3">
                            <h4 className="font-display text-lg font-bold text-secondary-900 flex items-center gap-2">
                              {event.eventType.toUpperCase()}
                            </h4>
                            <div className="flex items-center gap-2 text-secondary-600 text-sm">
                              <Calendar
                                size={16}
                                className="text-primary-500"
                              />
                              <span>
                                {new Date(event.eventDate).toLocaleDateString(
                                  undefined,
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-secondary-600 text-sm">
                              <Clock size={16} className="text-primary-500" />
                              <span>
                                {event.startTime} - {event.endTime}
                              </span>
                            </div>
                          </div>

                          {/* Col 2: Details */}
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-secondary-700">
                              <Building2
                                size={16}
                                className="text-secondary-400"
                              />
                              <span className="capitalize">
                                Venue:{" "}
                                <b>{formatStatus(event.venuePreference)}</b>
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-secondary-700">
                              <Users size={16} className="text-secondary-400" />
                              <span>
                                Count: <b>{event.guestCount}</b>
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-secondary-700">
                              <Wine size={16} className="text-secondary-400" />
                              <span className="capitalize">
                                Bev:{" "}
                                <b>{formatStatus(event.beveragePackage)}</b>
                              </span>
                            </div>
                          </div>

                          {/* Col 3: Actions */}
                          <div className="flex flex-col justify-center items-start md:items-end gap-3 border-t md:border-t-0 md:border-l border-secondary-100 pt-4 md:pt-0 md:pl-6">
                            {event.status === "confirmed" ||
                            event.status === "deposit_paid" ? (
                              <div className="text-xs text-secondary-500 text-right bg-secondary-50 p-2 rounded-md">
                                To modify this confirmed event, please contact
                                your dedicated planner directly.
                              </div>
                            ) : event.status === "cancelled" ? (
                              <span className="text-secondary-400 text-sm italic">
                                Cancelled on{" "}
                                {new Date(
                                  event.cancelledAt || Date.now(),
                                ).toLocaleDateString()}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleEventCancel(event._id)}
                                className="text-red-600 text-sm font-bold hover:bg-red-50 px-4 py-2 rounded-md transition-colors w-full md:w-auto"
                              >
                                Cancel Request
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sub-Components ---

const Badge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(status)}`}
  >
    {formatStatus(status)}
  </span>
);

const EmptyState = ({ title, msg, link, linkText }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg border-2 border-dashed border-secondary-200">
    <div className="bg-secondary-50 p-4 rounded-full mb-4">
      <AlertCircle size={32} className="text-secondary-400" />
    </div>
    <h3 className="text-xl font-bold text-secondary-900 mb-2">{title}</h3>
    <p className="text-secondary-500 mb-6 text-center">{msg}</p>
    <Link
      href={link}
      className="bg-secondary-900 text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest hover:bg-primary-600 transition-colors"
    >
      {linkText}
    </Link>
  </div>
);
