# SiloDispatch Backend Integration Guide

## Overview

This guide provides step-by-step instructions to connect the SiloDispatch frontend to your backend services.

## Required Backend Endpoints

### 1. Order Management

#### Upload Orders

```
POST /api/orders/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: CSV file with columns:
- Customer Name
- Phone
- Address
- Pincode
- Weight
- Amount
```

#### Generate Batches

```
POST /api/cluster-orders
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "orders": [
    {
      "id": "ord-1",
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 2.5,
      "amount": 1500,
      "customerName": "John Doe",
      "address": "123 Main St",
      "phone": "+919876543210"
    }
  ],
  "maxWeight": 25,
  "algorithm": "haversine-optimized"
}

Response:
{
  "batches": [
    {
      "id": "batch-1",
      "orders": [...],
      "totalWeight": 12.5,
      "totalAmount": 5420,
      "estimatedTime": "2.5 hours",
      "route": "MG Road → Brigade Road"
    }
  ]
}
```

### 2. Driver Authentication

#### Send OTP

```
POST /api/driver/auth/send-otp
Content-Type: application/json

Body:
{
  "phoneNumber": "+919876543210"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### Verify OTP

```
POST /api/driver/auth/verify-otp
Content-Type: application/json

Body:
{
  "phoneNumber": "+919876543210",
  "otp": "123456"
}

Response:
{
  "success": true,
  "token": "jwt-token-here",
  "driver": {
    "id": "driver-123",
    "name": "Mahesh Kumar",
    "phoneNumber": "+919876543210",
    "vehicleType": "Bike"
  }
}
```

### 3. Payment Processing

#### Generate UPI Payment

```
POST /api/payments/generate-upi
Content-Type: application/json
Authorization: Bearer <driver-token>

Body:
{
  "amount": 1500,
  "orderId": "ord-123",
  "currency": "INR"
}

Response:
{
  "success": true,
  "upiLink": "upi://pay?pa=merchant@paytm&am=1500...",
  "paymentToken": "cashfree-token",
  "orderId": "silo_ord-123_timestamp"
}
```

### 4. Order Status Updates

#### Update Order Status

```
PUT /api/orders/{orderId}/status
Content-Type: application/json
Authorization: Bearer <driver-token>

Body:
{
  "status": "delivered",
  "paymentData": {
    "method": "upi",
    "amount": 1500,
    "transactionId": "txn-123"
  },
  "timestamp": "2024-01-16T14:30:00Z"
}
```

### 5. COD Management

#### Settle COD Balance

```
POST /api/cod/settle
Content-Type: application/json
Authorization: Bearer <admin-token>

Body:
{
  "driverId": "driver-123",
  "amount": 15420,
  "settlementDate": "2024-01-16T18:00:00Z"
}
```

## Backend Implementation Examples

### 1. FastAPI Order Clustering Service

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
from sklearn.cluster import KMeans
import math

app = FastAPI()

class Order(BaseModel):
    id: str
    lat: float
    lng: float
    weight: float
    amount: float
    customerName: str
    address: str
    phone: str

class ClusterRequest(BaseModel):
    orders: List[Order]
    maxWeight: float = 25.0

@app.post("/cluster-orders")
async def cluster_orders(request: ClusterRequest):
    try:
        orders = request.orders

        # Haversine distance calculation
        def haversine(lat1, lon1, lat2, lon2):
            R = 6371  # Earth's radius in km
            dlat = math.radians(lat2 - lat1)
            dlon = math.radians(lon2 - lon1)
            a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
            c = 2 * math.asin(math.sqrt(a))
            return R * c

        # Prepare data for clustering
        coordinates = [[order.lat, order.lng] for order in orders]

        # Determine optimal number of clusters
        n_clusters = max(1, min(len(orders) // 5, 10))

        # Perform K-means clustering
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        cluster_labels = kmeans.fit_predict(coordinates)

        # Group orders by cluster and create batches
        clusters = {}
        for i, label in enumerate(cluster_labels):
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(orders[i])

        batches = []
        for cluster_id, cluster_orders in clusters.items():
            current_batch = []
            current_weight = 0

            for order in cluster_orders:
                if current_weight + order.weight <= request.maxWeight:
                    current_batch.append(order)
                    current_weight += order.weight
                else:
                    if current_batch:
                        batches.append({
                            "id": f"batch-{len(batches) + 1}",
                            "orders": current_batch,
                            "totalWeight": current_weight,
                            "totalAmount": sum(o.amount for o in current_batch),
                            "estimatedTime": f"{len(current_batch) * 0.5:.1f} hours"
                        })
                    current_batch = [order]
                    current_weight = order.weight

            if current_batch:
                batches.append({
                    "id": f"batch-{len(batches) + 1}",
                    "orders": current_batch,
                    "totalWeight": current_weight,
                    "totalAmount": sum(o.amount for o in current_batch),
                    "estimatedTime": f"{len(current_batch) * 0.5:.1f} hours"
                })

        return {"batches": batches}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 2. Node.js Driver Authentication with Twilio

```javascript
const express = require("express");
const twilio = require("twilio");
const jwt = require("jsonwebtoken");

