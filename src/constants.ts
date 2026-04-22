import type {CropData, CropType, ItemType, PrizePoolItem, PrizeRarity} from './types';

export const CROPS: Record<CropType, CropData> = {
  wheat: {
    id: 'wheat',
    name: '小麦',
    seedCost: 2,
    harvestValue: 5,
    growthTime: 5,
    xpReward: 10,
    unlockLevel: 1,
    icon: '🌾',
    color: 'bg-yellow-200',
  },
  carrot: {
    id: 'carrot',
    name: '胡萝卜',
    seedCost: 8,
    harvestValue: 20,
    growthTime: 15,
    xpReward: 25,
    unlockLevel: 2,
    icon: '🥕',
    color: 'bg-orange-300',
  },
  corn: {
    id: 'corn',
    name: '玉米',
    seedCost: 25,
    harvestValue: 60,
    growthTime: 45,
    xpReward: 70,
    unlockLevel: 4,
    icon: '🌽',
    color: 'bg-yellow-400',
  },
  watermelon: {
    id: 'watermelon',
    name: '西瓜',
    seedCost: 100,
    harvestValue: 300,
    growthTime: 120,
    xpReward: 200,
    unlockLevel: 7,
    icon: '🍉',
    color: 'bg-green-400',
  },
  sunflower: {
    id: 'sunflower',
    name: '向日葵',
    seedCost: 50,
    harvestValue: 150,
    growthTime: 60,
    xpReward: 100,
    unlockLevel: 5,
    icon: '🌻',
    color: 'bg-yellow-500',
  },
  lavender: {
    id: 'lavender',
    name: '薰衣草',
    seedCost: 15,
    harvestValue: 40,
    growthTime: 30,
    xpReward: 45,
    unlockLevel: 3,
    icon: '🪻',
    color: 'bg-purple-300',
  },
  strawberry: {
    id: 'strawberry',
    name: '草莓',
    seedCost: 75,
    harvestValue: 240,
    growthTime: 90,
    xpReward: 150,
    unlockLevel: 6,
    icon: '🍓',
    color: 'bg-red-400',
  },
  pineapple: {
    id: 'pineapple',
    name: '菠萝',
    seedCost: 150,
    harvestValue: 500,
    growthTime: 180,
    xpReward: 350,
    unlockLevel: 8,
    icon: '🍍',
    color: 'bg-yellow-600',
  },
  magic_bean: {
    id: 'magic_bean',
    name: '祈愿神豆',
    seedCost: 400,
    harvestValue: 1600,
    growthTime: 600,
    xpReward: 1000,
    unlockLevel: 10,
    icon: '🫘',
    color: 'bg-indigo-600',
    rarity: 'divine',
  },
  koi_grass: {
    id: 'koi_grass',
    name: '锦鲤草',
    seedCost: 888,
    harvestValue: 8888,
    growthTime: 1800,
    xpReward: 2000,
    unlockLevel: 1, 
    icon: '🎋',
    color: 'bg-teal-500',
    rarity: 'mythic',
  }
};

export const SKINS_CONFIG: Record<SkinId, SkinConfig> = {
  default: {
    id: 'default',
    name: '经典农场',
    bgClass: 'bg-green-100',
    plotClass: 'bg-amber-800/80 border-amber-900 shadow-[inset_0_2px_10px_rgba(0,0,0,0.28)]',
    color: '#6EE7B7',
    secondaryColor: '#BAE6FD',
    accentColor: '#6EE7B7',
    modalOverlay: 'bg-black/80',
  },
  sacred_spring: {
    id: 'sacred_spring',
    name: '神圣神泉',
    bgClass: 'bg-slate-950',
    plotClass:
      'bg-slate-900/40 backdrop-blur-sm border-teal-500/50 shadow-[0_0_15px_rgba(45,212,191,0.3)]',
    color: '#2DD4BF',
    secondaryColor: '#1A1D2D',
    bgImage: '/assets/backgrounds/bg_sacred_spring.png',
    accentColor: '#4FD1C5',
    modalOverlay: 'bg-slate-950/80',
  },
};

export const SKINS = SKINS_CONFIG;

export const PROPS = {
  magic_water: { id: 'magic_water', name: '神奇泉水', icon: '💧', description: '立即完成作物 50% 生长', effect: 0.5, type: 'growth' as const },
  ancient_fertilizer: { id: 'ancient_fertilizer', name: '远古化肥', icon: '🧪', description: '立即完成作物 80% 生长', effect: 0.8, type: 'growth' as const },
  super_fertilizer: { id: 'super_fertilizer', name: '超级化肥', icon: '✨', description: '立即完成生长', effect: 1.0, type: 'growth' as const },
  golden_bell: { id: 'golden_bell', name: '黄金摇铃', icon: '🔔', description: '5 分钟内收获金币翻倍', duration: 300, multiplier: 2, type: 'buff' as const },
};

