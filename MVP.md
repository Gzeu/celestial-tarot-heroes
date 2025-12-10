# Celestial Tarot Heroes - MVP (Minimum Viable Product)

## 🎯 MVP Scope

Versiunea MVP se concentrează pe **core gameplay loop** cu features esențiale pentru validarea conceptului.

## ✅ MVP Features (Implemented)

### Smart Contract
- [x] **Basic Hero Summoning** - Un erou simplu (Sun + The Fool fix pentru MVP)
- [x] **Single Quest** - Quest ID 1 (Mystic Grove) cu XP fix de 100
- [x] **Simple Level Up** - 100 XP = Level 2 (linear pentru MVP)
- [x] **Hero Storage** - Mapping hero_id → owner
- [x] **View Endpoints** - getHero, getHeroesByOwner

### dApp
- [x] **Wallet Connect** - xPortal extension login
- [x] **My Hero Page** - Afișează primul erou invocat cu stats
- [x] **Quest Button** - Un singur buton pentru Quest 1
- [x] **XP Progress Bar** - Vizualizare progres 0→100 XP
- [x] **Level Up Button** - Activ când XP ≥ 100

### UI/UX
- [x] **Dark Theme** - Fundal cosmic simplu (gradient)
- [x] **Responsive** - Mobile-friendly basic
- [x] **Loading States** - Spinner pe transactions
- [x] **Success Toast** - Notificare după TX

## ❌ Excluded from MVP (V2+)

- ⏳ **Multiple Planets/Arcana** - Doar Sun+Fool în MVP
- ⏳ **Quest Cooldown** - Nu e necesar pentru validare
- ⏳ **Success/Fail Mechanics** - Quest garantat în MVP
- ⏳ **10 Quest Tiers** - Doar Quest 1
- ⏳ **Exponential XP** - Linear în MVP (100 XP flat)
- ⏳ **Stat Bonuses** - Doar XP gain în MVP
- ⏳ **Rename Hero** - Feature nice-to-have
- ⏳ **Treasury** - Nu e necesar pentru MVP
- ⏳ **Advanced Animations** - UI simplu funcțional

## 🚀 MVP Deployment (5 Steps)

### 1. Build MVP Contract
```bash
cd contracts/celestial-heroes-mvp
sc-meta all build
```

### 2. Deploy to Devnet
```bash
mxpy contract deploy \
  --bytecode=output/celestial-heroes-mvp.wasm \
  --pem=~/wallet.pem \
  --gas-limit=20000000 \
  --chain=D \
  --proxy=https://devnet-gateway.multiversx.com \
  --send
```

### 3. Note Contract Address
```bash
# Output: Contract address: erd1qqqqqqqqqqqqqpgq...
export MVP_CONTRACT=erd1qqqqqqqqqqqqqpgq...
```

### 4. Configure dApp
```bash
cd ../../dapp-mvp
echo "REACT_APP_CONTRACT_ADDRESS=$MVP_CONTRACT" > .env
npm install
```

### 5. Run MVP dApp
```bash
npm start
# Open http://localhost:3000
```

## 🧪 MVP User Flow (End-to-End)

1. **Connect Wallet**
   - Click "Connect xPortal"
   - Approve in extension
   - ✅ Wallet connected (address visible)

2. **Summon First Hero**
   - Navigate to "Summon" page
   - Click "Summon Hero" (0.05 EGLD)
   - Sign TX in xPortal
   - ✅ Hero created (auto Sun + Fool, Level 1, 0 XP)

3. **View Hero**
   - Navigate to "My Hero"
   - See hero card:
     - Name: "Hero #1"
     - Planet: Sun ☀️
     - Arcana: The Fool
     - Level: 1
     - XP: 0/100 (progress bar empty)
     - Strength: 20
     - Wisdom: 15
     - Luck: 13

4. **Complete Quest**
   - Click "Start Quest" button
   - Sign TX (gas ~500K)
   - Wait for TX confirmation (~6 seconds)
   - ✅ Toast: "Quest completed! +100 XP"
   - XP bar updates: 100/100 (full)

5. **Level Up**
   - "Level Up" button now enabled (green)
   - Click "Level Up"
   - Sign TX (gas ~300K)
   - ✅ Hero stats update:
     - Level: 2
     - XP: 0/100 (reset)
     - Strength: 23 (+3)
     - Wisdom: 17 (+2)
     - Luck: 14 (+1)

6. **Repeat**
   - Quest again → 100 XP → Level 3...
   - Test loop: Quest → Level Up → Quest

## 📊 MVP Success Metrics

**Goal**: Validate că mecanica de bază funcționează end-to-end.

### Technical Metrics
- [ ] Smart contract deployed pe Devnet fără erori
- [ ] 5 summon TX confirmate (gas < 2M)
- [ ] 10 quest TX confirmate (gas < 1M)
- [ ] 5 levelUp TX confirmate (gas < 500K)
- [ ] Zero TX failures din cauza contract bugs

### User Experience Metrics
- [ ] User poate completa flow-ul complet în < 5 minute
- [ ] UI răspunde în < 2 secunde după fiecare TX
- [ ] Mobile (375px width) funcțional
- [ ] XP progress bar update vizibil

