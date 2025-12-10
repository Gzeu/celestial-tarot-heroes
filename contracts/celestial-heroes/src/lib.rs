#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

// Constants for game balance
const MIN_SUMMON_PAYMENT: u64 = 100_000_000_000_000_000; // 0.1 EGLD
const MAX_QUEST_ID: u32 = 10;
const QUEST_COOLDOWN_BLOCKS: u64 = 50; // ~5 minutes on MultiversX
const MAX_LEVEL: u32 = 100;
const MAX_NAME_LENGTH: usize = 32;

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone, Copy, PartialEq, Eq, Debug)]
pub enum Planet {
    Sun = 0,
    Moon = 1,
    Mercury = 2,
    Venus = 3,
    Mars = 4,
    Jupiter = 5,
    Saturn = 6,
    Uranus = 7,
    Neptune = 8,
    Pluto = 9,
}

impl Planet {
    pub fn get_stat_modifier(&self) -> (u32, u32, u32) {
        // Returns (strength_mod, wisdom_mod, luck_mod)
        match self {
            Planet::Sun => (15, 10, 8),      // Strength-focused
            Planet::Moon => (8, 15, 12),     // Wisdom and luck
            Planet::Mercury => (10, 14, 9),  // Balanced wisdom
            Planet::Venus => (9, 12, 14),    // Luck-focused
            Planet::Mars => (16, 7, 10),     // Maximum strength
            Planet::Jupiter => (13, 13, 11), // Balanced power
            Planet::Saturn => (11, 15, 8),   // Wisdom-focused
            Planet::Uranus => (12, 11, 13),  // Balanced luck
            Planet::Neptune => (9, 16, 11),  // Maximum wisdom
            Planet::Pluto => (14, 9, 14),    // Strength and luck
        }
    }
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone, Copy, PartialEq, Eq, Debug)]
pub enum Arcana {
    Fool = 0,
    Magician = 1,
    HighPriestess = 2,
    Empress = 3,
    Emperor = 4,
    Hierophant = 5,
    Lovers = 6,
    Chariot = 7,
    Strength = 8,
    Hermit = 9,
    WheelOfFortune = 10,
    Justice = 11,
    HangedMan = 12,
    Death = 13,
    Temperance = 14,
    Devil = 15,
    Tower = 16,
    Star = 17,
    Moon = 18,
    Sun = 19,
    Judgement = 20,
    World = 21,
}

