import test from 'node:test';
import assert from 'node:assert/strict';
import { CROPS, LOTTERY_COST, LOTTERY_TEN_COST } from '../constants';
import type { GameState } from '../types';
import { createDefaultGameState } from './useGameState';
import {
  addGold,
  commitHarvestAll,
  commitPlantAll,
  drawLottery,
  drawLotteryBatch,
  harvestPlot,
  planHarvestAll,
  planPlantAll,
  plantSeed,
  useInventoryItem,
} from './useGameActions';

const withState = (overrides: Partial<GameState>): GameState => ({
  ...createDefaultGameState(),
  ...overrides,
});

test('plantSeed deducts gold and stores crop timing', () => {
  const now = 123456789;
  const next = plantSeed(withState({ gold: 100 }), 'wheat', 0, now);

  assert.equal(next.gold, 100 - CROPS.wheat.seedCost);
  assert.equal(next.plots[0].cropId, 'wheat');
  assert.equal(next.plots[0].plantedAt, now);
});

test('addGold lets testers recover from zero gold by adding 10000 coins', () => {
  const next = addGold(withState({ gold: 0 }), 10_000);

  assert.equal(next.gold, 10_000);
});

test('harvestPlot returns gold and xp when crop is ready', () => {
  const now = 2_000_000;
  const plantedAt = now - CROPS.wheat.growthTime * 1000;
  const state = withState({
    plots: [
      { id: 0, cropId: 'wheat', plantedAt, isHarvestable: false, isWatered: true },
      ...createDefaultGameState().plots.slice(1),
    ],
  });

  const result = harvestPlot(state, 0, now);

  assert.ok(result);
  assert.equal(result?.finalGold, CROPS.wheat.harvestValue);
  assert.equal(result?.goldMultiplier, 1);
  assert.equal(result?.nextState.gold, state.gold + CROPS.wheat.harvestValue);
  assert.equal(result?.nextState.xp, state.xp + CROPS.wheat.xpReward);
  assert.equal(result?.nextState.plots[0].cropId, null);
});

test('planHarvestAll returns no_ready when nothing is ready', () => {
  const state = withState({});

  const result = planHarvestAll(state, 5_000);

  assert.equal(result.blockedReason, 'no_ready');
  assert.deepEqual(result.plotIds, []);
  assert.equal(result.totalGold, 0);
  assert.equal(result.totalXp, 0);
});

test('planPlantAll uses the selected seed and caps count by gold and empty plots', () => {
  const state = withState({ gold: CROPS.wheat.seedCost * 2 });

  const result = planPlantAll(state, 'wheat', 5_000);

  assert.equal(result.blockedReason, 'none');
  assert.equal(result.seedId, 'wheat');
  assert.equal(result.plotIds.length, 2);
  assert.equal(result.affordableCount, 2);
  assert.equal(result.totalCost, CROPS.wheat.seedCost * 2);
});

test('commitHarvestAll clears only selected ready plots and sums gold and xp', () => {
  const now = 2_000_000;
  const wheatPlantedAt = now - CROPS.wheat.growthTime * 1000;
  const cornPlantedAt = now - CROPS.corn.growthTime * 1000;
  const state = withState({
    gold: 100,
    xp: 7,
    plots: [
      { id: 0, cropId: 'wheat', plantedAt: wheatPlantedAt, isHarvestable: false, isWatered: true },
      { id: 1, cropId: 'corn', plantedAt: cornPlantedAt, isHarvestable: false, isWatered: true },
      { id: 2, cropId: 'carrot', plantedAt: now, isHarvestable: false, isWatered: true },
      ...createDefaultGameState().plots.slice(3),
    ],
  });

  const result = commitHarvestAll(state, [0, 1], now);

  assert.equal(result.nextState.gold, 100 + CROPS.wheat.harvestValue + CROPS.corn.harvestValue);
  assert.equal(result.nextState.xp, 7 + CROPS.wheat.xpReward + CROPS.corn.xpReward);
  assert.equal(result.nextState.plots[0].cropId, null);
  assert.equal(result.nextState.plots[1].cropId, null);
  assert.equal(result.nextState.plots[2].cropId, 'carrot');
  assert.equal(result.totalGold, CROPS.wheat.harvestValue + CROPS.corn.harvestValue);
  assert.equal(result.totalXp, CROPS.wheat.xpReward + CROPS.corn.xpReward);
});

test('commitPlantAll plants only the planned ids using the selected seed', () => {
  const now = 123_456;
  const state = withState({
    gold: 200,
    plots: [
      { id: 0, cropId: null, plantedAt: null, isHarvestable: false, isWatered: true },
      { id: 1, cropId: null, plantedAt: null, isHarvestable: false, isWatered: true },
      { id: 2, cropId: 'corn', plantedAt: now - 1_000, isHarvestable: false, isWatered: true },
      ...createDefaultGameState().plots.slice(3),
    ],
  });

  const result = commitPlantAll(state, [1], 'wheat', now);

  assert.equal(result.nextState.gold, 200 - CROPS.wheat.seedCost);
  assert.equal(result.nextState.plots[0].cropId, null);
  assert.equal(result.nextState.plots[1].cropId, 'wheat');
  assert.equal(result.nextState.plots[1].plantedAt, now);
  assert.equal(result.nextState.plots[2].cropId, 'corn');
  assert.equal(result.totalCost, CROPS.wheat.seedCost);
});

