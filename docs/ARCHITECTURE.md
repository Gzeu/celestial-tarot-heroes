# Celestial Tarot Heroes - Architecture

## System Overview

```
┌───────────────────────┐
│   User (Browser)       │
│                        │
│  xPortal / DeFi Wallet │
└─────────┬─────────────┘
          │
          │ HTTPS
          │
┌─────────┴─────────────────┐
│   React dApp (Frontend)     │
│                             │
│  - TypeScript               │
│  - @multiversx/sdk-dapp     │
│  - Framer Motion            │
│  - Custom Hooks             │
└─────────┬─────────────────┘
          │
          │ API / Transactions
          │
┌─────────┴─────────────────┐
│  MultiversX Devnet API     │
│                             │
│  - Gateway                  │
│  - ProxyNetworkProvider     │
└─────────┬─────────────────┘
          │
          │ Blockchain Calls
          │
┌─────────┴───────────────────────────────┐
│   Smart Contract (Rust)               │
│                                        │
│  ┌─────────────────┐                 │
│  │  MVP Version    │                 │
│  │  - summonHero   │                 │
│  │  - quest        │                 │
│  │  - levelUp      │                 │
│  └─────────────────┘                 │
│                                        │
│  ┌─────────────────┐                 │
│  │  Full Version   │                 │
│  │  - 10 Planets   │                 │
│  │  - 22 Arcana    │                 │
│  │  - 10 Quests    │                 │
│  │  - Treasury     │                 │
│  └─────────────────┘                 │
└─────────────────────────────────────────┘
```

## Component Details

### 1. Smart Contract Layer

#### MVP Contract
**File**: `contracts/celestial-heroes-mvp/src/lib.rs`

**Responsibilities**:
- Hero minting with fixed stats (Sun + Fool)
- Single quest (100 XP reward)
- Simple leveling (100 XP cost)
- Basic ownership management

**Storage**:
```rust
heroes: SingleValueMapper<HeroMVP>
ownerHeroes: UnorderedSetMapper<u64>
heroCounter: SingleValueMapper<u64>
```

**Endpoints**:
- `summonHero()` - 0.05 EGLD
- `quest(hero_id)` - Free
- `levelUp(hero_id)` - Free
- `getHero(hero_id)` - View
- `getHeroesByOwner(address)` - View

#### Full Contract
**File**: `contracts/celestial-heroes/src/lib.rs`

**Additional Features**:
- 10 planets with stat modifiers
- 22 Tarot arcana with bonuses
- 10 quest tiers with difficulty scaling
- Success/fail mechanics with RNG
- Quest cooldown (50 blocks)
- Treasury system
- Rename hero feature
- Max level cap (100)

**Complex Types**:
```rust
enum Planet { Sun, Moon, ..., Pluto }
enum Arcana { Fool, Magician, ..., World }
struct Hero {
    nft_nonce, planet, arcana,
    level, xp, strength, wisdom, luck,
    quest_count, last_quest_block, ...
}
struct QuestReward {
    xp_gained, bonus_stats, success, message
}
```

### 2. Frontend Layer

#### Architecture Pattern: Feature-Based

```
dapp/src/
├── hooks/              # Custom hooks for contract interaction
│   └── useContract.ts  # View queries (getHero, canQuest, etc)
├── pages/              # Route components
│   ├── HomePage.tsx
│   ├── TarotForgePage.tsx
│   ├── MyHeroesPage.tsx
│   └── QuestsPage.tsx
├── components/         # Reusable UI components
│   └── Layout.tsx
└── config.ts           # Constants (CONTRACT_ADDRESS, QUEST_DATA)
```

#### State Management

**Wallet State**: Managed by `@multiversx/sdk-dapp`
```typescript
const { address } = useGetAccountInfo();
```

**Hero Data**: Fetched via custom hooks
```typescript
const heroes = await getHeroesByOwner(address);
const hero = await getHero(heroId);
const eligible = await canQuest(heroId);
```

**Transaction Flow**:
1. User action (click button)
2. Construct TX data (hex encoding)
3. `sendTransactions()` from sdk-dapp
4. User signs in wallet
5. TX broadcast to network
6. Wait for confirmation
7. Reload data from contract

### 3. Data Flow

#### Read Flow (Query)
```
User Action (load page)
  → useEffect hook
  → getHeroesByOwner(address)
  → ProxyNetworkProvider.queryContract()
  → Devnet API
  → Smart Contract View
  → Parse Response
  → Update UI State
  → Render Components
```

#### Write Flow (Transaction)
```
User Action (click "Quest")
  → Validate inputs
  → Encode TX data (quest@hero_id@quest_id)
  → sendTransactions()
  → Wallet popup (sign)
  → Broadcast TX
  → Wait confirmation (~6 seconds)
  → Callback route (/my-heroes)
  → Reload hero data
  → Show success toast
```

## Technology Stack

### Smart Contract
- **Language**: Rust
- **Framework**: multiversx-sc 0.50.0
- **Build Tool**: sc-meta
- **Testing**: multiversx-sc-scenario

### Frontend
- **Framework**: React 18
- **Language**: TypeScript 5
- **Routing**: React Router 6
- **Styling**: CSS Modules + CSS Variables
- **Animations**: Framer Motion 11
- **Blockchain SDK**: @multiversx/sdk-dapp 4.0+

### Infrastructure
- **Blockchain**: MultiversX Devnet
- **API**: https://devnet-api.multiversx.com
- **Gateway**: https://devnet-gateway.multiversx.com
- **Explorer**: https://devnet-explorer.multiversx.com

## Security Considerations

### Smart Contract
1. **Ownership Checks**: Every state-changing endpoint verifies `ownerHeroes` mapping
2. **Payment Validation**: `require!(payment >= MIN_SUMMON_PAYMENT)`
3. **Cooldown Enforcement**: Quest spam prevented via `last_quest_block`
4. **Input Validation**: Quest ID bounds, name length, level cap
5. **Safe Math**: No manual overflow/underflow (Rust guarantees)

### Frontend
1. **XSS Protection**: React auto-escapes JSX
2. **No Private Keys**: SDK-dapp delegates to wallet extensions
3. **Input Sanitization**: Hex encoding for contract data
4. **HTTPS Only**: All API calls encrypted

## Performance

### Gas Usage (Estimated)
| Endpoint | MVP | Full v2.0 |
|----------|-----|----------|
| summonHero | ~1.5M | ~3M |
| quest | ~800K | ~2M |
| levelUp | ~500K | ~1M |

### Frontend Metrics
- **Initial Load**: ~2s (Devnet)
- **Hero Query**: ~500ms
- **TX Confirmation**: ~6s (1 block)

## Deployment

### Contract Deployment
```bash
cd contracts/celestial-heroes-mvp
sc-meta all build
mxpy contract deploy --bytecode=output/*.wasm --pem=wallet.pem --gas-limit=20M --chain=D --send
```

### dApp Deployment (Vercel)
```bash
cd dapp
npm install
npm run build
vercel --prod
```

## Future Architecture Enhancements

1. **Indexer Service**: Cache hero data for faster queries
2. **WebSocket**: Real-time TX updates
3. **IPFS**: NFT metadata and images
4. **Subgraph**: GraphQL API for complex queries
5. **CDN**: Static asset optimization
