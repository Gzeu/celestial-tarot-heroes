# Celestial Tarot Heroes – GameFi on MultiversX

🎮 **A blockchain RPG where mystical heroes bound to Tarot arcana and celestial planets embark on epic quests.**

![MultiversX](https://img.shields.io/badge/MultiversX-Devnet-23F7DD?style=for-the-badge)
![Rust](https://img.shields.io/badge/Rust-Smart_Contract-orange?style=for-the-badge&logo=rust)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![CI](https://github.com/Gzeu/celestial-tarot-heroes/workflows/CI/badge.svg)

## 📍 Project Status

**Current Version:** v0.2.0 (Ready for Devnet Testing) | **Last Updated:** Dec 11, 2025

### ✅ Completed
- [x] Full smart contract implementation (v2.0) with advanced game mechanics
- [x] MVP smart contract (simplified for rapid testing)
- [x] dApp fully integrated with real contract queries and transactions
- [x] Comprehensive test suite for MVP contract
- [x] Technical documentation (Architecture, API reference)
- [x] CI/CD pipeline (GitHub Actions)
- [x] Deployment automation scripts
- [x] ESLint + Prettier setup

### 🚀 Ready to Deploy
- [ ] Deploy MVP contract to Devnet
- [ ] Deploy Full v2.0 contract to Devnet
- [ ] Test complete user flow (summon → quest → levelup)
- [ ] Record video tutorial

### 📋 Backlog (Post-Launch)
- [ ] Generate NFT artwork (planets + tarot cards)
- [ ] Advanced UI animations
- [ ] Leaderboard microservice
- [ ] Marketplace integration
- [ ] Mainnet deployment

---

## 🚀 Quick Start

### Option 1: Deploy MVP (Recommended for Testing)

**Perfect for:** Quick validation of core gameplay mechanics

```bash
git clone https://github.com/Gzeu/celestial-tarot-heroes.git
cd celestial-tarot-heroes

# Deploy MVP contract
chmod +x deploy-mvp.sh
./deploy-mvp.sh
# Note the contract address output

# Run dApp
cd dapp
echo "REACT_APP_CONTRACT_ADDRESS=erd1qqqqqq..." > .env
npm install
npm start
```

📖 **See [MVP.md](./MVP.md) for detailed MVP documentation**

**MVP Features:**
- ✨ Single hero type (Sun + The Fool)
- 🎯 One quest (100 XP reward)
- 📈 Simple leveling (100 XP = Level 2)
- ⚡ Fast deployment (<2 min)
- 💰 Low cost (0.05 EGLD summon)

### Option 2: Deploy Full Version

**Perfect for:** Complete feature experience

```bash
cd contracts/celestial-heroes
sc-meta all build

mxpy contract deploy \
  --bytecode=output/celestial-heroes.wasm \
  --pem=~/wallet.pem \
  --gas-limit=60000000 \
  --chain=D \
  --proxy=https://devnet-gateway.multiversx.com \
  --send
```

**Full Features:**
- 🌍 10 Planets with unique stat modifiers
- 🃏 22 Tarot Arcana combinations (462 unique heroes!)
- ⚔️ 10 Quest tiers (difficulty 5-150)
- 🎲 Success/fail mechanics with RNG
- ⏱️ Quest cooldown system (50 blocks)
- 💎 Treasury and sustainability

---

## 📊 Version Comparison

| Feature | MVP | Full v2.0 |
|---------|-----|----------|
| **Planets** | 1 (Sun) | 10 (all celestial bodies) |
| **Arcana** | 1 (The Fool) | 22 (complete Major Arcana) |
| **Hero Combinations** | 1 | 462 unique builds |
| **Quests** | 1 tier | 10 progressive tiers |
| **XP System** | Linear (100) | Exponential (level²×50) |
| **Quest Cooldown** | None | 50 blocks (~5 min) |
| **Success/Fail** | Guaranteed | Chance-based with luck |
| **Stat Variance** | Fixed | +0-7 RNG |
| **Treasury** | No | Yes |
| **Rename Feature** | No | Yes (0.01 EGLD) |
| **Summon Cost** | 0.05 EGLD | 0.1 EGLD |
| **Contract Size** | ~3KB | ~12KB |
| **Deploy Time** | <1 min | ~3 min |
| **Gas (summon)** | ~1.5M | ~3M |
| **Recommended For** | Testing & Validation | Full Experience |

---

## 🌟 Features

### Smart Contract (Rust)

#### Full Version Highlights
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
- 👥 **My Heroes** - NFT gallery with real-time data from blockchain
- 🗺️ **Epic Quests** - 10 quest cards with difficulty, rewards, and success rate calculator
- 🎨 **Polished UI/UX** - Dark theme with cosmic gradients, smooth animations
- 🔗 **Full Integration** - Real contract queries + transaction handling via MultiversX SDK

---

## 🎯 Game Mechanics

### Hero Stats Formula (Full Version)
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

---

## 📚 Documentation

- **[MVP Guide](./MVP.md)** - Minimal viable product documentation
- **[Architecture](./docs/ARCHITECTURE.md)** - System design and data flow
- **[API Reference](./docs/API.md)** - Complete endpoint documentation
- **[TODO List](./TODO.md)** - Development roadmap and task tracking

---

## 🛠️ Development

### Run Tests

```bash
# MVP Contract Tests
cd contracts/celestial-heroes-mvp
cargo test

# Full Contract Tests (coming soon)
cd contracts/celestial-heroes
cargo test

# dApp Type Check
cd dapp
npx tsc --noEmit
```

### Local Development

```bash
# Start dApp
cd dapp
npm install
npm start  # http://localhost:3000

# Build contracts
cd contracts/celestial-heroes-mvp
sc-meta all build
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Rust best practices for smart contracts
- Use TypeScript for dApp code
- Write tests for new features
- Update documentation
- Run `cargo fmt` and `prettier` before committing

---

## 📜 License

MIT License - see [LICENSE](./LICENSE) file for details

---

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/Gzeu/celestial-tarot-heroes/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Gzeu/celestial-tarot-heroes/discussions)
- **MultiversX**: [Discord](https://discord.gg/multiversx)
- **Updates**: Watch this repo for latest changes

---

## 🙏 Acknowledgments

- Built for the [MultiversX Builders Hub](https://multiversx.com/builders)
- Inspired by classic RPG mechanics and Tarot mysticism
- Powered by MultiversX blockchain technology

---

**Built with ✨ for the MultiversX ecosystem**

[MultiversX](https://multiversx.com) | [Builders Hub](https://multiversx.com/builders-hub) | [Documentation](https://docs.multiversx.com)
