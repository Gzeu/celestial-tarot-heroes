# Celestial Tarot Heroes ⚔️🔮

> **A blockchain RPG where mystical heroes bound to Tarot arcana and celestial planets embark on epic quests on MultiversX**

[![MultiversX](https://img.shields.io/badge/MultiversX-Devnet-23F7DD?style=for-the-badge)](https://devnet-explorer.multiversx.com)
[![Rust](https://img.shields.io/badge/Rust-1.75+-orange?style=for-the-badge&logo=rust)](https://www.rust-lang.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![CI](https://github.com/Gzeu/celestial-tarot-heroes/workflows/CI/badge.svg)](https://github.com/Gzeu/celestial-tarot-heroes/actions)

---

## 📋 Table of Contents

- [Project Status](#-project-status)
- [Quick Start](#-quick-start)
- [Features](#-features)
- [Game Mechanics](#-game-mechanics)
- [Documentation](#-documentation)
- [Development](#%EF%B8%8F-development)
- [Contributing](#-contributing)
- [Support](#-support)

---

## 📊 Project Status

**Version:** `v0.2.0` | **Status:** Ready for Devnet Testing 🚀 | **Updated:** Dec 11, 2025

### ✅ Completed

- ✔️ **Smart Contracts** - MVP + Full v2.0 implementation
- ✔️ **dApp Integration** - Real blockchain queries & transactions
- ✔️ **Test Suite** - Comprehensive scenario testing
- ✔️ **Documentation** - Architecture, API, deployment guides
- ✔️ **CI/CD** - Automated testing via GitHub Actions
- ✔️ **Code Quality** - ESLint, Prettier, TypeScript strict mode

### 🎯 Next Milestones

- [ ] Deploy MVP to Devnet
- [ ] End-to-end testing (summon → quest → level up)
- [ ] Video tutorial recording
- [ ] NFT artwork generation
- [ ] Mainnet preparation

[📝 See full roadmap →](./TODO.md)

---

## 🚀 Quick Start

### Prerequisites

- **Rust** 1.75+ ([install](https://www.rust-lang.org/tools/install))
- **Node.js** 18+ ([install](https://nodejs.org))
- **MultiversX CLI** ([docs](https://docs.multiversx.com/sdk-and-tools/sdk-py/installing-mxpy))
- **Wallet** with Devnet EGLD ([faucet](https://devnet-wallet.multiversx.com))

---

### Option A: MVP Deployment (⚡ Fastest - 5 minutes)

**Best for:** Testing core mechanics quickly

```bash
# 1. Clone repository
git clone https://github.com/Gzeu/celestial-tarot-heroes.git
cd celestial-tarot-heroes

# 2. Deploy MVP contract
chmod +x deploy-mvp.sh
./deploy-mvp.sh
# ⚠️ Save the contract address output!

# 3. Configure & run dApp
cd dapp
echo "REACT_APP_CONTRACT_ADDRESS=erd1qqqqqq..." > .env
npm install
npm start

# 4. Open http://localhost:3000 and connect your wallet!
```

**MVP Includes:**
- 🌞 Single hero type (Sun + The Fool)
- 🎯 One quest (100 XP guaranteed)
- 📈 Simple leveling (100 XP → Level 2)
- 💰 Low cost (0.05 EGLD to summon)

📖 **[Read MVP Guide →](./MVP.md)**

---

### Option B: Full Version Deployment (🎮 Complete Experience)

**Best for:** Exploring all features

```bash
# 1. Build contract
cd contracts/celestial-heroes
sc-meta all build

# 2. Deploy to Devnet
mxpy contract deploy \
  --bytecode=output/celestial-heroes.wasm \
  --pem=~/wallet-devnet.pem \
  --gas-limit=60000000 \
  --chain=D \
  --proxy=https://devnet-gateway.multiversx.com \
  --send

# 3. Configure dApp
cd ../../dapp
echo "REACT_APP_CONTRACT_ADDRESS=<your-contract-address>" > .env
npm install
npm start
```

**Full Version Includes:**
- 🌍 **10 Planets** - Unique stat modifiers (Sun, Moon, Mars, etc.)
- 🃏 **22 Tarot Arcana** - The Fool to The World (462 combinations!)
- ⚔️ **10 Quest Tiers** - Difficulty scaling from 5 to 150
- 🎲 **Success/Fail Mechanics** - Based on hero power + luck RNG
- ⏱️ **Quest Cooldown** - 50 blocks (~5 minutes)
- 💎 **Treasury System** - Sustainable reward economy
- ✏️ **Rename Heroes** - Personalize for 0.01 EGLD

---

## 🎮 Features

### Smart Contract (Rust)

<table>
<tr>
<td width="50%">

#### Core Mechanics
- ⚡ Hero summoning with numerology
- 🎯 Quest system with 10 difficulty tiers
- 📊 Exponential XP progression
- 🏆 Max level 100 with stat scaling
- 🛡️ Ownership verification & security

</td>
<td width="50%">

#### Advanced Features
- 🌌 Planet/Arcana synergy bonuses
- 🎲 On-chain RNG for success rates
- ⏳ Quest cooldown (anti-spam)
- 💰 Treasury for sustainability
- 🔥 Permanent stat bonuses on success

</td>
</tr>
</table>

### dApp (React + TypeScript)

<table>
<tr>
<td width="50%">

#### User Interface
- 🏠 Animated landing page
- 🔮 Tarot Forge (hero creation)
- 👥 My Heroes gallery
- 🗺️ Quest browser with success rates
- 📱 Mobile-responsive design

</td>
<td width="50%">

#### Integration
- 🔗 Real blockchain queries
- 💳 Wallet connect (xPortal, DeFi)
- 🔄 Live transaction tracking
- 📊 Real-time stats updates
- ⚡ Loading states & error handling

</td>
</tr>
</table>

---

## 🎯 Game Mechanics

### Hero Stats Formula

```js
Strength = Planet_Modifier + Arcana_Bonus + Random(0-7)
Wisdom   = Planet_Modifier + Arcana_Bonus + Random(0-7)
Luck     = Planet_Modifier + Arcana_Bonus + Random(0-7)

Arcana_Bonus = floor(Arcana_ID / 2) + 5
```

**Example Hero:** Sun ☀️ + The World (Arcana XXI)
- **Strength:** 15 (Sun) + 15 (Arcana XXI) + 4 (RNG) = `34`
- **Wisdom:** 10 + 15 + 3 = `28`
- **Luck:** 8 + 15 + 5 = `28`

### Quest Success Calculation

```js
Hero_Power = Strength + Wisdom + Luck
Random_Factor = Random(0, 1000)
Success = (Hero_Power + Random_Factor) > (Quest_Difficulty × 10)

// Rewards
if (success) {
  XP = Base_XP × (1 + Luck/50) × 1.5
  Bonus_Stats = +Quest_Tier/3 (permanent)
} else {
  XP = Base_XP × (1 + Luck/50) × 0.5  // Half XP
}
```

### Quest Tiers

| Quest | Difficulty | Base XP | Recommended Level |
|-------|------------|---------|-------------------|
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

### Planet Stat Modifiers

| Planet | Strength | Wisdom | Luck | Playstyle |
|--------|----------|--------|------|----------|
| ☀️ Sun | 15 | 10 | 8 | Warrior |
| 🌙 Moon | 8 | 15 | 12 | Mystic |
| ☿ Mercury | 10 | 14 | 9 | Scholar |
| ♀ Venus | 9 | 12 | 14 | Rogue |
| ♂ Mars | **16** | 7 | 10 | Berserker |
| ♃ Jupiter | 13 | 13 | 11 | Balanced |
| ♄ Saturn | 11 | 15 | 8 | Sage |
| ♅ Uranus | 12 | 11 | 13 | Gambler |
| ♆ Neptune | 9 | **16** | 11 | Oracle |
| ♇ Pluto | 14 | 9 | **14** | Shadowblade |

---

## 📚 Documentation

### Essential Guides

- 📖 **[MVP Guide](./MVP.md)** - Simplified version documentation
- 🏗️ **[Architecture](./docs/ARCHITECTURE.md)** - System design & data flow
- 📡 **[API Reference](./docs/API.md)** - Complete endpoint documentation
- ✅ **[TODO List](./TODO.md)** - Development roadmap

### Quick Links

- [Smart Contract Endpoints](#smart-contract-endpoints)
- [Version Comparison](#version-comparison-mvp-vs-full)
- [Gas Usage Estimates](#gas-usage)
- [Security Features](#security)

---

## 🛠️ Development

### Project Structure

```
celestial-tarot-heroes/
├── contracts/
│   ├── celestial-heroes/          # Full v2.0 contract
│   │   ├── src/lib.rs            # Main contract logic
│   │   ├── tests/                # Rust tests
│   │   └── output/               # WASM build
│   └── celestial-heroes-mvp/     # MVP contract
│       ├── src/lib.rs
│       ├── scenarios/            # JSON test scenarios
│       └── tests/
├── dapp/                          # React frontend
│   ├── src/
│   │   ├── hooks/                # Contract integration
│   │   ├── pages/                # Route components
│   │   ├── components/           # UI components
│   │   └── config.ts             # Game constants
│   └── package.json
├── docs/                          # Documentation
├── .github/workflows/             # CI/CD
└── deploy-mvp.sh                  # Deployment script
```

### Run Tests

```bash
# Smart contract tests
cd contracts/celestial-heroes-mvp
cargo test

# dApp type checking
cd dapp
npx tsc --noEmit

# Run all CI checks locally
npm run lint
```

### Local Development

```bash
# Terminal 1: Build contract (watch mode)
cd contracts/celestial-heroes-mvp
sc-meta all build --watch

# Terminal 2: Run dApp
cd dapp
npm start
```

---

## 📊 Version Comparison: MVP vs Full

| Feature | MVP | Full v2.0 |
|---------|-----|----------|
| **Planets** | 1 (Sun ☀️) | 10 (all celestial bodies) |
| **Arcana** | 1 (The Fool) | 22 (complete Major Arcana) |
| **Unique Combinations** | 1 | **462** |
| **Quests** | 1 tier | 10 progressive tiers |
| **XP Formula** | Linear (100) | Exponential (level²×50+level×100) |
| **Quest Cooldown** | ❌ None | ✅ 50 blocks (~5 min) |
| **Success/Fail** | ✅ Guaranteed | ✅ Chance-based (luck RNG) |
| **Stat Variance** | Fixed | Random (+0-7) |
| **Treasury** | ❌ No | ✅ Yes |
| **Rename Heroes** | ❌ No | ✅ Yes (0.01 EGLD) |
| **Summon Cost** | 0.05 EGLD | 0.1 EGLD |
| **Contract Size** | ~3KB | ~12KB |
| **Deploy Time** | <1 min | ~3 min |
| **Best For** | **Testing & Validation** | **Full Experience** |

---

## 🔐 Security

### Smart Contract Security

- ✅ **Ownership Checks** - Every action verifies `ownerHeroes` mapping
- ✅ **Payment Validation** - `require!` minimum EGLD amounts
- ✅ **Cooldown Enforcement** - Quest spam prevented via block timestamps
- ✅ **Input Sanitization** - Quest ID bounds, name length (1-32 chars)
- ✅ **Safe Math** - Rust's built-in overflow protection
- ✅ **Event Logging** - All state changes emit events for tracking

### Frontend Security

- ✅ **XSS Protection** - React auto-escapes JSX
- ✅ **No Private Keys** - SDK delegates to wallet extensions
- ✅ **Input Encoding** - Hex encoding for contract data
- ✅ **HTTPS Only** - Encrypted API communication

---

## ⚡ Gas Usage

### Estimated Gas Costs

| Endpoint | MVP | Full v2.0 | EGLD Cost* |
|----------|-----|-----------|------------|
| `summonHero` | ~1.5M | ~3M | ~0.00003 |
| `quest` | ~800K | ~2M | ~0.00002 |
| `levelUp` | ~500K | ~1M | ~0.00001 |
| `renameHero` | N/A | ~700K | ~0.000007 |

*Gas cost calculated at 0.00000001 EGLD/gas (Devnet)

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- 📝 Write tests for new features
- 📚 Update documentation
- 🎨 Follow existing code style (ESLint + Prettier)
- 🔍 Run `cargo fmt` and `npm run lint` before committing

---

## 📞 Support

### Get Help

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Gzeu/celestial-tarot-heroes/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Gzeu/celestial-tarot-heroes/discussions)
- 🌐 **MultiversX**: [Discord Community](https://discord.gg/multiversx)
- 📧 **Email**: Create an issue for contact

### Useful Links

- [MultiversX Docs](https://docs.multiversx.com)
- [MultiversX Explorer](https://devnet-explorer.multiversx.com)
- [Builders Hub](https://multiversx.com/builders)

---

## 🙏 Acknowledgments

- Built for **[MultiversX Builders Hub](https://multiversx.com/builders)**
- Inspired by classic RPG mechanics and Tarot mysticism
- Powered by **MultiversX** blockchain technology
- Community feedback and early testers

---

## 📜 License

MIT License - see [LICENSE](./LICENSE) file for details

---

<div align="center">

**Built with ✨ for the MultiversX ecosystem**

[MultiversX](https://multiversx.com) • [Builders Hub](https://multiversx.com/builders-hub) • [Documentation](https://docs.multiversx.com)

⭐ **Star this repo** if you find it useful!

</div>
