import React, { useState } from 'react';

const WalletAddress: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Funktion für die Wallet-Verbindung
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        const address = accounts[0];
        console.log('Verbunden mit Wallet:', address);
        setWalletAddress(address);

        // API-Aufruf zum Speichern der Wallet-Adresse
        await saveWalletAddress(address);
      } catch (error) {
        console.error('Fehler beim Verbinden mit der Wallet:', error);
      }
    } else {
      alert('Bitte MetaMask installieren!');
    }
  };

  // Funktion zum Speichern der Wallet-Adresse in der API
  const saveWalletAddress = async (walletAddress: string) => {
    try {
      const response = await fetch('https://api.achim.group/api/investor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          referrerId: null, // Null, wenn keine Referrer-ID übergeben wird
        }),
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Speichern: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API-Antwort:', data);
    } catch (error) {
      console.error('Fehler beim API-Aufruf:', error);
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>Mit Wallet verbinden</button>
      {walletAddress && <p>Verbunden mit: {walletAddress}</p>}
    </div>
  );
};

export default WalletAddress; // Standardexport der gesamten Komponente
