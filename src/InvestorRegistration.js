import React, { useState, useEffect } from 'react';
import { connectWallet, registerInvestor, checkInvestorRegistration, getWalletBalance } from './services';
import { useSearchParams } from 'react-router-dom';

function InvestorRegistration() {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get('ref'); // Referrer-ID aus der URL
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isRegistered, setIsRegistered] = useState(false); // Status der Registrierung

  useEffect(() => {
    if (walletAddress) {
      // Prüfe, ob der Investor bereits registriert ist
      (async () => {
        const isInvestor = await checkInvestorRegistration(walletAddress);
        setIsRegistered(isInvestor);

        // Lade den Wallet-Bestand
        const balance = await getWalletBalance(walletAddress);
        setWalletBalance(balance);
      })();
    }
  }, [walletAddress]);

  const handleConnectWallet = async () => {
    try {
      const wallet = await connectWallet();
      setWalletAddress(wallet);

      // Automatische Registrierung nach Wallet-Verbindung
      if (!isRegistered) {
        const result = await registerInvestor(wallet, referrerId);
        setRegistrationStatus(result ? 'Erfolgreich registriert' : 'Registrierung fehlgeschlagen');
        setIsRegistered(result);
      }
    } catch (error) {
      console.error('Fehler bei der Wallet-Verbindung:', error);
      setRegistrationStatus('Fehler bei der Wallet-Verbindung');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Investor Registration</h1>

      <button onClick={handleConnectWallet} style={{ marginBottom: '20px' }}>
        {walletAddress ? 'Wallet verbunden' : 'MetaMask Wallet verbinden'}
      </button>

      {walletAddress && (
        <div>
          <p>Wallet-Adresse: {walletAddress}</p>
          <p>Wallet-Bestand: {walletBalance} ETH</p>
          <p>Registrierungsstatus: {registrationStatus}</p>
        </div>
      )}

      {walletAddress && isRegistered && (
        <iframe
          src={`https://achim.group/swap-widget?ref=${referrerId}`}
          title="Swap Widget"
          style={{ width: '100%', height: '600px', border: 'none', marginTop: '20px' }}
        />
      )}
    </div>
  );
}

export default InvestorRegistration;
