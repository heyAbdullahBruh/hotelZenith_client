"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { bookingService } from "@/lib/services/bookingService";
import { toast } from "sonner";
import SectionHeader from "@/components/ui/SectionHeader";
import { Loader2, Calendar, Users, Wine } from "lucide-react";

const eventSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  companyName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(10),
  eventType: z.string().min(1, "Select an event type"),
  eventDate: z.date({ required_error: "Date is required" }),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
  guestCount: z.number().min(10, "Minimum 10 guests"),
  venuePreference: z.string().optional(),
  specialRequirements: z.string().optional(),
});

export default function EventBookingPage() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = async (data) => {
    try {
      await bookingService.createEventBooking(data);
      toast.success("Inquiry sent! Our events team will contact you shortly.");
      reset();
    } catch (error) {
      toast.error("Failed to submit inquiry.");
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container max-w-4xl">
        <SectionHeader
          title="Host an Event"
          subtitle="Weddings & Corporate"
          center={true}
        />

        <div className="bg-white p-8 md:p-12 rounded-sm shadow-zenith border border-secondary-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Contact */}
            <div>
              <h3 className="font-display text-lg font-bold border-b border-secondary-100 pb-2 mb-6">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="input-label">Full Name</label>
                  <input
                    {...register("customerName")}
                    className="input-field"
                  />
                  {errors.customerName && (
                    <p className="error-msg">{errors.customerName.message}</p>
                  )}
                </div>
                <div>
                  <label className="input-label">Company (Optional)</label>
                  <input {...register("companyName")} className="input-field" />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input {...register("email")} className="input-field" />
                  {errors.email && (
                    <p className="error-msg">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="input-label">Phone</label>
                  <input {...register("phone")} className="input-field" />
                  {errors.phone && (
                    <p className="error-msg">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Event Details */}
            <div>
              <h3 className="font-display text-lg font-bold border-b border-secondary-100 pb-2 mb-6">
                Event Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="input-label">Event Type</label>
                  <select {...register("eventType")} className="input-field">
                    <option value="">Select Type</option>
                    <option value="wedding">Wedding Reception</option>
                    <option value="corporate">Corporate Dinner</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="conference">Conference</option>
                  </select>
                  {errors.eventType && (
                    <p className="error-msg">{errors.eventType.message}</p>
                  )}
                </div>
                <div>
                  <label className="input-label">Guest Count (Approx)</label>
                  <input
                    type="number"
                    {...register("guestCount", { valueAsNumber: true })}
                    className="input-field"
                  />
                  {errors.guestCount && (
                    <p className="error-msg">{errors.guestCount.message}</p>
                  )}
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="input-label">Date</label>
                    <Controller
                      control={control}
                      name="eventDate"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          minDate={new Date()}
                          className="input-field w-full"
                          placeholderText="Select Date"
                        />
                      )}
                    />
                    {errors.eventDate && (
                      <p className="error-msg">{errors.eventDate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="input-label">Start Time</label>
                    <input
                      type="time"
                      {...register("startTime")}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">End Time</label>
                    <input
                      type="time"
                      {...register("endTime")}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="input-label">Venue Preference</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <label className="venue-card">
                      <input
                        type="radio"
                        value="ballroom"
                        {...register("venuePreference")}
                      />
                      <span className="font-bold block">Grand Ballroom</span>
                      <span className="text-xs text-secondary-500">
                        Up to 300 guests
                      </span>
                    </label>
                    <label className="venue-card">
                      <input
                        type="radio"
                        value="rooftop"
                        {...register("venuePreference")}
                      />
                      <span className="font-bold block">Rooftop Terrace</span>
                      <span className="text-xs text-secondary-500">
                        Up to 100 guests
                      </span>
                    </label>
                    <label className="venue-card">
                      <input
                        type="radio"
                        value="private_dining"
                        {...register("venuePreference")}
                      />
                      <span className="font-bold block">Private Dining</span>
                      <span className="text-xs text-secondary-500">
                        Up to 40 guests
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="input-label">
                Special Requirements / Notes
              </label>
              <textarea
                {...register("specialRequirements")}
                rows={4}
                className="input-field"
                placeholder="Dietary requirements, AV needs, decor preferences..."
              />
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 font-bold uppercase tracking-widest transition-all rounded-sm flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Wine size={20} />
              )}
              {isSubmitting ? "Sending Inquiry..." : "Submit Inquiry"}
            </button>
          </form>
        </div>
      </div>

      {/* Helper Styles for this form */}
      <style jsx>{`
        .input-label {
          @apply block text-xs font-bold uppercase text-secondary-500 mb-1;
        }
        .input-field {
          @apply w-full border-secondary-200 rounded-sm focus:ring-primary-500 focus:border-primary-500;
        }
        .error-msg {
          @apply text-red-500 text-xs mt-1;
        }
        .venue-card {
          @apply border border-secondary-200 p-4 rounded-sm cursor-pointer hover:bg-secondary-50 hover:border-primary-500 transition-all flex flex-col gap-1;
        }
        .venue-card input {
          @apply mb-2 text-primary-500 focus:ring-primary-500;
        }
      `}</style>
    </div>
  );
}
