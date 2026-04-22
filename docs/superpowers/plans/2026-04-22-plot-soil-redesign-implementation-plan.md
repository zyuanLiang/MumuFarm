# Plot Soil Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the farm plot visuals so each tile reads as layered soil with depth, wet/dry state changes, and harvest dirt feedback instead of a flat rounded-rectangle button.

**Architecture:** Keep gameplay and event flow inside the existing `Plot.tsx` component, but split the visual markup into explicit soil layers and drive their look from derived plot state. Use `src/index.css` for the heavy visual treatment, keep Motion-based interaction and particle timing in `Plot.tsx`, and lock the structure and animation markers through `src/text-sanity.test.ts`.

**Tech Stack:** React 19, TypeScript, Motion (`motion/react`), Tailwind utility classes, custom CSS in `src/index.css`, Node `--test`, `tsx`

---

## File Map

- Modify: `src/text-sanity.test.ts`
  Purpose: add regression checks for the new soil-layer structure, wet-state markers, harvest bounce sequence, and particle hooks before implementation.
- Modify: `src/components/Plot.tsx`
  Purpose: replace the single-block plot body with layered soil markup, add harvest particle state, and upgrade the harvest bounce without changing gameplay logic.
- Modify: `src/index.css`
  Purpose: move the visual responsibility from `.plot-base` to new layered soil classes and define the 2.5D depth, wet sheen, AO, rough edges, and pit styling.
- Verify: `package.json`
  Purpose: use existing `npm test` and `npm run lint` scripts only; no script changes.

## Constraints

- Keep `onPlant`, `onHarvest`, `handlePointerEnter`, growth timing, and drag-harvest behavior unchanged.
- Do not add image assets, SVG files, or new dependencies.
- Preserve `plot-base` as a compatibility class even if it no longer owns the full visual treatment.
- Use TDD: update `src/text-sanity.test.ts` first, run it and watch it fail, then implement minimal code to pass.
- Current workspace is **not** a git repository, so commit steps are replaced by checkpoint steps.

## Task 1: Lock the New Plot Structure in Tests

**Files:**
- Modify: `src/text-sanity.test.ts`

- [ ] **Step 1: Write the failing plot redesign assertions**

Add a new test covering the exact markers the implementation will introduce, for example:

```ts
test('Plot uses layered soil structure and harvest dirt feedback markers', () => {
  const plotContent = readUtf8('src/components/Plot.tsx');

  assert.ok(plotContent.includes('soil-shadow'));
  assert.ok(plotContent.includes('soil-surface'));
  assert.ok(plotContent.includes('soil-ambience'));
  assert.ok(plotContent.includes('soil-particles'));
  assert.ok(plotContent.includes('scale: [1, 0.9, 1.1, 1]'));
  assert.ok(plotContent.includes('surfaceStateClass'));
  assert.ok(plotContent.includes('spawnHarvestParticles'));
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- FAIL because the new plot-layer and particle markers do not exist yet

- [ ] **Step 3: Record checkpoint**

Note:
- regression test now describes the target structure
- failure reason is missing implementation, not test syntax

## Task 2: Rebuild `Plot.tsx` Around Layered Soil Markup

**Files:**
- Modify: `src/components/Plot.tsx`

- [ ] **Step 1: Add the minimal new state needed for dirt feedback**

Introduce:

1. A short-lived particle list state, for example `harvestParticles`.
2. A helper like `spawnHarvestParticles()` that creates 6-8 particles with deterministic-enough keys, offsets, size, and earthy color values.
3. A derived soil-state class string such as:

```ts
const surfaceStateClass = plot.cropId
  ? plot.isWatered
    ? 'soil-surface-wet'
    : isGrown
      ? 'soil-surface-ripe'
      : 'soil-surface-growing'
  : 'soil-surface-empty';
