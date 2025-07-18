import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wifi,
  WifiOff,
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface SyncData {
  id: string;
  type: "order_update" | "payment_collection" | "location_update";
  data: any;
  timestamp: string;
  status: "pending" | "synced" | "failed";
}

const OfflineSync: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingSync, setPendingSync] = useState<SyncData[]>([
    {
      id: "sync-1",
      type: "order_update",
      data: { orderId: "ord-1", status: "delivered" },
      timestamp: "2024-01-16 14:30",
      status: "pending",
    },
    {
      id: "sync-2",
      type: "payment_collection",
      data: { orderId: "ord-1", amount: 1500, method: "upi" },
      timestamp: "2024-01-16 14:31",
      status: "pending",
    },
    {
      id: "sync-3",
      type: "location_update",
      data: { latitude: 12.9716, longitude: 77.5946 },
      timestamp: "2024-01-16 14:32",
      status: "synced",
    },
  ]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSync = async () => {
    if (!isOnline) return;

    setIsSyncing(true);

    // Simulate sync process
    for (let i = 0; i < pendingSync.length; i++) {
      if (pendingSync[i].status === "pending") {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setPendingSync((prev) =>
          prev.map((item) =>
            item.id === pendingSync[i].id ? { ...item, status: "synced" } : item
          )
        );
      }
    }

    setIsSyncing(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order_update":
        return <CheckCircle className="h-4 w-4" />;
      case "payment_collection":
        return <Upload className="h-4 w-4" />;
      case "location_update":
        return <Download className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "order_update":
        return "Order Status Update";
      case "payment_collection":
        return "Payment Collection";
      case "location_update":
        return "Location Update";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "synced":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const pendingCount = pendingSync.filter(
    (item) => item.status === "pending"
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Connection Status */}
      <div className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Connection Status</h3>
          <div
            className={`flex items-center space-x-2 ${
              isOnline ? "text-green-400" : "text-red-400"
            }`}
          >
            {isOnline ? (
              <Wifi className="h-5 w-5" />
            ) : (
              <WifiOff className="h-5 w-5" />
            )}
            <span className="font-medium">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#2A2A2A] rounded-lg p-4">
            <p className="text-gray-400 text-sm">Pending Sync</p>
            <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
          </div>
          <div className="bg-[#2A2A2A] rounded-lg p-4">
            <p className="text-gray-400 text-sm">Last Sync</p>
            <p className="text-sm text-white">2 minutes ago</p>
          </div>
        </div>

        {isOnline && pendingCount > 0 && (
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full mt-4 bg-[#BB86FC] text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#9965E6] transition-colors flex items-center justify-center space-x-2"
          >
            {isSyncing ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Syncing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" />
                <span>Sync Now</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Sync Queue */}
      <div className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Sync Queue</h3>

        {pendingSync.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-400">All data is synchronized</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingSync.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#2A2A2A] rounded-lg p-4 border border-gray-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={getStatusColor(item.status)}>
                      {getTypeIcon(item.type)}
                    </div>
                    <span className="font-medium text-white">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.status === "synced"
                        ? "bg-green-400 bg-opacity-20 text-green-400"
                        : item.status === "failed"
                        ? "bg-red-400 bg-opacity-20 text-red-400"
                        : "bg-yellow-400 bg-opacity-20 text-yellow-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="text-sm text-gray-400">
                  <p>Timestamp: {item.timestamp}</p>
                  <p>Data: {JSON.stringify(item.data)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Offline Features */}
      <div className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Offline Features</h3>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center space-x-3 p-3 bg-[#2A2A2A] rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-white">View assigned orders</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[#2A2A2A] rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-white">Update delivery status</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[#2A2A2A] rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-white">Collect payments</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[#2A2A2A] rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-white">Access cached maps</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OfflineSync;
