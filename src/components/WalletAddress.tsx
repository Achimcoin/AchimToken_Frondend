import React from 'react';

// Funktion für die Wallet-Verbindung
export const connectWallet = async (): Promise<string | null> => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });
      return accounts[0]; // Gibt die erste Wallet-Adresse zurück
    } catch (error) {
      console.error('Fehler beim Verbinden mit der Wallet:', error);
      return null;
    }
  } else {
    alert('Bitte MetaMask installieren!');
    return null;
  }
};

// Hauptkomponente: Wallet-Adresse (falls benötigt, bleibt jedoch leer)
const WalletAddress: React.FC = () => {
  return null; // Diese Komponente bleibt leer, da die Logik über connectWallet erfolgt
};

export default WalletAddress;
