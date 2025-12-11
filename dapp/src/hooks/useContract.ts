import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers';
import { Address, ResultsParser } from '@multiversx/sdk-core';
import { CONTRACT_ADDRESS } from '../config';

const provider = new ProxyNetworkProvider('https://devnet-api.multiversx.com');
const resultsParser = new ResultsParser();

export interface Hero {
  id: number;
  level: number;
  xp: number;
  strength: number;
  wisdom: number;
  luck: number;
  name: string;
  planet?: number;
  arcana?: number;
  questCount?: number;
  totalQuestsCompleted?: number;
  lastQuestBlock?: number;
  creationTimestamp?: number;
}

/**
 * Get all hero IDs owned by an address
 */
export const getHeroesByOwner = async (ownerAddress: string): Promise<number[]> => {
  try {
    const query = provider.createQuery({
      address: new Address(CONTRACT_ADDRESS),
      func: 'getHeroesByOwner',
      args: [new Address(ownerAddress)],
    });

    const queryResponse = await provider.queryContract(query);
    const bundle = resultsParser.parseQueryResponse(queryResponse, {
      returnCode: { name: 'returnCode', type: 'ReturnCode' },
      returnMessage: { name: 'returnMessage', type: 'string' },
      values: { name: 'values', type: 'variadic<multi<u64>>' },
    });

    if (bundle.returnCode.isSuccess()) {
      const heroIds = bundle.values.map((value: any) => Number(value));
      return heroIds;
    }
    return [];
  } catch (error) {
    console.error('Error fetching heroes by owner:', error);
    return [];
  }
};

/**
 * Get detailed hero data by ID
 */
export const getHero = async (heroId: number): Promise<Hero | null> => {
  try {
    const query = provider.createQuery({
      address: new Address(CONTRACT_ADDRESS),
      func: 'getHero',
      args: [heroId],
    });

    const queryResponse = await provider.queryContract(query);
    const bundle = resultsParser.parseQueryResponse(queryResponse, {
      returnCode: { name: 'returnCode', type: 'ReturnCode' },
      returnMessage: { name: 'returnMessage', type: 'string' },
      values: { name: 'values', type: 'variadic<nested>' },
    });

    if (bundle.returnCode.isSuccess() && bundle.values.length > 0) {
      const heroData = bundle.values[0];
      
      // Parse hero struct (order matches contract)
      // MVP: id, level, xp, strength, wisdom, luck, name
      // Full: + nft_nonce, planet, arcana, quest_count, total_quests_completed, last_quest_block, creation_timestamp
      
      return {
        id: Number(heroData.id || heroData.nft_nonce || heroId),
        level: Number(heroData.level),
        xp: Number(heroData.xp),
        strength: Number(heroData.strength),
        wisdom: Number(heroData.wisdom),
        luck: Number(heroData.luck),
        name: heroData.name?.toString() || 'Hero',
        planet: heroData.planet !== undefined ? Number(heroData.planet) : undefined,
        arcana: heroData.arcana !== undefined ? Number(heroData.arcana) : undefined,
        questCount: heroData.quest_count !== undefined ? Number(heroData.quest_count) : undefined,
        totalQuestsCompleted: heroData.total_quests_completed !== undefined ? Number(heroData.total_quests_completed) : undefined,
        lastQuestBlock: heroData.last_quest_block !== undefined ? Number(heroData.last_quest_block) : undefined,
        creationTimestamp: heroData.creation_timestamp !== undefined ? Number(heroData.creation_timestamp) : undefined,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching hero:', error);
    return null;
  }
};

/**
 * Check if a hero can quest (cooldown check)
 */
export const canQuest = async (heroId: number): Promise<boolean> => {
  try {
    const query = provider.createQuery({
      address: new Address(CONTRACT_ADDRESS),
      func: 'canQuest',
      args: [heroId],
    });

    const queryResponse = await provider.queryContract(query);
    const bundle = resultsParser.parseQueryResponse(queryResponse, {
      returnCode: { name: 'returnCode', type: 'ReturnCode' },
      returnMessage: { name: 'returnMessage', type: 'string' },
      values: { name: 'values', type: 'variadic<bool>' },
    });

    if (bundle.returnCode.isSuccess() && bundle.values.length > 0) {
      return bundle.values[0];
    }
    return false;
  } catch (error) {
    console.error('Error checking quest eligibility:', error);
    return false;
  }
};

/**
 * Get required XP for next level
 */
export const getRequiredXp = async (currentLevel: number): Promise<number> => {
  try {
    const query = provider.createQuery({
      address: new Address(CONTRACT_ADDRESS),
      func: 'getRequiredXp',
      args: [currentLevel],
    });

    const queryResponse = await provider.queryContract(query);
    const bundle = resultsParser.parseQueryResponse(queryResponse, {
      returnCode: { name: 'returnCode', type: 'ReturnCode' },
      returnMessage: { name: 'returnMessage', type: 'string' },
      values: { name: 'values', type: 'variadic<u64>' },
    });

    if (bundle.returnCode.isSuccess() && bundle.values.length > 0) {
      return Number(bundle.values[0]);
    }
    // Fallback: MVP uses 100 XP flat, full uses level^2 * 50 + level * 100
    return 100;
  } catch (error) {
    console.error('Error fetching required XP:', error);
    return 100;
  }
};

/**
 * Get total hero count
 */
export const getHeroCount = async (): Promise<number> => {
  try {
    const query = provider.createQuery({
      address: new Address(CONTRACT_ADDRESS),
      func: 'getHeroCount',
      args: [],
    });

    const queryResponse = await provider.queryContract(query);
    const bundle = resultsParser.parseQueryResponse(queryResponse, {
      returnCode: { name: 'returnCode', type: 'ReturnCode' },
      returnMessage: { name: 'returnMessage', type: 'string' },
      values: { name: 'values', type: 'variadic<u64>' },
    });

    if (bundle.returnCode.isSuccess() && bundle.values.length > 0) {
      return Number(bundle.values[0]);
    }
    return 0;
  } catch (error) {
    console.error('Error fetching hero count:', error);
    return 0;
  }
};

/**
 * Get quest difficulty
 */
export const getQuestDifficulty = async (questId: number): Promise<number> => {
  try {
    const query = provider.createQuery({
      address: new Address(CONTRACT_ADDRESS),
      func: 'getQuestDifficulty',
      args: [questId],
    });

    const queryResponse = await provider.queryContract(query);
    const bundle = resultsParser.parseQueryResponse(queryResponse, {
      returnCode: { name: 'returnCode', type: 'ReturnCode' },
      returnMessage: { name: 'returnMessage', type: 'string' },
      values: { name: 'values', type: 'variadic<u64>' },
    });

    if (bundle.returnCode.isSuccess() && bundle.values.length > 0) {
      return Number(bundle.values[0]);
    }
    return 0;
  } catch (error) {
    console.error('Error fetching quest difficulty:', error);
    return 0;
  }
};
