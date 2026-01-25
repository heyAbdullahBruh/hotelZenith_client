"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/useCartStore";
import { orderService } from "@/lib/services/orderService";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatCurrency } from "@/lib/utils";
import { Loader2, CheckCircle, MapPin, CreditCard, User } from "lucide-react";
import { toast } from "sonner";

// Zod Schema for Checkout
const checkoutSchema = z
  .object({
    customerName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone required"),
    orderType: z.enum(["delivery", "pickup", "dine-in"]),
    address: z.string().optional(),
    specialInstructions: z.string().optional(),
    paymentMethod: z.enum(["credit_card", "cash"]),
  })
  .refine(
    (data) => {
      if (data.orderType === "delivery" && !data.address) return false;
      return true;
    },
    {
      message: "Address is required for delivery",
      path: ["address"],
    },
  );

export default function CheckoutPage() {
  const router = useRouter();
  const { items, summary, clearCart, isLoading: cartLoading } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      orderType: "delivery",
      paymentMethod: "credit_card",
    },
  });

  const orderType = watch("orderType");

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      router.push("/menu");
    }
  }, [items, cartLoading, router]);

  const onSubmit = async (data) => {
    setIsProcessing(true);
    try {
      await orderService.create({
        ...data,
        items: items.map((i) => ({ foodId: i.foodId, quantity: i.quantity })),
      });

      // Success Sequence
      await clearCart();
      toast.success("Order placed successfully!");
      router.push("/my-orders"); // Redirect to dashboard
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container">
        <SectionHeader
          title="Checkout"
          subtitle="Complete your order"
          center={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-2 space-y-6">
            <form
              id="checkout-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Step 1: Contact Info */}
              <div className="bg-white p-8 rounded-sm shadow-sm border border-secondary-100">
                <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="text-primary-500" /> Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-secondary-500 mb-1">
                      Name
                    </label>
                    <input
                      {...register("customerName")}
                      className="w-full border-secondary-200 rounded-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-secondary-500 mb-1">
                      Phone
                    </label>
                    <input
                      {...register("phone")}
                      className="w-full border-secondary-200 rounded-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-secondary-500 mb-1">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      className="w-full border-secondary-200 rounded-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery/Pickup */}
              <div className="bg-white p-8 rounded-sm shadow-sm border border-secondary-100">
                <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="text-primary-500" /> Fulfillment
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {["delivery", "pickup", "dine-in"].map((type) => (
                    <label
                      key={type}
                      className={`
                      border cursor-pointer p-4 text-center rounded-sm transition-all uppercase text-xs font-bold tracking-widest
                      ${orderType === type ? "border-primary-500 bg-primary-50 text-primary-900" : "border-secondary-200 hover:border-secondary-300"}
                    `}
                    >
                      <input
                        type="radio"
                        value={type}
                        {...register("orderType")}
                        className="hidden"
                      />
                      {type}
                    </label>
                  ))}
                </div>

                {orderType === "delivery" && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="block text-xs font-bold uppercase text-secondary-500">
                      Delivery Address
                    </label>
                    <textarea
                      {...register("address")}
                      rows={3}
                      className="w-full border-secondary-200 rounded-sm focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Street address, apartment, building code..."
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-xs font-bold uppercase text-secondary-500 mb-1">
                    Special Instructions
                  </label>
                  <input
                    {...register("specialInstructions")}
                    className="w-full border-secondary-200 rounded-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="E.g. Leave at door, ring doorbell..."
                  />
                </div>
              </div>

              {/* Step 3: Payment */}
              <div className="bg-white p-8 rounded-sm shadow-sm border border-secondary-100">
                <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="text-primary-500" /> Payment Method
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-sm cursor-pointer hover:bg-secondary-50">
                    <input
                      type="radio"
                      value="credit_card"
                      {...register("paymentMethod")}
                      className="text-primary-500 focus:ring-primary-500"
                    />
                    <span className="font-medium">
                      Credit Card (Stripe Placeholder)
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-sm cursor-pointer hover:bg-secondary-50">
                    <input
                      type="radio"
                      value="cash"
                      {...register("paymentMethod")}
                      className="text-primary-500 focus:ring-primary-500"
                    />
                    <span className="font-medium">
                      Cash on Delivery / Pickup
                    </span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-secondary-900 text-white p-8 rounded-sm sticky top-24">
              <h3 className="font-display text-xl font-bold mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div
                    key={item.foodId}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-300">
                      {item.quantity}x {item.name}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-2 mb-8">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(summary.tax)}</span>
                </div>
                {orderType === "delivery" && (
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Delivery Fee</span>
                    <span>$5.00</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-display font-bold text-primary-500 pt-2 border-t border-gray-700 mt-2">
                  <span>Total</span>
                  <span>
                    {formatCurrency(
                      summary.total + (orderType === "delivery" ? 5 : 0),
                    )}
                  </span>
                </div>
              </div>

              <button
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 font-bold uppercase tracking-widest rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle size={20} />
                )}
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
