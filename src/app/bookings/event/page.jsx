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
  Users,
  Wine,
  Building2,
  Clock,
  Mail,
  Phone,
  User,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Schema & Options ---
const eventSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.date({ required_error: "Date is required" }),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
  guestCount: z.number().min(10, "Minimum 10 guests"),
  venuePreference: z.string().min(1, "Please select a venue"),
  specialRequirements: z.string().optional(),
});

const VENUES = [
  {
    id: "ballroom",
    name: "Grand Ballroom",
    capacity: "50-300",
    desc: "Crystal chandeliers, high ceilings, perfect for weddings.",
  },
  {
    id: "rooftop",
    name: "Skyline Terrace",
    capacity: "20-100",
    desc: "Open-air views of the city, ideal for cocktail hours.",
  },
  {
    id: "private_dining",
    name: "The Vault",
    capacity: "10-40",
    desc: "Intimate setting for executive meetings and dinners.",
  },
];

const EVENT_TYPES = [
  "Wedding Reception",
  "Corporate Dinner",
  "Conference",
  "Birthday Party",
  "Product Launch",
];

// --- Components ---

// 1. Visual Venue Card
const VenueCard = ({ venue, selected, onClick, register }) => (
  <div
    onClick={onClick}
    className={cn(
      "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 group",
      selected
        ? "border-primary-500 bg-primary-50/50 shadow-md"
        : "border-secondary-100 hover:border-primary-200 hover:shadow-sm bg-white",
    )}
  >
    {/* Hidden Radio for Hook Form */}
    <input
      type="radio"
      value={venue.id}
      {...register("venuePreference")}
      className="hidden"
    />

    <div className="flex justify-between items-start mb-2">
      <div className="bg-secondary-100 p-2 rounded-md group-hover:bg-white transition-colors">
        <Building2
          size={20}
          className={selected ? "text-primary-600" : "text-secondary-500"}
        />
      </div>
      {selected && (
        <CheckCircle2
          className="text-primary-600 animate-in zoom-in"
          size={20}
        />
      )}
    </div>

    <h4
      className={cn(
        "font-bold text-sm mb-1",
        selected ? "text-primary-900" : "text-secondary-900",
      )}
    >
      {venue.name}
    </h4>
    <p className="text-xs text-secondary-500 mb-2">{venue.desc}</p>
    <div className="text-[10px] font-bold uppercase tracking-wider text-secondary-400 bg-secondary-50 inline-block px-2 py-1 rounded-sm">
      Cap: {venue.capacity}
    </div>
  </div>
);

