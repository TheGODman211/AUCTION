const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  autoFinalBidDone: { type: Boolean, default: false },
  assetUrls: [
  {url: String,
    public_id: String
  }], // Image URL
  startingBid: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open"
  }
});

module.exports = mongoose.model("Auction", auctionSchema);
