# Smart Contract API Reference

## Data Structures

### Hero (MVP)
```rust
struct HeroMVP {
    id: u64,
    level: u32,
    xp: u64,
    strength: u32,
    wisdom: u32,
    luck: u32,
    name: ManagedBuffer,
}
```

### Hero (Full)
```rust
struct Hero {
    nft_nonce: u64,
    planet: Planet,
    arcana: Arcana,
    level: u32,
    xp: u64,
    strength: u32,
    wisdom: u32,
    luck: u32,
    quest_count: u32,
    total_quests_completed: u32,
    last_quest_block: u64,
    creation_timestamp: u64,
    name: ManagedBuffer,
}
```

### Planet Enum
```rust
enum Planet {
    Sun = 0, Moon = 1, Mercury = 2, Venus = 3, Mars = 4,
    Jupiter = 5, Saturn = 6, Uranus = 7, Neptune = 8, Pluto = 9,
}
```

### Arcana Enum
```rust
enum Arcana {
    Fool = 0, Magician = 1, HighPriestess = 2, ..., World = 21
}
```

### QuestReward (Full)
```rust
struct QuestReward {
    xp_gained: u64,
    bonus_stats: (u32, u32, u32),  // (strength, wisdom, luck)
    success: bool,
    message: ManagedBuffer,
}
```

---

## Write Endpoints

### summonHero

**MVP**: `summonHero()`  
**Full**: `summonHero(planet: Planet, arcana: Arcana, name: ManagedBuffer)`

**Payment**: 0.05 EGLD (MVP) / 0.1 EGLD (Full)

**Description**: Mints a new hero NFT with numerology-based stats.

**Returns**: `u64` (hero ID)

**Events**: `heroSummoned(owner, hero_id, planet, arcana)`

**Example TX Data**:
```
MVP: summonHero
Full: summonHero@00@00@4865726f  (Sun, Fool, "Hero")
```

---

### quest

**Signature**: `quest(hero_id: u64, quest_id: u32)`

**Payment**: 0 EGLD

**Description**: Sends hero on quest to gain XP.

**Returns**: `QuestReward` (full version only, MVP returns nothing)

**Constraints**:
- Hero must exist
- Caller must own hero
- Quest ID must be 1-10 (full) or 1 (MVP)
- Cooldown must be elapsed (full only)

**Events**: `questCompleted(hero_id, quest_id, xp_gained, success)`

**Example TX Data**:
```
quest@0000000000000001@00000001  (hero_id=1, quest_id=1)
```

---

### levelUp

**Signature**: `levelUp(hero_id: u64)`

**Payment**: 0 EGLD

**Description**: Consumes XP to increase hero level and boost stats.

**Constraints**:
- Hero XP >= required XP
- Level < 100 (full only)

**Events**: `levelUp(hero_id, new_level)`

**Example TX Data**:
```
levelUp@0000000000000001  (hero_id=1)
```

---

### renameHero (Full Only)

**Signature**: `renameHero(hero_id: u64, new_name: ManagedBuffer)`

**Payment**: 0.01 EGLD

**Description**: Changes hero name.

**Constraints**:
- Name length 1-32 chars
- Caller must own hero

**Events**: `heroRenamed(hero_id, new_name)`

**Example TX Data**:
```
renameHero@0000000000000001@4D794865726f  (hero_id=1, "MyHero")
```

---

### withdrawTreasury (Full Only, Owner)

**Signature**: `withdrawTreasury(amount: BigUint)`

**Payment**: 0 EGLD

**Description**: Owner withdraws from treasury.

**Constraints**:
- Caller must be contract owner
- Amount <= treasury balance

**Example TX Data**:
```
withdrawTreasury@0de0b6b3a7640000  (0.1 EGLD in hex)
```

---

## View Endpoints

### getHero

**Signature**: `getHero(hero_id: u64) -> Hero`

**Description**: Returns complete hero data.

