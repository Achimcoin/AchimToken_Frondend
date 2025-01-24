import React, { useState } from 'react';

// Funktion für die Wallet-Verbindung
export const connectWallet = async (): Promise<string | null> => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });
      return accounts[0];
    } catch (error) {
      console.error('Fehler beim Verbinden mit der Wallet:', error);
      return null;
    }
  } else {
    alert('Bitte MetaMask installieren!');
    return null;
  }
};

// Hauptkomponente
const WalletAddress: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    const address = await connectWallet();
    if (address) {
      setWalletAddress(address);

      // API-Aufruf zum Speichern der Wallet-Adresse
      await saveWalletAddress(address);
    }
  };

  const saveWalletAddress = async (walletAddress: string) => {
    try {
      const response = await fetch('https://api.achim.group/api/investor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          referrerId: null, // Null, wenn keine Referrer-ID vorhanden ist
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
      <button onClick={handleConnect}>Mit Wallet verbinden</button>
      {walletAddress && <p>Verbunden mit: {walletAddress}</p>}
    </div>
  );
};

export default WalletAddress; // Standardexport der Komponente
