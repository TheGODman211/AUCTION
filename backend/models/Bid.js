const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
  bidder: {
    name: String,
    email: String
  },
  amount: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bid", bidSchema);
