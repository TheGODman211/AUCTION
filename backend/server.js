
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const Auction = require("./models/Auction");
const Bid = require("./models/Bid");
const Otp = require("./models/Otp");
const crypto = require("crypto");

// Config
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
app.use(cors());
app.use(bodyParser.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

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

// OTP Endpoint
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

// Auction endpoints
app.post("/api/auctions", async (req, res) => {
  const auction = await Auction.create(req.body);
  res.send(auction);
});

app.get("/api/auctions", async (req, res) => {
  const auctions = await Auction.find({});
  res.send(auctions);
});

// WebSocket for bidding
io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("newBid", async ({ auctionId, bid }) => {
    await Bid.create(bid);
    io.emit("bidUpdate", { auctionId, bid });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
