export type AtmosphereId = 'clear' | 'soft_rain' | 'dusk';

export type AccessoryId = 'none' | 'cat_ears';

export interface AtmosphereDef {
  id: AtmosphereId;
  name: string;
  skyClass: string;
}

export const ATMOSPHERES: Record<AtmosphereId, AtmosphereDef> = {
  clear: {id: 'clear', name: '晴暖', skyClass: 'atm-clear'},
  soft_rain: {id: 'soft_rain', name: '软雨', skyClass: 'atm-soft-rain'},
  dusk: {id: 'dusk', name: '暮色', skyClass: 'atm-dusk'},
};

export const BUBBLES = [
  '今天也想慢慢种一点～',
  '西湖的云，好像棉花糖。',
  '黑猫说：先浇水，再想衣服。',
  '蘑菇屋里有点香香的木头味。',
  '雨停了就去菜地看看吧。',
  '换好衣服再回来，田还在。',
] as const;

/** Soft rain sessions have a chance to host a friendly stray cat. */
export function rollVisitor(atmosphere: AtmosphereId, alreadyGifted: boolean): boolean {
  if (alreadyGifted) return false;
  if (atmosphere !== 'soft_rain') return false;
  return Math.random() < 0.72;
}

export function pickAtmosphere(seed = Date.now()): AtmosphereId {
  const bag: AtmosphereId[] = ['clear', 'clear', 'dusk', 'soft_rain', 'soft_rain'];
  return bag[seed % bag.length];
}

export function pickBubble(seed = Date.now()): string {
  return BUBBLES[seed % BUBBLES.length];
}
