import React, { useState, useEffect } from 'react';
import { connectWallet, registerInvestor, checkInvestorRegistration, getWalletBalance } from './services';
import { investInToken } from './uniswapService';
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
    const wallet = await connectWallet();
    if (wallet) {
      setWalletAddress(wallet);
    } else {
      setWalletAddress('Verbindung fehlgeschlagen');
    }
  };

  const handleRegisterInvestor = async () => {
    if (!walletAddress) {
      alert('Bitte verbinde zuerst deine Wallet.');
      return;
    }
    if (!referrerId) {
      alert('Kein Referrer gefunden. Bitte nutze einen gültigen Referral-Link.');
      return;
    }
    try {
      await registerInvestor(walletAddress, referrerId);
      setRegistrationStatus('Erfolgreich als Investor registriert!');
      setIsRegistered(true);
    } catch (error) {
      setRegistrationStatus('Fehler bei der Registrierung.');
    }
  };

  const handleInvest = async () => {
    console.log('Investition gestartet...');
    if (!walletAddress) {
        alert('Bitte verbinde zuerst deine Wallet.');
        console.log('Fehler: Wallet nicht verbunden');
        return;
    }
    if (!investmentAmount) {
        alert('Bitte gib einen Betrag ein.');
        console.log('Fehler: Kein Investitionsbetrag eingegeben');
        return;
    }
    console.log(`Investitionsbetrag: ${investmentAmount} ETH`);
    try {
        await investInToken(walletAddress, investmentAmount);
        alert('Investition erfolgreich!');
        console.log('Investition erfolgreich abgeschlossen');
    } catch (error) {
        console.error('Fehler bei der Investition:', error);
        alert('Fehler bei der Investition.');
    }
  };


  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Investorregistrierung</h1>
      <button onClick={handleConnectWallet} style={{ padding: '10px 20px', fontSize: '16px', margin: '10px' }}>
        Mit MetaMask verbinden
      </button>
      {walletAddress && <p>Verbunden mit Wallet: {walletAddress}</p>}
      {walletBalance && <p>ETH-Bestand: {walletBalance} ETH</p>}

      {!isRegistered ? (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleRegisterInvestor} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Als Investor registrieren
          </button>
          {registrationStatus && <p>{registrationStatus}</p>}
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <h2>Investieren</h2>
          <input
            type="number"
            placeholder="Betrag in ETH"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            style={{ padding: '10px', fontSize: '16px', margin: '10px' }}
          />
          <button onClick={handleInvest} style={{ padding: '10px 20px', fontSize: '16px' }}>
            In AchimCoin investieren
          </button>
        </div>
      )}
    </div>
  );
}

export default InvestorRegistration;
