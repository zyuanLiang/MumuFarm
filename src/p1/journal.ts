import type {AccessoryId, AtmosphereId} from './dayFeel';
import {ATMOSPHERES} from './dayFeel';
import type {OutfitId} from './outfits';
import {OUTFITS} from './outfits';
import {
  closestOutfit,
  lookFromOutfit,
  lookLabel,
  type Look,
} from './pieces';
import type {VistaId} from './vistas';
import {VISTAS} from './vistas';

export interface JournalEntry {
  id: string;
  createdAt: number;
  vista: VistaId;
  /** Closest preset / legacy field */
  outfit: OutfitId;
  /** Mix look when available */
  look?: Look;
  accessory: AccessoryId;
  atmosphere: AtmosphereId;
  caption: string;
}

export const JOURNAL_MAX = 12;

const CAPTION_BITS = [
  '今天的风很软。',
  '想把这一页留给以后的自己。',
  '衣服新换，菜还在长。',
  '黑猫说：拍完再浇一壶。',
  '蘑菇屋门口的光刚刚好。',
] as const;

export function accessoryLabel(accessory: AccessoryId): string {
  switch (accessory) {
    case 'cat_ears':
      return '猫耳';
    case 'scarf':
      return '围巾';
    case 'flower_crown':
      return '花冠';
    case 'mushroom_pin':
      return '蘑菇胸针';
    default:
      return '';
  }
}

export function entryLook(entry: JournalEntry): Look {
  return entry.look ?? lookFromOutfit(entry.outfit);
}

export function makeJournalCaption(
  vista: VistaId,
  look: Look,
  accessory: AccessoryId,
  atmosphere: AtmosphereId,
  seed = Date.now(),
): string {
  const wearBase = lookLabel(look);
  const acc = accessoryLabel(accessory);
  const wear = acc ? `${wearBase}·${acc}` : wearBase;
  const bit = CAPTION_BITS[seed % CAPTION_BITS.length];
  return `${VISTAS[vista].name} · ${ATMOSPHERES[atmosphere].name} · ${wear}。${bit}`;
}

export function createJournalEntry(input: {
  vista: VistaId;
  look: Look;
  accessory: AccessoryId;
  atmosphere: AtmosphereId;
  now?: number;
  /** Override caption (e.g. 丰收小记) */
  caption?: string;
}): JournalEntry {
  const now = input.now ?? Date.now();
  return {
    id: `j-${now}-${Math.floor(Math.random() * 9999)}`,
    createdAt: now,
    vista: input.vista,
    outfit: closestOutfit(input.look),
    look: input.look,
    accessory: input.accessory,
    atmosphere: input.atmosphere,
    caption:
      input.caption ??
      makeJournalCaption(
        input.vista,
        input.look,
        input.accessory,
        input.atmosphere,
        now,
      ),
  };
}

export function prependJournalEntry(
  entries: JournalEntry[],
  entry: JournalEntry,
  max = JOURNAL_MAX,
): JournalEntry[] {
  return [entry, ...entries].slice(0, max);
}

export function formatJournalTime(ts: number): string {
  const d = new Date(ts);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${mm}-${dd} ${hh}:${mi}`;
}

/** Legacy helper for tests that still pass outfit id. */
export function captionFromOutfit(
  vista: VistaId,
  outfit: OutfitId,
  accessory: AccessoryId,
  atmosphere: AtmosphereId,
  seed = Date.now(),
): string {
  return makeJournalCaption(vista, lookFromOutfit(outfit), accessory, atmosphere, seed);
}

export function outfitDisplayName(outfit: OutfitId): string {
  return OUTFITS[outfit]?.name ?? '黄雨衣';
}
