import type {SkinId} from './constants';
export type {SkinId};

export type CropType =
  | 'wheat'
  | 'carrot'
  | 'corn'
  | 'watermelon'
  | 'sunflower'
  | 'lavender'
  | 'strawberry'
  | 'pineapple'
  | 'magic_bean'
  | 'koi_grass';

export type ItemType = 'skin' | 'prop' | 'seed' | 'fragment' | 'gold';
export type ViewMode = 'farm' | 'room';
export type InventoryTab = 'items' | 'skins';
export type RoomId = 'farmhouse_main' | (string & {});
export type DecorationCategory = 'furniture' | 'wallpaper' | 'floor' | 'collectible';
export type PropEffectType = 'growth' | 'buff';
export type PrizeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type PrizeSpecialEffect = 'butterfly_burst' | 'gold_rain' | 'sparkle_flare';

export interface DecorationBuff {
  type: 'gold_boost' | 'growth_speed';
  value: number;
}

export interface Decoration {
  id: string;
  name: string;
  price: number;
  icon: string;
  position: {x: number; y: number};
  category: DecorationCategory;
  buff?: DecorationBuff;
}

export interface RoomState {
  id: RoomId;
  isUnlocked: boolean;
  placedItems: Decoration[];
  currentWallpaper: string;
  currentFloor: string;
}

export type RoomsState = Record<string, RoomState>;

export interface PropConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: PropEffectType;
  effect?: number;
  multiplier?: number;
  duration?: number;
}

export interface PrizePoolItem {
  id: string;
  name: string;
  weight: number;
  type: ItemType;
  rarity: PrizeRarity;
  image: string;
  description?: string;
  specialEffect?: PrizeSpecialEffect;
  rewardGold?: number;
}

export type LotteryEffectKind = PrizeRarity;

export interface LotteryEffect {
  kind: LotteryEffectKind;
  triggerCoins: boolean;
  triggerButterflies: boolean;
  triggerRainbow: boolean;
  triggerSparkles: boolean;
}

export interface LotterySessionResult {
  drawCount: number;
  rewards: PrizePoolItem[];
  displayRewards: PrizePoolItem[];
  primaryReward: PrizePoolItem | null;
  summaryEffect: LotteryEffect;
  highRarityCount: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  icon: string;
  count: number;
  description?: string;
  image?: string;
  effectValue?: number;
  multiplier?: number;
  duration?: number;
}

export interface CropData {
  id: CropType;
  name: string;
  seedCost: number;
  harvestValue: number;
  growthTime: number;
  xpReward: number;
  unlockLevel: number;
  icon: string;
  color: string;
  rarity?: 'common' | 'rare' | 'epic' | 'divine' | 'mythic';
}

export type PlotState = {
  id: number;
  cropId: CropType | null;
  plantedAt: number | null;
  isHarvestable: boolean;
  isWatered: boolean;
};

export interface ActiveBuff {
  id: string;
  type: 'gold_boost' | 'growth_speed';
  multiplier: number;
  expiresAt: number;
}

export interface GameState {
  gold: number;
  level: number;
  xp: number;
  plots: PlotState[];
  discoveredCrops: CropType[];
  inventory: InventoryItem[];
  ownedSkinIds: SkinId[];
  activeSkin: SkinId;
  activeBuffs: ActiveBuff[];
  rooms: RoomsState;
  activeRoomId: RoomId;
  viewMode: ViewMode;
}

export interface InventoryUIState {
  isInventoryOpen: boolean;
  activeInventoryTab: InventoryTab;
}
