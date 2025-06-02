

import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [visibleBids, setVisibleBids] = useState({});
  const [bidHistory, setBidHistory] = useState({});
  const [newAuction, setNewAuction] = useState({
    title: "",
    description: "",
    startingBid: 0,
    expiresAt: "",
    image: []
  });
  const [status, setStatus] = useState("");
  const [viewMode, setViewMode] = useState("view");
  const [selectedFiles, setSelectedFiles] = useState([]);


  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    }
  });

  const fetchAuctions = () => {
    axios
      .get("https://auction-backend-wug0.onrender.com/api/auctions", getAuthHeaders())
      .then((res) => setAuctions(res.data))
      .catch(() => {
        alert("Access denied or session expired");
        window.location.href = "/admin-login";
      });
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  useEffect(() => {
    if (status) {
      const timeout = setTimeout(() => setStatus(""), 4000);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  const formatAmount = (amount) =>
    Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleCreate = async () => {
    try {
      const { title, description, startingBid, expiresAt, image } = newAuction;
      if (!title || !startingBid || !expiresAt || !image) {
        return setStatus("All fields including image are required.");
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("startingBid", startingBid);
      formData.append("expiresAt", expiresAt);

      // Append all selected files
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("images", selectedFiles[i]);
      }

      await axios.post("https://auction-backend-wug0.onrender.com/api/auctions", formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data"
        }
      });

      setStatus("✅ Auction created successfully!");
      setNewAuction({ title: "", description: "", startingBid: 0, expiresAt: "", image: null });
      fetchAuctions();
    } catch (err) {
      setStatus("❌ " + (err.response?.data || "Error creating auction"));
    }
  };

  const viewBidHistory = async (auctionId) => {
    const isVisible = visibleBids[auctionId];
    if (isVisible) {
      setVisibleBids((prev) => ({ ...prev, [auctionId]: false }));
      return;
    }

    try {
      const res = await axios.get(
        `https://auction-backend-wug0.onrender.com/api/admin/auctions/${auctionId}/bids`,
        getAuthHeaders()
      );
      setVisibleBids((prev) => ({ ...prev, [auctionId]: true }));
      setBidHistory((prev) => ({ ...prev, [auctionId]: res.data }));
    } catch (err) {
      setStatus("❌ Failed to load bid history");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://auction-backend-wug0.onrender.com/api/auctions/${id}`, getAuthHeaders());
      setStatus("🗑️ Auction deleted");
      fetchAuctions();
    } catch (err) {
      setStatus("❌ " + (err.response?.data || "Error deleting auction"));
    }
  };

  const slideStyle = (isVisible) => ({
    maxHeight: isVisible ? "500px" : "0px",
    overflow: "hidden",
    transition: "max-height 0.5s ease",
    paddingLeft: isVisible ? "10px" : "0px",
    marginTop: isVisible ? "10px" : "0px"
  });

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "auto" }}>
      <h2>🛠️ Admin Dashboard</h2>
      {status && <p style={{ color: "blue" }}>{status}</p>}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setViewMode("create")}>➕ Create New Auction</button>
        <button onClick={() => setViewMode("view")} style={{ marginLeft: 10 }}>
          📋 View Existing Auctions
        </button>
      </div>

      {viewMode === "create" && (
        <>
          <h3>Create New Auction</h3>
          <input
            placeholder="Title"
            value={newAuction.title}
            onChange={(e) => setNewAuction({ ...newAuction, title: e.target.value })}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <textarea
            placeholder="Description"
            value={newAuction.description}
            onChange={(e) => setNewAuction({ ...newAuction, description: e.target.value })}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            type="number"
            placeholder="Starting Bid"
            value={newAuction.startingBid}
            onChange={(e) => setNewAuction({ ...newAuction, startingBid: Number(e.target.value) })}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            type="datetime-local"
            value={newAuction.expiresAt}
            onChange={(e) => setNewAuction({ ...newAuction, expiresAt: e.target.value })}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewAuction({ ...newAuction, image: e.target.files[0] })}
            style={{ marginBottom: 12 }}
          />
          <button onClick={handleCreate}>Submit Auction</button>
        </>
      )}

      {viewMode === "view" && (
        <>
          <h3>Existing Auctions</h3>
          {auctions.length === 0 ? (
            <p>No auctions available</p>
          ) : (
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {auctions.map((a) => {
                const isVisible = visibleBids[a._id];
                const bids = bidHistory[a._id] || [];
                const highest = bids.length
                  ? bids.reduce((max, curr) => (curr.amount > max.amount ? curr : max), bids[0])
                  : null;

                return (
                  <li key={a._id} style={{ borderBottom: "1px solid #ccc", marginBottom: 15, paddingBottom: 10 }}>
                    <strong>{a.title}</strong><br />
                    💰 Starting at: GHS {formatAmount(a.startingBid)}<br />
                    📝 {a.description}<br />
                    🕒 Expires: {new Date(a.expiresAt).toLocaleString()}<br />
                    {a.assetUrls && a.assetUrls.map((url, idx) => (
  <img key={idx} src={url} alt={a.title} style={{ width: 150, margin: "5px 5px 10px 0" }} />
))}

                    {highest && (
                      <p>
                        🏆 Highest Bid: GHS {formatAmount(highest.amount)} by {highest.bidder.name} at{" "}
                        {new Date(highest.timestamp).toLocaleString()}
                      </p>
                    )}
                    <button onClick={() => handleDelete(a._id)} style={{ marginTop: 6 }}>Delete</button>
                    <button onClick={() => viewBidHistory(a._id)} style={{ marginLeft: 10 }}>
                      {isVisible ? "🔽 Hide Bids" : "📊 View Bids"}
                    </button>

                    <div style={slideStyle(isVisible)}>
                      <h4>📜 Bid History</h4>
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {bids.length === 0 ? (
                          <li>No bids yet</li>
                        ) : (
                          bids.map((bid, idx) => (
                            <li key={idx}>
                              🧑 {bid.bidder.name} ({bid.bidder.email}) - 💰 GHS {formatAmount(bid.amount)} - 🕒{" "}
                              {new Date(bid.timestamp).toLocaleString()}
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