test('planPlantAll returns insufficient_gold when the selected seed cannot be afforded', () => {
  const state = withState({ gold: CROPS.watermelon.seedCost - 1 });

  const result = planPlantAll(state, 'watermelon', 5_000);

  assert.equal(result.blockedReason, 'insufficient_gold');
  assert.deepEqual(result.plotIds, []);
  assert.equal(result.affordableCount, 0);
});

test('drawLottery deducts gold and grants inventory for prop rewards', () => {
  const state = withState({ gold: 500 });
  const result = drawLottery(state, 0.07);

  assert.equal(result.reward.type, 'prop');
  assert.equal(result.reward.id, 'golden_bell');
  assert.equal(result.reward.rarity, 'epic');
  assert.equal(result.effect.kind, 'epic');
  assert.equal(result.effect.triggerSparkles, true);
  assert.equal(result.nextState.gold, 500 - LOTTERY_COST);
  assert.equal(result.nextState.inventory[0].id, result.reward.id);
  assert.equal(result.nextState.inventory[0].count, 1);
});

test('drawLottery returns legendary feedback for skin rewards so App can drive fullscreen effects', () => {
  const state = withState({ gold: 500 });
  const result = drawLottery(state, 0);

  assert.equal(result?.reward.type, 'skin');
  assert.equal(result?.reward.rarity, 'legendary');
  assert.equal(result?.effect.kind, 'legendary');
  assert.equal(result?.effect.triggerButterflies, true);
  assert.equal(result?.effect.triggerSparkles, true);
  assert.equal(result?.effect.triggerRainbow, true);
});

test('drawLottery applies gold rewards immediately instead of storing them in inventory', () => {
  const state = withState({ gold: 500 });
  const result = drawLottery(state, 0.95);

  assert.equal(result?.reward.type, 'gold');
  assert.equal(result?.reward.id, 'gold_pack_small');
  assert.equal(result?.nextState.gold, 500 - LOTTERY_COST + 100);
  assert.deepEqual(result?.nextState.inventory, []);
});

test('drawLotteryBatch deducts discounted gold for ten draws', () => {
  const state = withState({ gold: 1000 });
  const result = drawLotteryBatch(state, new Array(10).fill(0.95));

  assert.ok(result);
  assert.equal(result?.drawCount, 10);
  assert.equal(result?.nextState.gold, 1000 - LOTTERY_TEN_COST + 1000);
});

test('drawLotteryBatch accumulates ten rewards and sorts display rewards by rarity', () => {
  const state = withState({ gold: 1000 });
  const result = drawLotteryBatch(state, [0.95, 0.07, 0.36, 0, 0.51, 0.18, 0.2, 0.85, 0.51, 0.36]);

  assert.ok(result);
  assert.equal(result?.rewards.length, 10);
  assert.equal(result?.displayRewards.length, 10);
  assert.equal(result?.primaryReward.id, 'sacred_spring');
  assert.equal(result?.highRarityCount, 3);
  assert.deepEqual(
    result?.displayRewards.slice(0, 6).map((reward) => reward.id),
    ['sacred_spring', 'golden_bell', 'magic_bean', 'cyber_skin_fragment', 'ancient_fertilizer', 'cyber_skin_fragment'],
  );
});

test('drawLotteryBatch returns null when gold is below the ten-draw price', () => {
  const state = withState({ gold: LOTTERY_TEN_COST - 1 });
  const result = drawLotteryBatch(state, new Array(10).fill(0.95));

  assert.equal(result, null);
});

test('useInventoryItem consumes growth props on the most progressed crop', () => {
  const now = 10_000;
  const state = withState({
    inventory: [
      {
        id: 'magic_water',
        name: 'Magic Water',
        type: 'prop',
        icon: 'M',
        count: 1,
        effectValue: 0.5,
      },
    ],
    plots: [
      { id: 0, cropId: 'wheat', plantedAt: now - 4000, isHarvestable: false, isWatered: true },
      { id: 1, cropId: 'wheat', plantedAt: now - 2000, isHarvestable: false, isWatered: true },
      ...createDefaultGameState().plots.slice(2),
    ],
  });

  const result = useInventoryItem(state, 'magic_water', now);

  assert.equal(result.status, 'applied');
  assert.equal(result.nextState.inventory[0].count, 0);
  assert.equal(result.nextState.plots[0].plantedAt, state.plots[0].plantedAt! - CROPS.wheat.growthTime * 0.5 * 1000);
});
