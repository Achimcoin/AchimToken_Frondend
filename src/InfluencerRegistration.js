import React, { useState } from 'react';
import { connectWallet, registerInfluencer } from './services';
import { useSearchParams } from 'react-router-dom';

function InfluencerRegistration() {
  const [walletAddress, setWalletAddress] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [dashboardLink, setDashboardLink] = useState('');
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get('ref'); // Referrer-ID aus der URL

  const handleConnectWallet = async () => {
    const wallet = await connectWallet();
    setWalletAddress(wallet || 'Verbindung fehlgeschlagen');
  };

  const handleRegisterInfluencer = async () => {
    if (!walletAddress) {
      alert('Bitte verbinde zuerst deine Wallet.');
      return;
    }
    if (!referrerId) {
      alert('Kein Referrer gefunden. Bitte nutze einen gültigen Referral-Link.');
      return;
    }
    try {
      const { influencerReferralLink, dashboardLink } = await registerInfluencer(walletAddress, referrerId);
      setRegistrationStatus('Erfolgreich als Influencer registriert!');
      setReferralLink(influencerReferralLink);
      setDashboardLink(dashboardLink);
    } catch (error) {
      setRegistrationStatus('Fehler bei der Registrierung.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Influencerregistrierung</h1>
      <button onClick={handleConnectWallet} style={{ padding: '10px 20px', fontSize: '16px', margin: '10px' }}>
        Mit MetaMask verbinden
      </button>
      {walletAddress && <p>Verbunden mit der Wallet: {walletAddress}</p>}

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleRegisterInfluencer} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Als Influencer registrieren
        </button>
        {registrationStatus && <p>{registrationStatus}</p>}
        {referralLink && (
          <p>
            Dein Influencer-Link: <a href={referralLink} target="_blank" rel="noopener noreferrer">{referralLink}</a>
          </p>
        )}
        {dashboardLink && (
          <p>
            Dein Dashboard: <a href={dashboardLink} target="_blank" rel="noopener noreferrer">{dashboardLink}</a>
          </p>
        )}
      </div>
    </div>
  );
}

export default InfluencerRegistration;
