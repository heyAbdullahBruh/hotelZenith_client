"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { bookingService } from "@/lib/services/bookingService";
import { toast } from "sonner";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  Loader2,
  Calendar,
  Clock,
  Users,
  User,
  Mail,
  Phone,
  Armchair,
  Gift,
  MessageSquare,
  Utensils,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// --- 1. CONSTANTS (Matching Mongoose Enums) ---

// Backend: [indoor, outdoor, window, private, no_preference]
const TABLE_PREFS = [
  { value: "no_preference", label: "No Preference" },
  { value: "indoor", label: "Indoor Dining" },
  { value: "outdoor", label: "Outdoor Terrace" },
  { value: "window", label: "Window Seat" },
  { value: "private", label: "Private Booth" },
];

// Backend: [birthday, anniversary, business, date, family, other]
const OCCASIONS = [
  { value: "other", label: "General Dining" },
  { value: "birthday", label: "Birthday Celebration" },
  { value: "anniversary", label: "Anniversary" },
  { value: "date", label: "Date Night" },
  { value: "business", label: "Business Meeting" },
  { value: "family", label: "Family Gathering" },
];

// Time Slots (Generation helper)
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 17; i <= 21; i++) {
    // 5 PM to 9 PM
    slots.push(`${i}:00`);
    slots.push(`${i}:30`);
  }
  return slots;
};
const TIME_SLOTS = generateTimeSlots();

// --- 2. ZOD SCHEMA ---
const bookingSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  date: z.date({ required_error: "Date is required" }),
  time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  guestCount: z
    .number()
    .min(1, "At least 1 guest")
    .max(20, "Max 20 guests online (Call for more)"),
  tablePreference: z.string().default("no_preference"),
  occasion: z.string().default("other"),
  specialOccasion: z.string().max(100, "Max 100 chars").optional(),
  specialRequests: z.string().max(500, "Max 500 chars").optional(),
});

// --- 3. COMPONENTS ---
const InputGroup = ({ label, error, icon: Icon, children }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 ml-1 flex items-center gap-2">
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors z-10">
          <Icon size={16} />
        </div>
      )}
      {children}
    </div>
    {error && (
      <p className="text-red-500 text-xs ml-1 animate-slide-up">
        {error.message}
      </p>
    )}
  </div>
);

