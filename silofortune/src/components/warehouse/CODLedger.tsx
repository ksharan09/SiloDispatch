import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  User,
  AlertCircle,
  CheckCircle,
  X,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

interface CODEntry {
  id: string;
  driverName: string;
  driverPhone: string;
  totalCollected: number;
  totalPending: number;
  lastSettlement: string;
  status: "pending" | "settled" | "overdue";
  orders: Array<{
    id: string;
    customerName: string;
    amount: number;
    status: "collected" | "pending";
    collectedAt?: string;
  }>;
}

const CODLedger: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState<CODEntry | null>(null);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [settlementAmount, setSettlementAmount] = useState("");

  const [codEntries, setCodEntries] = useState<CODEntry[]>([
    {
      id: "cod-1",
      driverName: "Mahesh Kumar",
      driverPhone: "+919876543210",
      totalCollected: 15420,
      totalPending: 2580,
      lastSettlement: "2024-01-15",
      status: "pending",
      orders: [
        {
          id: "ord-1",
          customerName: "Rajesh Kumar",
          amount: 1500,
          status: "collected",
          collectedAt: "2024-01-16 14:30",
        },
        {
          id: "ord-2",
          customerName: "Priya Sharma",
          amount: 890,
          status: "collected",
          collectedAt: "2024-01-16 15:45",
        },
        {
          id: "ord-3",
          customerName: "Amit Patel",
          amount: 2580,
          status: "pending",
        },
      ],
    },
    {
      id: "cod-2",
      driverName: "Ravi Sharma",
      driverPhone: "+919876543211",
      totalCollected: 22100,
      totalPending: 5200,
      lastSettlement: "2024-01-10",
      status: "overdue",
      orders: [
        {
          id: "ord-4",
          customerName: "Sneha Reddy",
          amount: 3200,
          status: "collected",
          collectedAt: "2024-01-15 11:20",
        },
        {
          id: "ord-5",
          customerName: "Kiran Bhat",
          amount: 1800,
          status: "collected",
          collectedAt: "2024-01-15 16:10",
        },
        {
          id: "ord-6",
          customerName: "Deepika Nair",
          amount: 5200,
          status: "pending",
        },
      ],
    },
    {
      id: "cod-3",
      driverName: "Amit Singh",
      driverPhone: "+919876543212",
      totalCollected: 8900,
      totalPending: 0,
      lastSettlement: "2024-01-16",
      status: "settled",
      orders: [
        {
          id: "ord-7",
          customerName: "Vikram Rao",
          amount: 1200,
          status: "collected",
          collectedAt: "2024-01-16 10:15",
        },
        {
          id: "ord-8",
          customerName: "Anita Joshi",
          amount: 950,
          status: "collected",
          collectedAt: "2024-01-16 12:30",
        },
      ],
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "settled":
        return "text-green-400 bg-green-400";
      case "pending":
        return "text-yellow-400 bg-yellow-400";
      case "overdue":
        return "text-red-400 bg-red-400";
      default:
        return "text-gray-400 bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "settled":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <RefreshCw className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleSettleBalance = () => {
    if (selectedDriver) {
      setSettlementAmount(selectedDriver.totalCollected.toString());
      setShowSettleModal(true);
    }
  };

  const confirmSettlement = () => {
    if (selectedDriver) {
      setCodEntries(
        codEntries.map((entry) =>
          entry.id === selectedDriver.id
            ? {
                ...entry,
                totalCollected: 0,
                status: "settled" as const,
                lastSettlement: new Date().toISOString().split("T")[0],
              }
            : entry
        )
      );
    }
    setShowSettleModal(false);
    setSelectedDriver(null);
    setSettlementAmount("");
  };

  const totalCollected = codEntries.reduce(
    (sum, entry) => sum + entry.totalCollected,
    0
  );
  const totalPending = codEntries.reduce(
    (sum, entry) => sum + entry.totalPending,
    0
  );
  const overdueAmount = codEntries
    .filter((e) => e.status === "overdue")
    .reduce((sum, entry) => sum + entry.totalCollected, 0);

  return (
    <div className="space-y-6">
      <div className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-[#BB86FC]" />
          <span>COD Collection Tracking</span>
        </h3>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2A2A2A] rounded-lg p-4 border border-gray-600 hover:border-green-500 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Collected</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{totalCollected.toLocaleString()}
                </p>
                <p className="text-green-400 text-sm">↑ 8% from yesterday</p>
              </div>
              <div className="bg-green-400 bg-opacity-20 p-2 rounded">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#2A2A2A] rounded-lg p-4 border border-gray-600 hover:border-yellow-500 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Collection</p>
                <p className="text-2xl font-bold text-yellow-400">
                  ₹{totalPending.toLocaleString()}
                </p>
                <p className="text-yellow-400 text-sm">
                  {codEntries.filter((e) => e.totalPending > 0).length} drivers
                </p>
              </div>
              <div className="bg-yellow-400 bg-opacity-20 p-2 rounded">
                <RefreshCw className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#2A2A2A] rounded-lg p-4 border border-gray-600 hover:border-red-500 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Overdue Amount</p>
                <p className="text-2xl font-bold text-red-400">
                  ₹{overdueAmount.toLocaleString()}
                </p>
                <p className="text-red-400 text-sm">
                  Needs immediate attention
                </p>
              </div>
              <div className="bg-red-400 bg-opacity-20 p-2 rounded">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Driver COD Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  Driver
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  Collected
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  Pending
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  Last Settlement
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {codEntries.map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-700 hover:bg-[#2A2A2A] transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#BB86FC] bg-opacity-20 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-[#BB86FC]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {entry.driverName}
                        </p>
                        <p className="text-sm text-gray-400">
                          {entry.driverPhone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-green-400 font-medium">
                      ₹{entry.totalCollected.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`font-medium ${
                        entry.totalPending > 0
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    >
                      ₹{entry.totalPending.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-300">
                      {entry.lastSettlement}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div
                      className={`flex items-center space-x-1 ${
                        getStatusColor(entry.status).split(" ")[0]
                      }`}
                    >
                      {getStatusIcon(entry.status)}
                      <span className="text-xs font-medium capitalize">
                        {entry.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedDriver(entry)}
                        className="text-[#BB86FC] hover:text-[#9965E6] text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                      {entry.totalCollected > 0 && (
                        <button
                          onClick={() => {
                            setSelectedDriver(entry);
                            handleSettleBalance();
                          }}
                          className="bg-[#BB86FC] text-white px-3 py-1 rounded text-sm hover:bg-[#9965E6] transition-colors"
                        >
                          Settle
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Details Modal */}
      <AnimatePresence>
        {selectedDriver && !showSettleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedDriver(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1E1E1E] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  COD Details - {selectedDriver.driverName}
                </h3>
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#2A2A2A] rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Collected</p>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{selectedDriver.totalCollected.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#2A2A2A] rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Pending Collection</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    ₹{selectedDriver.totalPending.toLocaleString()}
                  </p>
                </div>
              </div>

              <h4 className="font-semibold text-white mb-3">Order Details</h4>
              <div className="space-y-2">
                {selectedDriver.orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#2A2A2A] rounded-lg p-3 border border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">
                          {order.customerName}
                        </p>
                        <p className="text-sm text-gray-400">
                          Order ID: {order.id}
                        </p>
                        {order.collectedAt && (
                          <p className="text-xs text-gray-500">
                            Collected at: {order.collectedAt}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">
                          ₹{order.amount.toLocaleString()}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            order.status === "collected"
                              ? "bg-green-400 bg-opacity-20 text-green-400"
                              : "bg-yellow-400 bg-opacity-20 text-yellow-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-[#2A2A2A] transition-colors"
                >
                  Close
                </button>
                {selectedDriver.totalCollected > 0 && (
                  <button
                    onClick={handleSettleBalance}
                    className="px-4 py-2 bg-[#BB86FC] text-white rounded-lg hover:bg-[#9965E6] transition-colors"
                  >
                    Settle Balance
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settlement Modal */}
      <AnimatePresence>
        {showSettleModal && selectedDriver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSettleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1E1E1E] rounded-lg p-6 max-w-md w-full border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Settle Balance</h3>
                <button
                  onClick={() => setShowSettleModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#2A2A2A] rounded-lg p-4">
                  <p className="text-gray-400 mb-2">
                    Driver:{" "}
                    <span className="text-white">
                      {selectedDriver.driverName}
                    </span>
                  </p>
                  <p className="text-gray-400 mb-2">
                    Available Balance:{" "}
                    <span className="text-green-400 font-bold">
                      ₹{selectedDriver.totalCollected.toLocaleString()}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Settlement Amount
                  </label>
                  <input
                    type="number"
                    value={settlementAmount}
                    onChange={(e) => setSettlementAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#BB86FC] transition-colors"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="bg-yellow-400 bg-opacity-10 border border-yellow-400 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <p className="text-sm text-yellow-400">
                      This action will settle the driver's COD balance and
                      cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowSettleModal(false)}
                    className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-[#2A2A2A] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSettlement}
                    disabled={
                      !settlementAmount || parseFloat(settlementAmount) <= 0
                    }
                    className="px-4 py-2 bg-[#BB86FC] text-white rounded-lg hover:bg-[#9965E6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Confirm Settlement
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CODLedger;
