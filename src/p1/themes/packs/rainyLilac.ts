import type {ThemePack} from '../types';

/** Alternate world theme — proves hot-swap without touching gameplay. */
export const rainyLilacTheme: ThemePack = {
  id: 'rainy_lilac',
  name: '雨紫庭院',
  blurb: '软雨紫调，换主题不换玩法',
  unlockAtHarvests: 3,
  tokens: {
    cream: '#f4f0f8',
    sage: '#8fb3a8',
    sky: '#a8b8d8',
    peach: '#d4a0c0',
    honey: '#c8b0e0',
    wood: '#d8cce0',
    soil: '#9a7a8a',
    soilWet: '#7a5a6a',
    denim: '#7a8eb8',
    ink: '#4a3a58',
    lilac: '#9b7ec8',
    shellGradient: 'linear-gradient(180deg, #d8c8e8 0%, #e8e0f0 30%, #d0dce8 65%, #c8d8d0 100%)',
    skyGradient:
      'radial-gradient(ellipse 80% 45% at 65% 20%, rgba(180, 160, 220, 0.75), transparent 60%), linear-gradient(180deg, #b8a8d0 0%, #c8c0d8 55%, transparent 100%)',
  },
  assets: {},
};
