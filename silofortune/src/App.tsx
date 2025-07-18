import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WarehouseDashboard from "./components/warehouse/WarehouseDashboard";
import DriverLogin from "./components/driver/DriverLogin";
import DriverDashboard from "./components/driver/DriverDashboard";
import Navigation from "./components/Navigation";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-[#121212] text-white">
          <Navigation />
          <Routes>
            <Route path="/" element={<WarehouseDashboard />} />
            <Route path="/warehouse" element={<WarehouseDashboard />} />
            <Route path="/driver" element={<DriverLogin />} />
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