**Example Query**:
```bash
mxpy contract query $CONTRACT --function=getHero --arguments 1
```

**Response** (MVP):
```json
{
  "id": 1,
  "level": 2,
  "xp": 0,
  "strength": 23,
  "wisdom": 17,
  "luck": 14,
  "name": "Hero"
}
```

---

### getHeroesByOwner

**Signature**: `getHeroesByOwner(address: ManagedAddress) -> MultiValue<u64>`

**Description**: Returns array of hero IDs owned by address.

**Example Query**:
```bash
mxpy contract query $CONTRACT --function=getHeroesByOwner --arguments erd1abc...
```

**Response**:
```json
[1, 3, 7]
```

---

### getHeroCount

**Signature**: `getHeroCount() -> u64`

**Description**: Total heroes minted.

**Example Query**:
```bash
mxpy contract query $CONTRACT --function=getHeroCount
```

**Response**: `42`

---

### getRequiredXp (Full Only)

**Signature**: `getRequiredXp(current_level: u32) -> u64`

**Description**: Calculates XP needed for next level.

**Formula**:
```
MVP: 100 (flat)
Full: level^2 * 50 + level * 100
```

**Example**:
- Level 1 → 150 XP
- Level 10 → 6000 XP
- Level 50 → 130,000 XP

---

### canQuest (Full Only)

**Signature**: `canQuest(hero_id: u64) -> bool`

**Description**: Checks if hero can quest (cooldown elapsed).

**Example Query**:
```bash
mxpy contract query $CONTRACT --function=canQuest --arguments 1
```

**Response**: `true` or `false`

---

### getQuestDifficulty (Full Only)

**Signature**: `getQuestDifficulty(quest_id: u32) -> u64`

**Description**: Returns difficulty value for quest tier.

**Difficulty Table**:
| Quest ID | Difficulty |
|----------|------------|
| 1 | 5 |
| 2 | 10 |
| 3 | 18 |
| 4 | 28 |
| 5 | 40 |
| 6 | 55 |
| 7 | 75 |
| 8 | 95 |
| 9 | 120 |
| 10 | 150 |

---

### getTreasuryBalance (Full Only)

**Signature**: `getTreasuryBalance() -> BigUint`

**Description**: Current treasury EGLD balance.

**Example Query**:
```bash
mxpy contract query $CONTRACT --function=getTreasuryBalance
```

**Response**: `5000000000000000000` (5 EGLD in wei)

---

## Events

### heroSummoned
```rust
#[event("heroSummoned")]
fn hero_summoned_event(
    #[indexed] owner: &ManagedAddress,
    #[indexed] hero_id: u64,
    planet: Planet,
    arcana: Arcana,
);
```

### questCompleted
```rust
#[event("questCompleted")]
fn quest_completed_event(
    #[indexed] hero_id: u64,
    #[indexed] quest_id: u32,
    xp_gained: u64,
    success: bool,
);
```

### levelUp
```rust
#[event("levelUp")]
fn level_up_event(
    #[indexed] hero_id: u64,
    new_level: u32,
);
```

### heroRenamed
```rust
#[event("heroRenamed")]
fn hero_renamed_event(
    #[indexed] hero_id: u64,
    new_name: ManagedBuffer,
);
```

---

## Error Messages

| Error | Meaning |
|-------|----------|
| `Minimum 0.05 EGLD required` | Summon payment too low (MVP) |
| `Minimum 0.1 EGLD required` | Summon payment too low (Full) |
| `Not hero owner` | Caller doesn't own the hero |
| `Hero does not exist` | Invalid hero ID |
| `Invalid quest ID` | Quest ID out of bounds |
| `Hero is resting. Try again later.` | Cooldown not elapsed |
| `Not enough XP` | Can't level up yet |
| `Max level reached` | Hero is level 100 |
| `Invalid name length` | Name too short/long |
| `Insufficient treasury balance` | Withdrawal exceeds balance |
