import React, { useState } from "react";
import EmailVerification from "./components/EmailVerification";
import LiveAuction from "./components/LiveAuction";

const App = () => {
  const [email, setEmail] = useState(null);

  return (
    <div>
      {!email ? <EmailVerification onVerified={setEmail} /> : <LiveAuction userEmail={email} />}
    </div>
  );
};

export default App;