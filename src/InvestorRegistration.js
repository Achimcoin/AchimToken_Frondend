import React, { useState, useEffect } from 'react';
import { connectWallet, registerInvestor, checkInvestorRegistration, getWalletBalance } from './services';
import { useSearchParams } from 'react-router-dom';
import SwapWidget from './components/SwapWidget';

function InvestorRegistration() {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get('ref'); // Referrer-ID aus der URL
  const [isRegistered, setIsRegistered] = useState(false); // Status der Registrierung

  useEffect(() => {
    if (walletAddress) {
      (async () => {
        const isInvestor = await checkInvestorRegistration(walletAddress);
        setIsRegistered(isInvestor);

        const balance = await getWalletBalance(walletAddress);
        setWalletBalance(balance);
      })();
    }
  }, [walletAddress]);

  const handleConnectWallet = async () => {
    try {
      const wallet = await connectWallet();
      setWalletAddress(wallet);

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

      {walletAddress && isRegistered && <SwapWidget referrerId={referrerId} />}
    </div>
  );
}

export default InvestorRegistration;
