import type {CropDef, CropId, GrowthStage, PlotState} from './types';

export const CROPS: Record<CropId, CropDef> = {
  wheat: {
    id: 'wheat',
    name: '小麦',
    growMs: 12_000,
    gold: 8,
    stages: {seed: 'seed', sprout: 'sprout', growing: 'leaf', mature: 'wheat'},
  },
  carrot: {
    id: 'carrot',
    name: '胡萝卜',
    growMs: 20_000,
    gold: 14,
    stages: {seed: 'seed', sprout: 'sprout', growing: 'leaf', mature: 'carrot'},
  },
  sunflower: {
    id: 'sunflower',
    name: '向日葵',
    growMs: 28_000,
    gold: 22,
    stages: {seed: 'seed', sprout: 'sprout', growing: 'stalk', mature: 'sunflower'},
  },
  star_pumpkin: {
    id: 'star_pumpkin',
    name: '星星南瓜',
    growMs: 36_000,
    gold: 36,
    stages: {seed: 'seed', sprout: 'sprout', growing: 'vine', mature: 'pumpkin'},
  },
};

export const SEED_ORDER: CropId[] = ['wheat', 'carrot', 'sunflower', 'star_pumpkin'];

/** Soil dries and needs water again (Stardew-like, shortened for P1). */
export const DRY_AFTER_MS = 8_000;

export function createEmptyPlots(count = 6): PlotState[] {
  return Array.from({length: count}, (_, id) => ({
    id,
    cropId: null,
    grownMs: 0,
    watered: false,
    wateredAt: null,
    progress: 0,
  }));
}

export function growthRate(watered: boolean): number {
  return watered ? 1 : 0.35;
}

export function isEffectivelyWatered(plot: PlotState, now: number): boolean {
  if (!plot.watered || plot.wateredAt == null) return false;
  return now - plot.wateredAt < DRY_AFTER_MS;
}

export function stageFromProgress(progress: number, hasCrop: boolean): GrowthStage {
  if (!hasCrop) return 'empty';
  if (progress >= 1) return 'mature';
  if (progress >= 0.66) return 'growing';
  if (progress >= 0.33) return 'sprout';
  return 'seed';
}

export function progressOf(plot: PlotState): number {
  if (!plot.cropId) return 0;
  return Math.min(1, plot.grownMs / CROPS[plot.cropId].growMs);
}

export function advancePlot(plot: PlotState, now: number, dtMs: number): PlotState {
  if (!plot.cropId) {
    return {...plot, watered: false, wateredAt: null, grownMs: 0, progress: 0};
  }

  let grownMs = plot.grownMs;
  let remaining = Math.max(0, dtMs);
  let cursor = now - remaining;

  // Integrate wet/dry in chunks so long ticks don't apply only the end-state rate.
  while (remaining > 0 && grownMs < CROPS[plot.cropId].growMs) {
    const wet = plot.wateredAt != null && cursor < plot.wateredAt + DRY_AFTER_MS;
    const wetEnds =
      wet && plot.wateredAt != null ? plot.wateredAt + DRY_AFTER_MS - cursor : remaining;
    const step = Math.min(remaining, Math.max(1, wetEnds));
    grownMs += step * growthRate(wet);
    cursor += step;
    remaining -= step;
    if (!wet) break; // dry for the rest
    if (remaining > 0 && cursor >= (plot.wateredAt ?? 0) + DRY_AFTER_MS) {
      // continue loop as dry
      continue;
    }
  }

  grownMs = Math.min(CROPS[plot.cropId].growMs, grownMs);
  const watered = isEffectivelyWatered(plot, now);
  return {
    ...plot,
    watered,
    wateredAt: watered ? plot.wateredAt : null,
    grownMs,
    progress: Math.min(1, grownMs / CROPS[plot.cropId].growMs),
  };
}


export type PrimaryKind = 'plant' | 'water' | 'harvest' | 'noop';

export function primaryKind(plot: PlotState): PrimaryKind {
  const stage = stageFromProgress(plot.progress, Boolean(plot.cropId));
  if (stage === 'empty') return 'plant';
  if (stage === 'mature') return 'harvest';
  if (!plot.watered) return 'water';
  return 'noop';
}

export function primaryLabel(kind: PrimaryKind, seedName: string): string {
  switch (kind) {
    case 'plant':
      return `播种 ${seedName}`;
    case 'water':
      return '浇水';
    case 'harvest':
      return '收获';
    default:
      return '生长中…';
  }
}
