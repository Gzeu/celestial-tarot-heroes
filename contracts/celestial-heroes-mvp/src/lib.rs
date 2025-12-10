#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

const MIN_SUMMON_PAYMENT: u64 = 50_000_000_000_000_000; // 0.05 EGLD
const QUEST_XP_REWARD: u64 = 100;
const LEVELUP_XP_COST: u64 = 100;

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct HeroMVP<M: ManagedTypeApi> {
    pub id: u64,
    pub level: u32,
    pub xp: u64,
    pub strength: u32,
    pub wisdom: u32,
    pub luck: u32,
    pub name: ManagedBuffer<M>,
}

#[multiversx_sc::contract]
pub trait CelestialHeroesMVPContract {
    #[init]
    fn init(&self) {
        self.hero_counter().set(1u64);
    }

    /// Summon a hero (Sun + The Fool, fixed stats)
    #[payable("EGLD")]
    #[endpoint(summonHero)]
    fn summon_hero(&self) -> u64 {
        let payment = self.call_value().egld_value().clone_value();
        require!(
            payment >= BigUint::from(MIN_SUMMON_PAYMENT),
            "Minimum 0.05 EGLD required"
        );

        let caller = self.blockchain().get_caller();
        let hero_id = self.hero_counter().get();

        let hero = HeroMVP {
            id: hero_id,
            level: 1,
            xp: 0,
            strength: 20,
            wisdom: 15,
            luck: 13,
            name: ManagedBuffer::from(b"Hero"),
        };

        self.heroes(hero_id).set(&hero);
        self.owner_heroes(&caller).insert(hero_id);
        self.hero_counter().update(|x| *x += 1);

        self.hero_summoned_event(&caller, hero_id);
        hero_id
    }

    /// Complete quest (fixed 100 XP reward)
    #[endpoint(quest)]
    fn quest(&self, hero_id: u64) {
        let caller = self.blockchain().get_caller();
        require!(
            self.owner_heroes(&caller).contains(&hero_id),
            "Not hero owner"
        );

        let mut hero = self.heroes(hero_id).get();
        hero.xp += QUEST_XP_REWARD;
        self.heroes(hero_id).set(&hero);

        self.quest_completed_event(hero_id, QUEST_XP_REWARD);
    }

    /// Level up hero (costs 100 XP)
    #[endpoint(levelUp)]
    fn level_up(&self, hero_id: u64) {
        let caller = self.blockchain().get_caller();
        require!(
            self.owner_heroes(&caller).contains(&hero_id),
            "Not hero owner"
        );

        let mut hero = self.heroes(hero_id).get();
        require!(hero.xp >= LEVELUP_XP_COST, "Not enough XP");

        hero.xp -= LEVELUP_XP_COST;
        hero.level += 1;
        hero.strength += 3;
        hero.wisdom += 2;
        hero.luck += 1;

        self.heroes(hero_id).set(&hero);
        self.level_up_event(hero_id, hero.level);
    }

    // ========== VIEW ENDPOINTS ==========

    #[view(getHero)]
    fn get_hero(&self, hero_id: u64) -> HeroMVP<Self::Api> {
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

    // ========== STORAGE ==========

    #[storage_mapper("heroes")]
    fn heroes(&self, hero_id: u64) -> SingleValueMapper<HeroMVP<Self::Api>>;

    #[storage_mapper("ownerHeroes")]
    fn owner_heroes(&self, owner: &ManagedAddress) -> UnorderedSetMapper<u64>;

    #[storage_mapper("heroCounter")]
    fn hero_counter(&self) -> SingleValueMapper<u64>;

    // ========== EVENTS ==========

    #[event("heroSummoned")]
    fn hero_summoned_event(&self, #[indexed] owner: &ManagedAddress, #[indexed] hero_id: u64);

    #[event("questCompleted")]
    fn quest_completed_event(&self, #[indexed] hero_id: u64, xp_gained: u64);

    #[event("levelUp")]
    fn level_up_event(&self, #[indexed] hero_id: u64, new_level: u32);
}
