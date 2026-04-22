import test from 'node:test';
import assert from 'node:assert/strict';
import { migrateGameState, createDefaultGameState, DEFAULT_ROOM_ID } from './useGameState';

test('createDefaultGameState returns farm state with a default room scaffold', () => {
  const state = createDefaultGameState();

  assert.equal(state.gold, 100);
  assert.equal(state.level, 1);
  assert.equal(state.activeRoomId, DEFAULT_ROOM_ID);
  assert.equal(state.viewMode, 'farm');
  assert.ok(state.rooms[DEFAULT_ROOM_ID]);
  assert.equal(state.rooms[DEFAULT_ROOM_ID].isUnlocked, true);
  assert.deepEqual(state.rooms[DEFAULT_ROOM_ID].placedItems, []);
});

test('migrateGameState backfills missing room and inventory fields from old saves', () => {
  const migrated = migrateGameState({
    gold: 250,
    level: 3,
    xp: 40,
    plots: [],
    discoveredCrops: ['wheat'],
  });

  assert.equal(migrated.gold, 250);
  assert.deepEqual(migrated.inventory, []);
  assert.equal(migrated.activeSkin, 'default');
  assert.deepEqual(migrated.activeBuffs, []);
  assert.equal(migrated.activeRoomId, DEFAULT_ROOM_ID);
  assert.ok(migrated.rooms[DEFAULT_ROOM_ID]);
});

test('migrateGameState upgrades legacy single room saves into rooms map', () => {
  const migrated = migrateGameState({
    gold: 500,
    level: 5,
    xp: 20,
    plots: [],
    discoveredCrops: ['wheat'],
    inventory: [],
    activeSkin: 'sunny',
    activeBuffs: [],
    room: {
      isUnlocked: true,
      placedItems: [
        {
          id: 'window',
          name: 'Window',
          price: 10,
          icon: 'W',
          position: { x: 1, y: 2 },
          category: 'collectible',
        },
      ],
      currentWallpaper: 'sky',
      currentFloor: 'wood',
    },
  });

  assert.equal(migrated.activeRoomId, DEFAULT_ROOM_ID);
  assert.equal(migrated.rooms[DEFAULT_ROOM_ID].currentWallpaper, 'sky');
  assert.equal(migrated.rooms[DEFAULT_ROOM_ID].currentFloor, 'wood');
  assert.equal(migrated.rooms[DEFAULT_ROOM_ID].placedItems.length, 1);
});