impl Arcana {
    pub fn get_base_bonus(&self) -> u32 {
        // Higher arcana numbers = stronger base power
        (*self as u32) / 2 + 5
    }
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct Hero<M: ManagedTypeApi> {
    pub nft_nonce: u64,
    pub planet: Planet,
    pub arcana: Arcana,
    pub level: u32,
    pub xp: u64,
    pub strength: u32,
    pub wisdom: u32,
    pub luck: u32,
    pub quest_count: u32,
    pub total_quests_completed: u32,
    pub last_quest_block: u64,
    pub creation_timestamp: u64,
    pub name: ManagedBuffer<M>,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct QuestReward<M: ManagedTypeApi> {
    pub xp_gained: u64,
    pub bonus_stats: (u32, u32, u32), // (strength, wisdom, luck)
    pub success: bool,
    pub message: ManagedBuffer<M>,
}

#[multiversx_sc::contract]
pub trait CelestialHeroesContract {
    #[init]
    fn init(&self) {
        self.hero_counter().set(1u64);
        self.contract_owner().set(&self.blockchain().get_caller());
    }

    #[upgrade]
    fn upgrade(&self) {}

    /// Summon a new hero NFT with numerology-based stats
    #[payable("EGLD")]
    #[endpoint(summonHero)]
    fn summon_hero(&self, planet: Planet, arcana: Arcana, name: ManagedBuffer) -> u64 {
        let payment = self.call_value().egld_value().clone_value();
        require!(payment >= BigUint::from(MIN_SUMMON_PAYMENT), "Minimum 0.1 EGLD required");
        require!(name.len() > 0 && name.len() <= MAX_NAME_LENGTH, "Invalid name length");

        let caller = self.blockchain().get_caller();
        let hero_id = self.hero_counter().get();
        let current_block = self.blockchain().get_block_nonce();
        let timestamp = self.blockchain().get_block_timestamp();
        
        // Enhanced numerology calculation using planet/arcana synergy
        let planet_mods = planet.get_stat_modifier();
        let arcana_bonus = arcana.get_base_bonus();
        
        let strength = planet_mods.0 + arcana_bonus + self.calculate_variance(hero_id, 1);
        let wisdom = planet_mods.1 + arcana_bonus + self.calculate_variance(hero_id, 2);
        let luck = planet_mods.2 + arcana_bonus + self.calculate_variance(hero_id, 3);

        let hero = Hero {
            nft_nonce: hero_id,
            planet,
            arcana,
            level: 1,
            xp: 0,
            strength,
            wisdom,
            luck,
            quest_count: 0,
            total_quests_completed: 0,
            last_quest_block: current_block,
            creation_timestamp: timestamp,
            name,
        };

        self.heroes(hero_id).set(&hero);
        self.owner_heroes(&caller).insert(hero_id);
        self.hero_counter().update(|x| *x += 1);
        
        self.treasury_balance().update(|balance| *balance += payment);

        self.hero_summoned_event(&caller, hero_id, planet, arcana);
        hero_id
    }

    /// Send hero on quest with cooldown and success chance
    #[endpoint(quest)]
    fn quest(&self, hero_id: u64, quest_id: u32) -> QuestReward<Self::Api> {
        let caller = self.blockchain().get_caller();
        require!(self.owner_heroes(&caller).contains(&hero_id), "Not hero owner");
        require!(quest_id >= 1 && quest_id <= MAX_QUEST_ID, "Invalid quest ID");

        let mut hero = self.heroes(hero_id).get();
        let current_block = self.blockchain().get_block_nonce();
        
        require!(
            current_block >= hero.last_quest_block + QUEST_COOLDOWN_BLOCKS,
            "Hero is resting. Try again later."
        );
        
        let quest_difficulty = self.get_quest_difficulty(quest_id);
        let hero_power = (hero.strength as u64) + (hero.wisdom as u64) + (hero.luck as u64);
        let success_threshold = quest_difficulty * 10;
        
        let random_factor = self.generate_random(hero_id, current_block);
        let success = hero_power + random_factor > success_threshold;
        
        let base_xp = match quest_id {
            1..=2 => 50u64 * (quest_id as u64),
            3..=5 => 100u64 * (quest_id as u64),
            6..=8 => 200u64 * (quest_id as u64),
            9..=10 => 350u64 * (quest_id as u64),
            _ => 0u64,
        };

        let luck_multiplier = 100 + (hero.luck as u64 * 2);
        let mut total_xp = (base_xp * luck_multiplier) / 100;
        
        let mut bonus_stats = (0u32, 0u32, 0u32);
        let message: ManagedBuffer<Self::Api>;
        
        if success {
            total_xp = (total_xp * 150) / 100;
            bonus_stats = (
                quest_id / 3,
                (quest_id + 1) / 3,
                (quest_id + 2) / 3
            );
            
            hero.strength += bonus_stats.0;
            hero.wisdom += bonus_stats.1;
            hero.luck += bonus_stats.2;
            hero.total_quests_completed += 1;
            
            message = ManagedBuffer::from(b"Quest completed successfully!");
        } else {
            total_xp = total_xp / 2;
            message = ManagedBuffer::from(b"Quest failed, but gained experience.");
        }

        hero.xp += total_xp;
        hero.quest_count += 1;
        hero.last_quest_block = current_block;
        
        self.heroes(hero_id).set(&hero);
        self.quest_completed_event(hero_id, quest_id, total_xp, success);
        
        QuestReward {
            xp_gained: total_xp,
            bonus_stats,
            success,
            message,
        }
    }

    #[endpoint(levelUp)]
    fn level_up(&self, hero_id: u64) {
        let caller = self.blockchain().get_caller();
        require!(self.owner_heroes(&caller).contains(&hero_id), "Not hero owner");

        let mut hero = self.heroes(hero_id).get();
        require!(hero.level < MAX_LEVEL, "Max level reached");
        
        let required_xp = self.get_required_xp(hero.level);
        require!(hero.xp >= required_xp, "Not enough XP");

        hero.xp -= required_xp;
        hero.level += 1;
        
        let level_tier = hero.level / 10;
        let base_increase = 3 + level_tier;
        
        hero.strength += base_increase + (hero.level % 5);
        hero.wisdom += base_increase - 1 + (hero.level % 4);
        hero.luck += (base_increase / 2) + (hero.level % 3);

        self.heroes(hero_id).set(&hero);
        self.level_up_event(hero_id, hero.level);
    }

    #[payable("EGLD")]
    #[endpoint(renameHero)]
    fn rename_hero(&self, hero_id: u64, new_name: ManagedBuffer) {
        let payment = self.call_value().egld_value().clone_value();
        require!(payment >= BigUint::from(10_000_000_000_000_000u64), "Minimum 0.01 EGLD");
        require!(new_name.len() > 0 && new_name.len() <= MAX_NAME_LENGTH, "Invalid name");
        
        let caller = self.blockchain().get_caller();
        require!(self.owner_heroes(&caller).contains(&hero_id), "Not hero owner");
        
        let mut hero = self.heroes(hero_id).get();
        hero.name = new_name.clone();
        self.heroes(hero_id).set(&hero);
        
        self.treasury_balance().update(|balance| *balance += payment);
        self.hero_renamed_event(hero_id, new_name);
    }

    #[view(getHero)]
    fn get_hero(&self, hero_id: u64) -> Hero<Self::Api> {
        require!(!self.heroes(hero_id).is_empty(), "Hero does not exist");
        self.heroes(hero_id).get()
    }

    #[view(getHeroesByOwner)]
    fn get_heroes_by_owner(&self, owner: ManagedAddress) -> MultiValueEncoded<u64> {
        let mut result = MultiValueEncoded::new();
        for hero_id in self.owner_heroes(&owner).iter() {
            result.push(hero_id);
        }
        result
    }

    #[view(getHeroCount)]
    fn get_hero_count(&self) -> u64 {
        self.hero_counter().get() - 1
    }

    #[view(getRequiredXp)]
    fn get_required_xp(&self, current_level: u32) -> u64 {
        let level = current_level as u64;
        level * level * 50 + level * 100
    }

    #[view(getQuestDifficulty)]
    fn get_quest_difficulty(&self, quest_id: u32) -> u64 {
        match quest_id {
            1 => 5,   2 => 10,  3 => 18,  4 => 28,  5 => 40,
            6 => 55,  7 => 75,  8 => 95,  9 => 120, 10 => 150,
            _ => 0,
        }
    }

    #[view(canQuest)]
    fn can_quest(&self, hero_id: u64) -> bool {
        if self.heroes(hero_id).is_empty() {
            return false;
        }
        let hero = self.heroes(hero_id).get();
        let current_block = self.blockchain().get_block_nonce();
        current_block >= hero.last_quest_block + QUEST_COOLDOWN_BLOCKS
    }

    #[view(getTreasuryBalance)]
    fn get_treasury_balance(&self) -> BigUint {
        self.treasury_balance().get()
    }

    fn calculate_variance(&self, seed: u64, stat_type: u32) -> u32 {
        let hash = (seed * 997 + stat_type as u64 * 1009) % 100;
        (hash % 8) as u32
    }

    fn generate_random(&self, hero_id: u64, block_nonce: u64) -> u64 {
        let hash = (hero_id * 1009 + block_nonce * 997) % 1000;
        hash
    }

    #[only_owner]
    #[endpoint(withdrawTreasury)]
    fn withdraw_treasury(&self, amount: BigUint) {
        let balance = self.treasury_balance().get();
        require!(amount <= balance, "Insufficient treasury balance");
        
        let owner = self.contract_owner().get();
        self.treasury_balance().update(|b| *b -= &amount);
        self.send().direct_egld(&owner, &amount);
    }

    #[storage_mapper("heroes")]
    fn heroes(&self, hero_id: u64) -> SingleValueMapper<Hero<Self::Api>>;

    #[storage_mapper("ownerHeroes")]
    fn owner_heroes(&self, owner: &ManagedAddress) -> UnorderedSetMapper<u64>;

    #[storage_mapper("heroCounter")]
    fn hero_counter(&self) -> SingleValueMapper<u64>;

    #[storage_mapper("treasuryBalance")]
    fn treasury_balance(&self) -> SingleValueMapper<BigUint>;

    #[storage_mapper("contractOwner")]
    fn contract_owner(&self) -> SingleValueMapper<ManagedAddress>;

    #[event("heroSummoned")]
    fn hero_summoned_event(
        &self,
        #[indexed] owner: &ManagedAddress,
        #[indexed] hero_id: u64,
        planet: Planet,
        arcana: Arcana,
    );

    #[event("questCompleted")]
    fn quest_completed_event(
        &self,
        #[indexed] hero_id: u64,
        #[indexed] quest_id: u32,
        xp_gained: u64,
        success: bool,
    );

    #[event("levelUp")]
    fn level_up_event(&self, #[indexed] hero_id: u64, new_level: u32);

    #[event("heroRenamed")]
    fn hero_renamed_event(&self, #[indexed] hero_id: u64, new_name: ManagedBuffer<Self::Api>);
}
