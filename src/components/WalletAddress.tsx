import React from 'react';
import { saveWalletAddress } from '../utils/api'; // Importiere die Funktion

const connectWallet = async (): Promise<string | null> => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });

      const walletAddress = accounts[0];
      console.log('Verbunden mit Wallet:', walletAddress);

      // API-Aufruf zur Registrierung
      await saveWalletAddress(walletAddress);

      return walletAddress;
    } catch (error) {
      console.error('Fehler beim Verbinden mit der Wallet:', error);
      return null;
    }
  } else {
    alert('Bitte MetaMask installieren!');
    return null;
  }
};

export default connectWallet;
