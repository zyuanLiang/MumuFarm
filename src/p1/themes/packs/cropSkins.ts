import type {SkinPack} from '../types';

/**
 * Example crop skin pack.
 * Keys match CropId + stage when art exists, e.g. wheat.mature.
 * Empty URLs mean "still use CSS silhouette".
 */
export const paperCropsSkin: SkinPack = {
  id: 'paper_crops',
  name: '纸片作物',
  blurb: '默认 CSS 剪影；换成 PNG 路径即可换皮',
  kind: 'crops',
  unlockAtHarvests: 0,
  assets: {
    // 'wheat.mature': '/skins/paper-crops/wheat-mature.png',
  },
};

export const springCropsSkin: SkinPack = {
  id: 'spring_crops',
  name: '春日作物',
  blurb: '示例第二套作物皮（占位，待贴图）',
  kind: 'crops',
  unlockAtHarvests: 6,
  assets: {
    // Ready for frequent swaps — drop files under public/skins/spring-crops/
  },
};
