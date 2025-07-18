import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  MapPin,
  Package,
  Zap,
  Download,
  AlertCircle,
} from "lucide-react";

interface Order {
  id: string;
  address: string;
  pincode: string;
  weight: number;
  amount: number;
  customerName: string;
  phone: string;
}

interface Batch {
  id: string;
  name: string;
  orders: Order[];
  totalWeight: number;
  totalAmount: number;
  estimatedTime: string;
  route: string;
}

const OrderBatchGenerator: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
  });

  const generateBatches = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);

    // Simulate API call to backend clustering service
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock batch generation with realistic data
    const mockBatches: Batch[] = [
      {
        id: "batch-1",
        name: "Central Bangalore Route",
        orders: [
          {
            id: "ord-1",
            address: "123 MG Road, Bangalore",
            pincode: "560001",
            weight: 2.5,
            amount: 1500,
            customerName: "Rajesh Kumar",
            phone: "+919876543210",
          },
          {
            id: "ord-2",
            address: "456 Brigade Road, Bangalore",
            pincode: "560001",
            weight: 1.8,
            amount: 890,
            customerName: "Priya Sharma",
            phone: "+919876543211",
          },
          {
            id: "ord-3",
            address: "789 Commercial Street, Bangalore",
            pincode: "560001",
            weight: 2.1,
            amount: 1200,
            customerName: "Amit Patel",
            phone: "+919876543212",
          },
        ],
        totalWeight: 6.4,
        totalAmount: 3590,
        estimatedTime: "2.5 hours",
        route: "MG Road → Brigade Road → Commercial Street",
      },
      {
        id: "batch-2",
        name: "East Bangalore Route",
        orders: [
          {
            id: "ord-4",
            address: "321 Whitefield Main Road",
            pincode: "560066",
            weight: 3.2,
            amount: 2100,
            customerName: "Sneha Reddy",
            phone: "+919876543213",
          },
          {
            id: "ord-5",
            address: "654 ITPL Road, Whitefield",
            pincode: "560066",
            weight: 2.1,
            amount: 1200,
            customerName: "Kiran Bhat",
            phone: "+919876543214",
          },
        ],
        totalWeight: 5.3,
        totalAmount: 3300,
        estimatedTime: "3.1 hours",
        route: "Whitefield → ITPL → Marathahalli",
      },
      {
        id: "batch-3",
        name: "South Bangalore Route",
        orders: [
          {
            id: "ord-6",
            address: "987 Jayanagar 4th Block",
            pincode: "560011",
            weight: 1.5,
            amount: 950,
            customerName: "Deepika Nair",
            phone: "+919876543215",
          },
          {
            id: "ord-7",
            address: "147 BTM Layout 2nd Stage",
            pincode: "560076",
            weight: 2.8,
            amount: 1800,
            customerName: "Vikram Rao",
            phone: "+919876543216",
          },
          {
            id: "ord-8",
            address: "258 Bannerghatta Road",
            pincode: "560076",
            weight: 1.9,
            amount: 1100,
            customerName: "Anita Joshi",
            phone: "+919876543217",
          },
        ],
        totalWeight: 6.2,
        totalAmount: 3850,
        estimatedTime: "3.8 hours",
        route: "Jayanagar → BTM → Bannerghatta",
      },
    ];

    setBatches(mockBatches);
    setIsProcessing(false);
  };

  const downloadSampleCSV = () => {
    const csvContent = `Customer Name,Phone,Address,Pincode,Weight,Amount
Rajesh Kumar,+919876543210,"123 MG Road, Bangalore",560001,2.5,1500
Priya Sharma,+919876543211,"456 Brigade Road, Bangalore",560001,1.8,890
Amit Patel,+919876543212,"789 Commercial Street, Bangalore",560001,2.1,1200`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_orders.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Upload className="h-5 w-5 text-[#BB86FC]" />
            <span>Order Batch Generator</span>
          </h3>
          <button
            onClick={downloadSampleCSV}
            className="flex items-center space-x-2 text-[#BB86FC] hover:text-[#9965E6] transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Sample CSV</span>
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-[#BB86FC] bg-[#BB86FC] bg-opacity-10"
              : "border-gray-600 hover:border-gray-500"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />

          {uploadedFile ? (
            <div className="space-y-2">
              <p className="text-white font-medium">{uploadedFile.name}</p>
              <p className="text-gray-400 text-sm">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-white font-medium">
                {isDragActive
                  ? "Drop the CSV file here"
                  : "Drag & drop CSV file here"}
              </p>
              <p className="text-gray-400 text-sm">or click to select file</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400 space-y-1">
            <p className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Supported formats: CSV, XLS, XLSX</span>
            </p>
            <p className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>
                Required columns: Customer Name, Phone, Address, Pincode,
                Weight, Amount
              </span>
            </p>
          </div>

          <button
            onClick={generateBatches}
            disabled={!uploadedFile || isProcessing}
            className="bg-[#BB86FC] text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 hover:bg-[#9965E6] transition-colors"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Generating Batches...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                <span>Generate Batches</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Batches */}
      <AnimatePresence>
        {batches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#BB86FC]" />
              <span>Generated Batches ({batches.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches.map((batch, index) => (
                <motion.div
                  key={batch.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#2A2A2A] rounded-lg p-4 border border-gray-600 cursor-pointer hover:border-[#BB86FC] transition-all"
                  onClick={() => setSelectedBatch(batch)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{batch.name}</h4>
                    <span className="text-xs bg-[#BB86FC] text-white px-2 py-1 rounded">
                      {batch.orders.length} orders
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Weight:</span>
                      <span className="text-white">{batch.totalWeight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white">
                        ₹{batch.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white">{batch.estimatedTime}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <p className="text-xs text-gray-400 flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{batch.route}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batch Details Modal */}
      <AnimatePresence>
        {selectedBatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedBatch(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1E1E1E] rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <MapPin className="h-6 w-6 text-[#BB86FC]" />
                  <span>{selectedBatch.name}</span>
                </h3>
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Batch Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-[#BB86FC]">
                    {selectedBatch.orders.length}
                  </p>
                </div>
                <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm">Total Weight</p>
                  <p className="text-2xl font-bold text-white">
                    {selectedBatch.totalWeight} kg
                  </p>
                </div>
                <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{selectedBatch.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Route Information */}
              <div className="bg-[#2A2A2A] rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-white mb-2">
                  Route Information
                </h4>
                <p className="text-gray-300">{selectedBatch.route}</p>
                <p className="text-gray-400 text-sm mt-1">
                  Estimated Time: {selectedBatch.estimatedTime}
                </p>
              </div>

              {/* Order Details */}
              <h4 className="font-semibold text-white mb-4">Order Details</h4>
              <div className="space-y-3">
                {selectedBatch.orders.map((order, index) => (
                  <div
                    key={order.id}
                    className="bg-[#2A2A2A] rounded-lg p-4 border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[#BB86FC]">
                        #{index + 1}
                      </span>
                      <span className="text-sm text-gray-400">{order.id}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Customer:</p>
                        <p className="text-white font-medium">
                          {order.customerName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Phone:</p>
                        <p className="text-white">{order.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Pincode:</p>
                        <p className="text-white">{order.pincode}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-400">Address:</p>
                        <p className="text-white">{order.address}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400">Weight:</p>
                          <p className="text-white">{order.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Amount:</p>
                          <p className="text-green-400">₹{order.amount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderBatchGenerator;