const app = express();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.use(express.json());

// Store OTPs temporarily (use Redis in production)
const otpStore = new Map();

// Send OTP
app.post("/api/driver/auth/send-otp", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiration (5 minutes)
    otpStore.set(phoneNumber, {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    });

    // Send SMS via Twilio
    await client.messages.create({
      body: `SiloDispatch OTP: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP send error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/api/driver/auth/verify-otp", async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    const storedOTP = otpStore.get(phoneNumber);

    if (!storedOTP || Date.now() > storedOTP.expires || storedOTP.otp !== otp) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Remove OTP after successful verification
    otpStore.delete(phoneNumber);

    // Generate JWT token
    const token = jwt.sign(
      { phoneNumber, type: "driver" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Fetch driver details from database
    const driverData = {
      id: "driver-123",
      name: "Mahesh Kumar",
      phoneNumber,
      vehicleType: "Bike",
    };

    res.json({
      success: true,
      token,
      driver: driverData,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});
```

### 3. Cashfree UPI Integration

```javascript
const express = require("express");
const crypto = require("crypto");
const axios = require("axios");

const app = express();
app.use(express.json());

// Cashfree configuration
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_BASE_URL = "https://api.cashfree.com/api/v2";

// Generate UPI payment
app.post("/api/payments/generate-upi", async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // Generate payment session
    const paymentSession = {
      appId: CASHFREE_APP_ID,
      orderId: `silo_${orderId}_${Date.now()}`,
      orderAmount: amount,
      orderCurrency: "INR",
      customerName: "Customer",
      customerPhone: "9999999999",
      customerEmail: "customer@example.com",
      returnUrl: "https://your-app.com/payment-callback",
      notifyUrl: "https://your-app.com/payment-webhook",
    };

    // Create signature
    const signatureData = Object.keys(paymentSession)
      .sort()
      .map((key) => `${key}=${paymentSession[key]}`)
      .join("&");

    const signature = crypto
      .createHmac("sha256", CASHFREE_SECRET_KEY)
      .update(signatureData)
      .digest("base64");

    // Create payment session
    const response = await axios.post(`${CASHFREE_BASE_URL}/cftoken/order`, {
      ...paymentSession,
      signature,
    });

    const { cftoken } = response.data;

    // Generate UPI link
    const upiLink = `upi://pay?pa=cashfree@paytm&pn=SiloDispatch&am=${amount}&cu=INR&tn=Order%20${orderId}&tr=${paymentSession.orderId}`;

    res.json({
      success: true,
      upiLink,
      paymentToken: cftoken,
      orderId: paymentSession.orderId,
    });
  } catch (error) {
    console.error("UPI generation error:", error);
    res.status(500).json({ error: "Failed to generate UPI payment" });
  }
});
```

## Database Schema (PostgreSQL)

```sql
-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    amount DECIMAL(10, 2) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'offline',
    rating DECIMAL(3, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Batches table
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    driver_id UUID REFERENCES drivers(id),
    total_weight DECIMAL(5, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'assigned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COD transactions
CREATE TABLE cod_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES drivers(id),
    order_id UUID REFERENCES orders(id),
    amount DECIMAL(10, 2) NOT NULL,
    collection_method VARCHAR(20) NOT NULL,
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'collected'
);
```

## Environment Variables

Create a `.env` file in your backend project:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/silodispatch

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Cashfree
CASHFREE_APP_ID=your-cashfree-app-id
CASHFREE_SECRET_KEY=your-cashfree-secret-key

# Server
PORT=3000
NODE_ENV=development
```

## Deployment Checklist

1. **Database Setup**

   - Create PostgreSQL database
   - Run migration scripts
   - Set up indexes for performance

2. **API Security**

   - Implement rate limiting
   - Add CORS configuration
   - Set up API authentication middleware

3. **External Services**

   - Configure Twilio for SMS
   - Set up Cashfree payment gateway
   - Test all integrations

4. **Monitoring**

   - Add logging for all API calls
   - Set up error tracking
   - Monitor payment transactions

5. **Testing**
   - Test all API endpoints
   - Verify OTP flow
   - Test payment processing
   - Load test clustering algorithm

This guide provides everything needed to connect your SiloDispatch frontend to a production-ready backend system.
