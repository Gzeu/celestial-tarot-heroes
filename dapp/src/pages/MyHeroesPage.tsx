import React, { useState, useEffect } from 'react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { CONTRACT_ADDRESS, PLANET_DATA, ARCANA_DATA } from '../config';
import { getHeroesByOwner, getHero, getRequiredXp, Hero } from '../hooks/useContract';
import { motion } from 'framer-motion';
import './MyHeroesPage.css';

export const MyHeroesPage: React.FC = () => {
  const { address } = useGetAccountInfo();
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [requiredXp, setRequiredXp] = useState<{ [heroId: number]: number }>({});

  useEffect(() => {
    if (address) {
      loadHeroes();
    } else {
      setLoading(false);
    }
  }, [address]);

  const loadHeroes = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const heroIds = await getHeroesByOwner(address);
      const heroDataPromises = heroIds.map(id => getHero(id));
      const heroData = await Promise.all(heroDataPromises);
      const validHeroes = heroData.filter((h): h is Hero => h !== null);
      
      setHeroes(validHeroes);

      // Load required XP for each hero
      const xpData: { [heroId: number]: number } = {};
      for (const hero of validHeroes) {
        xpData[hero.id] = await getRequiredXp(hero.level);
      }
      setRequiredXp(xpData);
    } catch (error) {
      console.error('Failed to load heroes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelUp = async (heroId: number) => {
    setTxLoading(true);
    try {
      await sendTransactions({
        transactions: [{
          value: '0',
          data: `levelUp@${heroId.toString(16).padStart(16, '0')}`,
          receiver: CONTRACT_ADDRESS,
          gasLimit: 5000000,
        }],
        callbackRoute: '/my-heroes',
      });
      
      // Reload heroes after TX
      setTimeout(() => loadHeroes(), 3000);
    } catch (error) {
      console.error('Level up failed:', error);
    } finally {
      setTxLoading(false);
    }
  };

  const getPlanetData = (planetId?: number) => {
    if (planetId === undefined) return { name: 'Unknown', icon: '❓', color: '#666' };
    return PLANET_DATA[planetId] || { name: 'Unknown', icon: '❓', color: '#666' };
  };

  const getArcanaData = (arcanaId?: number) => {
    if (arcanaId === undefined) return { name: 'Unknown' };
    return ARCANA_DATA[arcanaId] || { name: 'Unknown' };
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your heroes...</p>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>🔒 Wallet Not Connected</h2>
          <p>Please connect your wallet to view your heroes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-heroes-page">
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        👥 My Heroes
      </motion.h1>
      <p className="page-subtitle">Your celestial warriors and their progression</p>

      {heroes.length === 0 ? (
        <div className="empty-state card">
          <h2>⭐ No Heroes Yet</h2>
          <p>Visit the Tarot Forge to summon your first hero!</p>
          <a href="/forge" className="btn btn-primary">Summon Hero</a>
        </div>
      ) : (
        <div className="heroes-grid">
          {heroes.map((hero, index) => {
            const planet = getPlanetData(hero.planet);
            const arcana = getArcanaData(hero.arcana);
            const xpNeeded = requiredXp[hero.id] || 100;
            const xpProgress = (hero.xp / xpNeeded) * 100;
            const canLevelUp = hero.xp >= xpNeeded;

            return (
              <motion.div
                key={hero.id}
                className="card hero-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="hero-header">
                  <div className="planet-badge" style={{ color: planet.color }}>
                    {planet.icon}
                  </div>
                  <div className="hero-title">
                    <h3>{hero.name}</h3>
                    <p className="hero-subtitle">
                      {arcana.name} × {planet.name}
                    </p>
                  </div>
                  <div className="level-badge">
                    Lv. {hero.level}
                  </div>
                </div>

                <div className="xp-section">
                  <div className="xp-bar">
                    <div className="xp-fill" style={{ width: `${xpProgress}%` }}></div>
                  </div>
                  <p className="xp-text">
                    {hero.xp} / {xpNeeded} XP
                  </p>
                </div>

                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-icon">⚔️</span>
                    <span className="stat-label">Strength</span>
                    <span className="stat-value">{hero.strength}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">📚</span>
                    <span className="stat-label">Wisdom</span>
                    <span className="stat-value">{hero.wisdom}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">🍀</span>
                    <span className="stat-label">Luck</span>
                    <span className="stat-value">{hero.luck}</span>
                  </div>
                </div>

                {hero.totalQuestsCompleted !== undefined && (
                  <div className="hero-stats-footer">
                    <small>🗡️ Quests: {hero.totalQuestsCompleted}</small>
                  </div>
                )}

                <button
                  onClick={() => handleLevelUp(hero.id)}
                  disabled={!canLevelUp || txLoading}
                  className={`btn btn-lg ${canLevelUp ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  {txLoading ? 'Leveling Up...' : canLevelUp ? '⬆️ Level Up' : `Need ${xpNeeded - hero.xp} more XP`}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
