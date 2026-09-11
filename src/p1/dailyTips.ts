import type {AtmosphereId} from './dayFeel';
import {ATMOSPHERES} from './dayFeel';
import type {CropId} from './types';
import {CROPS} from './crops';
import {
  LOOK_PRESETS,
  lookLabel,
  looksEqual,
  normalizeLook,
  type BootsId,
  type DressId,
  type HatId,
  type Look,
} from './pieces';
import type {OutfitId} from './outfits';
import type {VistaId} from './vistas';
import {VISTAS} from './vistas';

export interface DailyTip {
  look: Look;
  reason: string;
  label: string;
}

type UnlockedPieces = {
  hats: HatId[];
  dresses: DressId[];
  boots: BootsId[];
};

/** Preferred presets by weather — only kept if unlocked. */
const ATM_PRESETS: Record<AtmosphereId, OutfitId[]> = {
  soft_rain: ['raincoat', 'sweater', 'witch'],
  dusk: ['moonlight', 'witch', 'spore', 'sweater'],
  clear: ['picnic', 'garden', 'denim', 'spore'],
};

const ATM_HATS: Record<AtmosphereId, HatId[]> = {
  soft_rain: ['rain_hood', 'beret', 'bare'],
  dusk: ['witch_hat', 'beret', 'bare'],
  clear: ['straw_hat', 'beret', 'bare', 'rain_hood'],
};

const ATM_BOOTS: Record<AtmosphereId, BootsId[]> = {
  soft_rain: ['yellow', 'moss', 'witch'],
  dusk: ['moon', 'witch', 'moss'],
  clear: ['check', 'peach', 'denim', 'moss'],
};

function firstAvailable<T extends string>(order: T[], unlocked: T[]): T | null {
  return order.find((id) => unlocked.includes(id)) ?? null;
}

/**
 * Rule-based "今天穿什么" — never invents new pieces, only remixes unlocked wardrobe.
 */
export function suggestTodayLook(input: {
  atmosphere: AtmosphereId;
  unlocked: UnlockedPieces;
  current: Look;
  seed?: number;
}): DailyTip {
  const seed = input.seed ?? Date.now();
  const presets = ATM_PRESETS[input.atmosphere];
  const pick = presets[(seed + presets.length) % presets.length];
  const base = LOOK_PRESETS[pick] ?? LOOK_PRESETS.raincoat;

  let look = normalizeLook(base, input.unlocked, pick);
  const hat = firstAvailable(ATM_HATS[input.atmosphere], input.unlocked.hats);
  const boots = firstAvailable(ATM_BOOTS[input.atmosphere], input.unlocked.boots);
  if (hat) look = {...look, hat};
  if (boots) look = {...look, boots};
  look = normalizeLook(look, input.unlocked);

  // If suggestion equals current, nudge dress to another unlocked option.
  if (looksEqual(look, input.current)) {
    const altDress =
      input.unlocked.dresses.find((d) => d !== look.dress) ?? look.dress;
    look = normalizeLook({...look, dress: altDress}, input.unlocked);
  }

  const weather = ATMOSPHERES[input.atmosphere].name;
  const reason =
    input.atmosphere === 'soft_rain'
      ? `${weather}天，穿这个出门种菜最安心`
      : input.atmosphere === 'dusk'
        ? `${weather}里，这身和西湖刚刚好`
        : `${weather}适合把${lookLabel(look)}晒一晒`;

  return {look, reason, label: lookLabel(look)};
}

export function makeHarvestNote(
  crop: CropId,
  harvestCount: number,
  vista: VistaId,
  seed = Date.now(),
): string {
  const name = CROPS[crop].name;
  const place = VISTAS[vista].name;
  const bits = [
    `第 ${harvestCount} 次收获：${name}，记在${place}这一页。`,
    `${name}收进篮子里，院子又香了一点。`,
    `今天的${name}，想留给手帐里的自己看。`,
    `黑猫说：${name}收好了，再去浇一壶。`,
    `${place}边，${name}熟得刚刚好。`,
  ];
  return bits[seed % bits.length];
}

/** Whether this harvest should auto-pin a 丰收小记 into the scrapbook. */
export function shouldPinHarvestNote(
  crop: CropId,
  harvestsThisSession: number,
): boolean {
  if (crop === 'sunflower' || crop === 'star_pumpkin') return true;
  return harvestsThisSession === 1;
}
