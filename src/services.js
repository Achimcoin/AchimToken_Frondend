import { config } from './config';
import { ethers } from 'ethers';

// Verbindung zur Wallet herstellen
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0]; // Gibt die erste Wallet-Adresse zurück
    } catch (error) {
      alert('Fehler bei der Wallet-Verbindung. Bitte versuche es erneut.');
      console.error('Wallet-Verbindung Fehler:', error);
      return null;
    }
  } else {
    alert('MetaMask ist nicht installiert. Bitte installiere MetaMask und versuche es erneut.');
    return null;
  }
};

// Partner registrieren
export const registerPartner = async (walletAddress) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/partner/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Fehler bei der Registrierung');
    }

    const data = await response.json();
    return {
      partnerReferralLink: data.partnerReferralLink,
      dashboardLink: data.dashboardLink,
    };
  } catch (error) {
    console.error('Fehler bei der Partnerregistrierung:', error);
    throw error;
  }
};

// Influencer registrieren
export const registerInfluencer = async (walletAddress, referrerId) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/influencer/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress, referrerId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Fehler bei der Registrierung');
    }

    const data = await response.json();
    return {
      influencerReferralLink: data.influencerReferralLink,
      dashboardLink: data.dashboardLink,
    };
  } catch (error) {
    console.error('Fehler bei der Influencerregistrierung:', error);
    throw error;
  }
};

// Investor registrieren
export const registerInvestor = async (walletAddress, referrerId) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/investor/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress, referrerId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Fehler bei der Registrierung');
    }

    const data = await response.json();
    alert('Erfolgreich als Investor registriert!');
    return data;
  } catch (error) {
    console.error('Fehler bei der Investorregistrierung:', error);
    throw error;
  }
};

// Wallet-Bestand abrufen
export const getWalletBalance = async (walletAddress) => {
  if (!window.ethereum) {
    alert('MetaMask ist nicht installiert. Bitte installiere MetaMask.');
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(walletAddress);
    return ethers.formatEther(balance); // ETH-Bestand formatieren
  } catch (error) {
    console.error('Fehler beim Abrufen des Wallet-Bestands:', error);
    throw error;
  }
};

// Überprüfung der Investor-Registrierung
export const checkInvestorRegistration = async (walletAddress) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/investor/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress }),
    });

    if (!response.ok) {
      throw new Error('Fehler beim Überprüfen der Registrierung.');
    }

    const data = await response.json();
    return data.isRegistered; // Erwartet: { isRegistered: true/false }
  } catch (error) {
    console.error('Fehler bei der Registrierungskontrolle:', error);
    return false;
  }
};
