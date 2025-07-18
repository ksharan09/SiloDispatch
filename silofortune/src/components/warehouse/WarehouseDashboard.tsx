import React, { useState } from "react";
import { motion } from "framer-motion";
import OrderBatchGenerator from "./OrderBatchGenerator";
import DriverAssignmentPanel from "./DriverAssignmentPanel";
import CODLedger from "./CODLedger";
import {
  Upload,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const WarehouseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("batches");

  const tabs = [
    { id: "batches", label: "Order Batches", icon: Upload },
    { id: "drivers", label: "Driver Management", icon: Users },
    { id: "cod", label: "COD Tracking", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Warehouse Dashboard
          </h1>
          <p className="text-gray-400">
            Manage orders, drivers, and collections efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-700 hover:border-[#BB86FC] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white">247</p>
                <p className="text-green-400 text-sm">↑ 12% from yesterday</p>
              </div>
              <div className="bg-[#BB86FC] bg-opacity-20 p-3 rounded-lg">
                <Package className="h-6 w-6 text-[#BB86FC]" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Drivers</p>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-blue-400 text-sm">8 available, 4 busy</p>
              </div>
              <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">COD Collected</p>
                <p className="text-2xl font-bold text-white">₹45,320</p>
                <p className="text-green-400 text-sm">₹12,500 pending</p>
              </div>
              <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-white">94%</p>
                <p className="text-orange-400 text-sm">232 delivered today</p>
              </div>
              <div className="bg-orange-500 bg-opacity-20 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-[#1E1E1E] rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? "bg-[#BB86FC] text-white shadow-lg"
                  : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "batches" && <OrderBatchGenerator />}
          {activeTab === "drivers" && <DriverAssignmentPanel />}
          {activeTab === "cod" && <CODLedger />}
        </motion.div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;
