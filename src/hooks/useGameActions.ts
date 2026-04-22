import {useCallback} from 'react';
import type {Dispatch, SetStateAction} from 'react';
import {CROPS, LOTTERY_COST, LOTTERY_TEN_COST, PRIZE_POOL, PROPS, getPrizeFallbackIcon} from '../constants';
import type {CropType, GameState, LotteryEffect, LotterySessionResult, PrizePoolItem, SkinId} from '../types';

interface HarvestFeedback {
  plotId: number;
  finalGold: number;
  goldMultiplier: number;
}

interface ActionEffects {
  onHarvestFeedback?: (feedback: HarvestFeedback) => void;
  onDivineFlare?: () => void;
  onCyberAurora?: () => void;
  onLotteryResolved?: (result: LotterySessionResult) => void;
  onNoGrowablePlots?: () => void;
}

interface UseGameActionsOptions extends ActionEffects {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  selectedSeed: CropType;
}

export interface HarvestResult {
  nextState: GameState;
  finalGold: number;
  goldMultiplier: number;
  cropId: CropType;
}

export interface DrawLotteryResult {
  nextState: GameState;
  reward: PrizePoolItem;
  effect: LotteryEffect;
}

export interface DrawLotteryBatchResult {
  nextState: GameState;
  rewards: PrizePoolItem[];
  displayRewards: PrizePoolItem[];
  primaryReward: PrizePoolItem;
  summaryEffect: LotteryEffect;
  highRarityCount: number;
  drawCount: number;
}

export interface UseInventoryItemResult {
  nextState: GameState;
  status: 'applied' | 'missing_item' | 'no_target';
}

export type BulkBlockedReason = 'none' | 'no_ready' | 'no_empty' | 'insufficient_gold' | 'insufficient_level';

export interface HarvestAllPlanItem {
  plotId: number;
  cropId: CropType;
  rewardGold: number;
  rewardXp: number;
}

export interface HarvestAllPlan {
  blockedReason: BulkBlockedReason;
  plotIds: number[];
  totalGold: number;
  totalXp: number;
  perPlot: HarvestAllPlanItem[];
}

export interface PlantAllPlan {
  blockedReason: BulkBlockedReason;
  plotIds: number[];
  totalCost: number;
  affordableCount: number;
  seedId: CropType;
}

export interface HarvestAllCommitResult {
  nextState: GameState;
  totalGold: number;
  totalXp: number;
  plotIds: number[];
}

export interface PlantAllCommitResult {
  nextState: GameState;
  totalCost: number;
  plotIds: number[];
  seedId: CropType;
}

const isPlotReady = (state: GameState, plotId: number, now: number) => {
  const plot = state.plots.find((item) => item.id === plotId);
  if (!plot?.cropId || !plot.plantedAt) {
    return false;
  }

  return now - plot.plantedAt >= CROPS[plot.cropId].growthTime * 1000;
};

const PLOT_COLUMNS = 4;

const sortPlotIdsForBulk = (plotIds: number[]) =>
  [...plotIds].sort((left, right) => {
    const leftRow = Math.floor(left / PLOT_COLUMNS);
    const rightRow = Math.floor(right / PLOT_COLUMNS);

    if (leftRow !== rightRow) {
      return rightRow - leftRow;
    }

    return left - right;
  });

const getGoldMultiplier = (state: GameState, now: number) =>
  state.activeBuffs
    .filter((buff) => buff.type === 'gold_boost' && buff.expiresAt > now)
    .reduce((current, buff) => current * buff.multiplier, 1);

export const getReadyPlotIds = (state: GameState, now = Date.now()) =>
  sortPlotIdsForBulk(
    state.plots
      .filter((plot) => plot.cropId && plot.plantedAt && isPlotReady(state, plot.id, now))
      .map((plot) => plot.id),
  );

export const getEmptyPlotIds = (state: GameState) =>
  sortPlotIdsForBulk(state.plots.filter((plot) => !plot.cropId).map((plot) => plot.id));

const canPlantCrop = (state: GameState, selectedSeed: CropType) =>
  state.level >= CROPS[selectedSeed].unlockLevel;

