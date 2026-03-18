"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/store/useCartStore";
import { orderService } from "@/lib/services/orderService";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatCurrency } from "@/lib/utils";
import {
  Loader2,
  CheckCircle2,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  UtensilsCrossed,
  ShoppingBag,
  Truck,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// --- Validation Schema ---
const checkoutSchema = z
  .object({
    customerName: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Valid phone number required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    orderType: z.enum(["delivery", "pickup", "dine_in"]),
    street: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    specialInstructions: z.string().max(500).optional(),
    paymentMethod: z.enum(["cash", "card", "online"]),
  })
  .refine(
    (data) => {
      if (data.orderType === "delivery") {
        return !!data.street && !!data.city;
      }
      return true;
    },
    {
      message: "Street and City are required for delivery",
      path: ["street"],
    },
  );

// --- UI Helper Components ---
const InputGroup = ({ label, icon: Icon, error, children }) => (
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

const RadioCard = ({
  value,
  selected,
  onClick,
  icon: Icon,
  label,
  subLabel,
}) => (
  <div
    onClick={onClick}
    className={`
      cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3
      ${
        selected
          ? "border-primary-500 bg-primary-50/50 shadow-sm"
          : "border-secondary-100 hover:border-primary-200 bg-white"
      }
    `}
  >
    <div
      className={`p-2 rounded-full ${selected ? "bg-primary-100 text-primary-600" : "bg-secondary-100 text-secondary-500"}`}
    >
      <Icon size={20} />
    </div>
    <div>
      <h4
        className={`font-bold text-sm ${selected ? "text-primary-900" : "text-secondary-900"}`}
      >
        {label}
      </h4>
      {subLabel && <p className="text-xs text-secondary-500">{subLabel}</p>}
    </div>
    {selected && (
      <CheckCircle2 size={18} className="ml-auto text-primary-600" />
    )}
  </div>
);

// --- MAIN COMPONENT ---
export default function CheckoutPage() {
  const router = useRouter();
  const { items, summary, clearCart, isLoading: cartLoading } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null); // Stores the order object on success

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      orderType: "delivery",
      paymentMethod: "cash",
      customerName: "",
      phone: "",
      email: "",
    },
  });

  const orderType = watch("orderType");
  const paymentMethod = watch("paymentMethod");

  // Redirect if empty (only if not successful yet)
  useEffect(() => {
    if (!cartLoading && items.length === 0 && !successOrder) {
      router.push("/menu");
    }
  }, [items, cartLoading, router, successOrder]);

  const onSubmit = async (data) => {
    setIsProcessing(true);
    try {
      const payload = {
        customerName: data.customerName,
        phone: data.phone,
        email: data.email || undefined,
        orderType: data.orderType,
        paymentMethod: data.paymentMethod,
        specialInstructions: data.specialInstructions,
        address:
          data.orderType === "delivery"
            ? {
                street: data.street,
                city: data.city,
                zipCode: data.zipCode,
                country: "USA",
              }
            : undefined,
      };

      const res = await orderService.create(payload);

      if (res.success) {
        // Backend generated the orderNumber, accessible in res.data.orderNumber
        setSuccessOrder(res.data);
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- RENDER SUCCESS STATE ---
  if (successOrder) {
    return (
      <div className="min-h-screen bg-secondary-50 pt-32 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-lg shadow-2xl max-w-lg w-full text-center border-t-4 border-primary-500"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>

          <h2 className="font-display text-3xl font-bold text-secondary-900 mb-2">
            Order Confirmed!
          </h2>
          <p className="text-secondary-500 mb-8">
            Thank you for dining with Hotel Zenith.
          </p>

          <div className="bg-secondary-50 p-6 rounded-md mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-2">
              Order Number
            </p>
            <p className="font-display text-3xl font-bold text-primary-600 tracking-wider">
              {successOrder.orderNumber}
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/my-orders"
              className="block w-full bg-secondary-900 text-white py-4 rounded-md font-bold uppercase tracking-widest hover:bg-primary-600 transition-colors"
            >
              Track Order
            </Link>
            <Link
              href="/"
              className="block w-full text-secondary-500 font-bold text-sm hover:text-secondary-900"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- RENDER CHECKOUT FORM ---
  if (cartLoading || items.length === 0) return null;

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container max-w-6xl">
        <SectionHeader
          title="Checkout"
          subtitle="Complete Order"
          center={true}
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-2 space-y-6">
            <form
              id="checkout-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* 1. Contact Info */}
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-secondary-100">
                <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2 text-secondary-900">
                  <span className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    1
                  </span>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup
                    label="Full Name"
                    icon={User}
                    error={errors.customerName}
                  >
                    <input
                      {...register("customerName")}
                      className="input-field-modern pl-10"
                      placeholder="Jane Doe"
                    />
                  </InputGroup>
                  <InputGroup
                    label="Phone Number"
                    icon={Phone}
                    error={errors.phone}
                  >
                    <input
                      {...register("phone")}
                      className="input-field-modern pl-10"
                      placeholder="(555) 123-4567"
                    />
                  </InputGroup>
                  <div className="md:col-span-2">
                    <InputGroup
                      label="Email (Optional)"
                      icon={Mail}
                      error={errors.email}
                    >
                      <input
                        {...register("email")}
                        className="input-field-modern pl-10"
                        placeholder="jane@example.com"
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>

              {/* 2. Fulfillment Method */}
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-secondary-100">
                <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2 text-secondary-900">
                  <span className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    2
                  </span>
                  Fulfillment
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <RadioCard
                    label="Delivery"
                    subLabel="To your door"
                    icon={Truck}
                    selected={orderType === "delivery"}
                    onClick={() => setValue("orderType", "delivery")}
                  />
                  <RadioCard
                    label="Pickup"
                    subLabel="Come to us"
                    icon={ShoppingBag}
                    selected={orderType === "pickup"}
                    onClick={() => setValue("orderType", "pickup")}
                  />
                  <RadioCard
                    label="Dine In"
                    subLabel="Table service"
                    icon={UtensilsCrossed}
                    selected={orderType === "dine_in"}
                    onClick={() => setValue("orderType", "dine_in")}
                  />
                </div>

                {/* Conditional Address Fields */}
                <motion.div
                  initial={false}
                  animate={{
                    height: orderType === "delivery" ? "auto" : 0,
                    opacity: orderType === "delivery" ? 1 : 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200 space-y-4">
                    <h4 className="text-sm font-bold text-secondary-900 flex items-center gap-2">
                      <MapPin size={16} /> Delivery Address
                    </h4>
                    <InputGroup label="Street Address" error={errors.street}>
                      <input
                        {...register("street")}
                        className="input-field-modern bg-white"
                        placeholder="123 Luxury Blvd, Apt 4B"
                      />
                    </InputGroup>
                    <div className="grid grid-cols-2 gap-4">
                      <InputGroup label="City" error={errors.city}>
                        <input
                          {...register("city")}
                          className="input-field-modern bg-white"
                          placeholder="New York"
                        />
                      </InputGroup>
                      <InputGroup label="Zip Code" error={errors.zipCode}>
                        <input
                          {...register("zipCode")}
                          className="input-field-modern bg-white"
                          placeholder="10001"
                        />
                      </InputGroup>
                    </div>
                  </div>
                </motion.div>

                <div className="mt-6">
                  <InputGroup label="Special Instructions (Optional)">
                    <textarea
                      {...register("specialInstructions")}
                      className="input-field-modern pt-3 resize-none"
                      rows={2}
                      placeholder="Allergies, gate code, extra napkins..."
                    />
                  </InputGroup>
                </div>
              </div>

              {/* 3. Payment */}
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-secondary-100">
                <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2 text-secondary-900">
                  <span className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    3
                  </span>
                  Payment
                </h3>
                <div className="space-y-3">
                  <div
                    onClick={() => setValue("paymentMethod", "card")}
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "card" ? "border-primary-500 bg-primary-50/50" : "border-secondary-200 hover:bg-secondary-50"}`}
                  >
                    <div className="bg-white p-2 rounded border border-secondary-100 shadow-sm">
                      <CreditCard size={20} className="text-secondary-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-secondary-900">
                        Credit Card
                      </h4>
                      <p className="text-xs text-secondary-500">
                        Pay via mobile terminal
                      </p>
                    </div>
                    <input
                      type="radio"
                      value="card"
                      {...register("paymentMethod")}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                  </div>

                  <div
                    onClick={() => setValue("paymentMethod", "cash")}
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "cash" ? "border-primary-500 bg-primary-50/50" : "border-secondary-200 hover:bg-secondary-50"}`}
                  >
                    <div className="bg-white p-2 rounded border border-secondary-100 shadow-sm">
                      <span className="text-lg font-bold text-green-600">
                        $
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-secondary-900">
                        Cash
                      </h4>
                      <p className="text-xs text-secondary-500">
                        Pay upon receipt
                      </p>
                    </div>
                    <input
                      type="radio"
                      value="cash"
                      {...register("paymentMethod")}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-secondary-900 text-white p-8 rounded-lg sticky top-24 shadow-2xl">
              <h3 className="font-display text-xl font-bold mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 text-sm border-b border-gray-700/50 pb-3 last:border-0"
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded overflow-hidden shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-gray-200">
                          {item.quantity}x {item.food?.name}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            (item.food?.price || 0) * item.quantity,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-6 space-y-3 mb-8">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Tax</span>
                  <span>{formatCurrency(summary.tax)}</span>
                </div>
                {orderType === "delivery" && (
                  <div className="flex justify-between text-sm text-primary-400">
                    <span>Delivery Fee</span>
                    <span>$5.00</span>
                  </div>
                )}

                <div className="flex justify-between text-2xl font-display font-bold text-primary-500 pt-4 border-t border-gray-700 mt-2">
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
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 font-bold uppercase tracking-widest rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle2 size={20} />
                )}
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input-field-modern {
          @apply w-full border border-secondary-200 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm py-3 pr-4;
        }
      `}</style>
    </div>
  );
}
