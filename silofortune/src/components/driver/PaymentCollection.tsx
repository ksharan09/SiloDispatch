import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  CreditCard,
  QrCode,
  DollarSign,
  CheckCircle,
  Smartphone,
} from "lucide-react";
import QRCode from "react-qr-code";

interface Order {
  id: string;
  customerName: string;
  amount: number;
  phone: string;
}

interface PaymentCollectionProps {
  order: Order;
  onComplete: (success: boolean) => void;
  onCancel: () => void;
}

const PaymentCollection: React.FC<PaymentCollectionProps> = ({
  order,
  onComplete,
  onCancel,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("upi");
  const [cashAmount, setCashAmount] = useState(order.amount.toString());
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const upiLink = `upi://pay?pa=merchant@paytm&pn=SiloDispatch&am=${order.amount}&cu=INR&tn=Order%20${order.id}`;

  const handleUPIPayment = () => {
    setShowOTP(true);
  };

  const handleCashPayment = () => {
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onComplete(true);
    }, 1500);
  };

  const handleOTPVerification = () => {
    if (otp === "1234") {
      // Mock OTP verification
      setIsProcessing(true);

      setTimeout(() => {
        setIsProcessing(false);
        onComplete(true);
      }, 1500);
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1E1E1E] rounded-lg p-6 w-full max-w-md border border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Collect Payment</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-[#2A2A2A] rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Customer:</p>
              <p className="text-white font-medium">{order.customerName}</p>
              <p className="text-gray-400 text-xs">{order.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Amount:</p>
              <p className="text-2xl font-bold text-[#BB86FC]">
                ₹{order.amount}
              </p>
            </div>
          </div>
        </div>

        {!showOTP ? (
          <div className="space-y-4">
            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMethod("upi")}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-all ${
                  paymentMethod === "upi"
                    ? "bg-[#BB86FC] bg-opacity-20 border-[#BB86FC] text-white"
                    : "bg-[#2A2A2A] border-gray-600 text-gray-400 hover:bg-[#333333]"
                }`}
              >
                <Smartphone className="h-5 w-5" />
                <span>UPI</span>
              </button>

              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-all ${
                  paymentMethod === "cash"
                    ? "bg-[#BB86FC] bg-opacity-20 border-[#BB86FC] text-white"
                    : "bg-[#2A2A2A] border-gray-600 text-gray-400 hover:bg-[#333333]"
                }`}
              >
                <DollarSign className="h-5 w-5" />
                <span>Cash</span>
              </button>
            </div>

            {/* Payment Method Content */}
            {paymentMethod === "upi" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-white p-4 rounded-lg flex justify-center">
                  <QRCode value={upiLink} size={180} />
                </div>

                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-3">
                    Ask customer to scan QR code or use the button below
                  </p>
                  <button
                    onClick={() => window.open(upiLink, "_blank")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mb-3 flex items-center space-x-2 mx-auto"
                  >
                    <Smartphone className="h-4 w-4" />
                    <span>Open UPI App</span>
                  </button>
                </div>

                <button
                  onClick={handleUPIPayment}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Payment Received</span>
                </button>
              </motion.div>
            )}

            {paymentMethod === "cash" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Cash Amount Received
                  </label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#BB86FC] transition-colors"
                    placeholder="Enter amount"
                  />
                </div>

                <button
                  onClick={handleCashPayment}
                  disabled={
                    !cashAmount || parseFloat(cashAmount) <= 0 || isProcessing
                  }
                  className="w-full bg-[#BB86FC] text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#9965E6] transition-colors flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Confirm Cash Payment</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Enter Customer OTP
              </h4>
              <p className="text-gray-400 text-sm">
                Ask the customer to provide the OTP for this delivery
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Customer OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#BB86FC] text-center text-lg tracking-wider transition-colors"
                placeholder="Enter 4-digit OTP"
                maxLength={4}
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Demo OTP: 1234
              </p>
            </div>

            <button
              onClick={handleOTPVerification}
              disabled={otp.length !== 4 || isProcessing}
              className="w-full bg-[#BB86FC] text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#9965E6] transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Verify & Complete</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PaymentCollection;
