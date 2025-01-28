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

// Extrahiere die Referrer-ID aus der URL, auch bei Hash-Routing
const extractReferrerId = (): string | null => {
  try {
    // Falls Hash-Routing verwendet wird, extrahiere den Teil nach `#/`
    const hashIndex = window.location.href.indexOf('#/');
    const searchParams = hashIndex !== -1
      ? new URLSearchParams(window.location.href.substring(hashIndex + 2).split('?')[1])
      : new URLSearchParams(window.location.search);

    return searchParams.get('ref') || null;
  } catch (error) {
    console.error('Fehler beim Extrahieren der Referrer-ID:', error);
    return null;
  }
};

// Hauptkomponente: Wallet-Adresse
const WalletAddress: React.FC = () => {
  useEffect(() => {
    const handleWallet = async () => {
      const walletAddress = await connectWallet();
      if (walletAddress) {
        const isRegistered = await checkWalletRegistration(walletAddress);

        // Referrer-ID aus der URL extrahieren (Hash-Route oder regulär)
        const referrerId = extractReferrerId();

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