export const planHarvestAll = (state: GameState, now = Date.now()): HarvestAllPlan => {
  const plotIds = getReadyPlotIds(state, now);
  if (plotIds.length === 0) {
    return {
      blockedReason: 'no_ready',
      plotIds: [],
      totalGold: 0,
      totalXp: 0,
      perPlot: [],
    };
  }

  const goldMultiplier = getGoldMultiplier(state, now);
  const perPlot = plotIds.flatMap((plotId) => {
    const plot = state.plots.find((item) => item.id === plotId);
    if (!plot?.cropId) {
      return [];
    }

    const crop = CROPS[plot.cropId];
    return [
      {
        plotId,
        cropId: crop.id,
        rewardGold: Math.floor(crop.harvestValue * goldMultiplier),
        rewardXp: crop.xpReward,
      },
    ];
  });

  return {
    blockedReason: perPlot.length > 0 ? 'none' : 'no_ready',
    plotIds: perPlot.map((item) => item.plotId),
    totalGold: perPlot.reduce((sum, item) => sum + item.rewardGold, 0),
    totalXp: perPlot.reduce((sum, item) => sum + item.rewardXp, 0),
    perPlot,
  };
};

export const planPlantAll = (state: GameState, selectedSeed: CropType, _now = Date.now()): PlantAllPlan => {
  if (!canPlantCrop(state, selectedSeed)) {
    return {
      blockedReason: 'insufficient_level',
      plotIds: [],
      totalCost: 0,
      affordableCount: 0,
      seedId: selectedSeed,
    };
  }

  const plotIds = getEmptyPlotIds(state);
  if (plotIds.length === 0) {
    return {
      blockedReason: 'no_empty',
      plotIds: [],
      totalCost: 0,
      affordableCount: 0,
      seedId: selectedSeed,
    };
  }

  const seedCost = CROPS[selectedSeed].seedCost;
  const affordableCount = Math.floor(state.gold / seedCost);
  if (affordableCount <= 0) {
    return {
      blockedReason: 'insufficient_gold',
      plotIds: [],
      totalCost: 0,
      affordableCount: 0,
      seedId: selectedSeed,
    };
  }

  const plannedPlotIds = plotIds.slice(0, Math.min(plotIds.length, affordableCount));

  return {
    blockedReason: 'none',
    plotIds: plannedPlotIds,
    totalCost: plannedPlotIds.length * seedCost,
    affordableCount,
    seedId: selectedSeed,
  };
};

export const commitHarvestAll = (
  state: GameState,
  plotIds: number[],
  now = Date.now(),
): HarvestAllCommitResult => {
  const planned = planHarvestAll(state, now);
  const selectedIds = new Set(plotIds);
  const harvested = planned.perPlot.filter((item) => selectedIds.has(item.plotId));
  const harvestedIds = new Set(harvested.map((item) => item.plotId));

  return {
    nextState: {
      ...state,
      gold: state.gold + harvested.reduce((sum, item) => sum + item.rewardGold, 0),
      xp: state.xp + harvested.reduce((sum, item) => sum + item.rewardXp, 0),
      plots: state.plots.map((plot) =>
        harvestedIds.has(plot.id)
          ? {...plot, cropId: null, plantedAt: null, isHarvestable: false}
          : plot,
      ),
    },
    totalGold: harvested.reduce((sum, item) => sum + item.rewardGold, 0),
    totalXp: harvested.reduce((sum, item) => sum + item.rewardXp, 0),
    plotIds: harvested.map((item) => item.plotId),
  };
};

export const commitPlantAll = (
  state: GameState,
  plotIds: number[],
  selectedSeed: CropType,
  now = Date.now(),
): PlantAllCommitResult => {
  if (!canPlantCrop(state, selectedSeed)) {
    return {
      nextState: state,
      totalCost: 0,
      plotIds: [],
      seedId: selectedSeed,
    };
  }

  const emptyPlotIds = new Set(getEmptyPlotIds(state));
  const seedCost = CROPS[selectedSeed].seedCost;
  const safePlotIds: number[] = [];
  let remainingGold = state.gold;

  for (const plotId of plotIds) {
    if (!emptyPlotIds.has(plotId) || remainingGold < seedCost) {
      continue;
    }

    safePlotIds.push(plotId);
    remainingGold -= seedCost;
  }

  const plantedIds = new Set(safePlotIds);

  return {
    nextState: {
      ...state,
      gold: state.gold - safePlotIds.length * seedCost,
      plots: state.plots.map((plot) =>
        plantedIds.has(plot.id)
          ? {...plot, cropId: selectedSeed, plantedAt: now, isHarvestable: false}
          : plot,
      ),
    },
    totalCost: safePlotIds.length * seedCost,
    plotIds: safePlotIds,
    seedId: selectedSeed,
  };
};

