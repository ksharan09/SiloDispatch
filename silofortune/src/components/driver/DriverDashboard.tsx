import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Package,
  DollarSign,
  Clock,
  Navigation,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
} from "lucide-react";
import PaymentCollection from "./PaymentCollection";

interface Order {
  id: string;
  customerName: string;
  address: string;
  phone: string;
  amount: number;
  status: "pending" | "delivered" | "failed";
  paymentStatus: "pending" | "collected" | "failed";
  latitude: number;
  longitude: number;
  otp?: string;
}

interface Batch {
  id: string;
  name: string;
  orders: Order[];
  totalAmount: number;
  completedOrders: number;
  estimatedTime: string;
}

const DriverDashboard: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [driverName] = useState(
    localStorage.getItem("driverName") || "Mahesh Kumar"
  );

  const [batches] = useState<Batch[]>([
    {
      id: "batch-1",
      name: "Central Bangalore Route",
      totalAmount: 5420,
      completedOrders: 2,
      estimatedTime: "2.5 hours",
      orders: [
        {
          id: "ord-1",
          customerName: "Rajesh Kumar",
          address: "123 MG Road, Bangalore",
          phone: "+919876543210",
          amount: 1500,
          status: "delivered",
          paymentStatus: "collected",
          latitude: 12.9716,
          longitude: 77.5946,
          otp: "1234",
        },
        {
          id: "ord-2",
          customerName: "Priya Sharma",
          address: "456 Brigade Road, Bangalore",
          phone: "+919876543211",
          amount: 890,
          status: "delivered",
          paymentStatus: "collected",
          latitude: 12.9698,
          longitude: 77.6124,
          otp: "5678",
        },
        {
          id: "ord-3",
          customerName: "Amit Patel",
          address: "789 Commercial Street, Bangalore",
          phone: "+919876543212",
          amount: 2100,
          status: "pending",
          paymentStatus: "pending",
          latitude: 12.9824,
          longitude: 77.6045,
          otp: "9012",
        },
        {
          id: "ord-4",
          customerName: "Sneha Reddy",
          address: "321 Residency Road, Bangalore",
          phone: "+919876543213",
          amount: 930,
          status: "pending",
          paymentStatus: "pending",
          latitude: 12.9667,
          longitude: 77.605,
          otp: "3456",
        },
      ],
    },
  ]);

  const handleOrderComplete = (orderId: string) => {
    const order = batches
      .flatMap((b) => b.orders)
      .find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowPayment(true);
    }
  };

  const handlePaymentComplete = (success: boolean) => {
    setShowPayment(false);
    setSelectedOrder(null);
    // In a real app, update the order status
  };

  const totalCompleted = batches.reduce(
    (sum, batch) => sum + batch.completedOrders,
    0
  );
  const totalOrders = batches.reduce(
    (sum, batch) => sum + batch.orders.length,
    0
  );
  const totalCollected = batches.reduce(
    (sum, batch) =>
      sum +
      batch.orders
        .filter((o) => o.paymentStatus === "collected")
        .reduce((orderSum, order) => orderSum + order.amount, 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#121212] pb-20">
      {/* Header */}
      <div className="bg-[#1E1E1E] border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#BB86FC] bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-[#BB86FC]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Welcome, {driverName}
              </h1>
              <p className="text-gray-400 text-sm">Ready for deliveries</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Today's Progress</p>
            <p className="text-lg font-bold text-[#BB86FC]">
              {totalCompleted}/{totalOrders}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1E1E1E] rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-400">
                  {totalCompleted}/{totalOrders}
                </p>
                <p className="text-green-400 text-sm">
                  {Math.round((totalCompleted / totalOrders) * 100)}% done
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1E1E1E] rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Collected</p>
                <p className="text-2xl font-bold text-[#BB86FC]">
                  ₹{totalCollected.toLocaleString()}
                </p>
                <p className="text-[#BB86FC] text-sm">COD amount</p>
              </div>
              <DollarSign className="h-8 w-8 text-[#BB86FC]" />
            </div>
          </motion.div>
        </div>

        {/* Active Batches */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Active Batches</h2>

          {batches.map((batch) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1E1E1E] rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">{batch.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#BB86FC] font-medium">
                    {batch.completedOrders}/{batch.orders.length} completed
                  </span>
                  <div className="w-16 bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-[#BB86FC] h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (batch.completedOrders / batch.orders.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {batch.orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#2A2A2A] rounded-lg p-3 border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-white">
                          {order.customerName}
                        </h4>
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
                      <span className="text-[#BB86FC] font-medium">
                        ₹{order.amount}
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
                          onClick={() => handleOrderComplete(order.id)}
                          className="flex items-center space-x-1 bg-[#BB86FC] text-white px-3 py-1 rounded text-sm hover:bg-[#9965E6] transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Complete</span>
                        </button>
                      )}

                      {order.status === "delivered" && (
                        <span className="flex items-center space-x-1 text-green-400 text-sm">
                          <CheckCircle className="h-4 w-4" />
                          <span>Delivered</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedOrder && (
        <PaymentCollection
          order={selectedOrder}
          onComplete={handlePaymentComplete}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default DriverDashboard;
