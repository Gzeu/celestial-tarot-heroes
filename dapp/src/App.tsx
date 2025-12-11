import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { TarotForgePage } from './pages/TarotForgePage';
import { MyHeroesPage } from './pages/MyHeroesPage';
import { QuestsPage } from './pages/QuestsPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <DappProvider
        environment="devnet"
        customNetworkConfig={{
          name: 'devnet',
          apiTimeout: 6000,
          walletConnectV2ProjectId: '9b1a9564f91cb6593179c0fcd6c15c14',
        }}
      >
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/forge" element={<TarotForgePage />} />
            <Route path="/my-heroes" element={<MyHeroesPage />} />
            <Route path="/quests" element={<QuestsPage />} />
            <Route path="/unlock" element={<div className="container"><div className="card" style={{marginTop: '2rem', textAlign: 'center', padding: '3rem'}}><h2>Connect Your Wallet</h2><p>Use xPortal browser extension or xPortal mobile app to connect.</p></div></div>} />
          </Routes>
        </Layout>
      </DappProvider>
    </Router>
  );
};

export default App;
