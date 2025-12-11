import React from 'react';
import { Link } from 'react-router-dom';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { logout } from '@multiversx/sdk-dapp/utils';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { address } = useGetAccountInfo();

  const handleLogout = () => {
    logout('/');  
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="nav-brand">
              ✨ Celestial Tarot Heroes
            </Link>
            
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/forge" className="nav-link">Forge</Link>
              <Link to="/my-heroes" className="nav-link">My Heroes</Link>
              <Link to="/quests" className="nav-link">Quests</Link>
            </div>

            <div className="nav-wallet">
              {address ? (
                <div className="wallet-info">
                  <span className="wallet-address">{formatAddress(address)}</span>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Disconnect
                  </button>
                </div>
              ) : (
                <Link to="/unlock" className="btn btn-primary btn-sm">
                  Connect Wallet
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="container">
          <p>Built with ✨ on MultiversX | <a href="https://github.com/Gzeu/celestial-tarot-heroes" target="_blank" rel="noopener noreferrer">GitHub</a></p>
        </div>
      </footer>
    </div>
  );
};
