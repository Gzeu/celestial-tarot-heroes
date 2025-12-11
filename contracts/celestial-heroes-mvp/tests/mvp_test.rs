#![allow(deprecated)]

use multiversx_sc_scenario::*;

fn world() -> ScenarioWorld {
    let mut blockchain = ScenarioWorld::new();
    blockchain.register_contract(
        "mxsc:output/celestial-heroes-mvp.mxsc.json",
        celestial_heroes_mvp::ContractBuilder,
    );
    blockchain
}

#[test]
fn test_init() {
    let mut world = world();
    
    world.run("scenarios/init.scen.json");
}

#[test]
fn test_summon_hero() {
    let mut world = world();
    
    world.run("scenarios/summon.scen.json");
}

#[test]
fn test_quest_and_levelup() {
    let mut world = world();
    
    world.run("scenarios/quest_levelup.scen.json");
}

#[test]
fn test_ownership() {
    let mut world = world();
    
    world.run("scenarios/ownership.scen.json");
}
