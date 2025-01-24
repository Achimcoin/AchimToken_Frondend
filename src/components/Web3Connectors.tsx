import styles from '../styles/Connectors.module.css';
import { connectors, getConnectorName, Web3Connector } from '../connectors';
import { useCallback } from 'react';
import { connectWallet } from './WalletAddress'; // Funktion korrekt importiert

function Connector({
  web3Connector,
  setWalletAddress,
}: {
  web3Connector: Web3Connector;
  setWalletAddress: (address: string | null) => void;
}) {
  const [connector, hooks] = web3Connector;
  const isActive = hooks.useIsActive();

  const onClick = useCallback(async () => {
    if (isActive) {
      connector.deactivate();
      setWalletAddress(null);
    } else {
      connectors.forEach(([connector]) => connector.deactivate());
      await connector.activate();

      const address = await connectWallet(); // Wallet-Adresse abrufen
      if (address) {
        setWalletAddress(address);
      }
    }
  }, [connector, isActive, setWalletAddress]);

  return (
    <div className={styles.connector}>
      <label>{getConnectorName(connector)}</label>
      <button onClick={onClick}>{isActive ? 'Disconnect' : 'Connect'}</button>
      <svg
        className={[styles.status, isActive && styles.active].join(' ')}
        viewBox="0 0 2 2"
      >
        <circle cx={1} cy={1} r={1} />
      </svg>
    </div>
  );
}

export default function Web3Connectors({
  setWalletAddress,
}: {
  setWalletAddress: (address: string | null) => void;
}) {
  return (
    <div className={styles.connectors}>
      {connectors.map((web3Connector, index) => (
        <Connector
          key={index}
          web3Connector={web3Connector}
          setWalletAddress={setWalletAddress}
        />
      ))}
    </div>
  );
}
