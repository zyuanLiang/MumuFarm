import type {CropId} from './types';
import type {AccessoryId} from './dayFeel';
import type {OutfitId} from './outfits';
import type {PlotState} from './types';

const SAVE_KEY = 'mumufarm.p3.v1';

export interface GameSave {
  version: 1;
  gold: number;
  outfit: OutfitId;
  accessory: AccessoryId;
  unlockedAccessories: AccessoryId[];
  selectedSeed: CropId;
  plots: PlotState[];
  catGiftClaimed: boolean;
  lastBubble: string;
}

export function loadSave(): GameSave | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as GameSave;
    if (data.version !== 1) return null;
    return data;
  } catch {
    return null;
  }
}

export function writeSave(save: GameSave): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // ignore quota / private mode
  }
}
