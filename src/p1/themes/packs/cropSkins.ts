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

/** Second crop pack — spring palette; swap files under public/skins/spring-crops/. */
export const springCropsSkin: SkinPack = {
  id: 'spring_crops',
  name: '春日作物',
  blurb: '嫩绿＋花粉色一季；与示例贴同槽位',
  kind: 'crops',
  unlockAtHarvests: 6,
  assets: {
    'wheat.mature': '/skins/spring-crops/wheat-mature.svg',
    'carrot.mature': '/skins/spring-crops/carrot-mature.svg',
    'sunflower.mature': '/skins/spring-crops/sunflower-mature.svg',
    'star_pumpkin.mature': '/skins/spring-crops/star-pumpkin-mature.svg',
    'wheat.sprout': '/skins/spring-crops/sprout.svg',
    'carrot.sprout': '/skins/spring-crops/sprout.svg',
    'sunflower.sprout': '/skins/spring-crops/sprout.svg',
    'star_pumpkin.sprout': '/skins/spring-crops/sprout.svg',
    'wheat.seed': '/skins/spring-crops/seed.svg',
    'carrot.seed': '/skins/spring-crops/seed.svg',
    'sunflower.seed': '/skins/spring-crops/seed.svg',
    'star_pumpkin.seed': '/skins/spring-crops/seed.svg',
  },
};

/** Filled sample crop stickers — proves SkinPack URL hot-swap. */
export const sampleCropsSkin: SkinPack = {
  id: 'sample_crops',
  name: '示例作物贴',
  blurb: 'SVG 成熟剪影；换 PNG 路径即可换季',
  kind: 'crops',
  unlockAtHarvests: 0,
  assets: {
    'wheat.mature': '/skins/sample-v1/crops/wheat-mature.svg',
    'carrot.mature': '/skins/sample-v1/crops/carrot-mature.svg',
    'sunflower.mature': '/skins/sample-v1/crops/sunflower-mature.svg',
    'star_pumpkin.mature': '/skins/sample-v1/crops/star-pumpkin-mature.svg',
    'wheat.sprout': '/skins/sample-v1/crops/sprout.svg',
    'carrot.sprout': '/skins/sample-v1/crops/sprout.svg',
    'sunflower.sprout': '/skins/sample-v1/crops/sprout.svg',
    'star_pumpkin.sprout': '/skins/sample-v1/crops/sprout.svg',
    'wheat.seed': '/skins/sample-v1/crops/seed.svg',
    'carrot.seed': '/skins/sample-v1/crops/seed.svg',
    'sunflower.seed': '/skins/sample-v1/crops/seed.svg',
    'star_pumpkin.seed': '/skins/sample-v1/crops/seed.svg',
  },
};
