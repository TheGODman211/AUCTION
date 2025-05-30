import { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

const AdminDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [newAuction, setNewAuction] = useState({
    title: '',
    description: '',
    startingBid: 0,
    expiresAt: ''
  });
  const [status, setStatus] = useState('');

  const fetchAuctions = () => {
    axios
      .get("https://auction-backend-wug0.onrender.com/api/auctions", { withCredentials: true })
      .then((res) => setAuctions(res.data))
      .catch(() => {
        alert("Access denied or session expired");
        window.location.href = "/admin-login";
      });
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleCreate = async () => {
    try {
      if (!newAuction.title || !newAuction.startingBid || !newAuction.expiresAt) {
        return setStatus("Please fill all required fields.");
      }

      await axios.post("https://auction-backend-wug0.onrender.com/api/auctions", newAuction, {
        withCredentials: true,
      });

      setStatus("✅ Auction created successfully!");
      setNewAuction({ title: '', description: '', startingBid: 0, expiresAt: '' });
      fetchAuctions();
    } catch (err) {
      setStatus("❌ " + (err.response?.data || "Error creating auction"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://auction-backend-wug0.onrender.com/api/auctions/${id}`, {
        withCredentials: true,
      });
      setStatus("🗑️ Auction deleted");
      fetchAuctions();
    } catch (err) {
      setStatus("❌ " + (err.response?.data || "Error deleting auction"));
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>🛠️ Admin Dashboard</h2>
      {status && <p style={{ color: "blue" }}>{status}</p>}

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
        placeholder="Expiry Date"
        value={newAuction.expiresAt}
        onChange={(e) => setNewAuction({ ...newAuction, expiresAt: e.target.value })}
        style={{ width: "100%", marginBottom: 12 }}
      />
      <button onClick={handleCreate}>➕ Create Auction</button>

      <h3 style={{ marginTop: 40 }}>Existing Auctions</h3>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {auctions.map((a) => (
          <li key={a._id} style={{ borderBottom: "1px solid #ccc", marginBottom: 15, paddingBottom: 10 }}>
            <strong>{a.title}</strong><br />
            💰 Starting at: ${a.startingBid}<br />
            📝 {a.description}<br />
            🕒 Expires: {new Date(a.expiresAt).toLocaleString()}<br />
            <button onClick={() => handleDelete(a._id)} style={{ marginTop: 6 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
