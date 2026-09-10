import type {CropId} from './types';
import type {AccessoryId} from './dayFeel';
import type {OutfitId} from './outfits';
import type {PlotState} from './types';
import type {VistaId} from './vistas';
import {outfitsUnlockedBy} from './outfits';
import {vistasUnlockedBy} from './vistas';

const SAVE_KEY = 'mumufarm.p4.v2';
const LEGACY_KEY = 'mumufarm.p3.v1';

export interface GameSave {
  version: 2;
  gold: number;
  outfit: OutfitId;
  accessory: AccessoryId;
  unlockedAccessories: AccessoryId[];
  unlockedOutfits: OutfitId[];
  unlockedVistas: VistaId[];
  activeVista: VistaId;
  selectedSeed: CropId;
  plots: PlotState[];
  harvestCount: number;
  catGiftClaimed: boolean;
  birdGiftClaimed: boolean;
  sunflowerCelebrated: boolean;
  starPumpkinGifted?: boolean;
  lastBubble: string;
}

function migrateLegacy(raw: unknown): GameSave | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  const harvestCount = typeof data.harvestCount === 'number' ? data.harvestCount : 0;
  return {
    version: 2,
    gold: typeof data.gold === 'number' ? data.gold : 20,
    outfit: (data.outfit as OutfitId) ?? 'raincoat',
    accessory: (data.accessory as AccessoryId) ?? 'none',
    unlockedAccessories: Array.isArray(data.unlockedAccessories)
      ? (data.unlockedAccessories as AccessoryId[])
      : ['none'],
    unlockedOutfits: outfitsUnlockedBy(harvestCount),
    unlockedVistas: vistasUnlockedBy(harvestCount),
    activeVista: 'westlake',
    selectedSeed: (data.selectedSeed as CropId) ?? 'wheat',
    plots: Array.isArray(data.plots) ? (data.plots as PlotState[]) : [],
    harvestCount,
    catGiftClaimed: Boolean(data.catGiftClaimed),
    birdGiftClaimed: Boolean(data.birdGiftClaimed),
    sunflowerCelebrated: Boolean(data.sunflowerCelebrated),
    starPumpkinGifted: Boolean(data.starPumpkinGifted),
    lastBubble: typeof data.lastBubble === 'string' ? data.lastBubble : '今天也想慢慢种一点～',
  };
}

export function loadSave(): GameSave | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {version?: number};
    if (parsed.version === 2) return parsed as GameSave;
    return migrateLegacy(parsed);
  } catch {
    return null;
  }
}

export function writeSave(save: GameSave): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // ignore
  }
}
