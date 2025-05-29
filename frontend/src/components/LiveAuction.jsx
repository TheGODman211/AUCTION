import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import axios from "axios";

const LiveAuction = ({ userEmail }) => {
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState({});
  const [amounts, setAmounts] = useState({});

  useEffect(() => {
    axios.get("https://auction-backend-wug0.onrender.com/api/auctions").then((res) => {
      setAuctions(res.data);
    });

    socket.on("bidUpdate", ({ auctionId, bid }) => {
      setBids((prev) => ({ ...prev, [auctionId]: bid.amount }));
    });

    return () => socket.off("bidUpdate");
  }, []);

  const placeBid = (auctionId) => {
    const amount = Number(amounts[auctionId]);
    if (isNaN(amount) || amount <= 0) return alert("Enter a valid amount");

    socket.emit("newBid", {
      auctionId,
      bid: { name: userEmail.split("@")[0], email: userEmail, amount },
    });
  };

  return (
    <div>
      <h2>Live Auctions</h2>
      {auctions.map((a) => (
        <div key={a._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h3>{a.title}</h3>
          <p>{a.description}</p>
          <img src={a.image} alt={a.title} style={{ width: 200 }} />
          <p>Starting Bid: ${a.startingBid}</p>
          <p>Highest Bid: ${bids[a._id] || "No bids yet"}</p>
          <input
            placeholder="Enter bid"
            onChange={(e) => setAmounts({ ...amounts, [a._id]: e.target.value })}
          />
          <button onClick={() => placeBid(a._id)}>Place Bid</button>
        </div>
      ))}
    </div>
  );
};

export default LiveAuction;