export type CropId = 'wheat' | 'carrot' | 'sunflower' | 'star_pumpkin';

export type GrowthStage = 'empty' | 'seed' | 'sprout' | 'growing' | 'mature';

export interface CropDef {
  id: CropId;
  name: string;
  /** Effective watered grow time to mature */
  growMs: number;
  gold: number;
  stages: Record<Exclude<GrowthStage, 'empty'>, string>;
}

export interface PlotState {
  id: number;
  cropId: CropId | null;
  /** Accumulated effective growth milliseconds */
  grownMs: number;
  watered: boolean;
  wateredAt: number | null;
  progress: number;
}

export interface FarmPrototypeState {
  gold: number;
  selectedPlotId: number;
  selectedSeed: CropId;
  plots: PlotState[];
  lastAction: string | null;
  harvestBurstId: number;
  lastTickAt: number;
  harvestCount: number;
  lastHarvestCrop: CropId | null;
}

export type FarmAction =
  | {type: 'select_plot'; plotId: number}
  | {type: 'select_seed'; seed: CropId}
  | {type: 'primary'}
  /** Sticky tap / swipe brush: act on a specific plot. */
  | {type: 'apply_plot'; plotId: number; mode?: 'auto' | 'plant' | 'water' | 'harvest'}
  /** Gentle helper watering (cat / soft rain). */
  | {type: 'help_water'; limit?: number; message: string}
  | {type: 'tick'; now: number}
  | {type: 'add_gold'; amount: number; message?: string}
  | {type: 'set_feedback'; message: string}
  | {type: 'clear_last_harvest'};
