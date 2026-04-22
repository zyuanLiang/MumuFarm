# Ten Lottery Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a production-ready 10-draw lottery flow with a separate button, discounted 450-gold settlement, rarity-sorted staggered results, and stronger fullscreen feedback without regressing the existing single draw flow.

**Architecture:** Keep the current single-draw lottery path intact, but refactor the draw logic into a reusable single-draw settlement unit plus a batch settlement layer. Promote the UI from `lastReward` to a session-shaped result object so `App.tsx` and `LotteryModal.tsx` can render either one reward or ten rewards from the same source of truth.

**Tech Stack:** React 19, TypeScript, Motion, Vite, Node `--test`, existing `tsx --test` and `tsc --noEmit`

---

## File Map

- Modify: `src/constants.ts`
  Purpose: add `LOTTERY_TEN_COST` and keep lottery pricing out of component literals.
- Modify: `src/types.ts`
  Purpose: define shared session/result types needed by `App.tsx` and `LotteryModal.tsx`.
- Modify: `src/hooks/useGameActions.ts`
  Purpose: extract reusable single-draw settlement logic, add batch settlement, and update the hook to accept a draw count.
- Modify: `src/hooks/useGameActions.test.ts`
  Purpose: add TDD coverage for 10-draw pricing, settlement, ordering, and insufficient-gold behavior.
- Modify: `src/App.tsx`
  Purpose: replace `lastReward` with `lastLotterySession` and convert fullscreen effect triggers to intensity-aware inputs.
- Modify: `src/components/LotteryModal.tsx`
  Purpose: add the separate 10-draw CTA, batch-result presentation, and rarity-sorted staggered grid rendering while preserving single-draw behavior.
- Modify: `src/text-sanity.test.ts`
  Purpose: lock in the new 10-draw UI copy and structure markers so later visual refactors do not silently remove them.
- Verify: `package.json`
  Purpose: use the existing `npm test` and `npm run lint` scripts only; no script changes needed.

## Constraints

- Keep the existing prize pool weights and reward semantics unchanged.
- Do not add pity logic, long-press input, flip-card ritual, meteor scatter path animation, or 3-4-3 layout in this implementation.
- Use TDD: every new behavior starts as a failing automated test before production code changes.
- Preserve current single-draw behavior and visuals unless explicitly needed to unify the session model.
- Current workspace is **not** a git repository, so commit steps are replaced with documented checkpoints.

## Task 1: Lock 10-Draw Settlement Expectations in Tests

**Files:**
- Modify: `src/hooks/useGameActions.test.ts`
- Verify: `package.json`

- [ ] **Step 1: Write the failing test for discounted 10-draw pricing**

Add a test that calls the future batch lottery API with deterministic random inputs and asserts that gold drops by `LOTTERY_TEN_COST` instead of `LOTTERY_COST * 10`.

Example target shape:

```ts
test('drawLotteryBatch deducts discounted gold for ten draws', () => {
  const state = withState({gold: 1000});
  const result = drawLotteryBatch(state, new Array(10).fill(0.95));

  assert.ok(result);
  assert.equal(result?.drawCount, 10);
  assert.equal(result?.nextState.gold, 1000 - LOTTERY_TEN_COST + 1000);
});
```

- [ ] **Step 2: Write the failing test for batch reward accumulation and ordering**

Add a second test that mixes deterministic random values and asserts:

1. `rewards.length === 10`
2. `displayRewards.length === 10`
3. `primaryReward` is the highest-rarity reward
4. same-rarity items preserve original relative order

- [ ] **Step 3: Write the failing test for insufficient gold**

Add a third test asserting that batch draw returns `null` when `gold < LOTTERY_TEN_COST`.

- [ ] **Step 4: Run the focused hook test suite to verify failure**

Run: `npx tsx --test src/hooks/useGameActions.test.ts`

Expected:
- FAIL because `drawLotteryBatch`, `LOTTERY_TEN_COST`, and batch result fields do not exist yet

- [ ] **Step 5: Record checkpoint**

Document:
- failing tests now define batch draw behavior
- no production files changed yet

