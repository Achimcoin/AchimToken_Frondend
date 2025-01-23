import React, { useState, useEffect } from "react";
import { SwapWidget } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";
import { connectWallet, registerInvestor, checkInvestorRegistration, getWalletBalance } from "./services";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";

// Uniswap Widget-Konfiguration
const JSON_RPC_URL = "https://mainnet.infura.io/v3/6d1c7156ace64a7898ae5c5338286545";
const TOKEN_LIST = "https://swap.achim.group/tokens.json";

function InvestorRegistration() {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get("ref");
  const [isRegistered, setIsRegistered] = useState(false);
  const [locale, setLocale] = useState("en-US");

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
    const wallet = await connectWallet();
    if (wallet) {
      setWalletAddress(wallet);
    } else {
      alert("Fehler beim Verbinden der Wallet.");
    }
  };

  const handleRegisterInvestor = async () => {
    if (!walletAddress) {
      alert("Bitte verbinde zuerst deine Wallet.");
      return;
    }
    if (!referrerId) {
      alert("Kein Referrer gefunden. Bitte nutze einen gültigen Referral-Link.");
      return;
    }
    try {
      await registerInvestor(walletAddress, referrerId);
      setRegistrationStatus("Erfolgreich als Investor registriert!");
      setIsRegistered(true);
    } catch (error) {
      setRegistrationStatus("Fehler bei der Registrierung.");
    }
  };

  const handleLocaleChange = (e) => setLocale(e.target.value);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Helmet>
        <title>Achimcoin</title>
        <meta name="description" content="Investieren Sie jetzt in Dubais Zukunft!" />
      </Helmet>

      <h1>Investorregistrierung</h1>

      <div>
        <label>
          Sprache:
          <select value={locale} onChange={handleLocaleChange} style={{ marginLeft: "10px", padding: "5px" }}>
            <option value="en-US">English</option>
            <option value="de-DE">Deutsch</option>
          </select>
        </label>
      </div>

      {!walletAddress ? (
        <button onClick={handleConnectWallet} style={{ padding: "10px 20px", fontSize: "16px", margin: "10px" }}>
          Mit Wallet verbinden
        </button>
      ) : (
        <p>Verbunden mit Wallet: {walletAddress}</p>
      )}
      {walletBalance && <p>ETH-Bestand: {walletBalance} ETH</p>}

      {!isRegistered ? (
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleRegisterInvestor} style={{ padding: "10px 20px", fontSize: "16px" }}>
            Als Investor registrieren
          </button>
          {registrationStatus && <p>{registrationStatus}</p>}
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <div style={{ width: "420px", height: "500px", margin: "0 auto" }}>
            <SwapWidget
              jsonRpcEndpoint={JSON_RPC_URL}
              tokenList={TOKEN_LIST}
              locale={locale}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default InvestorRegistration;
