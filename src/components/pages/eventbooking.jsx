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
  Utensils,
  Music,
  DollarSign,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- 1. CONSTANTS (Mapped to Mongoose Enums) ---

// Backend: [indoor, outdoor, garden, ballroom, conference_room, no_preference]
const VENUES = [
  {
    id: "ballroom", // Matches backend enum
    name: "Grand Ballroom",
    capacity: "50-300",
    desc: "Crystal chandeliers, high ceilings, perfect for weddings.",
  },
  {
    id: "outdoor", // Matches backend enum
    name: "Skyline Terrace",
    capacity: "20-100",
    desc: "Open-air views of the city, ideal for cocktail hours.",
  },
  {
    id: "conference_room", // Matches backend enum
    name: "The Vault",
    capacity: "10-40",
    desc: "Intimate setting for executive meetings and dinners.",
  },
];

// Backend: [wedding, corporate, birthday, anniversary, conference, seminar, other]
const EVENT_TYPES = [
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate Event" },
  { value: "birthday", label: "Birthday Party" },
  { value: "conference", label: "Conference" },
  { value: "seminar", label: "Seminar" },
  { value: "anniversary", label: "Anniversary" },
  { value: "other", label: "Other" },
];

// Backend: [vegetarian, non_vegetarian, mixed, vegan, custom]
const FOOD_OPTS = [
  { value: "mixed", label: "Mixed (Standard)" },
  { value: "non_vegetarian", label: "Non-Vegetarian" },
  { value: "vegetarian", label: "Vegetarian Only" },
  { value: "vegan", label: "Vegan Only" },
  { value: "custom", label: "Custom Menu" },
];

// Backend: [non_alcoholic, standard_bar, premium_bar, custom]
const BEVERAGE_OPTS = [
  { value: "non_alcoholic", label: "Non-Alcoholic Only" },
  { value: "standard_bar", label: "Standard Bar (Beer/Wine)" },
  { value: "premium_bar", label: "Premium Open Bar" },
  { value: "custom", label: "Custom Package" },
];

