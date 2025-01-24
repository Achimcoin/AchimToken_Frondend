import React, { useState, useEffect } from 'react';
import styles from '../styles/Connectors.module.css';
import { connectors, getConnectorName, Web3Connector } from '../connectors';
import { connectWallet, registerInvestor, checkInvestorRegistration, getWalletBalance } from './services';
import { useCallback } from 'react';

function Connector({ web3Connector }: { web3Connector: Web3Connector }) {
  const [connector, hooks] = web3Connector;
  const isActive = hooks.useIsActive();
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (walletAddress) {
      console.log('Wallet address updated:', walletAddress);
    }
  }, [walletAddress]);

  const onClick = useCallback(async () => {
    try {
      if (isActive) {
        connector.deactivate();
        setWalletAddress('');
      } else {
        connectors.forEach(([connector]) => connector.deactivate());
        await connector.activate();

        // Trigger API or database entry after successful activation
        const walletAddress = await connector.getAccount();
        if (walletAddress) {
          setWalletAddress(walletAddress);
          const referrerId = new URLSearchParams(window.location.search).get('ref') || null;

          // Call API or database function here using registerInvestor
          const isRegistered = await checkInvestorRegistration(walletAddress);
          if (!isRegistered) {
            await registerInvestor(walletAddress, referrerId || 'NULL');
          }

          const balance = await getWalletBalance(walletAddress);
          console.log('Wallet connected, registered, and balance retrieved:', walletAddress, balance);
        }
      }
    } catch (error) {
      console.error('Error during wallet connection:', error);
    }
  }, [connector, isActive]);

  return (
    <div className={styles.connector}>
      <label>{getConnectorName(connector)}</label>
      <button onClick={onClick}>
        {isActive ? 'Disconnect' : 'Connect'}
      </button>
      <svg
        className={[styles.status, isActive && styles.active].join(' ')}
        viewBox="0 0 2 2"
      >
        <circle cx="1" cy="1" r="1" />
      </svg>
    </div>
  );
}

export default Connector;
