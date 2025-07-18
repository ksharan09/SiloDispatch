import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Shield, ArrowRight, Truck, Clock } from "lucide-react";

const DriverLogin: React.FC = () => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) return;

    setIsLoading(true);

    // Simulate API call to backend
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStep("otp");
    setIsLoading(false);

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) return;

    setIsLoading(true);

    // Simulate API call to backend
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Store auth token and driver info
    localStorage.setItem("driverToken", "mock-jwt-token");
    localStorage.setItem("driverName", "Mahesh Kumar");
    localStorage.setItem("driverPhone", phoneNumber);

    setIsLoading(false);
    navigate("/driver/dashboard");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const resendOTP = () => {
    setTimeLeft(300);
    setOtp("");
    // In real app, call API to resend OTP
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1E1E1E] rounded-lg p-8 w-full max-w-md border border-gray-700"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#BB86FC] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="h-8 w-8 text-[#BB86FC]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Driver Login</h1>
          <p className="text-gray-400">
            {step === "phone"
              ? "Enter your phone number to continue"
              : "Enter the OTP sent to your phone"}
          </p>
        </div>

        {step === "phone" ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#BB86FC] transition-colors"
                  placeholder="+91 9876543210"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We'll send you a verification code
              </p>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={!phoneNumber || phoneNumber.length < 10 || isLoading}
              className="w-full bg-[#BB86FC] text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:bg-[#9965E6] transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Enter OTP
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#BB86FC] transition-colors text-center text-lg tracking-wider"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-gray-400 text-sm">OTP sent to {phoneNumber}</p>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4 text-[#BB86FC]" />
                <p
                  className={`font-medium ${
                    timeLeft > 0 ? "text-[#BB86FC]" : "text-red-400"
                  }`}
                >
                  {timeLeft > 0
                    ? `${formatTime(timeLeft)} remaining`
                    : "OTP expired"}
                </p>
              </div>
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={!otp || otp.length !== 6 || timeLeft === 0 || isLoading}
              className="w-full bg-[#BB86FC] text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:bg-[#9965E6] transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <span>Verify OTP</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <div className="text-center space-y-2">
              <button
                onClick={() => setStep("phone")}
                className="text-[#BB86FC] hover:text-[#9965E6] text-sm font-medium transition-colors"
              >
                Change phone number
              </button>
              {timeLeft === 0 && (
                <button
                  onClick={resendOTP}
                  className="block w-full text-[#BB86FC] hover:text-[#9965E6] text-sm font-medium transition-colors"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DriverLogin;