// Backend: [basic, standard, premium, luxury, custom]
const BUDGET_OPTS = [
  { value: "basic", label: "Basic" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
  { value: "luxury", label: "Luxury" },
  { value: "custom", label: "Custom" },
];

// --- 2. ZOD SCHEMA ---
const eventSchema = z
  .object({
    // Contact
    customerName: z.string().min(2, "Name is required"),
    companyName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number required"),

    // Event Info
    eventType: z.string().min(1, "Event type is required"),
    eventDate: z.date({ required_error: "Date is required" }),
    startTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format HH:MM"),
    endTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format HH:MM"),
    guestCount: z.number().min(10, "Min 10 guests").max(500, "Max 500 guests"),
    venuePreference: z.string().default("no_preference"),

    // Requirements
    foodPreference: z.string().default("mixed"),
    beveragePackage: z.string().default("non_alcoholic"),
    budgetRange: z.string().default("standard"),
    audioVisualRequirements: z.string().optional(),
    decorations: z.string().optional(), // Added field
    specialRequirements: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      const [startH, startM] = data.startTime.split(":").map(Number);
      const [endH, endM] = data.endTime.split(":").map(Number);
      return startH < endH || (startH === endH && startM < endM);
    },
    { message: "End time must be after start time", path: ["endTime"] },
  );

// --- 3. COMPONENTS ---

const VenueCard = ({ venue, selected, onClick, register }) => (
  <div
    onClick={onClick}
    className={cn(
      "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 group h-full",
      selected
        ? "border-primary-500 bg-primary-50/50 shadow-md"
        : "border-secondary-100 hover:border-primary-200 hover:shadow-sm bg-white",
    )}
  >
    {/* Hidden input to register value */}
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
    <p className="text-xs text-secondary-500 mb-2 leading-snug">{venue.desc}</p>
    <div className="text-[10px] font-bold uppercase tracking-wider text-secondary-400 bg-secondary-50 inline-block px-2 py-1 rounded-sm">
      Cap: {venue.capacity}
    </div>
  </div>
);

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

// --- 4. MAIN PAGE ---

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
    defaultValues: {
      guestCount: 50,
      foodPreference: "mixed",
      beveragePackage: "standard_bar",
      budgetRange: "standard",
      venuePreference: "ballroom", // Default selection
    },
  });

  const selectedVenue = watch("venuePreference");

  const onSubmit = async (data) => {
    try {
      // Backend expects ISO Date
      const payload = {
        ...data,
        eventDate: data.eventDate.toISOString(),
      };

      const res = await bookingService.createEventBooking(payload);

      if (res.data.success) {
        toast.success(
          `Inquiry #${res.data.data.bookingNumber} Sent Successfully!`,
        );
        reset();
        setValue("venuePreference", "ballroom"); // Reset visual
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to submit booking.";
      toast.error(msg);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container max-w-6xl">
        <SectionHeader
          title="Host an Event"
          subtitle="Luxury Venues & Services"
          center={true}
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR */}
          <div className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="bg-secondary-900 text-white p-8 rounded-lg shadow-xl relative overflow-hidden top-24">
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
                      Michelin Catering
                    </h4>
                    <p className="text-xs text-gray-400">
                      Custom menus for every palate.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-primary-500/20 p-2 rounded-md h-fit">
                    <Users className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Dedicated Team</h4>
                    <p className="text-xs text-gray-400">
                      From setup to cleanup, we handle it.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-8 pt-8 border-t border-secondary-700">
                <p className="text-xs text-gray-400 mb-2">Direct Line</p>
                <a
                  href="tel:+15551234567"
                  className="text-white font-bold hover:text-primary-500 flex items-center gap-2"
                >
                  <Phone size={16} /> +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>

          {/* MAIN FORM */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-zenith border border-secondary-100 overflow-hidden"
            >
              <div className="h-2 bg-leniar-to-r from-primary-400 to-primary-600 w-full" />

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 md:p-10 space-y-10"
              >
                {/* 1. LOGISTICS */}
                <section>
                  <h3 className="text-xl font-display font-bold text-secondary-900 mb-6 flex items-center gap-2">
                    <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    Logistics
                  </h3>

                  <div className="mb-6">
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3 block">
                      Venue Preference
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {VENUES.map((venue) => (
                        <VenueCard
                          key={venue.id}
                          venue={venue}
                          selected={selectedVenue === venue.id}
                          register={register}
                          onClick={() =>
                            setValue("venuePreference", venue.id, {
                              shouldValidate: true,
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Event Type" error={errors.eventType}>
                      <select
                        {...register("eventType")}
                        className="w-full pl-3 pr-4 py-3 bg-white border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
                      >
                        <option value="">Select Type...</option>
                        {EVENT_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
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
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
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
                            className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
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
                          className="w-full pl-10 pr-2 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
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
                          className="w-full pl-10 pr-2 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
                        />
                      </InputGroup>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-secondary-100 w-full" />

                {/* 2. DETAILS */}
                <section>
                  <h3 className="text-xl font-display font-bold text-secondary-900 mb-6 flex items-center gap-2">
                    <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup
                      label="Food"
                      icon={Utensils}
                      error={errors.foodPreference}
                    >
                      <select
                        {...register("foodPreference")}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
                      >
                        {FOOD_OPTS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </InputGroup>

                    <InputGroup
                      label="Beverage"
                      icon={Wine}
                      error={errors.beveragePackage}
                    >
                      <select
                        {...register("beveragePackage")}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
                      >
                        {BEVERAGE_OPTS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </InputGroup>

                    <InputGroup
                      label="Budget"
                      icon={DollarSign}
                      error={errors.budgetRange}
                    >
                      <select
                        {...register("budgetRange")}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
                      >
                        {BUDGET_OPTS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </InputGroup>

                    <InputGroup label="A/V Needs" icon={Music}>
                      <input
                        {...register("audioVisualRequirements")}
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
                        placeholder="Microphone, Projector..."
                      />
                    </InputGroup>

                    <div className="md:col-span-2">
                      <InputGroup label="Decorations & Theme" icon={Sparkles}>
                        <input
                          {...register("decorations")}
                          className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
                          placeholder="e.g. White flowers, Rustic theme..."
                        />
                      </InputGroup>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-secondary-100 w-full" />

                {/* 3. CONTACT */}
                <section>
                  <h3 className="text-xl font-display font-bold text-secondary-900 mb-6 flex items-center gap-2">
                    <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    Contact
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup
                      label="Name"
                      icon={User}
                      error={errors.customerName}
                    >
                      <input
                        {...register("customerName")}
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
                        placeholder="Full Name"
                      />
                    </InputGroup>
                    <InputGroup label="Company" icon={Briefcase}>
                      <input
                        {...register("companyName")}
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
                        placeholder="Optional"
                      />
                    </InputGroup>
                    <InputGroup label="Email" icon={Mail} error={errors.email}>
                      <input
                        {...register("email")}
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
                        placeholder="email@domain.com"
                      />
                    </InputGroup>
                    <InputGroup label="Phone" icon={Phone} error={errors.phone}>
                      <input
                        {...register("phone")}
                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
                        placeholder="(555) 123-4567"
                      />
                    </InputGroup>
                    <div className="md:col-span-2">
                      <InputGroup
                        label="Special Requests"
                        error={errors.specialRequirements}
                      >
                        <textarea
                          {...register("specialRequirements")}
                          rows={3}
                          className="w-full p-4 border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none resize-none"
                          placeholder="Any dietary restrictions or specific visions?"
                        />
                      </InputGroup>
                    </div>
                  </div>
                </section>

                <button
                  disabled={isSubmitting}
                  className="w-full bg-secondary-900 hover:bg-primary-600 text-white py-4 text-lg font-display font-bold uppercase tracking-widest transition-all rounded-md flex justify-center items-center gap-3 shadow-lg disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Wine size={24} />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
