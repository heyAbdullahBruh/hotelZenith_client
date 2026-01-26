"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { bookingService } from "@/lib/services/bookingService";
import { toast } from "sonner";
import SectionHeader from "@/components/ui/SectionHeader";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// Validation Schema
const bookingSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, "Time is required"),
  guestCount: z.number().min(1).max(20),
  occasion: z.string().optional(),
  specialRequests: z.string().optional(),
});

const TIME_SLOTS = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

export default function TableBookingPage() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { guestCount: 2 },
  });

  const onSubmit = async (data) => {
    try {
      await bookingService.createTableBooking(data);
      toast.success("Table booked successfully! Check your email.");
      router.push("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Booking failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container max-w-3xl">
        <SectionHeader
          title="Reserve a Table"
          subtitle="Bookings"
          center={true}
        />

        <div className="bg-white p-8 md:p-12 rounded-sm shadow-zenith border border-secondary-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-600">
                  Full Name
                </label>
                <input
                  {...register("customerName")}
                  className="w-full border-secondary-200 focus:ring-primary-500 focus:border-primary-500 rounded-sm"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-xs">
                    {errors.customerName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-600">
                  Phone
                </label>
                <input
                  {...register("phone")}
                  className="w-full border-secondary-200 focus:ring-primary-500 focus:border-primary-500 rounded-sm"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone.message}</p>
                )}
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-600">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full border-secondary-200 focus:ring-primary-500 focus:border-primary-500 rounded-sm"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-600 flex items-center gap-2">
                  <CalendarIcon size={14} /> Date
                </label>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      minDate={new Date()}
                      className="w-full border-secondary-200 focus:ring-primary-500 focus:border-primary-500 rounded-sm"
                      placeholderText="Select Date"
                    />
                  )}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs">{errors.date.message}</p>
                )}
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-600">
                  Time
                </label>
                <select
                  {...register("time")}
                  className="w-full border-secondary-200 focus:ring-primary-500 focus:border-primary-500 rounded-sm"
                >
                  <option value="">Select Time</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p className="text-red-500 text-xs">{errors.time.message}</p>
                )}
              </div>

              {/* Guest Count */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-600">
                  Guests
                </label>
                <select
                  {...register("guestCount", { valueAsNumber: true })}
                  className="w-full border-secondary-200 focus:ring-primary-500 focus:border-primary-500 rounded-sm"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} People
                    </option>
                  ))}
                  <option value={11}>10+ (Call us)</option>
                </select>
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary-600">
                Occasion / Special Requests
              </label>
              <textarea
                {...register("specialRequests")}
                rows={3}
                className="w-full border-secondary-200 focus:ring-primary-500 focus:border-primary-500 rounded-sm"
                placeholder="Birthday, Allergy, Anniversary..."
              />
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-secondary-900 text-white py-4 font-display font-bold text-xl uppercase tracking-widest hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSubmitting && <Loader2 className="animate-spin" />}
              {isSubmitting ? "Confirming..." : "Confirm Reservation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
