// Backend Integration Guide for SiloDispatch

// 1. Order Ingestion API
export const uploadOrders = async (csvFile: File) => {
  const formData = new FormData();
  formData.append("file", csvFile);

  try {
    const response = await fetch("/api/orders/upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Order upload error:", error);
    throw error;
  }
};

// 2. Batch Generation API
export const generateBatches = async (
  orders: any[],
  maxWeight: number = 25
) => {
  try {
    const response = await fetch("/api/cluster-orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({
        orders,
        maxWeight,
        algorithm: "haversine-optimized",
      }),
    });

    if (!response.ok) {
      throw new Error("Batch generation failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Batch generation error:", error);
    throw error;
  }
};

// 3. Driver Authentication API
export const authenticateDriver = async (phoneNumber: string) => {
  try {
    const response = await fetch("/api/driver/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      throw new Error("OTP send failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Driver auth error:", error);
    throw error;
  }
};

export const verifyDriverOTP = async (phoneNumber: string, otp: string) => {
  try {
    const response = await fetch("/api/driver/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, otp }),
    });

    if (!response.ok) {
      throw new Error("OTP verification failed");
    }

    const data = await response.json();

    // Store JWT token
    localStorage.setItem("driverToken", data.token);
    localStorage.setItem("driverName", data.driverName);

    return data;
  } catch (error) {
    console.error("OTP verification error:", error);
    throw error;
  }
};

// 4. UPI Payment Generation API
export const generateUPIPayment = async (amount: number, orderId: string) => {
  try {
    const response = await fetch("/api/payments/generate-upi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("driverToken")}`,
      },
      body: JSON.stringify({
        amount,
        orderId,
        currency: "INR",
      }),
    });

    if (!response.ok) {
      throw new Error("UPI generation failed");
    }

    return await response.json();
  } catch (error) {
    console.error("UPI generation error:", error);
    throw error;
  }
};

// 5. Order Status Update API
export const updateOrderStatus = async (
  orderId: string,
  status: string,
  paymentData?: any
) => {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("driverToken")}`,
      },
      body: JSON.stringify({
        status,
        paymentData,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Status update failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Status update error:", error);
    throw error;
  }
};

// 6. COD Settlement API
export const settleCODBalance = async (driverId: string, amount: number) => {
  try {
    const response = await fetch("/api/cod/settle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({
        driverId,
        amount,
        settlementDate: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("COD settlement failed");
    }

    return await response.json();
  } catch (error) {
    console.error("COD settlement error:", error);
    throw error;
  }
};

// Error handling with exponential backoff
export const withRetry = async (
  fn: () => Promise<any>,
  maxRetries: number = 3
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Exponential backoff
      const delay = Math.pow(2, i) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Usage example with retry logic
export const uploadOrdersWithRetry = (csvFile: File) => {
  return withRetry(() => uploadOrders(csvFile));
};
