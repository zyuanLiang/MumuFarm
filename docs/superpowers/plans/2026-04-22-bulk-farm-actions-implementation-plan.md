# Bulk Farm Actions Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build juicy one-click plant and one-click harvest actions that use the currently selected seed, preserve the existing single-plot interactions, and add staged bulk animation sequencing instead of instant refreshes.

**Architecture:** Keep bulk business rules in `src/hooks/useGameActions.ts` as pure planning/commit helpers, orchestrate timing and transient animation state in `src/App.tsx`, and keep `src/components/Plot.tsx` focused on per-plot visual phases. Use TDD for bulk planners and text-level regression coverage for new UI hooks so sequencing logic stays testable without introducing a global store.

**Tech Stack:** React 19, TypeScript, Motion (`motion/react`), Tailwind utility classes, Node test runner via `tsx --test`

---

## File Structure

### Existing files to modify

- `src/hooks/useGameActions.ts`
  - Add bulk selectors, bulk plan helpers, and bulk commit helpers.
  - Keep functions pure and reusable from `App.tsx`.
- `src/hooks/useGameActions.test.ts`
  - Add failing tests first for bulk plan/commit behavior.
- `src/App.tsx`
  - Add bulk controller state, button entry points, anchor measurement, and transient flight rendering.
- `src/components/Plot.tsx`
  - Add bulk visual props and non-destructive per-plot feedback phases.
- `src/components/SeedSelector.tsx`
  - Add a stable anchor hook for bulk plant launch coordinates and expose a placement area for the floating pill buttons.
- `src/components/HUD.tsx`
  - Keep `gold-bag-ui` as the harvest destination anchor and add any lightweight feedback hook if needed.
- `src/text-sanity.test.ts`
  - Lock in button labels, bulk state hooks, and key animation identifiers.

### Optional new file if App grows too much

- `src/components/BulkActionPill.tsx`
  - Only create this if the bulk controls meaningfully clutter `App.tsx`.
  - Keep it presentational: receives disabled/loading/highlight props and click handlers.

## Constraints And Notes

- The workspace is not a git repository, so commit steps cannot be executed here. Keep the checkpoint steps in place, but mark them as blocked unless the work is moved into a git worktree later.
- Do not introduce Zustand or any new state library.
- Do not break the existing `window.alert` use that text regression tests currently lock unless the regression coverage is updated in the same task.
- Prefer minimal structural change. Only split files if the implementation becomes unwieldy.

## Task 1: Add bulk business-rule tests and pure helpers

**Files:**
- Modify: `src/hooks/useGameActions.test.ts`
- Modify: `src/hooks/useGameActions.ts`

- [ ] **Step 1: Write failing tests for bulk selectors and planners**

Add tests covering:

```ts
test('planHarvestAll returns no_ready when nothing is ready', () => {
  const state = withState({});
  const result = planHarvestAll(state, 5_000);

  assert.equal(result.blockedReason, 'no_ready');
  assert.deepEqual(result.plotIds, []);
});

test('planPlantAll uses the selected seed and caps count by gold and empty plots', () => {
  const state = withState({gold: CROPS.wheat.seedCost * 2});
  const result = planPlantAll(state, 'wheat', 5_000);

  assert.equal(result.blockedReason, 'none');
  assert.equal(result.plotIds.length, 2);
  assert.equal(result.totalCost, CROPS.wheat.seedCost * 2);
});

test('commitHarvestAll clears only selected ready plots and sums gold and xp', () => {
  // Build one ready wheat plot and one ready corn plot.
});

test('commitPlantAll plants only the planned ids using the selected seed', () => {
  // Assert plantedAt and cropId are set only on requested empty plots.
});
```

- [ ] **Step 2: Run the targeted test file and confirm the new tests fail**

Run: `npx tsx --test src/hooks/useGameActions.test.ts`

Expected: FAIL with missing `planHarvestAll` / `planPlantAll` / `commitHarvestAll` / `commitPlantAll` exports or assertion mismatches.

