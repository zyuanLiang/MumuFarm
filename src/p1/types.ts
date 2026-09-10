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
}

export type FarmAction =
  | {type: 'select_plot'; plotId: number}
  | {type: 'select_seed'; seed: CropId}
  | {type: 'primary'}
  | {type: 'tick'; now: number};