```

- [ ] **Step 2: Upgrade the harvest feedback trigger without changing harvest logic**

Use the existing “previous crop was grown and now crop is null” detection to:

1. set the bounce flag
2. call `spawnHarvestParticles()`
3. clear the bounce flag after the animation duration
4. clear particles after their fade-out window

Do **not** trigger particles from empty clicks or non-harvest interactions.

- [ ] **Step 3: Replace the current single-block body with explicit layers**

Inside the root `motion.div`, add the new structure:

1. `soil-shadow` layer
2. `soil-surface` layer with the state class
3. optional `soil-ambience` wrapper holding rough-edge / grass / crack elements
4. `soil-particles` layer rendering the animated dirt particles
5. existing crop / pit / progress / timer content above them

Keep `data-plot-id`, pointer handlers, and the current crop rendering flow intact.

- [ ] **Step 4: Upgrade the bounce animation to the approved sequence**

Change the harvest bounce to:

```ts
animate={isSquishing ? { scale: [1, 0.9, 1.1, 1] } : { scale: 1 }}
transition={isSquishing ? { duration: 0.42, ease: [0.22, 1, 0.36, 1] } : {}}
```

Keep `whileTap` active for ordinary press feedback, but tune it toward “soft soil” rather than a generic button press.

- [ ] **Step 5: Run the focused test to verify the new markers pass**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- PASS for the new plot redesign assertions
- any remaining failures should be understood as pre-existing or unrelated before proceeding

- [ ] **Step 6: Record checkpoint**

Note:
- `Plot.tsx` now exposes explicit soil layers
- harvest bounce and particle hooks exist
- gameplay logic remains untouched

## Task 3: Move the Soil Look Into Dedicated CSS Layers

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Keep `.plot-base` as the interaction shell only**

Reduce `.plot-base` to container-oriented behavior:

1. preserve border radius / pointer / transition compatibility
2. remove responsibility for the full soil fill and thick inset shadows
3. keep hover layering behavior compatible with Framer Motion

- [ ] **Step 2: Add the new soil depth and surface classes**

Create CSS for:

1. `.soil-shadow`
2. `.soil-surface`
3. `.soil-surface-empty`
4. `.soil-surface-growing`
5. `.soil-surface-wet`
6. `.soil-surface-ripe`

These classes should provide:

1. bottom-heavy depth shading
2. top-to-bottom soil gradient
3. inner dark rim for dug-up thickness
4. subtle AO against the background
5. wet-state highlight without a blue overlay

- [ ] **Step 3: Add ambience and pit-specific styling**

Create or update CSS for:

1. `soil-ambience`
2. rough dirt lumps / grass-tip helper classes used by `Plot.tsx`
3. `dirt-pit` so the empty state reads as a collapsed planting pit, not a flat dark circle

If `soil-texture` remains, keep it as a low-opacity support layer only.

- [ ] **Step 4: Add particle styling hooks**

Define CSS for the dirt particle layer and individual particles, for example:

1. `.soil-particles`
2. `.soil-particle`

Keep them pointer-transparent and visually subordinate to the crop art.

- [ ] **Step 5: Run the focused regression suite again**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- PASS

- [ ] **Step 6: Record checkpoint**

Note:
- soil visuals now come from dedicated layers, not a single rounded rectangle
- wet, empty, growing, and ripe states are all visually differentiated

## Task 4: Full Regression and Type Verification

**Files:**
- Verify: `src/text-sanity.test.ts`
- Verify: `src/components/Plot.tsx`
- Verify: `src/index.css`

- [ ] **Step 1: Run the full existing test suite**

Run: `npm test`

Expected:
- PASS
- no regression in existing lottery / copy / hook sanity checks

- [ ] **Step 2: Run the full TypeScript check**

Run: `npm run lint`

Expected:
- PASS
- no new type issues from particle state, helper arrays, or JSX structure changes

- [ ] **Step 3: Manually verify the plot in the app**

Check all of the following:

1. Empty plots read as soil pits instead of UI buttons.
2. Plot edges feel thicker and grounded against the farm background.
3. Watered plots look darker and glossier without a strong blue tint.
4. Harvesting produces the `scale: [1, 0.9, 1.1, 1]` bounce and visible dirt flecks.
5. Drag-harvest still works and does not spawn particles on non-ready plots.

- [ ] **Step 4: Final checkpoint**

Document:
- test status
- lint status
- any remaining visual compromises from the “no new assets” constraint

## Review Notes

- This plan is based on `docs/superpowers/specs/2026-04-22-plot-soil-redesign-design.md`.
- The standard plan-review subagent loop was not used because this session is not authorized to spawn subagents unless explicitly requested by the user.
