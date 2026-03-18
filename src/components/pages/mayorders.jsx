"use client";
import { useEffect, useState } from "react";
import { orderService } from "@/lib/services/orderService";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  MapPin,
  Truck,
  ShoppingBag,
  UtensilsCrossed,
  Calendar,
  Ban,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

// Map backend statuses to colors and readable labels
const STATUS_CONFIG = {
  pending: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    label: "Pending",
  },
  accepted: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    label: "Confirmed",
  },
  preparing: {
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    label: "Preparing",
  },
  ready: { color: "bg-teal-100 text-teal-800 border-teal-200", label: "Ready" },
  out_for_delivery: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    label: "Out for Delivery",
  },
  delivered: {
    color: "bg-green-100 text-green-800 border-green-200",
    label: "Delivered",
  },
  completed: {
    color: "bg-green-100 text-green-800 border-green-200",
    label: "Completed",
  },
  cancelled: {
    color: "bg-red-100 text-red-800 border-red-200",
    label: "Cancelled",
  },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      // API returns { success: true, data: [...], pagination: {...} }
      const res = await orderService.getMyOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setCancellingId(orderId);
    try {
      const res = await orderService.cancel(orderId);
      if (res.success) {
        toast.success("Order cancelled successfully");
        fetchOrders(); // Refresh list to show new status
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  // Helper to determine icon based on type
  const getTypeIcon = (type) => {
    switch (type) {
      case "delivery":
        return <Truck size={14} />;
      case "pickup":
        return <ShoppingBag size={14} />;
      case "dine_in":
        return <UtensilsCrossed size={14} />;
      default:
        return <Package size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container max-w-4xl">
        <SectionHeader title="My Orders" subtitle="Order History" />

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-white rounded-lg animate-pulse border border-secondary-100"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-12 text-center rounded-lg shadow-sm border border-secondary-100"
          >
            <div className="w-20 h-20 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-secondary-400" />
            </div>
            <h3 className="text-xl font-display font-bold text-secondary-900 mb-2">
              No orders found
            </h3>
            <p className="text-secondary-500 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Explore our menu to find
              something delicious.
            </p>
            <Link
              href="/menu"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest transition-colors"
            >
              Browse Menu
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status =
                STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const isCancellable = ["pending", "accepted"].includes(
                order.status,
              );

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm border border-secondary-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-secondary-50/50 px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-secondary-100">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded border border-secondary-100">
                        <Package className="text-primary-500" size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary-400 block mb-0.5">
                          Order Number
                        </span>
                        <span className="text-sm font-bold text-secondary-900 tracking-wide">
                          {order.orderNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${status.color}`}
                      >
                        {status.label}
                      </span>
                      {/* Only show cancel button if applicable */}
                      {isCancellable && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingId === order._id}
                          className="text-xs text-red-500 hover:text-red-700 font-medium underline flex items-center gap-1 disabled:opacity-50"
                        >
                          {cancellingId === order._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Ban size={12} />
                          )}
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Left: Items */}
                      <div className="flex-1">
                        <h4 className="text-xs font-bold uppercase text-secondary-400 mb-4">
                          Items
                        </h4>
                        <ul className="space-y-3">
                          {order.items.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex justify-between text-sm text-secondary-700 group"
                            >
                              <span className="flex items-center gap-2">
                                <span className="font-bold text-secondary-900">
                                  {item.quantity}x
                                </span>
                                {item.name}
                              </span>
                              <span className="font-medium text-secondary-500 group-hover:text-secondary-900">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 pt-4 border-t border-secondary-100 flex justify-between items-center">
                          <span className="font-display font-bold text-lg text-secondary-900">
                            Total
                          </span>
                          <span className="font-display font-bold text-xl text-primary-600">
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Right: Info */}
                      <div className="md:w-64 space-y-4 md:border-l md:border-secondary-100 md:pl-8">
                        {/* Date */}
                        <div>
                          <span className="text-xs font-bold uppercase text-secondary-400 block mb-1">
                            Date
                          </span>
                          <div className="flex items-center gap-2 text-sm text-secondary-600">
                            <Calendar size={14} />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Type */}
                        <div>
                          <span className="text-xs font-bold uppercase text-secondary-400 block mb-1">
                            Type
                          </span>
                          <div className="flex items-center gap-2 text-sm text-secondary-600 capitalize">
                            {getTypeIcon(order.orderType)}
                            {order.orderType.replace("_", " ")}
                          </div>
                        </div>

                        {/* Delivery Address (if applicable) */}
                        {order.orderType === "delivery" && order.address && (
                          <div>
                            <span className="text-xs font-bold uppercase text-secondary-400 block mb-1">
                              Delivering To
                            </span>
                            <div className="flex items-start gap-2 text-sm text-secondary-600">
                              <MapPin size={14} className="mt-0.5 shrink-0" />
                              <span className="line-clamp-2">
                                {order.address.street}, {order.address.city}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