const resolveLotteryEffect = (reward: PrizePoolItem): LotteryEffect => {
  return {
    kind: reward.rarity,
    triggerCoins: reward.type === 'gold' || reward.specialEffect === 'gold_rain',
    triggerButterflies: reward.specialEffect === 'butterfly_burst',
    triggerRainbow: reward.rarity === 'legendary' || reward.specialEffect === 'sparkle_flare',
    triggerSparkles:
      reward.rarity === 'epic' ||
      reward.rarity === 'legendary' ||
      reward.specialEffect === 'sparkle_flare',
  };
};

const buildInventoryItemFromReward = (reward: PrizePoolItem) => {
  const propConfig = reward.type === 'prop' ? PROPS[reward.id as keyof typeof PROPS] : undefined;
  const effectValue = propConfig && 'effect' in propConfig ? propConfig.effect : undefined;
  const multiplier = propConfig && 'multiplier' in propConfig ? propConfig.multiplier : undefined;
  const duration = propConfig && 'duration' in propConfig ? propConfig.duration : undefined;

  return {
    id: reward.id,
    name: reward.name,
    icon: propConfig?.icon ?? getPrizeFallbackIcon(reward),
    type: reward.type,
    count: 1,
    description: reward.description,
    image: reward.image,
    effectValue,
    multiplier,
    duration,
  } as const;
};

const LOTTERY_RARITY_PRIORITY = {
  common: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
} as const;

const resolveRewardFromRandomValue = (randomValue: number) => {
  const totalWeight = PRIZE_POOL.reduce((sum, prize) => sum + prize.weight, 0);
  let remaining = Math.max(0, Math.min(0.999999, randomValue)) * totalWeight;
  let reward = PRIZE_POOL[0];

  for (const prize of PRIZE_POOL) {
    if (remaining < prize.weight) {
      reward = prize;
      break;
    }

    remaining -= prize.weight;
  }

  return reward;
};

const settleLotteryReward = (state: GameState, reward: PrizePoolItem, cost: number): GameState => {
  if (reward.type === 'skin') {
    return {
      ...state,
      gold: state.gold - cost,
      activeSkin: reward.id as SkinId,
    };
  }

  if (reward.type === 'gold') {
    return {
      ...state,
      gold: state.gold - cost + (reward.rewardGold ?? 0),
    };
  }

  const existingItem = state.inventory.find((item) => item.id === reward.id);
  const inventory = existingItem
    ? state.inventory.map((item) =>
        item.id === reward.id ? {...item, count: item.count + 1} : item,
      )
    : [...state.inventory, buildInventoryItemFromReward(reward)];

  return {
    ...state,
    gold: state.gold - cost,
    inventory,
  };
};

const sortRewardsByRarity = (rewards: PrizePoolItem[]) =>
  rewards
    .map((reward, index) => ({reward, index}))
    .sort((left, right) => {
      const rarityDiff =
        LOTTERY_RARITY_PRIORITY[right.reward.rarity] - LOTTERY_RARITY_PRIORITY[left.reward.rarity];
      return rarityDiff !== 0 ? rarityDiff : left.index - right.index;
    })
    .map(({reward}) => reward);

const mergeLotteryEffects = (effects: LotteryEffect[]): LotteryEffect => {
  const primaryEffect = effects.reduce((current, effect) =>
    LOTTERY_RARITY_PRIORITY[effect.kind] > LOTTERY_RARITY_PRIORITY[current.kind] ? effect : current,
  );

  return {
    kind: primaryEffect.kind,
    triggerCoins: effects.some((effect) => effect.triggerCoins),
    triggerButterflies: effects.some((effect) => effect.triggerButterflies),
    triggerRainbow: effects.some((effect) => effect.triggerRainbow),
    triggerSparkles: effects.some((effect) => effect.triggerSparkles),
  };
};

