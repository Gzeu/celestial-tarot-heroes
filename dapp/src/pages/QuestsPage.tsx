import React, { useState, useEffect } from 'react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { CONTRACT_ADDRESS, QUEST_DATA } from '../config';
import { getHeroesByOwner, getHero, canQuest as checkCanQuest, Hero } from '../hooks/useContract';
import { motion } from 'framer-motion';
import './QuestsPage.css';

export const QuestsPage: React.FC = () => {
  const { address } = useGetAccountInfo();
  const [selectedHero, setSelectedHero] = useState<number | null>(null);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [questEligibility, setQuestEligibility] = useState<{ [heroId: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    if (address) {
      loadHeroes();
    }
  }, [address]);

  useEffect(() => {
    if (heroes.length > 0) {
      checkQuestEligibility();
    }
  }, [heroes]);

  const loadHeroes = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const heroIds = await getHeroesByOwner(address);
      const heroDataPromises = heroIds.map(id => getHero(id));
      const heroData = await Promise.all(heroDataPromises);
      const validHeroes = heroData.filter((h): h is Hero => h !== null);
      setHeroes(validHeroes);
      
      if (validHeroes.length > 0 && !selectedHero) {
        setSelectedHero(validHeroes[0].id);
      }
    } catch (error) {
      console.error('Failed to load heroes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkQuestEligibility = async () => {
    const eligibility: { [heroId: number]: boolean } = {};
    for (const hero of heroes) {
      eligibility[hero.id] = await checkCanQuest(hero.id);
    }
    setQuestEligibility(eligibility);
  };

  const handleQuest = async (questId: number) => {
    if (!selectedHero) {
      alert('Please select a hero first');
      return;
    }

    if (!questEligibility[selectedHero]) {
      alert('Your hero is resting. Please wait before the next quest.');
      return;
    }

    setTxLoading(true);
    try {
      await sendTransactions({
        transactions: [{
          value: '0',
          data: `quest@${selectedHero.toString(16).padStart(16, '0')}@${questId.toString(16).padStart(8, '0')}`,
          receiver: CONTRACT_ADDRESS,
          gasLimit: 10000000,
        }],
        callbackRoute: '/my-heroes',
      });
      
      setTimeout(() => {
        loadHeroes();
        checkQuestEligibility();
      }, 3000);
    } catch (error) {
      console.error('Quest failed:', error);
    } finally {
      setTxLoading(false);
    }
  };

  const calculateSuccessChance = (questDifficulty: number, hero: Hero) => {
    const heroPower = hero.strength + hero.wisdom + hero.luck;
    const threshold = questDifficulty * 10;
    const baseChance = (heroPower / threshold) * 100;
    const chance = Math.min(95, Math.max(10, baseChance));
    return Math.round(chance);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="container">
        <div className="empty-state card">
          <h2>🔒 Wallet Not Connected</h2>
          <p>Connect your wallet to embark on quests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container quests-page">
      <h1 className="page-title">Epic Quests</h1>
      <p className="page-subtitle">Send your heroes on dangerous quests to gain XP and rewards</p>

      <div className="quest-layout">
        <div className="hero-selector card">
          <h2>Select Hero</h2>
          {heroes.length === 0 ? (
            <p className="empty-message">No heroes available. Summon one first!</p>
          ) : (
            <div className="hero-list">
              {heroes.map((hero) => (
                <div
                  key={hero.id}
                  className={`hero-item ${
                    selectedHero === hero.id ? 'selected' : ''
                  } ${
                    !questEligibility[hero.id] ? 'resting' : ''
                  }`}
                  onClick={() => questEligibility[hero.id] && setSelectedHero(hero.id)}
                >
                  <div>
                    <div className="hero-item-name">{hero.name}</div>
                    <div className="hero-item-level">Level {hero.level}</div>
                  </div>
                  {!questEligibility[hero.id] && <span className="resting-badge">💤 Resting</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="quests-grid">
          {QUEST_DATA.map((quest, index) => {
            const selectedHeroData = heroes.find(h => h.id === selectedHero);
            const successChance = selectedHeroData ? calculateSuccessChance(quest.difficulty, selectedHeroData) : 0;
            const canAttempt = selectedHeroData && questEligibility[selectedHero!];

            return (
              <motion.div
                key={quest.id}
                className={`card quest-card ${!canAttempt ? 'disabled' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="quest-icon">{quest.icon}</div>
                <h3>{quest.name}</h3>
                <p className="quest-description">{quest.description}</p>

                <div className="quest-info">
                  <div className="info-row">
                    <span>Difficulty</span>
                    <span className="difficulty-badge" style={{ background: `rgba(239, 68, 68, ${quest.difficulty / 200})` }}>
                      {quest.difficulty}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>Base XP</span>
                    <span className="xp-value">{quest.baseXp}</span>
                  </div>
                  {selectedHero && selectedHeroData && (
                    <div className="info-row">
                      <span>Success Rate</span>
                      <span className={`success-rate ${
                        successChance > 70 ? 'high' : successChance > 40 ? 'medium' : 'low'
                      }`}>
                        {successChance}%
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleQuest(quest.id)}
                  disabled={txLoading || !canAttempt}
                  className="btn btn-primary btn-quest"
                >
                  {txLoading ? 'Embarking...' : 'Start Quest'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
