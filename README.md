<div align="center">

# 🏆 BidArena
### ⚡ Competitive Real-Time Auction Platform

> **Kodex Mini Hack Sprint 2026**  
> *Built with MERN Stack, Socket.IO & MongoDB*

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
<img src="https://img.shields.io/badge/Socket.IO-Realtime-black?style=for-the-badge&logo=socketdotio"/>
<img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge"/>

---

### 🚀 Real-Time • Deterministic • Secure • Scalable

</div>

---

# 📖 About

**BidArena** is a **real-time online auction platform** where users can create auctions, participate in live bidding, watch auctions as spectators, communicate through live chat, and securely complete payments.

The platform is designed around a **deterministic auction engine**, ensuring that every bid is processed safely, sequentially, and fairly—even when hundreds of users bid simultaneously.

---

# ✨ Features

## 👤 Authentication

- JWT Authentication
- Register
- Login
- Logout
- Protected Routes
- User Profile

---

## 🏷️ Auction Management

- Create Auction
- Edit Auction
- Delete Auction
- Upload Product Images
- Start Bid
- Set Duration
- Upcoming Auctions
- Active Auctions
- Completed Auctions

---

## ⚡ Real-Time Auction Engine

- Socket.IO Rooms
- Live Highest Bid
- Live Bid Updates
- Live Countdown Timer
- Bid Validation
- Bid Queue
- Race Condition Handling
- Deterministic Bid Ordering
- Winner Declaration

---

## 💬 Live Chat

- Room Based Chat
- Instant Messaging
- Real-Time Notifications

---

## 📊 Statistics

- Active Bidders
- Spectators
- Bid Count
- Auction Heat
- Remaining Time
- Highest Bid

---

## 📜 Timeline

Every auction event is stored.

- Auction Created
- Auction Started
- Bid Accepted
- Bid Rejected
- Winner
- Payment
- Auction Closed

---

## 💳 Payments

- Razorpay
- Stripe
- Success
- Failed
- Pending

---

## 🔄 Recovery

- Browser Refresh Recovery
- Reconnection Handling
- Restore Auction State
- Restore Timer
- Restore Highest Bid

---

# 🛠️ Tech Stack

## Frontend

- React 19
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios
- Socket.IO Client
- React Hook Form
- Zod
- Framer Motion

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- Bcrypt
- Multer
- Cloudinary
- Razorpay
- Stripe

---

# 🏗️ Project Architecture

```
Client (React)
       │
       ▼
React Router
       │
       ▼
Redux Toolkit
       │
       ▼
Axios / Socket.IO
       │
────────────────────────────
       │
Express Routes
       │
       ▼
Middlewares
       │
       ▼
Validators
       │
       ▼
Controllers
       │
       ▼
Services
       │
       ▼
Repositories
       │
       ▼
MongoDB Models
       │
       ▼
MongoDB
```

---

# 📂 Folder Structure

```
BidArena
│
├── client
│
└── server
    ├── src
    │   ├── config
    │   ├── routes
    │   ├── controllers
    │   ├── services
    │   ├── repositories
    │   ├── models
    │   ├── sockets
    │   ├── middlewares
    │   ├── validators
    │   ├── jobs
    │   ├── utils
    │   ├── app.js
    │   └── server.js
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/BidArena.git
```

---

## Client

```bash
cd client

npm install

npm run dev
```

---

## Server

```bash
cd server

npm install

npm run dev
```

---

# 🌍 Environment Variables

## Server (.env)

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

CLIENT_URL=http://localhost:5173

RAZORPAY_KEY_ID=

RAZORPAY_SECRET=

STRIPE_SECRET_KEY=
```

---

# 🔥 Core Modules

- Authentication
- Auctions
- Bidding Engine
- Socket Server
- Live Chat
- Timeline
- Payments
- Auction Timer
- Auction Heat
- Reconnection Manager

---

# 🎯 Functional Flow

```
Register/Login
      │
      ▼
Create Auction
      │
      ▼
Join Auction Room
      │
      ▼
Live Bidding
      │
      ▼
Socket Broadcast
      │
      ▼
Highest Bid Updated
      │
      ▼
Timer Ends
      │
      ▼
Winner Declared
      │
      ▼
Payment
      │
      ▼
Auction Completed
```

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Protected APIs
- Bid Validation
- Rate Limiting
- Server-side Validation
- Duplicate Bid Prevention

---

# 🚀 Future Enhancements

- Anti Sniping
- Proxy Bidding
- Auction Replay
- AI Fraud Detection
- Admin Dashboard
- Redis Cache
- Scheduled Auctions
- Watchlist
- Push Notifications
- Recommendation System

---

# 👨‍💻 Team

| Name | Role |
|------|------|
| Member 1 | Marketplace & Frontend |
| Member 2 | Auction Engine & Backend |

---

# 📸 Screenshots

```
📁 docs/screenshots/

Home Page

Login

Dashboard

Auction Room

Profile

Payments
```

---

# 📄 License

This project is developed for the **Kodex Mini Hack Sprint 2026**.

---

<div align="center">

## ⭐ If you like this project, don't forget to star the repository!

Made with ❤️ using **React, Node.js, MongoDB & Socket.IO**

</div>