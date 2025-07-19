import React, { useState } from "react";
import { motion } from "framer-motion";
// import TestingFile from "../testing/TestingFile";
import {
  User,
  MapPin,
  Clock,
  Package,
  Phone,
  CheckCircle,
  AlertCircle,
  Truck,
} from "lucide-react";

interface Driver {
  id: string;
  name: string;
  phone: string;
  status: "available" | "busy" | "offline";
  currentLocation: string;
  completedDeliveries: number;
  totalDeliveries: number;
  vehicleType: string;
  rating: number;
}

interface Batch {
  id: string;
  name: string;
  orderCount: number;
  totalWeight: number;
  estimatedTime: string;
  route: string;
  assignedDriver?: string;
}

const DriverAssignmentPanel: React.FC = () => {
  const [drivers] = useState<Driver[]>([
    {
      id: "driver-1",
      name: "Mahesh Kumar",
      phone: "+919876543210",
      status: "available",
      currentLocation: "Koramangala Hub",
      completedDeliveries: 2,
      totalDeliveries: 5,
      vehicleType: "Bike",
      rating: 4.8,
    },
    {
      id: "driver-2",
      name: "Ravi Sharma",
      phone: "+919876543211",
      status: "busy",
      currentLocation: "Whitefield Area",
      completedDeliveries: 4,
      totalDeliveries: 6,
      vehicleType: "Scooter",
      rating: 4.6,
    },
    {
      id: "driver-3",
      name: "Amit Singh",
      phone: "+919876543212",
      status: "available",
      currentLocation: "Jayanagar Hub",
      completedDeliveries: 0,
      totalDeliveries: 0,
      vehicleType: "Bike",
      rating: 4.9,
    },
    {
      id: "driver-4",
      name: "Suresh Reddy",
      phone: "+919876543213",
      status: "offline",
      currentLocation: "BTM Layout",
      completedDeliveries: 3,
      totalDeliveries: 8,
      vehicleType: "Scooter",
      rating: 4.7,
    },
  ]);

  const [batches, setBatches] = useState<Batch[]>([
    {
      id: "batch-1",
      name: "Central Bangalore",
      orderCount: 8,
      totalWeight: 12.5,
      estimatedTime: "2.5 hours",
      route: "MG Road → Brigade Road → Commercial St",
    },
    {
      id: "batch-2",
      name: "East Bangalore",
      orderCount: 6,
      totalWeight: 9.2,
      estimatedTime: "3.1 hours",
      route: "Whitefield → ITPL → Marathahalli",
    },
    {
      id: "batch-3",
      name: "South Bangalore",
      orderCount: 10,
      totalWeight: 15.8,
      estimatedTime: "4.2 hours",
      route: "Jayanagar → BTM → Bannerghatta",
    },
  ]);

  const assignBatch = (batchId: string, driverId: string) => {
    setBatches(
      batches.map((batch) =>
        batch.id === batchId ? { ...batch, assignedDriver: driverId } : batch
      )
    );
  };

  const unassignBatch = (batchId: string) => {
    setBatches(
      batches.map((batch) =>
        batch.id === batchId ? { ...batch, assignedDriver: undefined } : batch
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-400";
      case "busy":
        return "text-yellow-400";
      case "offline":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4" />;
      case "busy":
        return <AlertCircle className="h-4 w-4" />;
      case "offline":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (

    <>
    <div className="space-y-6">
      <div className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Truck className="h-5 w-5 text-[#BB86FC]" />
          <span>Driver Assignment Panel</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Batches */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Available Batches
            </h4>
            <div className="space-y-3">
              {batches
                .filter((batch) => !batch.assignedDriver)
                .map((batch, index) => (
                  <motion.div
                    key={batch.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#2A2A2A] rounded-lg p-4 border border-gray-600 hover:border-[#BB86FC] transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-white">{batch.name}</h5>
                      <span className="text-xs bg-[#BB86FC] text-white px-2 py-1 rounded">
                        {batch.orderCount} orders
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">
                          {batch.totalWeight} kg
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">
                          {batch.estimatedTime}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3 flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {batch.route}
                      </span>
                    </div>

                    {/* Assignment Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {drivers
                        .filter((d) => d.status === "available")
                        .map((driver) => (
                          <button
                            key={driver.id}
                            onClick={() => assignBatch(batch.id, driver.id)}
                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors"
                          >
                            Assign to {driver.name}
                          </button>
                        ))}
                    </div>
                  </motion.div>
                ))}

              {batches.filter((batch) => !batch.assignedDriver).length ===
                0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    All batches have been assigned
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Drivers */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Driver Status
            </h4>
            <div className="space-y-3">
              {drivers.map((driver, index) => (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#2A2A2A] rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#BB86FC] bg-opacity-20 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-[#BB86FC]" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-white">
                          {driver.name}
                        </h5>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {driver.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center space-x-1 ${getStatusColor(
                        driver.status
                      )}`}
                    >
                      {getStatusIcon(driver.status)}
                      <span className="text-xs font-medium capitalize">
                        {driver.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-gray-400">Location:</span>
                      <p className="text-white">{driver.currentLocation}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Vehicle:</span>
                      <p className="text-white">{driver.vehicleType}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Progress:</span>
                      <p className="text-white">
                        {driver.completedDeliveries}/{driver.totalDeliveries}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Rating:</span>
                      <p className="text-white">⭐ {driver.rating}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-[#BB86FC] h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            driver.totalDeliveries > 0
                              ? (driver.completedDeliveries /
                                  driver.totalDeliveries) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Assigned Batches */}
                  <div className="space-y-2">
                    {batches
                      .filter((batch) => batch.assignedDriver === driver.id)
                      .map((batch) => (
                        <div
                          key={batch.id}
                          className="bg-[#BB86FC] bg-opacity-20 rounded p-3 border border-[#BB86FC]"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">
                              {batch.name}
                            </span>
                            <button
                              onClick={() => unassignBatch(batch.id)}
                              className="text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                              Unassign
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#BB86FC]">
                              {batch.orderCount} orders
                            </span>
                            <span className="text-gray-300">
                              {batch.estimatedTime}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* <TestingFile /> */}
    </>
  );
};

export default DriverAssignmentPanel;