export const RARITY_CONFIG: Record<
  PrizeRarity,
  {color: string; shadow: string; flare: boolean}
> = {
  common: {color: '#94A3B8', shadow: '0 0 10px rgba(148, 163, 184, 0.5)', flare: false},
  rare: {color: '#38BDF8', shadow: '0 0 20px rgba(56, 189, 248, 0.6)', flare: false},
  epic: {color: '#A855F7', shadow: '0 0 30px rgba(168, 85, 247, 0.7)', flare: true},
  legendary: {color: '#FBBF24', shadow: '0 0 50px rgba(251, 191, 36, 0.8)', flare: true},
};

// Prize images are expected under public/assets/prizes. See public/assets/prizes/README.md.
export const PRIZE_POOL: PrizePoolItem[] = [
  {
    id: 'sacred_spring',
    name: '神圣神泉皮肤',
    type: 'skin',
    weight: 5,
    rarity: 'legendary',
    image: '/assets/prizes/skin_sacred_spring.png',
    description: '唤醒远古神泉的神圣力量，切换整座农场的视觉主题。',
    specialEffect: 'butterfly_burst',
  },
  {
    id: 'golden_bell',
    name: '黄金摇铃',
    type: 'prop',
    weight: 10,
    rarity: 'epic',
    image: '/assets/prizes/prop_golden_bell.png',
    description: '5 分钟内收获金币翻倍。',
    specialEffect: 'gold_rain',
  },
  {
    id: 'magic_bean',
    name: '祈愿神豆种子',
    type: 'seed',
    weight: 5,
    rarity: 'epic',
    image: '/assets/prizes/seed_magic_bean.png',
    description: '极其稀有的种子，能够种出高价值的神豆。',
    specialEffect: 'sparkle_flare',
  },
  {
    id: 'ancient_fertilizer',
    name: '远古化肥',
    type: 'prop',
    weight: 15,
    rarity: 'rare',
    image: '/assets/prizes/prop_ancient_fertilizer.png',
    description: '立即完成作物 80% 生长。',
  },
  {
    id: 'cyber_skin_fragment',
    name: '赛博皮肤碎片',
    type: 'fragment',
    weight: 15,
    rarity: 'rare',
    image: '/assets/prizes/fragment_cyber.png',
    description: '集齐 10 个碎片可兑换赛博空间皮肤。',
  },
  {
    id: 'magic_water',
    name: '神奇泉水',
    type: 'prop',
    weight: 30,
    rarity: 'common',
    image: '/assets/prizes/prop_magic_water.png',
    description: '立即完成作物 50% 生长。',
  },
  {
    id: 'gold_pack_small',
    name: '小袋金币 (100)',
    type: 'gold',
    weight: 20,
    rarity: 'common',
    image: '/assets/prizes/gold_pack_small.png',
    description: '直接获得 100 金币。',
    rewardGold: 100,
  },
];

export const PRIZE_POOL_BY_ID = Object.fromEntries(
  PRIZE_POOL.map((item) => [item.id, item]),
) as Record<string, PrizePoolItem>;

const FALLBACK_REWARD_ICONS: Record<ItemType, string> = {
  skin: '🎨',
  prop: '✨',
  seed: '🌱',
  fragment: '🧩',
  gold: '🪙',
};

export const getPrizeFallbackIcon = (item: Pick<PrizePoolItem, 'id' | 'type'>) => {
  if (item.type === 'prop') {
    return PROPS[item.id as keyof typeof PROPS]?.icon ?? FALLBACK_REWARD_ICONS.prop;
  }

  return FALLBACK_REWARD_ICONS[item.type];
};

export const LOTTERY_COST = 50;
export const LOTTERY_TEN_COST = 450;
export const INITIAL_GOLD = 100;
export const XP_PER_LEVEL = 100;
export const INITIAL_PLOTS_COUNT = 6;
export const MAX_PLOTS_COUNT = 12;

export type SkinId = 'default' | 'sacred_spring';

export interface SkinConfig {
  id: SkinId;
  name: string;
  bgClass: string;
  plotClass: string;
  color: string;
  secondaryColor: string;
  bgImage?: string;
  accentColor?: string;
  modalOverlay?: string;
}

export const SKIN_IDS: SkinId[] = ['default', 'sacred_spring'];
