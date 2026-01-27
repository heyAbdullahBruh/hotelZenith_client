"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { reviewService } from "@/lib/services/reviewService";
import { menuService } from "@/lib/services/menuService";
import SectionHeader from "@/components/ui/SectionHeader";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Star,
  Send,
  Utensils,
  Calendar,
  Armchair,
  Loader2,
  CheckCircle2,
  User,
  Mail,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// --- Schema ---
const reviewSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  profession: z.string().min(2, "Profession is required"),
  rating: z.number().min(1).max(5),
  title: z.string().min(5, "Title must be at least 5 chars").max(100),
  comment: z.string().min(10, "Tell us more (min 10 chars)").max(1000),
  category: z.string(),
  // Conditional Fields handled via manual validation or refinement
  orderId: z.string().optional(),
  foodId: z.string().optional(),
  tableBookingId: z.string().optional(),
  eventBookingId: z.string().optional(),
});

export default function GiveFeedbackPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("food"); // 'food' | 'table' | 'event'
  const [foods, setFoods] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      category: "overall",
      profession: "Guest",
    },
  });

  const currentRating = watch("rating");

  // Load Foods for Dropdown
  useEffect(() => {
    menuService.getAll().then((res) => {
      if (res.success) setFoods(res.data);
    });
  }, []);

  const onSubmit = async (data) => {
    try {
      // Manual Validation based on Tab
      if (activeTab === "food") {
        if (!data.orderId || !data.foodId) {
          toast.error(
            "Order ID and Food selection are required for food reviews",
          );
          return;
        }
      } else if (activeTab === "table" && !data.tableBookingId) {
        toast.error("Table Booking ID is required");
        return;
      } else if (activeTab === "event" && !data.eventBookingId) {
        toast.error("Event Booking ID is required");
        return;
      }

      // Cleanup Payload
      const payload = {
        ...data,
        rating: Number(data.rating),
        // Only send relevant IDs
        orderId: activeTab === "food" ? data.orderId : undefined,
        foodId: activeTab === "food" ? data.foodId : undefined,
        tableBookingId: activeTab === "table" ? data.tableBookingId : undefined,
        eventBookingId: activeTab === "event" ? data.eventBookingId : undefined,
      };

      await reviewService.create(payload);
      toast.success("Thank you! Your review has been submitted.");
      router.push("/feedbacks");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container max-w-3xl">
        <SectionHeader
          title="Share Your Experience"
          subtitle="We Value Your Feedback"
          center={true}
          className="mb-12"
        />

        {/* TABS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { id: "food", icon: Utensils, label: "Food & Dining" },
            { id: "table", icon: Armchair, label: "Table Service" },
            { id: "event", icon: Calendar, label: "Event Experience" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                reset(); // Clear form when switching context
                setValue("rating", 5);
              }}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                activeTab === tab.id
                  ? "border-primary-500 bg-white text-primary-600 shadow-md"
                  : "border-transparent bg-white/50 text-secondary-400 hover:bg-white",
              )}
            >
              <tab.icon size={24} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* FORM */}
        <motion.div
          key={activeTab} // Re-animate on tab change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-10 rounded-lg shadow-zenith border border-secondary-100"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* 1. Context Specific IDs */}
            <div className="bg-secondary-50 p-6 rounded-md border border-secondary-100 space-y-6">
              <h4 className="font-display font-bold text-secondary-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-primary-500" />
                Verification Details
              </h4>

              {activeTab === "food" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500">
                      Order ID (From Receipt)
                    </label>
                    <input
                      {...register("orderId")}
                      className="input-field w-full p-3 border rounded-md"
                      placeholder="e.g. ORD-12345"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500">
                      Select Item
                    </label>
                    <select
                      {...register("foodId")}
                      className="input-field w-full p-3 border rounded-md"
                    >
                      <option value="">Choose a dish...</option>
                      {foods.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {activeTab === "table" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500">
                    Table Booking Number
                  </label>
                  <input
                    {...register("tableBookingId")}
                    className="input-field w-full p-3 border rounded-md"
                    placeholder="e.g. TB-230912"
                  />
                </div>
              )}

              {activeTab === "event" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500">
                    Event Booking Number
                  </label>
                  <input
                    {...register("eventBookingId")}
                    className="input-field w-full p-3 border rounded-md"
                    placeholder="e.g. EV-998877"
                  />
                </div>
              )}
            </div>

            {/* 2. Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary-500">
                  <User size={14} /> Name
                </label>
                <input
                  {...register("name")}
                  className="w-full p-3 border border-secondary-200 rounded-md text-sm"
                  placeholder="Your Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary-500">
                  <Briefcase size={14} /> Profession
                </label>
                <input
                  {...register("profession")}
                  className="w-full p-3 border border-secondary-200 rounded-md text-sm"
                  placeholder="e.g. Food Critic"
                />
                {errors.profession && (
                  <p className="text-red-500 text-xs">
                    {errors.profession.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary-500">
                  <Mail size={14} /> Email
                </label>
                <input
                  {...register("email")}
                  className="w-full p-3 border border-secondary-200 rounded-md text-sm"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* 3. Rating & Content */}
            <div className="space-y-6 border-t border-secondary-100 pt-6">
              <div className="flex flex-col items-center gap-2">
                <label className="text-sm font-bold uppercase tracking-wider text-secondary-900">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setValue("rating", star)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={cn(
                          "transition-colors duration-200",
                          star <= (hoverRating || currentRating)
                            ? "fill-primary-500 text-primary-500"
                            : "fill-secondary-100 text-secondary-200",
                        )}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-secondary-400 font-bold">
                  {currentRating === 5
                    ? "Exceptional"
                    : currentRating === 4
                      ? "Very Good"
                      : currentRating === 3
                        ? "Average"
                        : "Needs Improvement"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-500">
                  Title
                </label>
                <input
                  {...register("title")}
                  className="w-full p-3 border border-secondary-200 rounded-md text-sm font-bold"
                  placeholder="Summarize your experience..."
                />
                {errors.title && (
                  <p className="text-red-500 text-xs">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-500">
                  Review
                </label>
                <textarea
                  {...register("comment")}
                  rows={4}
                  className="w-full p-3 border border-secondary-200 rounded-md text-sm resize-none"
                  placeholder="Tell us what you liked or what we can improve..."
                />
                {errors.comment && (
                  <p className="text-red-500 text-xs">
                    {errors.comment.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-500">
                  Aspect
                </label>
                <select
                  {...register("category")}
                  className="w-full p-3 border border-secondary-200 rounded-md text-sm"
                >
                  <option value="overall">Overall Experience</option>
                  <option value="food">Food Quality</option>
                  <option value="service">Service</option>
                  <option value="ambiance">Ambiance</option>
                </select>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-secondary-900 text-white py-4 font-display font-bold uppercase tracking-widest hover:bg-primary-600 transition-all rounded-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