## Task 2: Implement Shared Lottery Result Types and Batch Settlement

**Files:**
- Modify: `src/constants.ts`
- Modify: `src/types.ts`
- Modify: `src/hooks/useGameActions.ts`
- Verify: `src/hooks/useGameActions.test.ts`

- [ ] **Step 1: Add the minimal shared types and pricing constant**

Add `LOTTERY_TEN_COST = 450` to `src/constants.ts`.

Add shared types in `src/types.ts` for:

```ts
export interface LotterySessionResult {
  drawCount: number;
  rewards: PrizePoolItem[];
  displayRewards: PrizePoolItem[];
  primaryReward: PrizePoolItem | null;
  summaryEffect: LotteryEffect;
  highRarityCount: number;
}
```

If a separate batch result type is needed internally, define it in `useGameActions.ts` or export it only if reused elsewhere.

- [ ] **Step 2: Rework the single-draw logic into a reusable settlement helper**

In `src/hooks/useGameActions.ts`, extract the single-draw internals so one helper:

1. accepts a `GameState` and a deterministic random value
2. resolves one reward
3. returns `nextState`, `reward`, and `effect`

Keep the external single-draw contract stable.

- [ ] **Step 3: Implement `drawLotteryBatch` with cumulative state updates**

Implement batch settlement so it:

1. checks `LOTTERY_TEN_COST`
2. loops exactly 10 times
3. feeds each iteration the previous `nextState`
4. accumulates `rewards` and `effects`
5. computes `displayRewards`, `primaryReward`, `summaryEffect`, and `highRarityCount`

- [ ] **Step 4: Update the hook-level handler to accept a draw count**

Change the hook API from a hard-coded single-draw handler to:

```ts
handleDraw(count?: number)
```

Behavior:

1. `count` omitted or `1` keeps current single-draw behavior
2. `count === 10` uses the batch path
3. `onLotteryResolved` receives a session-shaped result for either path

- [ ] **Step 5: Run the focused hook test suite to verify it passes**

Run: `npx tsx --test src/hooks/useGameActions.test.ts`

Expected:
- PASS for the new batch-draw tests
- PASS for the existing single-draw tests

- [ ] **Step 6: Run a type check for this milestone**

Run: `npm run lint`

Expected:
- PASS
- no new type errors around shared lottery result types

- [ ] **Step 7: Record checkpoint**

Document:
- logic layer now supports single draw and ten draw from shared settlement code
- no modal changes yet

## Task 3: Promote App State to Lottery Sessions and Intensity-Aware Effects

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/types.ts` or `src/hooks/useGameActions.ts` only if the session type location needs adjustment
- Verify: `src/hooks/useGameActions.test.ts`

- [ ] **Step 1: Identify the exact replacement points for `lastReward`**

Before editing, map every usage of:

1. `lastReward`
2. `applyLotteryEffect`
3. `onLotteryResolved`
4. modal props passed into `LotteryModal`

Do not change unrelated gameplay state while doing this.

- [ ] **Step 2: Replace `lastReward` with `lastLotterySession`**

Update `src/App.tsx` so state stores one session object, not one reward:

```ts
const [lastLotterySession, setLastLotterySession] = useState<LotterySessionResult | null>(null);
```

When the hook resolves:

1. set the session object
2. derive the fullscreen effect intensity from `drawCount` and `highRarityCount`
3. continue to trigger existing overlays rather than replacing them with a new animation system

- [ ] **Step 3: Make effect helpers accept intensity inputs**

Refactor the fullscreen effect helpers in `src/App.tsx` to accept optional counts, for example:

```ts
triggerLotteryButterflies(count?: number)
triggerLotterySparkles(count?: number)
triggerLotteryCoins(count?: number)
```

Use those counts to adjust particle array sizes while preserving current timing and cleanup behavior.

- [ ] **Step 4: Re-run the existing full test suite to catch integration regressions early**

Run: `npm test`

Expected:
- PASS for hook tests and existing text sanity tests
- if text sanity fails because the modal has not been updated yet, understand the exact failure and continue only if it is expected and temporary

- [ ] **Step 5: Record checkpoint**

Document:
- App now understands lottery sessions
- fullscreen feedback intensity can scale with batch results

## Task 4: Add the 10-Draw Modal Flow and Batch Grid Presentation

**Files:**
- Modify: `src/components/LotteryModal.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing text-sanity assertions for the new 10-draw UI**