- [ ] **Step 3: Implement the minimal pure helpers in `src/hooks/useGameActions.ts`**

Add:

```ts
export type BulkBlockedReason = 'none' | 'no_ready' | 'no_empty' | 'insufficient_gold';

export interface HarvestAllPlan {
  blockedReason: BulkBlockedReason;
  plotIds: number[];
  totalGold: number;
  totalXp: number;
  perPlot: Array<{plotId: number; cropId: CropType; rewardGold: number; rewardXp: number;}>;
}

export interface PlantAllPlan {
  blockedReason: BulkBlockedReason;
  plotIds: number[];
  totalCost: number;
  affordableCount: number;
  seedId: CropType;
}
```

Implement helpers that:

1. Reuse existing crop readiness checks and multiplier logic.
2. Sort plot ids in bottom-to-top, left-to-right display order.
3. Return enough metadata for UI sequencing without touching DOM or timers.

- [ ] **Step 4: Run the targeted bulk test file again**

Run: `npx tsx --test src/hooks/useGameActions.test.ts`

Expected: PASS for the new bulk tests and existing action tests.

- [ ] **Step 5: Checkpoint this unit**

Blocked here because this directory is not a git repo.

If moved into git later:

```bash
git add src/hooks/useGameActions.ts src/hooks/useGameActions.test.ts
git commit -m "feat: add bulk farm action planners"
```

## Task 2: Add bulk UI regression coverage before wiring the screen

**Files:**
- Modify: `src/text-sanity.test.ts`
- Test target: `src/App.tsx`
- Test target: `src/components/Plot.tsx`
- Test target: `src/components/SeedSelector.tsx`

- [ ] **Step 1: Write failing text-level assertions for the new hooks**

Add assertions that lock:

```ts
assert.ok(appContent.includes('handleHarvestAllClick'));
assert.ok(appContent.includes('handlePlantAllClick'));
assert.ok(appContent.includes('activeBulkAction'));
assert.ok(appContent.includes('bulkHarvestFlights'));
assert.ok(appContent.includes('bulkPlantFlights'));
assert.ok(appContent.includes('一键收取'));
assert.ok(appContent.includes('一键播种'));
assert.ok(plotContent.includes("bulkPhase?: 'idle' | 'plant-target' | 'plant-impact' | 'harvest-lift' | 'harvest-cleared'"));
assert.ok(seedSelectorContent.includes('bulk-seed-launch-anchor'));
```

- [ ] **Step 2: Run the regression file and verify it fails**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected: FAIL because the new strings and props do not exist yet.

- [ ] **Step 3: Adjust assertions if they accidentally rely on unstable formatting**

Keep assertions tied to stable identifiers, labels, or type strings instead of fragile class order.

- [ ] **Step 4: Re-run the regression file and confirm it still fails for the intended reasons only**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected: FAIL only on the new bulk-related assertions.

- [ ] **Step 5: Checkpoint this unit**

Blocked here because this directory is not a git repo.

If moved into git later:

```bash
git add src/text-sanity.test.ts
git commit -m "test: lock bulk farm action UI hooks"
```

## Task 3: Wire bulk controller state and button entry points in App

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/SeedSelector.tsx`
- Modify: `src/components/HUD.tsx` if a dedicated HUD pulse hook is needed

- [ ] **Step 1: Add the minimum local types and controller state in `src/App.tsx`**

Introduce:

```ts
type BulkActionType = 'plant' | 'harvest' | null;

