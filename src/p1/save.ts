import type {CropId} from './types';
import type {AccessoryId} from './dayFeel';
import type {OutfitId} from './outfits';
import type {PlotState} from './types';
import type {VistaId} from './vistas';
import {outfitsUnlockedBy} from './outfits';
import {vistasUnlockedBy} from './vistas';
import type {JournalEntry} from './journal';
import {
  bootsUnlockedBy,
  dressesUnlockedBy,
  hatsUnlockedBy,
  lookFromOutfit,
  type BootsId,
  type DressId,
  type HatId,
  type Look,
} from './pieces';
import {
  DEFAULT_CROP_SKIN_ID,
  DEFAULT_THEME_ID,
  themesUnlockedBy,
  type SkinId,
  type ThemeId,
} from './themes';

const SAVE_KEY = 'mumufarm.p4.v2';
const LEGACY_KEY = 'mumufarm.p3.v1';

export interface GameSave {
  version: 2;
  gold: number;
  outfit: OutfitId;
  look?: Look;
  accessory: AccessoryId;
  unlockedAccessories: AccessoryId[];
  unlockedOutfits: OutfitId[];
  unlockedHats?: HatId[];
  unlockedDresses?: DressId[];
  unlockedBoots?: BootsId[];
  unlockedVistas: VistaId[];
  activeVista: VistaId;
  selectedSeed: CropId;
  plots: PlotState[];
  harvestCount: number;
  catGiftClaimed: boolean;
  birdGiftClaimed: boolean;
  sunflowerCelebrated: boolean;
  starPumpkinGifted?: boolean;
  mushroomPinGifted?: boolean;
  journalEntries?: JournalEntry[];
  lastBubble: string;
  /** World color / surface theme pack */
  activeTheme?: ThemeId;
  unlockedThemes?: ThemeId[];
  /** Crop sticker skin pack (independent of world theme) */
  activeCropSkin?: SkinId;
}

function migrateLegacy(raw: unknown): GameSave | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  const harvestCount = typeof data.harvestCount === 'number' ? data.harvestCount : 0;
  const outfit = (data.outfit as OutfitId) ?? 'raincoat';
  return {
    version: 2,
    gold: typeof data.gold === 'number' ? data.gold : 20,
    outfit,
    look: lookFromOutfit(outfit),
    accessory: (data.accessory as AccessoryId) ?? 'none',
    unlockedAccessories: Array.isArray(data.unlockedAccessories)
      ? (data.unlockedAccessories as AccessoryId[])
      : ['none'],
    unlockedOutfits: outfitsUnlockedBy(harvestCount),
    unlockedHats: hatsUnlockedBy(harvestCount),
    unlockedDresses: dressesUnlockedBy(harvestCount),
    unlockedBoots: bootsUnlockedBy(harvestCount),
    unlockedVistas: vistasUnlockedBy(harvestCount),
    activeVista: 'westlake',
    selectedSeed: (data.selectedSeed as CropId) ?? 'wheat',
    plots: Array.isArray(data.plots) ? (data.plots as PlotState[]) : [],
    harvestCount,
    catGiftClaimed: Boolean(data.catGiftClaimed),
    birdGiftClaimed: Boolean(data.birdGiftClaimed),
    sunflowerCelebrated: Boolean(data.sunflowerCelebrated),
    starPumpkinGifted: Boolean(data.starPumpkinGifted),
    mushroomPinGifted: Boolean(data.mushroomPinGifted),
    journalEntries: Array.isArray(data.journalEntries)
      ? (data.journalEntries as JournalEntry[])
      : [],
    lastBubble: typeof data.lastBubble === 'string' ? data.lastBubble : '今天也想慢慢种一点～',
    activeTheme: DEFAULT_THEME_ID,
    unlockedThemes: themesUnlockedBy(harvestCount),
    activeCropSkin: DEFAULT_CROP_SKIN_ID,
  };
}

export function loadSave(): GameSave | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameSave & {version?: number};
    if (parsed.version === 2) {
      const harvestCount = parsed.harvestCount ?? 0;
      const outfit = parsed.outfit ?? 'raincoat';
      return {
        ...parsed,
        look: parsed.look ?? lookFromOutfit(outfit),
        unlockedHats: parsed.unlockedHats?.length
          ? parsed.unlockedHats
          : hatsUnlockedBy(harvestCount),
        unlockedDresses: parsed.unlockedDresses?.length
          ? parsed.unlockedDresses
          : dressesUnlockedBy(harvestCount),
        unlockedBoots: parsed.unlockedBoots?.length
          ? parsed.unlockedBoots
          : bootsUnlockedBy(harvestCount),
        activeTheme: parsed.activeTheme ?? DEFAULT_THEME_ID,
        unlockedThemes: parsed.unlockedThemes?.length
          ? parsed.unlockedThemes
          : themesUnlockedBy(harvestCount),
        activeCropSkin: parsed.activeCropSkin ?? DEFAULT_CROP_SKIN_ID,
      };
    }
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