Add assertions to `src/text-sanity.test.ts` for the exact markers you intend to implement, for example:

```ts
assert.ok(modalContent.includes('10 连抽'));
assert.ok(modalContent.includes('立省 50'));
assert.ok(modalContent.includes('LOTTERY_TEN_COST'));
assert.ok(modalContent.includes('RewardGridDisplay'));
assert.ok(modalContent.includes('staggerChildren'));
```

Use the final literal strings you actually plan to keep in the component.

- [ ] **Step 2: Run the focused text-sanity suite to verify failure**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- FAIL because the 10-draw UI markers do not exist yet

- [ ] **Step 3: Update modal props and draw controls**

In `src/components/LotteryModal.tsx`:

1. replace `lastReward` with `lastLotterySession`
2. replace `onDraw` with either:
   - `onDraw(count?: number)`, or
   - `onDrawSingle` and `onDrawTen`
3. add a second CTA for 10 draws
4. independently disable single and ten-draw buttons using `LOTTERY_COST` and `LOTTERY_TEN_COST`

- [ ] **Step 4: Add `RewardGridDisplay` for the batch result stage**

Implement a new batch-result renderer in the modal that:

1. uses a `2 x 5` grid
2. renders `displayRewards`
3. uses `staggerChildren` or equivalent child sequencing
4. applies stronger glow to `legendary`, medium glow to `epic`
5. keeps single-draw rendering on the existing `RewardDisplay`

- [ ] **Step 5: Update the title area to support session summaries**

When `drawCount === 10`, show summary copy derived from the session:

1. primary line for the 10-draw reveal
2. summary line such as rarity counts or “共获得 10 件奖励”

When `drawCount === 1`, preserve the current focused reward treatment.

- [ ] **Step 6: Run the focused text-sanity suite to verify it passes**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- PASS for the new 10-draw UI assertions
- PASS for the pre-existing modal structure assertions

- [ ] **Step 7: Record checkpoint**

Document:
- modal now supports separate single and 10-draw actions
- batch results render as a rarity-sorted staggered grid

## Task 5: Final Regression Verification

**Files:**
- Verify: `src/constants.ts`
- Verify: `src/types.ts`
- Verify: `src/hooks/useGameActions.ts`
- Verify: `src/hooks/useGameActions.test.ts`
- Verify: `src/App.tsx`
- Verify: `src/components/LotteryModal.tsx`
- Verify: `src/text-sanity.test.ts`

- [ ] **Step 1: Re-run the focused hook tests**

Run: `npx tsx --test src/hooks/useGameActions.test.ts`

Expected:
- PASS

- [ ] **Step 2: Re-run the focused text regression suite**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- PASS

- [ ] **Step 3: Run the complete automated test suite**

Run: `npm test`

Expected:
- PASS

- [ ] **Step 4: Run the full TypeScript check**

Run: `npm run lint`

Expected:
- PASS

- [ ] **Step 5: Manual UI verification**

Check all of the following in the running app:

1. single draw still works and shows the existing single reward card
2. `10 连抽` button appears in the modal and shows the discounted price
3. ten-draw results appear in a `2 x 5` grid
4. high-rarity rewards are displayed first and visibly highlighted
5. fullscreen particles and background intensity feel stronger when multiple high-rarity rewards appear
6. insufficient gold disables only the button that cannot be afforded

- [ ] **Step 6: Final checkpoint**

Document:
- test status
- lint status
- any visual deviations from the approved spec
- any follow-up work intentionally deferred to a later spec

## Review Notes

- This plan was manually reviewed in-session against `docs/superpowers/specs/2026-04-22-ten-lottery-design.md`.
- The standard subagent plan-review loop was not used because this session is not authorized to spawn subagents unless explicitly requested by the user.