interface HarvestFlight {
  id: string;
  plotId: number;
  sequenceIndex: number;
  rewardGold: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface PlantFlight {
  id: string;
  plotId: number;
  sequenceIndex: number;
  seedId: CropType;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
```

State to add:

```ts
const [activeBulkAction, setActiveBulkAction] = useState<BulkActionType>(null);
const [isBulkBusy, setIsBulkBusy] = useState(false);
const [bulkAnimatedPlotIds, setBulkAnimatedPlotIds] = useState<number[]>([]);
const [bulkHarvestFlights, setBulkHarvestFlights] = useState<HarvestFlight[]>([]);
const [bulkPlantFlights, setBulkPlantFlights] = useState<PlantFlight[]>([]);
const [bulkActivePlotId, setBulkActivePlotId] = useState<number | null>(null);
```

- [ ] **Step 2: Add DOM anchor measurement helpers**

Measure:

1. Plot center by `data-plot-id`
2. Seed launch area by a new `id="bulk-seed-launch-anchor"`
3. Harvest destination by existing `id="gold-bag-ui"`

Implement helpers that read DOM at click time, not only once on mount.

- [ ] **Step 3: Add the floating pill controls above `SeedSelector`**

Use stable labels and disabled states:

```tsx
<button disabled={harvestDisabled}>一键收取</button>
<button disabled={plantDisabled}>一键播种</button>
```

Rules:

1. Harvest disabled when nothing is ready or `isBulkBusy`
2. Plant disabled when no empty plots, insufficient gold for one selected seed, or `isBulkBusy`
3. Keep styling in line with the existing pill-like, high-polish visual language

- [ ] **Step 4: Add entry point handlers without plot animation yet**

Implement `handleHarvestAllClick` and `handlePlantAllClick` that:

1. Call the new planners
2. Bail out on blocked reasons
3. Toggle `activeBulkAction` / `isBulkBusy`
4. Create flight state placeholders and sequence ids
5. Call the commit helper at the correct phase

At this stage, keep the motion rendering simple enough to satisfy the regression strings before polishing trajectories.

- [ ] **Step 5: Run the regression and type checks**

Run:

```bash
npx tsx --test src/text-sanity.test.ts
npm run lint
```

Expected:

1. `src/text-sanity.test.ts` now passes the new bulk UI checks
2. TypeScript passes with the new controller state

- [ ] **Step 6: Checkpoint this unit**

Blocked here because this directory is not a git repo.

If moved into git later:

```bash
git add src/App.tsx src/components/SeedSelector.tsx src/components/HUD.tsx src/text-sanity.test.ts
git commit -m "feat: add bulk farm action controls"
```

## Task 4: Add per-plot bulk phases and interaction locking

**Files:**
- Modify: `src/components/Plot.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Extend `PlotProps` with bulk visual props**

Add:

```ts
isBulkLocked?: boolean;
bulkPhase?: 'idle' | 'plant-target' | 'plant-impact' | 'harvest-lift' | 'harvest-cleared';
sequenceIndex?: number;
isBulkHighlighted?: boolean;
```

- [ ] **Step 2: Guard single-plot interactions while a bulk action is running**

Inside `Plot.tsx`:

1. No `onPlant` / `onHarvest` when `isBulkLocked`
2. No drag-harvest pointer enter when `isBulkLocked`
3. Preserve existing single-plot behavior when not locked

- [ ] **Step 3: Add minimal phase-driven visual feedback**

Examples:

```ts
animate={
  bulkPhase === 'harvest-lift'
    ? {scale: [1, 0.94, 1.03, 1], y: [0, -6, 0]}
    : bulkPhase === 'plant-impact'
      ? {scale: [1, 0.96, 1.01, 1]}
      : {scale: 1}
}
```

Also add a stable class or attribute for the phase if needed for future regression hooks.

- [ ] **Step 4: Pass bulk props from `App.tsx` to each plot**

Map controller state to each plot:

1. Current highlighted plot
2. Current phase
3. Global lock while bulk is active

- [ ] **Step 5: Run the focused checks**

Run:

```bash
npx tsx --test src/text-sanity.test.ts
npm run lint
```

Expected: PASS, with no type regressions in `Plot.tsx`.

- [ ] **Step 6: Checkpoint this unit**

Blocked here because this directory is not a git repo.

If moved into git later:

```bash
git add src/App.tsx src/components/Plot.tsx
git commit -m "feat: add bulk plot feedback phases"
```

## Task 5: Render first-pass plant and harvest flight animations

**Files:**
- Modify: `src/App.tsx`
- Optional Modify: `src/components/HUD.tsx`

- [ ] **Step 1: Render transient plant and harvest flight layers**

In `App.tsx`, add an absolutely positioned overlay similar to the existing fullscreen feedback shells:

```tsx
<AnimatePresence>
  {bulkHarvestFlights.map((flight) => (
    <motion.div key={flight.id} />
  ))}
</AnimatePresence>
```

Use `pointer-events-none` and a high z-index that sits above the field but below modal overlays.

- [ ] **Step 2: Approximate a parabolic feel with keyframed transforms**

For harvest:

```ts
animate={{
  x: [flight.startX, midX, flight.endX],
  y: [flight.startY, midY - 48, flight.endY],
  scale: [1, 1.12, 0.6],
  opacity: [0, 1, 0.8],
}}
```

For plant:

```ts
animate={{
  x: [flight.startX, spreadMidX, flight.endX],
  y: [flight.startY, spreadMidY - 36, flight.endY],
  rotate: [0, 10, 0],
}}
```

Sequence using `delay: flight.sequenceIndex * 0.05` or `0.06`.

- [ ] **Step 3: Hook cleanup to animation completion**

When a flight ends:

1. Remove it from the corresponding array
2. Clear `bulkActivePlotId` when the current phase is done
3. Reset `activeBulkAction` / `isBulkBusy` only after the last expected animation completes

- [ ] **Step 4: Add lightweight destination feedback**

Prefer a small HUD pulse instead of a heavy new effect system. If needed, temporarily drive a class or motion state near `gold-bag-ui` on harvest impact.

- [ ] **Step 5: Run the full automated checks**

Run:

```bash
npm test
npm run lint
```

Expected:

1. All existing tests pass
2. New bulk planner tests pass
3. Text regressions pass
4. TypeScript passes

- [ ] **Step 6: Do a manual behavior pass**

Verify in the browser:

1. One-click harvest does not instantly clear all plots before feedback begins
2. One-click plant uses the currently selected seed
3. Buttons disable during bulk execution
4. Drag harvest is blocked during bulk execution
5. The final HUD arrival feels sequential, not like a single synchronous refresh

- [ ] **Step 7: Checkpoint this unit**

Blocked here because this directory is not a git repo.

If moved into git later:

```bash
git add src/App.tsx src/components/HUD.tsx
git commit -m "feat: animate bulk farm actions"
```

## Task 6: Final cleanup and follow-up guardrails

**Files:**
- Review: `src/App.tsx`
- Review: `src/components/Plot.tsx`
- Review: `src/hooks/useGameActions.ts`
- Review: `src/text-sanity.test.ts`

- [ ] **Step 1: Remove dead code and duplicate timing constants**

Extract repeated delays into top-level constants in `App.tsx` only if the values are reused at least twice.

- [ ] **Step 2: Re-check bulk failure feedback**

Confirm:

1. No new blocking `alert` is introduced for bulk plant failure
2. Existing unrelated alerts still behave as before

- [ ] **Step 3: Run the final verification pass**

Run:

```bash
npm test
npm run lint
```

Expected: PASS on both commands with no new warnings or type errors.

- [ ] **Step 4: Document any intentional shortcuts**

If the first-pass trajectory uses DOM-measured motion divs instead of a reusable animation component, note that in the handoff so a later polish pass can extract it cleanly.

- [ ] **Step 5: Final checkpoint**

Blocked here because this directory is not a git repo.

If moved into git later:

```bash
git add src/App.tsx src/components/Plot.tsx src/components/SeedSelector.tsx src/hooks/useGameActions.ts src/hooks/useGameActions.test.ts src/text-sanity.test.ts
git commit -m "feat: add one-click farm actions"
```

## Execution Order Summary

1. Bulk pure helpers and tests
2. Text regressions for new UI hooks
3. App controller state and buttons
4. Plot phase feedback and locking
5. Flight animation layer and cleanup
6. Full verification and cleanup

## Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-22-bulk-farm-actions-implementation-plan.md`. Ready to execute?
