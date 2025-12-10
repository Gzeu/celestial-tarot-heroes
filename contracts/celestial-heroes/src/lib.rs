#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

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
    pub name: ManagedBuffer<M>,
}

#[multiversx_sc::contract]
pub trait CelestialHeroesContract {
    #[init]
    fn init(&self) {
        self.hero_counter().set(1u64);
    }

    #[upgrade]
    fn upgrade(&self) {}

    // Summon a new hero NFT with numerology-based stats
    #[payable("EGLD")]
    #[endpoint(summonHero)]
    fn summon_hero(&self, planet: Planet, arcana: Arcana, name: ManagedBuffer) -> u64 {
        let payment = self.call_value().egld_value();
        require!(payment.clone_value() >= BigUint::from(100000000000000000u64), "Minimum 0.1 EGLD required");

        let caller = self.blockchain().get_caller();
        let hero_id = self.hero_counter().get();
        
        // Calculate stats based on numerology (planet + arcana values)
        let seed = (planet as u32) * 100 + (arcana as u32);
        let strength = self.calculate_stat(seed, 1);
        let wisdom = self.calculate_stat(seed, 2);
        let luck = self.calculate_stat(seed, 3);

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
            name,
        };

        self.heroes(hero_id).set(&hero);
        self.owner_heroes(&caller).insert(hero_id);
        self.hero_counter().update(|x| *x += 1);

        hero_id
    }

    // Send hero on quest to gain XP
    #[endpoint(quest)]
    fn quest(&self, hero_id: u64, quest_id: u32) {
        let caller = self.blockchain().get_caller();
        require!(self.owner_heroes(&caller).contains(&hero_id), "Not hero owner");
        require!(quest_id >= 1 && quest_id <= 5, "Invalid quest ID");

        let mut hero = self.heroes(hero_id).get();
        
        // XP calculation based on quest difficulty and hero stats
        let base_xp = match quest_id {
            1 => 50u64,
            2 => 100u64,
            3 => 200u64,
            4 => 350u64,
            5 => 500u64,
            _ => 0u64,
        };

        let luck_bonus = (hero.luck as u64) * 2;
        let total_xp = base_xp + luck_bonus;

        hero.xp += total_xp;
        hero.quest_count += 1;
        
        self.heroes(hero_id).set(&hero);

        self.quest_completed_event(hero_id, quest_id, total_xp);
    }

    // Level up hero using accumulated XP
    #[endpoint(levelUp)]
    fn level_up(&self, hero_id: u64) {
        let caller = self.blockchain().get_caller();
        require!(self.owner_heroes(&caller).contains(&hero_id), "Not hero owner");

        let mut hero = self.heroes(hero_id).get();
        let required_xp = self.get_required_xp(hero.level);
        
        require!(hero.xp >= required_xp, "Not enough XP");

        hero.xp -= required_xp;
        hero.level += 1;
        
        // Stat increases on level up
        hero.strength += 3 + (hero.level % 5);
        hero.wisdom += 2 + (hero.level % 4);
        hero.luck += 1 + (hero.level % 3);

        self.heroes(hero_id).set(&hero);

        self.level_up_event(hero_id, hero.level);
    }

    // View hero details
    #[view(getHero)]
    fn get_hero(&self, hero_id: u64) -> Hero<Self::Api> {
        self.heroes(hero_id).get()
    }

    // Get all hero IDs owned by address
    #[view(getHeroesByOwner)]
    fn get_heroes_by_owner(&self, owner: ManagedAddress) -> MultiValueEncoded<u64> {
        let mut result = MultiValueEncoded::new();
        for hero_id in self.owner_heroes(&owner).iter() {
            result.push(hero_id);
        }
        result
    }

    // Get XP required for next level
    #[view(getRequiredXp)]
    fn get_required_xp(&self, current_level: u32) -> u64 {
        (current_level as u64) * 100 + ((current_level as u64) * (current_level as u64)) * 50
    }

    // Internal: Calculate stat based on seed and multiplier
    fn calculate_stat(&self, seed: u32, multiplier: u32) -> u32 {
        let base = (seed % 10) + 5;
        base * multiplier + (seed / 10)
    }

    // Storage
    #[storage_mapper("heroes")]
    fn heroes(&self, hero_id: u64) -> SingleValueMapper<Hero<Self::Api>>;

    #[storage_mapper("ownerHeroes")]
    fn owner_heroes(&self, owner: &ManagedAddress) -> UnorderedSetMapper<u64>;

    #[storage_mapper("heroCounter")]
    fn hero_counter(&self) -> SingleValueMapper<u64>;

    // Events
    #[event("questCompleted")]
    fn quest_completed_event(&self, #[indexed] hero_id: u64, #[indexed] quest_id: u32, xp_gained: u64);

    #[event("levelUp")]
    fn level_up_event(&self, #[indexed] hero_id: u64, new_level: u32);
}
