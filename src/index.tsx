import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import WalletAddress from './components/WalletAddress';

ReactDOM.render(
  <React.StrictMode>
    <div>
      <WalletAddress />
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