// 2. Styled Input with Icon
const InputGroup = ({ label, error, icon: Icon, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 ml-1">
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

export default function EventBookingPage() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: { guestCount: 50 },
  });

  const selectedVenue = watch("venuePreference");

  const onSubmit = async (data) => {
    try {
      await bookingService.createEventBooking(data);
      toast.success("Inquiry sent! We will contact you within 24 hours.");
      reset();
      setValue("venuePreference", null); // Reset custom UI state
    } catch (error) {
      toast.error("Failed to submit inquiry. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container max-w-6xl">
        <SectionHeader
          title="Host an Event"
          subtitle="Weddings & Corporate"
          center={true}
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Context Sidebar (Desktop Only) */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-secondary-900 text-white p-8 rounded-lg shadow-xl relative overflow-hidden">
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl"></div>

              <h3 className="font-display text-2xl font-bold mb-6 relative z-10">
                Why Hotel Zenith?
              </h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex gap-4">
                  <div className="bg-primary-500/20 p-2 rounded-md h-fit">
                    <Wine className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">
                      World-Class Catering
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Menus curated by Michelin-star chefs tailored to your
                      tastes.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-primary-500/20 p-2 rounded-md h-fit">
                    <Users className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">
                      Dedicated Planner
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      A personal concierge to manage every detail of your event.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-primary-500/20 p-2 rounded-md h-fit">
                    <Building2 className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Iconic Spaces</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      From the rooftop skyline to the historic grand ballroom.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary-100">
              <h4 className="font-bold text-secondary-900 mb-2">
                Need immediate assistance?
              </h4>
              <p className="text-sm text-secondary-500 mb-4">
                Call our events team directly.
              </p>
              <a
                href="tel:+15551234567"
                className="text-primary-600 font-bold hover:underline flex items-center gap-2"
              >
                <Phone size={16} /> +1 (555) 123-4567
              </a>
            </div>
          </div>

          {/* RIGHT: Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-zenith border border-secondary-100 overflow-hidden"
            >
              <div className="h-2 bg-linear-to-r from-primary-400 to-primary-600 w-full" />

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 md:p-10 space-y-10"
              >
                {/* 1. Event Details Section */}
                <section>
                  <h3 className="text-xl font-display font-bold text-secondary-900 mb-6 flex items-center gap-2">
                    <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      1
                    </span>
                    Event Details
                  </h3>

                  {/* Venue Selection */}
                  <div className="mb-8">
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3 block">
                      Select Venue Preference
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {VENUES.map((venue) => (
                        <VenueCard
                          key={venue.id}
                          venue={venue}
                          selected={selectedVenue === venue.id}
                          register={register}
                          onClick={() => setValue("venuePreference", venue.id)}
                        />
                      ))}
                    </div>
                    {errors.venuePreference && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.venuePreference.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Event Type" error={errors.eventType}>
                      <select
                        {...register("eventType")}
                        className="w-full pl-3 pr-4 py-3 bg-white border border-secondary-200 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                      >
                        <option value="">Select an Event Type</option>
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </InputGroup>

                    <InputGroup
                      label="Guest Count"
                      icon={Users}
                      error={errors.guestCount}
                    >
                      <input
                        type="number"
                        {...register("guestCount", { valueAsNumber: true })}
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                      />
                    </InputGroup>

                    <InputGroup
                      label="Event Date"
                      icon={Calendar}
                      error={errors.eventDate}
                    >
                      <Controller
                        control={control}
                        name="eventDate"
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value}
                            onChange={field.onChange}
                            minDate={new Date()}
                            className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                            placeholderText="Select Date"
                            wrapperClassName="w-full"
                          />
                        )}
                      />
                    </InputGroup>

                    <div className="grid grid-cols-2 gap-4">
                      <InputGroup
                        label="Start"
                        icon={Clock}
                        error={errors.startTime}
                      >
                        <input
                          type="time"
                          {...register("startTime")}
                          className="w-full pl-10 pr-2 py-3 border border-secondary-200 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                        />
                      </InputGroup>
                      <InputGroup
                        label="End"
                        icon={Clock}
                        error={errors.endTime}
                      >
                        <input
                          type="time"
                          {...register("endTime")}
                          className="w-full pl-10 pr-2 py-3 border border-secondary-200 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                        />
                      </InputGroup>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-secondary-100 w-full" />

                {/* 2. Contact Section */}
                <section>
                  <h3 className="text-xl font-display font-bold text-secondary-900 mb-6 flex items-center gap-2">
                    <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      2
                    </span>
                    Contact Info
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup
                      label="Full Name"
                      icon={User}
                      error={errors.customerName}
                    >
                      <input
                        {...register("customerName")}
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                        placeholder="John Doe"
                      />
                    </InputGroup>

                    <InputGroup label="Company (Optional)" icon={Building2}>
                      <input
                        {...register("companyName")}
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                        placeholder="Company Ltd"
                      />
                    </InputGroup>

                    <InputGroup
                      label="Email Address"
                      icon={Mail}
                      error={errors.email}
                    >
                      <input
                        {...register("email")}
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                        placeholder="john@example.com"
                      />
                    </InputGroup>

                    <InputGroup
                      label="Phone Number"
                      icon={Phone}
                      error={errors.phone}
                    >
                      <input
                        {...register("phone")}
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                        placeholder="+1 (555) 000-0000"
                      />
                    </InputGroup>

                    <div className="md:col-span-2">
                      <InputGroup
                        label="Special Requests / Vision"
                        error={errors.specialRequirements}
                      >
                        <textarea
                          {...register("specialRequirements")}
                          rows={3}
                          className="w-full p-4 border border-secondary-200 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm resize-none"
                          placeholder="Tell us about your vision, dietary restrictions, or AV requirements..."
                        />
                      </InputGroup>
                    </div>
                  </div>
                </section>

                <button
                  disabled={isSubmitting}
                  className="w-full bg-secondary-900 hover:bg-primary-600 text-white py-4 text-lg font-display font-bold uppercase tracking-widest transition-all rounded-md flex justify-center items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Wine size={24} />
                  )}
                  {isSubmitting ? "Sending Inquiry..." : "Submit Inquiry"}
                </button>

                <p className="text-center text-xs text-secondary-400">
                  By submitting this form, you agree to our privacy policy. No
                  payment is required at this stage.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
