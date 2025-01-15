import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import PartnerRegistration from './PartnerRegistration';
import InfluencerRegistration from './InfluencerRegistration';
import InvestorRegistration from './InvestorRegistration';

function App() {
  // Effekt, um sicherzustellen, dass der `#` gesetzt ist
  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '/'; // Setzt den Standard-Hash, wenn keiner vorhanden ist
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PartnerRegistration />} />
        <Route path="/influencer/register" element={<InfluencerRegistration />} />
        <Route path="/investor/register" element={<InvestorRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
