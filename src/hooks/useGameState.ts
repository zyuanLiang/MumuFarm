import {useCallback, useEffect, useMemo, useState} from 'react';
import {CROPS, INITIAL_GOLD, INITIAL_PLOTS_COUNT, MAX_PLOTS_COUNT, SKIN_IDS, SKINS, XP_PER_LEVEL} from '../constants';
import type {
  ActiveBuff,
  CropType,
  Decoration,
  GameState,
  InventoryTab,
  InventoryUIState,
  InventoryItem,
  PlotState,
  RoomId,
  RoomState,
  RoomsState,
  SkinId,
} from '../types';

const STORAGE_KEY = 'mini_farm_save';
export const DEFAULT_ROOM_ID: RoomId = 'farmhouse_main';

export interface LevelUpEvent {
  level: number;
  unlockedPlot: boolean;
  token: number;
}

export const createDefaultInventoryUIState = (): InventoryUIState => ({
  isInventoryOpen: false,
  activeInventoryTab: 'items',
});

export const openInventoryPanel = (
  state: InventoryUIState,
  tab: InventoryTab = 'items',
): InventoryUIState => ({
  ...state,
  isInventoryOpen: true,
  activeInventoryTab: tab,
});

export const closeInventoryPanel = (state: InventoryUIState): InventoryUIState => ({
  ...state,
  isInventoryOpen: false,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isCropType = (value: unknown): value is CropType =>
  typeof value === 'string' && value in CROPS;

const isSkinId = (value: unknown): value is SkinId =>
  typeof value === 'string' && value in SKINS;

const migrateOwnedSkinIds = (value: unknown): SkinId[] => {
  const filtered = Array.isArray(value) ? value.filter(isSkinId) : [];
  if (filtered.length === 0) {
    return [...SKIN_IDS];
  }

  const deduped = new Set<SkinId>(['default', ...filtered]);
  return SKIN_IDS.filter((skinId) => deduped.has(skinId));
};

const isInventoryItemType = (value: unknown): value is InventoryItem['type'] =>
  value === 'skin' ||
  value === 'prop' ||
  value === 'seed' ||
  value === 'fragment' ||
  value === 'gold';

const createEmptyPlot = (id: number): PlotState => ({
  id,
  cropId: null,
  plantedAt: null,
  isHarvestable: false,
  isWatered: true,
});

export const createDefaultRooms = (): RoomsState => ({
  [DEFAULT_ROOM_ID]: {
    id: DEFAULT_ROOM_ID,
    isUnlocked: true,
    placedItems: [],
    currentWallpaper: 'default_wallpaper',
    currentFloor: 'default_floor',
  },
});

export const createDefaultGameState = (): GameState => ({
  gold: INITIAL_GOLD,
  level: 1,
  xp: 0,
  plots: Array.from({length: INITIAL_PLOTS_COUNT}, (_, index) => createEmptyPlot(index)),
  discoveredCrops: ['wheat'],
  inventory: [],
  ownedSkinIds: [...SKIN_IDS],
  activeSkin: 'default',
  activeBuffs: [],
  rooms: createDefaultRooms(),
  activeRoomId: DEFAULT_ROOM_ID,
  viewMode: 'farm',
});

const createDefaultRoom = (id: RoomId): RoomState => ({
  ...createDefaultRooms()[DEFAULT_ROOM_ID],
  id,
});

const migratePlot = (value: unknown, index: number): PlotState => {
  if (!isRecord(value)) {
    return createEmptyPlot(index);
  }

  return {
    id: typeof value.id === 'number' ? value.id : index,
    cropId: isCropType(value.cropId) ? value.cropId : null,
    plantedAt: typeof value.plantedAt === 'number' ? value.plantedAt : null,
    isHarvestable: typeof value.isHarvestable === 'boolean' ? value.isHarvestable : false,
    isWatered: typeof value.isWatered === 'boolean' ? value.isWatered : true,
  };
};

const migrateInventoryItem = (value: unknown): InventoryItem | null => {
  if (!isRecord(value) || typeof value.id !== 'string') {
    return null;
  }

  return {
    id: value.id,
    name: typeof value.name === 'string' ? value.name : value.id,
    type: isInventoryItemType(value.type) ? value.type : 'prop',
    icon: typeof value.icon === 'string' ? value.icon : '',
    count: typeof value.count === 'number' ? value.count : 0,
    description: typeof value.description === 'string' ? value.description : undefined,
    image: typeof value.image === 'string' ? value.image : undefined,
    effectValue: typeof value.effectValue === 'number' ? value.effectValue : undefined,
    multiplier: typeof value.multiplier === 'number' ? value.multiplier : undefined,
    duration: typeof value.duration === 'number' ? value.duration : undefined,
  };
};

const migrateActiveBuff = (value: unknown): ActiveBuff | null => {
  if (!isRecord(value) || typeof value.id !== 'string') {
    return null;
  }

  const type =
    value.type === 'gold_boost'
      ? 'gold_boost'
      : value.type === 'growth_speed'
        ? 'growth_speed'
        : null;
  if (!type) {
    return null;
  }

  return {
    id: value.id,
    type,
    multiplier: typeof value.multiplier === 'number' ? value.multiplier : 1,
    expiresAt: typeof value.expiresAt === 'number' ? value.expiresAt : Date.now(),
  };
};

const migrateRoom = (value: unknown, fallbackId: RoomId): RoomState => {
  if (!isRecord(value)) {
    return createDefaultRoom(fallbackId);
  }

  return {
    id: typeof value.id === 'string' ? (value.id as RoomId) : fallbackId,
    isUnlocked: typeof value.isUnlocked === 'boolean' ? value.isUnlocked : true,
    placedItems: Array.isArray(value.placedItems)
      ? value.placedItems
          .map((item): Decoration | null => {
            if (!isRecord(item)) {
              return null;
            }

            return {
              id: typeof item.id === 'string' ? item.id : 'decoration',
              name: typeof item.name === 'string' ? item.name : 'Decoration',
              price: typeof item.price === 'number' ? item.price : 0,
              icon: typeof item.icon === 'string' ? item.icon : '',
              position: isRecord(item.position)
                ? {
                    x: typeof item.position.x === 'number' ? item.position.x : 0,
                    y: typeof item.position.y === 'number' ? item.position.y : 0,
                  }
                : {x: 0, y: 0},
              category:
                item.category === 'furniture' ||
                item.category === 'wallpaper' ||
                item.category === 'floor' ||
                item.category === 'collectible'
                  ? item.category
                  : 'collectible',
              buff: isRecord(item.buff)
                ? {
                    type:
                      item.buff.type === 'growth_speed' ? 'growth_speed' : 'gold_boost',
                    value: typeof item.buff.value === 'number' ? item.buff.value : 0,
                  }
                : undefined,
            };
          })
          .filter((item): item is Decoration => item !== null)
      : [],
    currentWallpaper:
      typeof value.currentWallpaper === 'string' ? value.currentWallpaper : 'default_wallpaper',
    currentFloor: typeof value.currentFloor === 'string' ? value.currentFloor : 'default_floor',
  };
};

const migrateRooms = (value: unknown): RoomsState => {
  if (!isRecord(value)) {
    return createDefaultRooms();
  }

  const entries = Object.entries(value).map(([roomId, roomValue]) => [
    roomId,
    migrateRoom(roomValue, roomId as RoomId),
  ]);

  if (entries.length === 0) {
    return createDefaultRooms();
  }

  return Object.fromEntries(entries);
};

export const migrateGameState = (value: unknown): GameState => {
  const defaults = createDefaultGameState();
  if (!isRecord(value)) {
    return defaults;
  }

  const rooms = isRecord(value.rooms)
    ? migrateRooms(value.rooms)
    : isRecord(value.room)
      ? {[DEFAULT_ROOM_ID]: migrateRoom(value.room, DEFAULT_ROOM_ID)}
      : defaults.rooms;

  const activeRoomId =
    typeof value.activeRoomId === 'string' && rooms[value.activeRoomId]
      ? (value.activeRoomId as RoomId)
      : ((Object.keys(rooms)[0] ?? DEFAULT_ROOM_ID) as RoomId);
  const ownedSkinIds = migrateOwnedSkinIds(value.ownedSkinIds);
  const activeSkin = isSkinId(value.activeSkin) && ownedSkinIds.includes(value.activeSkin)
    ? value.activeSkin
    : defaults.activeSkin;

  return {
    ...defaults,
    gold: typeof value.gold === 'number' ? value.gold : defaults.gold,
    level: typeof value.level === 'number' ? value.level : defaults.level,
    xp: typeof value.xp === 'number' ? value.xp : defaults.xp,
    plots: Array.isArray(value.plots) ? value.plots.map(migratePlot) : defaults.plots,
    discoveredCrops: Array.isArray(value.discoveredCrops)
      ? value.discoveredCrops.filter(isCropType)
      : defaults.discoveredCrops,
    inventory: Array.isArray(value.inventory)
      ? value.inventory
          .map(migrateInventoryItem)
          .filter((item): item is InventoryItem => item !== null)
      : defaults.inventory,
    ownedSkinIds,
    activeSkin,
    activeBuffs: Array.isArray(value.activeBuffs)
      ? value.activeBuffs
          .map(migrateActiveBuff)
          .filter((buff): buff is ActiveBuff => buff !== null)
      : defaults.activeBuffs,
    rooms,
    activeRoomId,
    viewMode: value.viewMode === 'room' ? 'room' : 'farm',
  };
};

export const getXpToNextLevel = (level: number) => level * XP_PER_LEVEL;

export const applyLevelProgression = (state: GameState) => {
  const xpToNextLevel = getXpToNextLevel(state.level);
  if (state.xp < xpToNextLevel) {
    return {nextState: state, event: null as LevelUpEvent | null};
  }

  const nextLevel = state.level + 1;
  const unlockedPlot = nextLevel % 2 === 0 && state.plots.length < MAX_PLOTS_COUNT;

  return {
    nextState: {
      ...state,
      level: nextLevel,
      xp: state.xp - xpToNextLevel,
      plots: unlockedPlot ? [...state.plots, createEmptyPlot(state.plots.length)] : state.plots,
    },
    event: {
      level: nextLevel,
      unlockedPlot,
      token: Date.now(),
    } satisfies LevelUpEvent,
  };
};

const loadInitialState = () => {
  if (typeof window === 'undefined') {
    return createDefaultGameState();
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return createDefaultGameState();
  }

  try {
    return migrateGameState(JSON.parse(saved));
  } catch (error) {
    console.error('Failed to parse save', error);
    return createDefaultGameState();
  }
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => loadInitialState());
  const [levelUpEvent, setLevelUpEvent] = useState<LevelUpEvent | null>(null);
  const [inventoryUI, setInventoryUI] = useState<InventoryUIState>(() =>
    createDefaultInventoryUIState(),
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = Date.now();
      setGameState((previous) => {
        const hasExpiredBuff = previous.activeBuffs.some((buff) => buff.expiresAt <= now);
        if (!hasExpiredBuff) {
          return previous;
        }

        return {
          ...previous,
          activeBuffs: previous.activeBuffs.filter((buff) => buff.expiresAt > now),
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const {nextState, event} = applyLevelProgression(gameState);
    if (!event) {
      return;
    }

    setGameState(nextState);
    setLevelUpEvent(event);
  }, [gameState]);

  const clearLevelUpEvent = useCallback(() => {
    setLevelUpEvent(null);
  }, []);

  const openInventory = useCallback((tab: InventoryTab = 'items') => {
    setInventoryUI((previous) => openInventoryPanel(previous, tab));
  }, []);

  const closeInventory = useCallback(() => {
    setInventoryUI((previous) => closeInventoryPanel(previous));
  }, []);

  const setActiveInventoryTab = useCallback((tab: InventoryTab) => {
    setInventoryUI((previous) => ({
      ...previous,
      activeInventoryTab: tab,
    }));
  }, []);

  const setActiveSkin = useCallback((skinId: SkinId) => {
    setGameState((previous) =>
      previous.ownedSkinIds.includes(skinId) ? {...previous, activeSkin: skinId} : previous,
    );
  }, []);

  const xpToNextLevel = useMemo(() => getXpToNextLevel(gameState.level), [gameState.level]);

  return {
    gameState,
    setGameState,
    xpToNextLevel,
    levelUpEvent,
    clearLevelUpEvent,
    isInventoryOpen: inventoryUI.isInventoryOpen,
    activeInventoryTab: inventoryUI.activeInventoryTab,
    openInventory,
    closeInventory,
    setActiveInventoryTab,
    setActiveSkin,
  };
};
