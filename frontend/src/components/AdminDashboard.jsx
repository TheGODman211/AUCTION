// import { useEffect, useState } from 'react';
// import axios from 'axios';
// axios.defaults.withCredentials = true;
//
//
// const AdminDashboard = () => {
//   const [auctions, setAuctions] = useState([]);
//   const [selectedAuctionId, setSelectedAuctionId] = useState(null);
//   const [bidHistory, setBidHistory] = useState([]);
//   const [newAuction, setNewAuction] = useState({
//     title: '',
//     description: '',
//     startingBid: 0,
//     expiresAt: ''
//   });
//   const [status, setStatus] = useState('');
//
//   const fetchAuctions = () => {
//     axios
//       .get("https://auction-backend-wug0.onrender.com/api/auctions", { withCredentials: true })
//       .then((res) => setAuctions(res.data))
//       .catch(() => {
//         alert("Access denied or session expired");
//         window.location.href = "/admin-login";
//       });
//   };
//
//   useEffect(() => {
//     fetchAuctions();
//   }, []);
//
//   useEffect(() => {
//   if (status) {
//     const timeout = setTimeout(() => setStatus(""), 5000);
//     return () => clearTimeout(timeout);
//   }
// }, [status]);
//
//
//   const handleCreate = async () => {
//     try {
//       if (!newAuction.title || !newAuction.startingBid || !newAuction.expiresAt) {
//         return setStatus("Please fill all required fields.");
//       }
//
//       await axios.post("https://auction-backend-wug0.onrender.com/api/auctions", newAuction, {
//         withCredentials: true,
//       });
//
//       setStatus("✅ Auction created successfully!");
//       setNewAuction({ title: '', description: '', startingBid: 0, expiresAt: '' });
//       fetchAuctions();
//     } catch (err) {
//       setStatus("❌ " + (err.response?.data || "Error creating auction"));
//     }
//   };
//
//   const viewBidHistory = async (auctionId) => {
//   try {
//     const res = await axios.get(`https://auction-backend-wug0.onrender.com/api/auctions/${auctionId}/bids`, {
//       withCredentials: true
//     });
//     setSelectedAuctionId(auctionId);
//     setBidHistory(res.data);
//   } catch (err) {
//     setStatus("❌ Failed to load bid history");
//   }
// };
//
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`https://auction-backend-wug0.onrender.com/api/auctions/${id}`, {
//         withCredentials: true,
//       });
//       setStatus("🗑️ Auction deleted");
//       fetchAuctions();
//     } catch (err) {
//       setStatus("❌ " + (err.response?.data || "Error deleting auction"));
//     }
//   };
//
//   return (
//     <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
//       <h2>🛠️ Admin Dashboard</h2>
//       {status && <p style={{ color: "blue" }}>{status}</p>}
//
//       <h3>Create New Auction</h3>
//       <input
//         placeholder="Title"
//         value={newAuction.title}
//         onChange={(e) => setNewAuction({ ...newAuction, title: e.target.value })}
//         style={{ width: "100%", marginBottom: 8 }}
//       />
//       <textarea
//         placeholder="Description"
//         value={newAuction.description}
//         onChange={(e) => setNewAuction({ ...newAuction, description: e.target.value })}
//         style={{ width: "100%", marginBottom: 8 }}
//       />
//       <input
//         type="number"
//         placeholder="Starting Bid"
//         value={newAuction.startingBid}
//         onChange={(e) => setNewAuction({ ...newAuction, startingBid: Number(e.target.value) })}
//         style={{ width: "100%", marginBottom: 8 }}
//       />
//       <input
//         type="datetime-local"
//         placeholder="Expiry Date"
//         value={newAuction.expiresAt}
//         onChange={(e) => setNewAuction({ ...newAuction, expiresAt: e.target.value })}
//         style={{ width: "100%", marginBottom: 12 }}
//       />
//
//
//
//       <button onClick={handleCreate}>➕ Create Auction</button>
//
//       <h3 style={{ marginTop: 40 }}>Existing Auctions</h3>
//       {auctions.length === 0 ? (
//   <p>No auctions available</p>
// ) : (
//   <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
//     {auctions.map((a) => (
//       <li key={a._id} style={{ borderBottom: "1px solid #ccc", marginBottom: 15, paddingBottom: 10 }}>
//         <strong>{a.title}</strong><br />
//         💰 Starting at: ${a.startingBid}<br />
//         📝 {a.description}<br />
//         🕒 Expires: {new Date(a.expiresAt).toLocaleString()}<br />
//         <button onClick={() => handleDelete(a._id)} style={{ marginTop: 6 }}>Delete</button>
//         <button onClick={() => viewBidHistory(a._id)} style={{ marginLeft: 10 }}>📊 View Bids</button>
//       </li>
//     ))}
//   </ul>
// )}
//
//   {selectedAuctionId && (
//   <div style={{ marginTop: 20 }}>
//     <h4>📜 Bid History</h4>
//     <ul style={{ listStyle: "none", padding: 0 }}>
//       {bidHistory.length === 0 ? (
//         <li>No bids yet</li>
//       ) : (
//         bidHistory.map((bid, idx) => (
//           <li key={idx}>
//             🧑 {bid.bidder} - 💰 ${bid.amount} - 🕒 {new Date(bid.timestamp).toLocaleString()}
//           </li>
//         ))
//       )}
//     </ul>
//   </div>
// )}
//
//     </div>
//   );
// };
//
// export default AdminDashboard;

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// axios.defaults.withCredentials = true;
//
// const AdminDashboard = () => {
//   const [auctions, setAuctions] = useState([]);
//   const [visibleBids, setVisibleBids] = useState({});
//   const [bidHistory, setBidHistory] = useState({});
//   const [newAuction, setNewAuction] = useState({
//     title: '',
//     description: '',
//     startingBid: 0,
//     expiresAt: ''
//   });
//   const [status, setStatus] = useState('');
//
//   const fetchAuctions = () => {
//     axios
//       .get("https://auction-backend-wug0.onrender.com/api/auctions", { withCredentials: true })
//       .then((res) => setAuctions(res.data))
//       .catch(() => {
//         alert("Access denied or session expired");
//         window.location.href = "/admin-login";
//       });
//   };
//
//   useEffect(() => {
//     fetchAuctions();
//   }, []);
//
//   useEffect(() => {
//     if (status) {
//       const timeout = setTimeout(() => setStatus(""), 5000);
//       return () => clearTimeout(timeout);
//     }
//   }, [status]);
//
//   const handleCreate = async () => {
//     try {
//       if (!newAuction.title || !newAuction.startingBid || !newAuction.expiresAt) {
//         return setStatus("Please fill all required fields.");
//       }
//
//       await axios.post("https://auction-backend-wug0.onrender.com/api/auctions", newAuction, {
//         withCredentials: true,
//       });
//
//       setStatus("✅ Auction created successfully!");
//       setNewAuction({ title: '', description: '', startingBid: 0, expiresAt: '' });
//       fetchAuctions();
//     } catch (err) {
//       setStatus("❌ " + (err.response?.data || "Error creating auction"));
//     }
//   };
//
//   const viewBidHistory = async (auctionId) => {
//     const isVisible = visibleBids[auctionId];
//     if (isVisible) {
//       setVisibleBids((prev) => ({ ...prev, [auctionId]: false }));
//       return;
//     }
//
//     try {
//       const res = await axios.get(`https://auction-backend-wug0.onrender.com/api/auctions/${auctionId}/bids`, {
//         withCredentials: true
//       });
//       setVisibleBids((prev) => ({ ...prev, [auctionId]: true }));
//       setBidHistory((prev) => ({ ...prev, [auctionId]: res.data }));
//     } catch (err) {
//       setStatus("❌ Failed to load bid history");
//     }
//   };
//
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`https://auction-backend-wug0.onrender.com/api/auctions/${id}`, {
//         withCredentials: true,
//       });
//       setStatus("🗑️ Auction deleted");
//       fetchAuctions();
//     } catch (err) {
//       setStatus("❌ " + (err.response?.data || "Error deleting auction"));
//     }
//   };
//
//   return (
//     <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
//       <h2>🛠️ Admin Dashboard</h2>
//       {status && <p style={{ color: "blue" }}>{status}</p>}
//
//       <h3>Create New Auction</h3>
//       <input
//         placeholder="Title"
//         value={newAuction.title}
//         onChange={(e) => setNewAuction({ ...newAuction, title: e.target.value })}
//         style={{ width: "100%", marginBottom: 8 }}
//       />
//       <textarea
//         placeholder="Description"
//         value={newAuction.description}
//         onChange={(e) => setNewAuction({ ...newAuction, description: e.target.value })}
//         style={{ width: "100%", marginBottom: 8 }}
//       />
//       <input
//         type="number"
//         placeholder="Starting Bid"
//         value={newAuction.startingBid}
//         onChange={(e) => setNewAuction({ ...newAuction, startingBid: Number(e.target.value) })}
//         style={{ width: "100%", marginBottom: 8 }}
//       />
//       <input
//         type="datetime-local"
//         placeholder="Expiry Date"
//         value={newAuction.expiresAt}
//         onChange={(e) => setNewAuction({ ...newAuction, expiresAt: e.target.value })}
//         style={{ width: "100%", marginBottom: 12 }}
//       />
//
//       <button onClick={handleCreate}>➕ Create Auction</button>
//
//       <h3 style={{ marginTop: 40 }}>Existing Auctions</h3>
//       {auctions.length === 0 ? (
//         <p>No auctions available</p>
//       ) : (
//         <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
//           {auctions.map((a) => (
//             <li key={a._id} style={{ borderBottom: "1px solid #ccc", marginBottom: 15, paddingBottom: 10 }}>
//               <strong>{a.title}</strong><br />
//               💰 Starting at: ${a.startingBid}<br />
//               📝 {a.description}<br />
//               🕒 Expires: {new Date(a.expiresAt).toLocaleString()}<br />
//               <button onClick={() => handleDelete(a._id)} style={{ marginTop: 6 }}>Delete</button>
//               <button onClick={() => viewBidHistory(a._id)} style={{ marginLeft: 10 }}>
//                 {visibleBids[a._id] ? "🔽 Hide Bids" : "📊 View Bids"}
//               </button>
//
//               {visibleBids[a._id] && (
//                 <div style={{ marginTop: 10, paddingLeft: 10 }}>
//                   <h4>📜 Bid History</h4>
//                   <ul style={{ listStyle: "none", padding: 0 }}>
//                     {bidHistory[a._id]?.length === 0 ? (
//                       <li>No bids yet</li>
//                     ) : (
//                       bidHistory[a._id].map((bid, idx) => (
//                         <li key={idx}>
//                           🧑 {bid.bidder} - 💰 ${bid.amount} - 🕒 {new Date(bid.timestamp).toLocaleString()}
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };
//
// export default AdminDashboard;


import { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

const AdminDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [visibleBids, setVisibleBids] = useState({});
  const [bidHistory, setBidHistory] = useState({});
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

  useEffect(() => {
    if (status) {
      const timeout = setTimeout(() => setStatus(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [status]);

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

  const viewBidHistory = async (auctionId) => {
    const isVisible = visibleBids[auctionId];
    if (isVisible) {
      setVisibleBids(prev => ({ ...prev, [auctionId]: false }));
      return;
    }

    try {
      const res = await axios.get(`https://auction-backend-wug0.onrender.com/api/admin/auctions/${auctionId}/bids`, {
        withCredentials: true
      });
      setVisibleBids(prev => ({ ...prev, [auctionId]: true }));
      setBidHistory(prev => ({ ...prev, [auctionId]: res.data }));
    } catch (err) {
      setStatus("❌ Failed to load bid history");
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

  const slideStyle = (isVisible) => ({
    maxHeight: isVisible ? '500px' : '0px',
    overflow: 'hidden',
    transition: 'max-height 0.5s ease',
    paddingLeft: isVisible ? '10px' : '0px',
    marginTop: isVisible ? '10px' : '0px'
  });

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
      {auctions.length === 0 ? (
        <p>No auctions available</p>
      ) : (
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {auctions.map((a) => {
            const isVisible = visibleBids[a._id];
            return (
              <li key={a._id} style={{ borderBottom: "1px solid #ccc", marginBottom: 15, paddingBottom: 10 }}>
                <strong>{a.title}</strong><br />
                💰 Starting at: ${a.startingBid}<br />
                📝 {a.description}<br />
                🕒 Expires: {new Date(a.expiresAt).toLocaleString()}<br />
                <button onClick={() => handleDelete(a._id)} style={{ marginTop: 6 }}>Delete</button>
                <button onClick={() => viewBidHistory(a._id)} style={{ marginLeft: 10 }}>
                  {isVisible ? "🔽 Hide Bids" : "📊 View Bids"}
                </button>

                <div style={slideStyle(isVisible)}>
                  <h4>📜 Bid History</h4>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {!bidHistory[a._id] || bidHistory[a._id].length === 0 ? (
                      <li>No bids yet</li>
                    ) : (
                      bidHistory[a._id].map((bid, idx) => (
                        <li key={idx}>
  🧑                       {bid.bidder.name} ({bid.bidder.email}) - 💰 ${bid.amount} - 🕒 {new Date(bid.timestamp).toLocaleString()}
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
    </div>
  );
};

export default AdminDashboard;
