import type {ThemePack} from '../types';

/**
 * Real PNG portrait wardrobe pack — same slot contract as SVG sample packs.
 * Drop replacements under public/skins/png-portrait without gameplay changes.
 */
export const pngPortraitTheme: ThemePack = {
  id: 'png_portrait',
  name: '水彩立绘',
  blurb: '真 PNG 立绘包：帽衣靴 + 远景 + 小屋内景；母版脸固定',
  unlockAtHarvests: 5,
  tokens: {
    cream: '#fff6ec',
    sage: '#9bb894',
    sky: '#b8d4ea',
    peach: '#efa387',
    honey: '#efc45a',
    wood: '#e6d2b0',
    soil: '#cfa278',
    soilWet: '#b4855c',
    denim: '#7fa0c2',
    ink: '#574636',
    lilac: '#b59ad0',
    shellGradient: 'linear-gradient(180deg, #f6d4bf 0%, #f2dfcb 28%, #e4efd4 62%, #dce8c6 100%)',
    skyGradient:
      'radial-gradient(ellipse 80% 45% at 70% 18%, rgba(255, 210, 168, 0.58), transparent 60%), linear-gradient(180deg, #f2c4ae 0%, #e6d2c0 45%, transparent 100%)',
  },
  assets: {
    vistaBg: {
      westlake: '/skins/png-portrait/vistas/vista-westlake.png',
      guilin: '/skins/png-portrait/vistas/vista-guilin.png',
      skycastle: '/skins/png-portrait/vistas/vista-skycastle.png',
      huangshan: '/skins/png-portrait/vistas/vista-huangshan.png',
    },
    mushroomHouse: '/skins/png-portrait/mushroom-house.png',
    cottageInterior: '/skins/png-portrait/cottage-interior.png',
    dress: {
      raincoat: '/skins/png-portrait/wardrobe/dress-raincoat.png',
      witch: '/skins/png-portrait/wardrobe/dress-witch.png',
      denim: '/skins/png-portrait/wardrobe/dress-denim.png',
      garden: '/skins/png-portrait/wardrobe/dress-garden.png',
      picnic: '/skins/png-portrait/wardrobe/dress-picnic.png',
      sweater: '/skins/png-portrait/wardrobe/dress-sweater.png',
      moonlight: '/skins/png-portrait/wardrobe/dress-moonlight.png',
      spore: '/skins/png-portrait/wardrobe/dress-spore.png',
    },
    hat: {
      rain_hood: '/skins/png-portrait/wardrobe/hat-rain-hood.png',
      witch_hat: '/skins/png-portrait/wardrobe/hat-witch.png',
      straw_hat: '/skins/png-portrait/wardrobe/hat-straw.png',
      beret: '/skins/png-portrait/wardrobe/hat-beret.png',
    },
    boots: {
      yellow: '/skins/png-portrait/wardrobe/boots-yellow.png',
      witch: '/skins/png-portrait/wardrobe/boots-witch.png',
      denim: '/skins/png-portrait/wardrobe/boots-denim.png',
      peach: '/skins/png-portrait/wardrobe/boots-peach.png',
      moss: '/skins/png-portrait/wardrobe/boots-moss.png',
      check: '/skins/png-portrait/wardrobe/boots-check.png',
      moon: '/skins/png-portrait/wardrobe/boots-moon.png',
    },
  },
};