const toLotterySessionResult = (
  result: DrawLotteryResult | DrawLotteryBatchResult,
): LotterySessionResult => {
  if ('rewards' in result) {
    return {
      drawCount: result.drawCount,
      rewards: result.rewards,
      displayRewards: result.displayRewards,
      primaryReward: result.primaryReward,
      summaryEffect: result.summaryEffect,
      highRarityCount: result.highRarityCount,
    };
  }

  return {
    drawCount: 1,
    rewards: [result.reward],
    displayRewards: [result.reward],
    primaryReward: result.reward,
    summaryEffect: result.effect,
    highRarityCount: result.reward.rarity === 'epic' || result.reward.rarity === 'legendary' ? 1 : 0,
  };
};

export const plantSeed = (
  state: GameState,
  selectedSeed: CropType,
  plotId: number,
  now = Date.now(),
): GameState => {
  const crop = CROPS[selectedSeed];
  const targetPlot = state.plots.find((plot) => plot.id === plotId);
  if (state.gold < crop.seedCost || !targetPlot || targetPlot.cropId || !canPlantCrop(state, selectedSeed)) {
    return state;
  }

  return {
    ...state,
    gold: state.gold - crop.seedCost,
    plots: state.plots.map((plot) =>
      plot.id === plotId
        ? {...plot, cropId: selectedSeed, plantedAt: now, isHarvestable: false}
        : plot,
    ),
  };
};

export const addGold = (state: GameState, amount: number): GameState => {
  if (amount <= 0) {
    return state;
  }

  return {
    ...state,
    gold: state.gold + amount,
  };
};

export const harvestPlot = (state: GameState, plotId: number, now = Date.now()): HarvestResult | null => {
  const plot = state.plots.find((item) => item.id === plotId);
  if (!plot?.cropId || !isPlotReady(state, plotId, now)) {
    return null;
  }

  const crop = CROPS[plot.cropId];
  const goldMultiplier = getGoldMultiplier(state, now);
  const finalGold = Math.floor(crop.harvestValue * goldMultiplier);

  return {
    nextState: {
      ...state,
      gold: state.gold + finalGold,
      xp: state.xp + crop.xpReward,
      plots: state.plots.map((item) =>
        item.id === plotId ? {...item, cropId: null, plantedAt: null, isHarvestable: false} : item,
      ),
    },
    finalGold,
    goldMultiplier,
    cropId: crop.id,
  };
};

export const drawLottery = (state: GameState, randomValue = Math.random()): DrawLotteryResult | null => {
  if (state.gold < LOTTERY_COST) {
    return null;
  }

  const reward = resolveRewardFromRandomValue(randomValue);
  const effect = resolveLotteryEffect(reward);

  return {
    reward,
    effect,
    nextState: settleLotteryReward(state, reward, LOTTERY_COST),
  };
};

export const drawLotteryBatch = (
  state: GameState,
  randomValues = Array.from({length: 10}, () => Math.random()),
): DrawLotteryBatchResult | null => {
  if (state.gold < LOTTERY_TEN_COST) {
    return null;
  }

  const rewards: PrizePoolItem[] = [];
  const effects: LotteryEffect[] = [];
  let currentState = state;

  for (let index = 0; index < 10; index += 1) {
    const reward = resolveRewardFromRandomValue(randomValues[index] ?? Math.random());
    const effect = resolveLotteryEffect(reward);

    rewards.push(reward);
    effects.push(effect);
    currentState = settleLotteryReward(currentState, reward, 0);
  }

  const nextState = {
    ...currentState,
    gold: currentState.gold - LOTTERY_TEN_COST,
  };
  const displayRewards = sortRewardsByRarity(rewards);
  const primaryReward = displayRewards[0];

  return {
    nextState,
    rewards,
    displayRewards,
    primaryReward,
    summaryEffect: mergeLotteryEffects(effects),
    highRarityCount: rewards.filter((reward) => reward.rarity === 'epic' || reward.rarity === 'legendary').length,
    drawCount: rewards.length,
  };
};

