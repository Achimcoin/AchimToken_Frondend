import type { NextPage } from 'next';
import Head from 'next/head';
import { FiGlobe } from 'react-icons/fi';
import Image from 'next/image';
import { SupportedLocale, SUPPORTED_LOCALES, SwapWidget } from '@uniswap/widgets';

// ↓↓↓ Don't forget to import the widgets' fonts! ↓↓↓
import '@uniswap/widgets/fonts.css';
// ↑↑↑

import styles from '../styles/Home.module.css';
import Web3Connectors from '../components/Web3Connectors';
import { useActiveProvider } from '../connectors';
import { useCallback, useRef, useState } from 'react';
import { JSON_RPC_URL } from '../constants';

const TOKEN_LIST = 'https://swap.achim.group/tokens.json';
const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';

const Home: NextPage = () => {
  // When a user clicks "Connect your wallet" in the SwapWidget, this callback focuses the connectors.
  const connectors = useRef<HTMLDivElement>(null);
  const focusConnectors = useCallback(() => connectors.current?.focus(), []);

  // The provider to pass to the SwapWidget.
  // This is a Web3Provider (from @ethersproject) supplied by @web3-react; see ./connectors.ts.
  const provider = useActiveProvider();

  // The locale to pass to the SwapWidget.
  // This is a value from the SUPPORTED_LOCALES exported by @uniswap/widgets.
  const [locale, setLocale] = useState<SupportedLocale>('en-US');
  const onSelectLocale = useCallback((e) => setLocale(e.target.value), []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Achimcoin</title>
        <meta name="description" content="Investieren Sie jetzt in Dubais Zukunft!" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>

      <div className={styles.i18n}>
        <label style={{ display: 'flex' }}>
          <FiGlobe />
        </label>
        <select onChange={onSelectLocale}>
          {SUPPORTED_LOCALES.map((locale) => (
            <option key={locale} value={locale}>
              {locale}
            </option>
          ))}
        </select>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>Achimcoin<br />Investieren Sie jetzt in Dubais Zukunft!</h1>

        <div className={styles.demo}>
          <div className={styles.connectors} ref={connectors} tabIndex={-1}>
            <Web3Connectors />
          </div>

          <div className={styles.widget}>
            <SwapWidget
              jsonRpcEndpoint={JSON_RPC_URL}
              tokenList={TOKEN_LIST}
              provider={provider}
              locale={locale}
              onConnectWallet={focusConnectors}
              defaultInputTokenAddress="NATIVE"
              defaultInputAmount="1"
              defaultOutputTokenAddress={UNI}
            />
          </div>
        </div>

        <hr className={styles.rule} />

        <div className={styles.documentationCards}>
          <div className={styles.card}>
            <Image src="/images/real_estate_future.jpg" alt="Real Estate Future" width={300} height={200} />
            <h2>Unlocking the Future of Real Estate: AchimCoin&apos;s Impact on Dubai&apos;s Market</h2>
            <p>
              Discover how AchimCoin is revolutionizing Dubai&apos;s real estate market by providing unparalleled investment opportunities and fostering sustainable growth.
            </p>
            <button className={styles.learnMoreButton}>Learn more</button>
          </div>
          <div className={styles.card}>
            <Image src="/images/real_estate_investing.jpg" alt="Real Estate Investing" width={300} height={200} />
            <h2>Navigating Growth with AchimCoin: A New Realm in Real Estate Investing</h2>
            <p>
              Explore the innovative solutions offered by AchimCoin, paving the way for a new era in real estate investments in one of the world&apos;s most dynamic cities.
            </p>
            <button className={styles.learnMoreButton}>Learn more</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
