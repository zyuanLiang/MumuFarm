import type {ThemePack} from '../types';

/** Default production look: cream paper-cut cottage. */
export const cottageCreamTheme: ThemePack = {
  id: 'cottage_cream',
  name: '奶油小院',
  blurb: '默认西湖暮色纸片味',
  unlockAtHarvests: 0,
  tokens: {
    cream: '#fff8ee',
    sage: '#9bc09a',
    sky: '#b7d8f0',
    peach: '#f3a989',
    honey: '#f0c75e',
    wood: '#e8d5b5',
    soil: '#d2a679',
    soilWet: '#b8895f',
    denim: '#7fa3c9',
    ink: '#5a4a3a',
    lilac: '#b9a0d6',
    shellGradient: 'linear-gradient(180deg, #f7d9c4 0%, #f3e2cf 28%, #e7f0d8 62%, #dfe9c9 100%)',
    skyGradient:
      'radial-gradient(ellipse 80% 45% at 70% 18%, rgba(255, 214, 170, 0.85), transparent 60%), linear-gradient(180deg, #f4c7b0 0%, #e8d5c4 55%, transparent 100%)',
  },
  // assets left empty → CSS placeholders until art lands
  assets: {},
};