export default function TableBookingPage() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestCount: 2,
      tablePreference: "no_preference",
      occasion: "other",
    },
  });

  const selectedOccasion = watch("occasion");

  const onSubmit = async (data) => {
    try {
      // Format Date for Backend (ISO String)
      const payload = {
        ...data,
        date: data.date.toISOString(),
      };

      const response = await bookingService.createTableBooking(payload);

      if (response.data.success) {
        toast.success(
          `Table Reserved! Booking #${response.data.data.bookingNumber}`,
        );
        router.push("/bookings/my-bookings"); // Redirect to dashboard
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Booking failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container max-w-4xl">
        <SectionHeader
          title="Reserve a Table"
          subtitle="Fine Dining Experience"
          center={true}
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* INFO SIDEBAR (Hidden on mobile) */}
          <div className="hidden md:block md:col-span-4 space-y-6">
            <div className="bg-secondary-900 text-white p-6 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="font-display text-xl font-bold mb-4">
                Opening Hours
              </h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Mon-Thu</span>{" "}
                  <span className="text-white">5:00 PM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Fri-Sat</span>{" "}
                  <span className="text-white">5:00 PM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>{" "}
                  <span className="text-white">5:00 PM - 9:30 PM</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary-100">
              <h3 className="font-bold text-secondary-900 mb-2 flex items-center gap-2">
                <Utensils size={18} className="text-primary-500" /> Dress Code
              </h3>
              <p className="text-xs text-secondary-500 leading-relaxed">
                Smart casual attire is required. We kindly ask guests to refrain
                from wearing beachwear, gym attire, or flip-flops.
              </p>
            </div>
          </div>

          {/* MAIN FORM */}
          <div className="md:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 md:p-10 rounded-lg shadow-zenith border border-secondary-100"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* 1. Booking Details */}
                <div className="space-y-6">
                  <h4 className="font-display text-lg font-bold text-secondary-900 border-b border-secondary-100 pb-2">
                    Reservation Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date */}
                    <InputGroup
                      label="Date"
                      icon={Calendar}
                      error={errors.date}
                    >
                      <Controller
                        control={control}
                        name="date"
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value}
                            onChange={field.onChange}
                            minDate={new Date()}
                            className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                            placeholderText="Select Date"
                          />
                        )}
                      />
                    </InputGroup>

                    {/* Time */}
                    <InputGroup label="Time" icon={Clock} error={errors.time}>
                      <select
                        {...register("time")}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-md text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                      >
                        <option value="">Select Time</option>
                        {TIME_SLOTS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </InputGroup>

                    {/* Guests */}
                    <InputGroup
                      label="Guests"
                      icon={Users}
                      error={errors.guestCount}
                    >
                      <select
                        {...register("guestCount", { valueAsNumber: true })}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-md text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                      >
                        {[...Array(20)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1} Guest{i > 0 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </InputGroup>

                    {/* Table Preference */}
                    <InputGroup
                      label="Seating Preference"
                      icon={Armchair}
                      error={errors.tablePreference}
                    >
                      <select
                        {...register("tablePreference")}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-md text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                      >
                        {TABLE_PREFS.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </InputGroup>
                  </div>
                </div>

                {/* 2. Guest Info */}
                <div className="space-y-6">
                  <h4 className="font-display text-lg font-bold text-secondary-900 border-b border-secondary-100 pb-2">
                    Contact Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup
                      label="Full Name"
                      icon={User}
                      error={errors.customerName}
                    >
                      <input
                        {...register("customerName")}
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                        placeholder="John Doe"
                      />
                    </InputGroup>

                    <InputGroup
                      label="Phone Number"
                      icon={Phone}
                      error={errors.phone}
                    >
                      <input
                        {...register("phone")}
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                        placeholder="+1 (555) 000-0000"
                      />
                    </InputGroup>

                    <div className="md:col-span-2">
                      <InputGroup
                        label="Email Address"
                        icon={Mail}
                        error={errors.email}
                      >
                        <input
                          {...register("email")}
                          type="email"
                          className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                          placeholder="john@example.com"
                        />
                      </InputGroup>
                    </div>
                  </div>
                </div>

                {/* 3. Occasion & Requests */}
                <div className="space-y-6">
                  <h4 className="font-display text-lg font-bold text-secondary-900 border-b border-secondary-100 pb-2">
                    Special Requests
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup
                      label="Occasion"
                      icon={Gift}
                      error={errors.occasion}
                    >
                      <select
                        {...register("occasion")}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-md text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                      >
                        {OCCASIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </InputGroup>

                    {/* Conditional Input: If specific occasion is selected (not 'other'), show detail field */}
                    <InputGroup
                      label="Occasion Note (Optional)"
                      icon={MessageSquare}
                      error={errors.specialOccasion}
                    >
                      <input
                        {...register("specialOccasion")}
                        disabled={selectedOccasion === "other"}
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none disabled:bg-secondary-50 disabled:text-secondary-400"
                        placeholder={
                          selectedOccasion === "other"
                            ? "Select an occasion first..."
                            : "e.g. It's John's 30th"
                        }
                      />
                    </InputGroup>

                    <div className="md:col-span-2">
                      <InputGroup
                        label="Dietary / Other Requests"
                        error={errors.specialRequests}
                      >
                        <textarea
                          {...register("specialRequests")}
                          rows={3}
                          className="w-full p-4 border border-secondary-200 rounded-md text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
                          placeholder="Allergies, high chair needed, etc..."
                        />
                      </InputGroup>
                    </div>
                  </div>
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-secondary-900 text-white py-4 rounded-md font-display font-bold text-lg uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Utensils size={20} />
                  )}
                  {isSubmitting
                    ? "Confirming Reservation..."
                    : "Confirm Table Reservation"}
                </button>

                <p className="text-center text-xs text-secondary-400">
                  You will receive an email confirmation immediately after
                  booking.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
