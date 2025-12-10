# Celestial Tarot Heroes – GameFi on MultiversX

🎮 **A blockchain RPG where mystical heroes bound to Tarot arcana and celestial planets embark on epic quests.**

![MultiversX](https://img.shields.io/badge/MultiversX-Devnet-23F7DD?style=for-the-badge)
![Rust](https://img.shields.io/badge/Rust-Smart_Contract-orange?style=for-the-badge&logo=rust)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## 🌟 Features

### Smart Contract (Rust)
- ⚡ **10 Celestial Planets** - Each with unique stat modifiers (Sun=Strength, Neptune=Wisdom, Venus=Luck)
- 🃏 **22 Tarot Arcana** - Synergistic bonuses with planets for diverse hero builds
- ⚔️ **Quest System** - 10 difficulty tiers with success/fail mechanics based on hero power
- ⏱️ **Quest Cooldown** - 50 blocks (~5 minutes) anti-spam protection
- 📈 **Exponential Progression** - XP requirement: Level² × 50 + Level × 100
- 🏆 **Max Level 100** - Balanced endgame with scaling stat increases
- 💰 **Treasury System** - Summon payments fund sustainable rewards
- ✏️ **Rename Heroes** - Pay 0.01 EGLD to customize your hero

### dApp (React + TypeScript)
- 🔮 **Tarot Forge** - Interactive planet selection + arcana picker with stat preview
- 👥 **My Heroes** - NFT gallery with detailed stats and progression tracking
- 🗺️ **Epic Quests** - 10 quest cards with difficulty, rewards, and success rate calculator
- 🎨 **Polished UI/UX** - Dark theme with cosmic gradients, smooth animations (framer-motion)
- 🔗 **Real Contract Integration** - Full MultiversX SDK integration with transaction handling

## 🚀 Quick Start

### Prerequisites
- Rust 1.75+
- Node.js 18+
- MultiversX CLI tools (mxpy, sc-meta)

### Deploy Smart Contract

```bash
cd contracts/celestial-heroes
sc-meta all build

# Deploy to Devnet
mxpy contract deploy \
  --bytecode=output/celestial-heroes.wasm \
  --pem=~/wallet.pem \
  --gas-limit=60000000 \
  --chain=D \
  --proxy=https://devnet-gateway.multiversx.com \
  --send
```

### Run dApp

```bash
cd dapp
npm install

# Set contract address
echo "REACT_APP_CONTRACT_ADDRESS=erd1qqqqqq..." > .env

npm start
# Open http://localhost:3000
```

## 🎯 Game Mechanics

### Hero Stats Formula
```
Strength = Planet_Strength_Mod + Arcana_Bonus + Variance(0-7)
Wisdom   = Planet_Wisdom_Mod + Arcana_Bonus + Variance(0-7)
Luck     = Planet_Luck_Mod + Arcana_Bonus + Variance(0-7)

Arcana_Bonus = floor(Arcana_ID / 2) + 5
```

**Example**: Sun (☀️) + The World (21)
- Strength: 15 + 15 + 4 = **34**
- Wisdom: 10 + 15 + 3 = **28**  
- Luck: 8 + 15 + 5 = **28**

### Quest Success Mechanics
```
Hero_Power = Strength + Wisdom + Luck
Success = (Hero_Power + Random(0-1000)) > (Quest_Difficulty × 10)

Rewards on Success:
- XP: Base_XP × (1 + Luck/50) × 1.5
- Bonus Stats: +Quest_Tier/3 to all stats

Rewards on Failure:
- XP: Base_XP × (1 + Luck/50) × 0.5
```

## 📊 Quest Tiers

| Quest | Difficulty | Base XP | Recommended Level |
|-------|-----------|---------|-------------------|
| 🌲 Mystic Grove | 5 | 50 | 1-5 |
| 💎 Crystal Caves | 10 | 100 | 5-10 |
| 🏛️ Shadow Temple | 18 | 300 | 10-15 |
| 🗼 Celestial Tower | 28 | 400 | 15-20 |
| 🐉 Dragon's Lair | 40 | 500 | 20-30 |
| 🌌 Void Nexus | 55 | 1200 | 30-45 |
| 🔮 Arcane Labyrinth | 75 | 1400 | 45-60 |
| 🔥 Phoenix Sanctum | 95 | 1600 | 60-75 |
| ⏳ Time Rift | 120 | 3150 | 75-90 |
| ✨ Cosmic Convergence | 150 | 3500 | 90-100 |

## 🛡️ Security Features

- ✅ Quest cooldown prevents spam
- ✅ Owner-only treasury withdrawal
- ✅ Input validation (name length, quest bounds)
- ✅ Hero ownership verification on all actions
- ✅ Existence checks before operations
- ✅ Max level cap prevents infinite scaling

## 📝 Smart Contract Endpoints

### Write Endpoints
- `summonHero(planet, arcana, name)` - Mint hero NFT (0.1 EGLD)
- `quest(hero_id, quest_id)` - Send hero on quest (returns QuestReward)
- `levelUp(hero_id)` - Consume XP to increase level
- `renameHero(hero_id, new_name)` - Change hero name (0.01 EGLD)
- `withdrawTreasury(amount)` - Owner only

### View Endpoints
- `getHero(hero_id)` - Returns Hero struct
- `getHeroesByOwner(address)` - Returns array of hero IDs
- `getRequiredXp(level)` - Calculate XP for next level
- `canQuest(hero_id)` - Check cooldown status
- `getQuestDifficulty(quest_id)` - Get difficulty value
- `getTreasuryBalance()` - Current treasury EGLD

## 🎨 Planet Stats Modifiers

| Planet | Icon | Strength | Wisdom | Luck |
|--------|------|----------|--------|------|
| ☀️ Sun | ☀️ | 15 | 10 | 8 |
| 🌙 Moon | 🌙 | 8 | 15 | 12 |
| ☿ Mercury | ☿ | 10 | 14 | 9 |
| ♀ Venus | ♀ | 9 | 12 | 14 |
| ♂ Mars | ♂ | 16 | 7 | 10 |
| ♃ Jupiter | ♃ | 13 | 13 | 11 |
| ♄ Saturn | ♄ | 11 | 15 | 8 |
| ♅ Uranus | ♅ | 12 | 11 | 13 |
| ♆ Neptune | ♆ | 9 | 16 | 11 |
| ♇ Pluto | ♇ | 14 | 9 | 14 |

## 🔮 Tech Stack

- **Blockchain**: MultiversX (Devnet)
- **Smart Contract**: Rust + multiversx-sc 0.50.0
- **Frontend**: React 18 + TypeScript
- **Styling**: Custom CSS with CSS variables
- **Animations**: Framer Motion
- **Wallet**: @multiversx/sdk-dapp 4.0+

## 📁 Project Structure

```
celestial-tarot-heroes/
├── contracts/
│   └── celestial-heroes/
│       ├── src/
│       │   └── lib.rs          # Main contract logic
│       ├── wasm/               # WASM build output
│       └── meta/               # Contract metadata
├── dapp/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── MyHeroesPage.tsx
│   │   │   ├── TarotForgePage.tsx
│   │   │   └── QuestsPage.tsx
│   │   ├── components/
│   │   │   └── Layout.tsx
│   │   ├── config.ts           # Quest/Planet/Arcana data
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## 🎮 Gameplay Flow

1. **Connect Wallet** - Use xPortal, DeFi Wallet, or Web Wallet
2. **Summon Hero** - Choose planet + arcana combination (0.1 EGLD)
3. **View Your Heroes** - Check stats, level, XP progress
4. **Select Quest** - Choose from 10 difficulty tiers
5. **Complete Quest** - Gain XP and stat bonuses (if successful)
6. **Level Up** - Spend XP to increase level and boost stats
7. **Repeat** - Progress to harder quests and reach level 100!

## 🌈 Future Enhancements

- [ ] NFT Marketplace integration
- [ ] PvP Arena battles
- [ ] Guild system for cooperative quests
- [ ] Leaderboard with seasonal rewards
- [ ] Hero equipment & items
- [ ] Special events with limited-time quests
- [ ] Achievement system with badges

## 📜 License

MIT

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Join MultiversX Discord
- Follow development updates

---

**Built with ✨ for the MultiversX ecosystem**

[MultiversX](https://multiversx.com) | [Builders Hub](https://multiversx.com/builders)
