"use client";
import { useEffect, useState } from "react";
import { orderService } from "@/lib/services/orderService";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatCurrency } from "@/lib/utils";
import { Clock, CheckCircle, XCircle, Package } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container max-w-4xl">
        <SectionHeader title="My Orders" subtitle="History" />

        {loading ? (
          <div className="text-center py-20">Loading history...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-sm shadow-sm">
            <Package size={48} className="mx-auto text-secondary-300 mb-4" />
            <h3 className="text-xl font-bold text-secondary-900 mb-2">
              No orders yet
            </h3>
            <p className="text-secondary-500">
              Looks like you haven't ordered any delicious food yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-sm shadow-sm border border-secondary-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-secondary-50 px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-secondary-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-secondary-900">
                      {new Date(order.createdAt).toLocaleDateString()} at{" "}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[order.status] || "bg-gray-100"}`}
                    >
                      {order.status}
                    </span>
                    <span className="font-display font-bold text-xl text-primary-600">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <ul className="space-y-3">
                    {order.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between text-sm text-secondary-700"
                      >
                        <span>
                          {item.quantity}x {item.foodName}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Fulfillment Info */}
                  <div className="mt-6 pt-4 border-t border-secondary-100 flex gap-6 text-sm text-secondary-500">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {order.orderType === "delivery"
                        ? "Estimated Delivery: 45 mins"
                        : "Pickup in: 20 mins"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
