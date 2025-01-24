import React, { useEffect } from 'react';
import axios from 'axios';

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

// Prüfen, ob die Wallet-Adresse registriert ist
const checkWalletRegistration = async (walletAddress: string): Promise<boolean> => {
  try {
    const response = await axios.post('https://api.achim.group/api/investor/check', { walletAddress });
    return response.data.isRegistered;
  } catch (error) {
    console.error('Fehler beim Überprüfen der Wallet-Registrierung:', error);
    return false;
  }
};

// Registriere die Wallet-Adresse
const registerWallet = async (walletAddress: string, referrerId: string | null): Promise<void> => {
  try {
    await axios.post('https://api.achim.group/api/investor/register', {
      walletAddress,
      referrerId,
    });
    console.log('Wallet erfolgreich registriert.');
  } catch (error) {
    console.error('Fehler bei der Registrierung der Wallet:', error);
  }
};

// Hauptkomponente: Wallet-Adresse
const WalletAddress: React.FC = () => {
  useEffect(() => {
    const handleWallet = async () => {
      const walletAddress = await connectWallet();
      if (walletAddress) {
        const isRegistered = await checkWalletRegistration(walletAddress);

        // URL-Parameter auslesen
        const urlParams = new URLSearchParams(window.location.search);
        const referrerId = urlParams.get('ref') || null;

        if (!isRegistered) {
          await registerWallet(walletAddress, referrerId);
        } else {
          console.log('Wallet ist bereits registriert.');
        }
      }
    };

    handleWallet();
  }, []);

  return null; // Keine sichtbare Darstellung nötig
};

export default WalletAddress;