export const useInventoryItem = (state: GameState, itemId: string, now = Date.now()): UseInventoryItemResult => {
  const inventoryItem = state.inventory.find((item) => item.id === itemId);
  const propConfig = PROPS[itemId];

  if (!inventoryItem || inventoryItem.count <= 0 || !propConfig) {
    return {nextState: state, status: 'missing_item'};
  }

  if (propConfig.type === 'buff') {
    return {
      status: 'applied',
      nextState: {
        ...state,
        inventory: state.inventory.map((item) =>
          item.id === itemId ? {...item, count: item.count - 1} : item,
        ),
        activeBuffs: [
          ...state.activeBuffs,
          {
            id: `${itemId}_${now}`,
            type: itemId === 'golden_bell' ? 'gold_boost' : 'growth_speed',
            multiplier: inventoryItem.multiplier ?? propConfig.multiplier ?? 1,
            expiresAt: now + ((inventoryItem.duration ?? propConfig.duration ?? 0) * 1000),
          },
        ],
      },
    };
  }

  const availablePlots = state.plots
    .filter((plot) => plot.cropId && plot.plantedAt && !isPlotReady(state, plot.id, now))
    .sort((left, right) => (left.plantedAt || 0) - (right.plantedAt || 0));

  if (availablePlots.length === 0) {
    return {nextState: state, status: 'no_target'};
  }

  const targetPlot = availablePlots[0];
  const growthTime = CROPS[targetPlot.cropId!].growthTime;
  const effect = inventoryItem.effectValue ?? propConfig.effect ?? 0;
  const acceleratedPlantedAt = (targetPlot.plantedAt || now) - growthTime * effect * 1000;

  return {
    status: 'applied',
    nextState: {
      ...state,
      inventory: state.inventory.map((item) =>
        item.id === itemId ? {...item, count: item.count - 1} : item,
      ),
      plots: state.plots.map((plot) =>
        plot.id === targetPlot.id ? {...plot, plantedAt: acceleratedPlantedAt} : plot,
      ),
    },
  };
};

export const useGameActions = ({
  gameState,
  setGameState,
  selectedSeed,
  onHarvestFeedback,
  onDivineFlare,
  onCyberAurora,
  onLotteryResolved,
  onNoGrowablePlots,
}: UseGameActionsOptions) => {
  const handlePlant = useCallback(
    (plotId: number) => {
      setGameState((previous) => plantSeed(previous, selectedSeed, plotId));
    },
    [selectedSeed, setGameState],
  );

  const handleHarvest = useCallback(
    (plotId: number) => {
      const result = harvestPlot(gameState, plotId);
      if (!result) {
        return;
      }

      setGameState(result.nextState);
      onHarvestFeedback?.({
        plotId,
        finalGold: result.finalGold,
        goldMultiplier: result.goldMultiplier,
      });

      if (result.cropId === 'magic_bean' && gameState.activeSkin === 'sacred_spring') {
        onDivineFlare?.();
      }
    },
    [gameState, onDivineFlare, onHarvestFeedback, setGameState],
  );

  const handleDraw = useCallback((count = 1) => {
    const result = count === 10 ? drawLotteryBatch(gameState) : drawLottery(gameState);
    if (!result) {
      return null;
    }

    const sessionResult = toLotterySessionResult(result);
    setGameState(result.nextState);
    onLotteryResolved?.(sessionResult);

    if (sessionResult.highRarityCount > 0 && gameState.activeSkin === 'sacred_spring') {
      onDivineFlare?.();
    }

    if (sessionResult.summaryEffect.triggerRainbow) {
      onCyberAurora?.();
    }

    return result;
  }, [gameState, onCyberAurora, onDivineFlare, onLotteryResolved, setGameState]);

  const handleUseProp = useCallback(
    (itemId: string) => {
      const result = useInventoryItem(gameState, itemId);
      if (result.status === 'no_target') {
        onNoGrowablePlots?.();
        return;
      }

      if (result.status === 'missing_item') {
        return;
      }

      setGameState(result.nextState);
    },
    [gameState, onNoGrowablePlots, setGameState],
  );

  const handleAddGold = useCallback(
    (amount: number) => {
      setGameState((previous) => addGold(previous, amount));
    },
    [setGameState],
  );

  return {
    handlePlant,
    handleHarvest,
    handleDraw,
    handleUseProp,
    handleAddGold,
  };
};
