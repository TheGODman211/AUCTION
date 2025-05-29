// README.md (GitHub Documentation for Auction Site)

# 🛒 Real-Time Auction Platform

A full-stack web application that allows authenticated users with `@oldmutual.com.gh` emails to join live auctions and place real-time bids. Built with Node.js, Express, MongoDB, React, and Socket.IO.

---

## 📦 Features
- Admin auction creation with title, description, duration, image, and starting bid
- Email OTP-based access for authorized users
- Real-time bidding with WebSocket updates
- Bid history stored in MongoDB

---

## 🛠 Tech Stack
- **Frontend**: React, Axios, Socket.IO client
- **Backend**: Node.js, Express, MongoDB, Socket.IO, Nodemailer
- **Database**: MongoDB Atlas (free tier)

---

## 📁 Project Structure
```
auction-platform/
├── backend/            # Express backend with real-time WebSocket support
│   ├── models/         # Mongoose models (Auction, Bid, OTP)
│   └── server.js       # Main server file
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # EmailVerification, LiveAuction
│   │   ├── socket.js   # Socket.IO setup
│   │   └── App.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ MongoDB Atlas (Database)
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new project and free cluster
- Add a new database user and whitelist your IP or `0.0.0.0/0`
- Create a database called `auction`
- Copy your connection string and update `.env`:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/auction
EMAIL=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

### 2️⃣ Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Then update your credentials
node server.js         # Start server at http://localhost:5000
```

---

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm start              # Runs frontend at http://localhost:3000
```

> 🔧 Be sure to update `src/socket.js` to point to your Render backend URL in production.

---

## 🚀 Deployment (Free)

### 🔹 Backend: [Render](https://render.com)
- Create a new Web Service
- Connect your GitHub repo
- Build Command: `npm install`
- Start Command: `node server.js`
- Add Environment Variables: `MONGO_URI`, `EMAIL`, `EMAIL_PASS`
- Render gives you a URL like: `https://auction-backend.onrender.com`

### 🔹 Frontend: [Vercel](https://vercel.com)
- Import from GitHub
- React is auto-detected
- Vercel deploys your frontend and gives you a live URL
- Ensure your `socket.js` connects to the Render backend

---

## ✅ Testing the App
- Navigate to your Vercel frontend URL
- OTP-authenticate with a `@oldmutual.com.gh` email
- Place bids and see updates instantly from another device or tab

---

## 🔐 Security Notes
- OTPs expire in 5 minutes
- Email domain check for access
- Basic XSS/validation controls included (customize as needed)

---

## 🧠 Future Enhancements
- Admin panel with bid history
- Cloud image uploads (e.g., Cloudinary)
- JWT-based session management
- Countdown timer per auction

---

**Made with 💻 for Old Mutual Auction Events**
