import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { getHeroCount } from '../hooks/useContract';
import { motion } from 'framer-motion';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { address } = useGetAccountInfo();
  const [totalHeroes, setTotalHeroes] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const count = await getHeroCount();
    setTotalHeroes(count);
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              ✨ Celestial Tarot Heroes ✨
            </h1>
            <p className="hero-description">
              A blockchain RPG where mystical heroes bound to Tarot arcana and celestial planets embark on epic quests.
              Summon unique heroes, complete challenging quests, and level up your warriors on the MultiversX blockchain.
            </p>
            <div className="hero-actions">
              {address ? (
                <>
                  <Link to="/forge" className="btn btn-primary btn-lg">
                    🔮 Summon Hero
                  </Link>
                  <Link to="/my-heroes" className="btn btn-secondary btn-lg">
                    👥 My Heroes
                  </Link>
                </>
              ) : (
                <Link to="/unlock" className="btn btn-primary btn-lg">
                  🔒 Connect Wallet to Start
                </Link>
              )}
            </div>
            <div className="hero-stats">
              <div className="stat-box">
                <div className="stat-number">{totalHeroes}</div>
                <div className="stat-label">Heroes Summoned</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">462</div>
                <div className="stat-label">Unique Combinations</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">10</div>
                <div className="stat-label">Epic Quests</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Game Features</h2>
          <div className="features-grid">
            <motion.div
              className="feature-card card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="feature-icon">🌍</div>
              <h3>10 Celestial Planets</h3>
              <p>Each planet grants unique stat modifiers. Choose wisely to build your perfect hero.</p>
            </motion.div>

            <motion.div
              className="feature-card card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="feature-icon">🃏</div>
              <h3>22 Tarot Arcana</h3>
              <p>Bind your hero to one of the 22 Major Arcana for mystical synergy bonuses.</p>
            </motion.div>

            <motion.div
              className="feature-card card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="feature-icon">⚔️</div>
              <h3>Progressive Quests</h3>
              <p>10 difficulty tiers with dynamic success rates based on hero power and luck.</p>
            </motion.div>

            <motion.div
              className="feature-card card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="feature-icon">📈</div>
              <h3>Exponential Growth</h3>
              <p>Level up your heroes with exponential XP scaling. Reach max level 100!</p>
            </motion.div>

            <motion.div
              className="feature-card card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="feature-icon">🔥</div>
              <h3>Quest Rewards</h3>
              <p>Gain XP and permanent stat bonuses on successful quests. Fail and still earn half XP.</p>
            </motion.div>

            <motion.div
              className="feature-card card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="feature-icon">💰</div>
              <h3>Sustainable Economy</h3>
              <p>Treasury system funds rewards. Fair summon costs with quest cooldowns.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2>Ready to Begin Your Journey?</h2>
            <p>Connect your MultiversX wallet and summon your first celestial hero today.</p>
            {!address ? (
              <Link to="/unlock" className="btn btn-primary btn-lg">
                Connect Wallet
              </Link>
            ) : (
              <Link to="/forge" className="btn btn-primary btn-lg">
                Summon Your First Hero
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};
