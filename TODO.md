# Celestial Tarot Heroes - Development TODO

## 🔥 CRITICAL (Next 48 Hours)

### Deploy & Test MVP
- [ ] **Deploy MVP Contract to Devnet**
  ```bash
  cd contracts/celestial-heroes-mvp
  sc-meta all build
  ./deploy-mvp.sh
  # Save contract address
  ```
  
- [ ] **Manual Testing (mxpy CLI)**
  - [ ] Summon hero (0.05 EGLD)
  - [ ] Quest (verify 100 XP added)
  - [ ] Level up (verify stats: STR+3, WIS+2, LUCK+1)
  - [ ] Verify events emitted
  - [ ] Check gas usage (<5M per TX)

- [ ] **Test dApp Integration**
  - [ ] Update .env with deployed contract
  - [ ] Connect xPortal wallet
  - [ ] Summon hero via UI
  - [ ] Verify hero appears in My Heroes
  - [ ] Complete quest via UI
  - [ ] Level up via UI
  - [ ] Check TX success in Explorer

### Documentation
- [ ] **Record Video Tutorial** (5-10 min)
  - [ ] Wallet connect
  - [ ] Summon flow
  - [ ] Quest + levelup demo
  - [ ] Upload to YouTube
  - [ ] Embed link in README

---

## ⚡ HIGH PRIORITY (Week 2)

### Full Contract Deployment
- [ ] Deploy Full v2.0 to Devnet
- [ ] Test all 10 planets
- [ ] Test all 22 arcana
- [ ] Test all 10 quest tiers
- [ ] Verify success/fail mechanics
- [ ] Test quest cooldown (wait 50 blocks)
- [ ] Test treasury withdrawal
- [ ] Profile gas usage per endpoint

### Gas Optimization
- [ ] Measure summonHero gas (target <3M)
- [ ] Measure quest gas (target <2M)
- [ ] Measure levelUp gas (target <1M)
- [ ] Optimize storage access patterns

---

## 📱 MEDIUM PRIORITY (Week 3-4)

### dApp Enhancements
- [ ] Add loading skeletons
- [ ] Implement error boundaries
- [ ] Add TX toast notifications
- [ ] Show cooldown timer countdown
- [ ] Display success rate % per quest
- [ ] Add stats comparison modal (pre/post levelup)
- [ ] Mobile optimization testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

### Assets
- [ ] **Generate Planet SVGs** (10 files)
  - [ ] Animate with CSS/SVG
  - [ ] Export at 512x512px
  - [ ] Optimize file size
  
- [ ] **Generate Tarot Cards** (22 files)
  - [ ] Design in Figma/Illustrator
  - [ ] Rider-Waite aesthetic
  - [ ] Export at 1024x1440px
  - [ ] Upload to public/assets/

### NFT Metadata
- [ ] Define JSON schema
- [ ] Generate dynamic metadata per hero
- [ ] Upload to IPFS
- [ ] Update contract to return metadata URI

---

## 📊 LOW PRIORITY (Month 2+)

### Advanced Features
- [ ] Leaderboard microservice
- [ ] Marketplace integration
- [ ] Guild system
- [ ] Achievement badges
- [ ] Seasonal events

### Analytics
- [ ] Google Analytics integration
- [ ] Track wallet connects
- [ ] Track summons/day
- [ ] Monitor TX success rate

### Performance
- [ ] Lighthouse audit (target 90+)
- [ ] Bundle size optimization
- [ ] Service worker (PWA)
- [ ] Image lazy loading

---

## 🔧 TECHNICAL DEBT

### Code Quality
- [x] ESLint config
- [x] Prettier config
- [x] CI/CD pipeline (GitHub Actions)
- [ ] Husky pre-commit hooks
- [ ] Increase test coverage (target 80%)

### Documentation
- [x] Architecture diagram
- [x] API reference
- [ ] Inline code comments
- [ ] TypeDoc generation
- [ ] Developer guide
- [ ] Troubleshooting section

### Security
- [ ] Third-party audit (optional)
- [ ] Bug bounty program
- [ ] Security policy document

---

## 🎉 LAUNCH PREPARATION

### Pre-Launch Checklist
- [ ] **Contracts**
  - [ ] MVP tested on Devnet ✅
  - [ ] Full v2.0 tested on Devnet
  - [ ] Gas optimized
  - [ ] Security review

- [ ] **dApp**
  - [ ] All features working
  - [ ] Mobile tested
  - [ ] Performance optimized
  - [ ] Error handling robust

- [ ] **Content**
  - [ ] README complete ✅
  - [ ] Video tutorial
  - [ ] Social media graphics
  - [ ] Launch announcement

- [ ] **Community**
  - [ ] Discord channel
  - [ ] Twitter account
  - [ ] 10+ early testers
  - [ ] Feedback incorporated

### Launch Day
- [ ] Deploy to Mainnet
- [ ] Update dApp config (Mainnet)
- [ ] Publish announcement
- [ ] Monitor contract activity
- [ ] Community support

---

## 📈 METRICS TO TRACK

### Smart Contract
- Total heroes minted
- Quests completed/day
- Level ups/day
- Treasury balance
- Average gas/TX

### dApp
- Daily active users
- Wallet connection rate
- TX success rate
- Average session time
- Bounce rate

### Community
- GitHub stars
- Discord members
- Twitter followers
- Forum engagement

---

## 💡 FUTURE IDEAS

- [ ] Hero breeding
- [ ] Equipment system
- [ ] Seasonal events
- [ ] Achievement NFTs
- [ ] Hero skins
- [ ] Staking mechanism
- [ ] DAO governance
- [ ] Cross-chain bridge
- [ ] Mobile app
- [ ] VR/AR integration

---

**Last Updated:** Dec 11, 2025 02:00 AM EET
