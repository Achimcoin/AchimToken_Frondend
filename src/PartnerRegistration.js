import React, { useState } from 'react';
import { connectWallet, registerPartner } from './services';

function PartnerRegistration() {
  const [walletAddress, setWalletAddress] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [dashboardLink, setDashboardLink] = useState('');

  const handleConnectWallet = async () => {
    const wallet = await connectWallet();
    setWalletAddress(wallet || 'Verbindung fehlgeschlagen');
  };

  const handleRegisterPartner = async () => {
    if (!walletAddress) {
      alert('Bitte verbinde zuerst deine Wallet.');
      return;
    }
    try {
      const { partnerReferralLink, dashboardLink } = await registerPartner(walletAddress);
      setRegistrationStatus('Erfolgreich registriert!');
      setReferralLink(partnerReferralLink);
      setDashboardLink(dashboardLink);
    } catch (error) {
      setRegistrationStatus('Fehler bei der Registrierung.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Partnerregistrierung</h1>
      <button onClick={handleConnectWallet} style={{ padding: '10px 20px', fontSize: '16px', margin: '10px' }}>
        Mit MetaMask verbinden
      </button>
      {walletAddress && <p>Verbunden mit Wallet: {walletAddress}</p>}

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleRegisterPartner} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Als Partner registrieren
        </button>
        {registrationStatus && <p>{registrationStatus}</p>}
        {referralLink && (
          <p>
            Dein Referral-Link: <a href={referralLink} target="_blank" rel="noopener noreferrer">{referralLink}</a>
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

export default PartnerRegistration;