### Business Metrics
- [ ] 10 early testers completează flow-ul
- [ ] Feedback pozitiv pe concept (≥7/10 rating)
- [ ] Zero confusion pe flow (no support questions)

## 🛠️ MVP Technical Spec

### Smart Contract (Simplified)
```rust
// contracts/celestial-heroes-mvp/src/lib.rs

#[multiversx_sc::contract]
pub trait CelestialHeroesMVP {
    #[init]
    fn init(&self) {
        self.hero_counter().set(1);
    }

    #[payable("EGLD")]
    #[endpoint(summonHero)]
    fn summon_hero(&self) -> u64 {
        require!(payment >= 50000000000000000, "0.05 EGLD required");
        
        let hero_id = self.hero_counter().get();
        let hero = Hero {
            level: 1,
            xp: 0,
            strength: 20,
            wisdom: 15,
            luck: 13,
        };
        
        self.heroes(hero_id).set(&hero);
        self.hero_counter().update(|x| *x += 1);
        hero_id
    }

    #[endpoint(quest)]
    fn quest(&self, hero_id: u64) {
        let mut hero = self.heroes(hero_id).get();
        hero.xp += 100; // Fixed XP
        self.heroes(hero_id).set(&hero);
    }

    #[endpoint(levelUp)]
    fn level_up(&self, hero_id: u64) {
        let mut hero = self.heroes(hero_id).get();
        require!(hero.xp >= 100, "Not enough XP");
        
        hero.level += 1;
        hero.xp = 0;
        hero.strength += 3;
        hero.wisdom += 2;
        hero.luck += 1;
        
        self.heroes(hero_id).set(&hero);
    }

    #[view(getHero)]
    fn get_hero(&self, hero_id: u64) -> Hero<Self::Api> {
        self.heroes(hero_id).get()
    }
}
```

### dApp (Simplified)
```typescript
// dapp-mvp/src/pages/MyHeroPage.tsx

const MyHeroPage = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuest = async () => {
    setLoading(true);
    await sendTransactions({
      transactions: [{
        value: '0',
        data: 'quest@01',
        receiver: CONTRACT_ADDRESS,
        gasLimit: 5000000,
      }],
    });
    setLoading(false);
  };

  const handleLevelUp = async () => {
    setLoading(true);
    await sendTransactions({
      transactions: [{
        value: '0',
        data: 'levelUp@01',
        receiver: CONTRACT_ADDRESS,
        gasLimit: 3000000,
      }],
    });
    setLoading(false);
  };

  return (
    <div className="hero-card">
      <h2>Hero #{hero.id}</h2>
      <p>Level {hero.level}</p>
      <ProgressBar value={hero.xp} max={100} />
      <p>XP: {hero.xp}/100</p>
      
      <button onClick={handleQuest} disabled={loading}>
        {loading ? 'Questing...' : 'Start Quest (+100 XP)'}
      </button>
      
      <button 
        onClick={handleLevelUp} 
        disabled={loading || hero.xp < 100}
      >
        Level Up
      </button>
    </div>
  );
};
```

## 📅 MVP Timeline

- **Day 1-2**: Build MVP contract + tests
- **Day 3**: Deploy Devnet + verify
- **Day 4**: Build MVP dApp UI
- **Day 5**: Integration testing
- **Day 6-7**: Early tester feedback

**Total: 1 week to MVP**

## 🔄 Iteration Plan (Post-MVP)

### V1.1 (Week 2)
- Add 3 more planets (Moon, Mars, Venus)
- Add 5 quest tiers
- Implement quest cooldown

### V1.2 (Week 3)
- Success/fail mechanics
- All 10 planets
- All 22 arcana

### V1.3 (Week 4)
- Advanced UI animations
- Leaderboard
- Treasury system

### V2.0 (Month 2)
- Full feature parity with roadmap
- Mainnet deployment

## ❗ MVP Limitations (Known)

1. **No variety** - Doar o combinație planetă/arcana
2. **Linear progression** - XP scaling simplu
3. **No strategy** - Quest success garantat
4. **Basic UI** - Funcțional dar nu spectaculos
5. **No economy** - Payment-uri nu sunt folosite

**Nota**: Aceste limitări sunt **intenționate** pentru validare rapidă.

## 🎯 MVP Acceptance Criteria

**MVP este "Done" când:**

- [x] Contract deployed pe Devnet (verified)
- [x] dApp hosted (Vercel/Netlify)
- [x] User poate:
  - [x] Conecta wallet
  - [x] Summon hero (0.05 EGLD)
  - [x] Vezi hero card cu stats
  - [x] Completa quest (+100 XP)
  - [x] Level up (reset XP, boost stats)
  - [x] Repeta loop-ul
- [x] Mobile funcțional (≥375px)
- [x] Zero crash-uri critice
- [x] 3 early testers au completat flow-ul

## 📞 Feedback & Next Steps

După MVP validation:
1. Colectează feedback calitativ (ce lipsește cel mai mult?)
2. Analizează metrics (unde abandonează userii?)
3. Prioritizează V1.1 features
4. Decide: Iterate sau Pivot?

---

**MVP Goal**: Dovediți că gameplay loop-ul de bază este engaging înainte de a investi în features avansate.
