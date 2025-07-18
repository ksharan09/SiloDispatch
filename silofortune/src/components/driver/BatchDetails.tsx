import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Package, Navigation } from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  address: string;
  phone: string;
  amount: number;
  status: "pending" | "delivered" | "failed";
  latitude: number;
  longitude: number;
}

interface Batch {
  id: string;
  name: string;
  orders: Order[];
  totalAmount: number;
  completedOrders: number;
  estimatedTime: string;
}

interface BatchDetailsProps {
  batch: Batch;
  onOrderSelect: (order: Order) => void;
}

const BatchDetails: React.FC<BatchDetailsProps> = ({
  batch,
  onOrderSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{batch.name}</h3>
        <span className="text-sm bg-[#BB86FC] text-white px-3 py-1 rounded">
          {batch.completedOrders}/{batch.orders.length} completed
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#2A2A2A] rounded-lg p-3">
          <p className="text-gray-400 text-sm">Total Amount</p>
          <p className="text-xl font-bold text-[#BB86FC]">
            ₹{batch.totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#2A2A2A] rounded-lg p-3">
          <p className="text-gray-400 text-sm">Estimated Time</p>
          <p className="text-xl font-bold text-white">{batch.estimatedTime}</p>
        </div>
      </div>

      <h4 className="font-semibold text-white mb-3">Orders</h4>
      <div className="space-y-3">
        {batch.orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#2A2A2A] rounded-lg p-4 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-[#BB86FC]">
                  #{index + 1}
                </span>
                <h5 className="font-medium text-white">{order.customerName}</h5>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  order.status === "delivered"
                    ? "bg-green-400 bg-opacity-20 text-green-400"
                    : order.status === "failed"
                    ? "bg-red-400 bg-opacity-20 text-red-400"
                    : "bg-yellow-400 bg-opacity-20 text-yellow-400"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm mb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{order.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{order.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">₹{order.amount}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  window.open(
                    `https://maps.google.com?q=${order.latitude},${order.longitude}`,
                    "_blank"
                  )
                }
                className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                <Navigation className="h-4 w-4" />
                <span>Navigate</span>
              </button>

              {order.status === "pending" && (
                <button
                  onClick={() => onOrderSelect(order)}
                  className="flex items-center space-x-1 bg-[#BB86FC] text-white px-3 py-1 rounded text-sm hover:bg-[#9965E6] transition-colors"
                >
                  <Package className="h-4 w-4" />
                  <span>Deliver</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BatchDetails;
