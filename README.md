# SiloDispatch - Smart Feed Logistics Management

SiloDispatch is a smart logistics platform designed to streamline the last-mile delivery process in the feed industry. This project features a Vite-powered React frontend and a Python backend built using FastAPI.

---

## 📁 Project Structure

SiloDispatch/
│
├── backend/ # FastAPI backend
│ ├── main.py
│ └── requirements.txt
│
├── frontend/
│ └── vite-project/ # React + Vite frontend
│ ├── src/
│ ├── public/
│ ├── index.html
│ └── vite.config.js
│
├── OTP/ # OTP verification module
├── PaymentGateway/ # Payment gateway module
├── ReactNative/ # React Native mobile app (optional)
├── silofortune/ # Core app logic
├── server/, testing3/, etc. # Additional modules or experiments

## ⚙️ Getting Started

### 1. Clone the Repository

git clone https://github.com/ksharan09/SiloDispatch.git
cd SiloDispatch

### 2. Backend Setup (Python + FastAPI)

cd backend
pip install -r requirements.txt
uvicorn main:app --reload


3. Frontend Setup (Vite + React)

cd frontend/vite-project
npm install
npm run dev

🚀 Features
📦 Order clustering & batch generation

🗺️ Real-time driver tracking

🔐 OTP-based delivery verification

💳 Integrated payment gateway

📱 Mobile app (React Native - optional)

✅ Admin panel to manage deliveries and payments
