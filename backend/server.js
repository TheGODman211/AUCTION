// server.js
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const Auction = require("./models/Auction");
const Bid = require("./models/Bid");
const Otp = require("./models/Otp");
const Admin = require("./models/Admin");

// Config
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'https://auction-theta-two.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true
  }
});


// Middleware
const allowedOrigins = ['https://auction-theta-two.vercel.app', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // ✅ Start OTP cleanup task every 5 minutes
    setInterval(() => {
      Otp.deleteMany({ expiresAt: { $lt: Date.now() } })
        .then((result) => {
          if (result.deletedCount > 0) {
            console.log(`Cleaned up ${result.deletedCount} expired OTPs`);
          }
        })
        .catch(console.error);
    }, 5 * 60 * 1000); // every 5 minutes
  })
  .catch((err) => console.error(err));


// OTP Email Sender
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS },
});

function sendOtp(email, code) {
  return transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP for Auction Access",
    text: `Your OTP is: ${code}`,
  });
}

// Admin Middleware
// const requireAdmin = async (req, res, next) => {
//   const token = req.cookies.admin;
//   if (!token) return res.status(401).send("Not logged in");
//
//   const admin = await Admin.findById(token);
//   if (!admin) return res.status(403).send("Unauthorized");
//
//   req.admin = admin;
//   next();
// };
const requireAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Not logged in");

  const admin = await Admin.findById(token);
  if (!admin) return res.status(403).send("Unauthorized");

  req.admin = admin;
  next();
};

// OTP Endpoints
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email.endsWith("@oldmutual.com.gh")) return res.status(400).send("Invalid email domain");

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({ email, code, expiresAt: Date.now() + 5 * 60 * 1000 });
  await sendOtp(email, code);
  res.send("OTP sent");
});

app.post("/api/verify-otp", async (req, res) => {
  const { email, code } = req.body;
  const record = await Otp.findOne({ email, code });
  if (!record || record.expiresAt < Date.now()) return res.status(400).send("Invalid or expired OTP");
  res.send("Verified");
});

// Admin Endpoints
app.post("/api/admin/register", async (req, res) => {
  const { username, password } = req.body;
  const exists = await Admin.findOne({ username });
  if (exists) return res.status(409).send("Admin already exists");

  const hashed = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, password: hashed });
  await admin.save();
  res.send("Admin created");
});

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(400).send("User not found");

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).send("Wrong password");

  // res.cookie("admin", admin._id, {
  //   httpOnly: true,
  //   sameSite: "None",
  //   secure: true,
  // });
  res.json({ token: admin._id });
  });

app.post("/api/admin/logout", (req, res) => {
  res.clearCookie("admin");
  res.send("Logged out");
});

// Auction Routes
app.post("/api/auctions", requireAdmin, async (req, res) => {
  const auction = await Auction.create(req.body);
  res.send(auction);
});

app.get("/api/auctions", requireAdmin, async (req, res) => {
  const auctions = await Auction.find({});
  res.send(auctions);
});

// DELETE an auction
app.delete("/api/auctions/:id", requireAdmin, async (req, res) => {
  try {
    const result = await Auction.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send("Auction not found");
    res.send({ message: "Auction deleted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});


// Check admin login status
// app.get("/api/admin/status", async (req, res) => {
//   const token = req.cookies.admin;
//   if (!token) return res.json({ isAdmin: false });
//
//   const admin = await Admin.findById(token);
//   if (!admin) return res.json({ isAdmin: false });
//
//   res.json({ isAdmin: true });
// });

app.get("/api/admin/status", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.json({ isAdmin: false });

  const admin = await Admin.findById(token);
  if (!admin) return res.json({ isAdmin: false });

  res.json({ isAdmin: true });
});


// Get bid data
app.get("/api/admin/auctions/:id/bids", requireAdmin, async (req, res) => {
  const bids = await Bid.find({ auctionId: req.params.id }).sort({ timestamp: -1 });
  res.send(bids);
});



// WebSocket for bidding
io.on("connection", (socket) => {
  console.log("🔌 WebSocket client connected");

  socket.on("newBid", async ({ auctionId, bid }) => {
    try {
      const savedBid = await Bid.create({
        auctionId,
        ...bid
      });

      console.log("✅ Bid saved:", savedBid);
      io.emit("bidUpdate", { auctionId, bid: savedBid });
    } catch (err) {
      console.error("❌ Failed to save bid:", err);
    }
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
