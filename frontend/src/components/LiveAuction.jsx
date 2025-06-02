import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// Initialize socket connection
const socket = io("https://auction-backend-wug0.onrender.com", {
  withCredentials: true,
  transports: ["websocket", "polling"]
});

socket.on("connect", () => {
  console.log("WebSocket connected");
});

const LiveAuction = ({ userEmail }) => {
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState({});
  const [amounts, setAmounts] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios
      .get("https://auction-backend-wug0.onrender.com/api/auctions")
      .then((res) => {
        setAuctions(res.data);
      });

    socket.on("bidUpdate", ({ auctionId, bid }) => {
      setBids((prev) => ({ ...prev, [auctionId]: bid }));
    });

    return () => {
      socket.off("bidUpdate");
    };
  }, []);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const formatAmount = (amount) =>
    Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const placeBid = (auctionId) => {
    const amount = Number(amounts[auctionId]);
    if (isNaN(amount) || amount <= 0) {
      setStatus("❌ Enter a valid amount");
      return;
    }

    const bidData = {
      auctionId,
      amount: amount,
      bidder: {
        name: userEmail.split("@")[0],
        email: userEmail
      },
      timestamp: new Date().toISOString()
    };

    socket.emit("newBid", {
      auctionId,
      bid: bidData
    });

    setStatus("✅ Bid placed successfully");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Live Auctions</h2>
      {status && <p style={{ color: status.startsWith("❌") ? "red" : "green" }}>{status}</p>}
      {auctions.map((a) => (
        <div key={a._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h3>{a.title}</h3>
          <p>📝 {a.description}</p>
          <p> 🕒 Expires: {new Date(a.expiresAt).toLocaleString()}</p>
          {a.assetUrls && a.assetUrls.map((img, idx) => (
            <img key={idx} src={img.url} alt={a.title} style={{ width: 150, margin: "5px 5px 10px 0" }} />
          ))}


          <p>💰 Starting Bid: GHS {formatAmount(a.startingBid)}</p>
          <p>
            🏆 Highest Bid:{" "}
            {bids[a._id]
              ? `GHS ${formatAmount(bids[a._id].amount)}  at ${new Date(
                  bids[a._id].timestamp
                ).toLocaleString()}`
              : "No bids yet"}
          </p>
          <input
            placeholder="Enter bid"
            type="number"
            value={amounts[a._id] || ""}
            onChange={(e) => setAmounts({ ...amounts, [a._id]: e.target.value })}
          />
          <button onClick={() => placeBid(a._id)}>Place Bid</button>
        </div>
      ))}
    </div>
  );
};

export default LiveAuction;
