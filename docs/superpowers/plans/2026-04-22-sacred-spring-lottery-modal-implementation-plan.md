# Sacred Spring Lottery Modal Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the sacred spring lottery modal feel more readable and layered without changing draw behavior, using a small header, stronger modal separation, a softer disabled button state, and clearer prize-slot rhythm.

**Architecture:** Keep the implementation scoped to the existing lottery modal and skin config. Add a small amount of skin-driven modal UI configuration in `constants.ts`, consume it in `LotteryModal.tsx` with fallback values, and lock the expected copy/style markers through the existing `text-sanity` test file.

**Tech Stack:** React 19, TypeScript, Motion, Vite, Tailwind utility classes, Node `--test`

---

## File Map

- Modify: `src/constants.ts`
  Purpose: extend `SKINS.sacred_spring` with modal-specific theme tokens and keep defaults for other skins.
- Modify: `src/components/LotteryModal.tsx`
  Purpose: apply the modal shell polish, add the `神泉商店` header, refine the disabled button state, and improve prize list slot styling.
- Modify: `src/text-sanity.test.ts`
  Purpose: add regression coverage for the new header copy, skin config keys, and the specific modal style markers introduced by this change.
- Verify: `package.json`
  Purpose: use existing `npm test` and `npm run lint` scripts only; no script changes needed.

## Constraints

- Keep `handleDraw`, `gold < LOTTERY_COST`, reward reveal logic, and prize list ordering unchanged.
- Do not expand this work into `SeedSelector`, `HUD`, or other overlays.
- Use TDD for each behavior change by updating `src/text-sanity.test.ts` first and watching it fail before implementing.
- Current workspace is **not** a git repository, so commit steps are intentionally replaced by “document checkpoint” steps.

## Task 1: Add Skin-Level Modal Theme Tokens

**Files:**
- Modify: `src/text-sanity.test.ts`
- Modify: `src/constants.ts`

- [ ] **Step 1: Write the failing test for sacred spring modal config**

Add assertions to `src/text-sanity.test.ts` inside a new test or the existing skin/config coverage test for:

```ts
assert.ok(constantsContent.includes("accentColor: '#4FD1C5'"));
assert.ok(constantsContent.includes("modalOverlay: 'bg-slate-950/80'"));
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- FAIL because `accentColor` and `modalOverlay` are not present in `src/constants.ts`

- [ ] **Step 3: Add the minimal sacred spring config**

Update `src/constants.ts` so `SKINS.sacred_spring` includes:

```ts
accentColor: '#4FD1C5',
modalOverlay: 'bg-slate-950/80',
```

Also add the same keys to the other skins with safe fallback values if TypeScript inference would otherwise create property access friction in `LotteryModal.tsx`.

- [ ] **Step 4: Run the targeted test to verify it passes**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- PASS for the new config assertions
- Any remaining failures should only be unrelated pre-existing ones that must be understood before continuing

- [ ] **Step 5: Record checkpoint**

Note in the working log or task tracker:
- skin config now carries modal UI tokens
- no runtime behavior changed yet

## Task 2: Add Header Copy and Modal Shell Layering

**Files:**
- Modify: `src/text-sanity.test.ts`
- Modify: `src/components/LotteryModal.tsx`

- [ ] **Step 1: Write the failing test for header and shell markers**

Add assertions for the exact new copy and style hooks, for example:

```ts
assert.ok(modalContent.includes('神泉商店'));
assert.ok(modalContent.includes('献祭金币，换取神泉赐福'));
assert.ok(modalContent.includes('shadow-[0_0_20px_rgba(100,200,255,0.1)]'));
assert.ok(modalContent.includes('backdrop-blur-lg'));
```

Use the final class/style markers you actually intend to implement. Keep the assertions narrow and specific.

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- FAIL because the title copy and new shell markers do not exist yet

- [ ] **Step 3: Implement the modal shell and header**

Update `src/components/LotteryModal.tsx` to:

1. Read `accentColor` and `modalOverlay` from the active skin with fallback values.
2. Apply the modal overlay token to the outer fullscreen backdrop.
3. Strengthen the modal container with:
   - a thin border
   - a subtle blue-green outer glow
   - a slightly stronger blur
   - a vertical gradient background instead of a flat dark fill
4. Add a lightweight top header area containing:
   - title: `神泉商店`
   - helper copy: `献祭金币，换取神泉赐福`
5. Keep the close button position intact on mobile widths.

- [ ] **Step 4: Run the targeted test to verify it passes**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- PASS for the new title and shell assertions

- [ ] **Step 5: Perform a quick type check on just this milestone**

Run: `npm run lint`

Expected:
- exit code 0
- no new TypeScript property errors around `SKINS[...]`

- [ ] **Step 6: Record checkpoint**

Note:
- header copy added
- modal shell now has stronger separation from the sacred spring background

## Task 3: Refine Draw Button States

**Files:**
- Modify: `src/text-sanity.test.ts`
- Modify: `src/components/LotteryModal.tsx`

- [ ] **Step 1: Write the failing test for button-state markers**

Add assertions for the disabled-state and interactive-state hooks you will implement, for example:

```ts
assert.ok(modalContent.includes('disabled:cursor-not-allowed'));
assert.ok(modalContent.includes('hover:brightness-110'));
assert.ok(modalContent.includes('shadow-[inset_0_0_12px_rgba(248,113,113,0.18)]'));
```

Choose the final markers first, then assert exactly those strings.

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- FAIL because the new button-state markers are not in the file yet

- [ ] **Step 3: Implement the button-state polish**

Update the draw button in `src/components/LotteryModal.tsx` to:

1. Keep the current CTA copy and button structure.
2. Add a visible but restrained hover lift for enabled state.
3. Preserve active scale feedback.
4. Replace the current hard disabled overlay feel with a more depressed state:
   - darker button surface
   - lower overall opacity
   - red hint text with a weak inner glow or shadow
   - optional disabled cursor treatment
5. Preserve the existing `disabled={gold < LOTTERY_COST || isDrawing}` behavior.

- [ ] **Step 4: Run the targeted test to verify it passes**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- PASS for the new button-style assertions

- [ ] **Step 5: Record checkpoint**

Note:
- enabled and disabled states now read differently without changing logic

## Task 4: Improve Prize List Slot Rhythm and Readability

**Files:**
- Modify: `src/text-sanity.test.ts`
- Modify: `src/components/LotteryModal.tsx`

- [ ] **Step 1: Write the failing test for prize-slot styling markers**

Add assertions for the slot-base and text readability markers, for example:

```ts
assert.ok(modalContent.includes('bg-slate-950/40'));
assert.ok(modalContent.includes('textShadow:'));
assert.ok(modalContent.includes('inset 0 1px 0 rgba(255,255,255,0.06)'));
```

If you implement text shadow via inline style, assert the exact property/value fragment you add.

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- FAIL because the slot styling markers do not exist yet

- [ ] **Step 3: Implement the prize-slot polish**

Update the prize list item rendering in `src/components/LotteryModal.tsx` to:

1. Wrap each item in a darker semi-transparent slot surface.
2. Add a light border and inner highlight/shadow to make the item feel seated in a slot.
3. Preserve current hover motion and rarity coloring.
4. Add a very light text shadow to item names only.
5. Keep horizontal scrolling and current mask fade behavior unchanged.

- [ ] **Step 4: Run the targeted test to verify it passes**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- PASS for the slot/readability assertions

- [ ] **Step 5: Record checkpoint**

Note:
- prize list feels grounded
- text readability improved without increasing font size

## Task 5: Final Regression Verification

**Files:**
- Verify: `src/constants.ts`
- Verify: `src/components/LotteryModal.tsx`
- Verify: `src/text-sanity.test.ts`

- [ ] **Step 1: Re-run the focused text regression suite**

Run: `npx tsx --test src/text-sanity.test.ts`

Expected:
- PASS

- [ ] **Step 2: Run the full existing test suite**

Run: `npm test`

Expected:
- PASS
- no new failures introduced by the modal changes

- [ ] **Step 3: Run the full TypeScript check**

Run: `npm run lint`

Expected:
- PASS

- [ ] **Step 4: Manual UI verification in the app/browser**

Check all of the following:

1. `神泉商店` title appears and does not overlap the close button on small widths.
2. Modal edges are clearer against the sacred spring background.
3. Enabled button has a visible hover response.
4. `金币储备不足` reads as disabled instead of an error overlay.
5. Prize items look seated in slots and the first highlighted item still stands out the most.

- [ ] **Step 5: Final checkpoint**

Document the outcome:
- tests and lint status
- any visual deviations from the approved spec
- whether the browser preview matched expectations

## Review Notes

- This plan was manually reviewed in-session against `docs/superpowers/specs/2026-04-21-sacred-spring-lottery-modal-design.md`.
- The standard subagent plan-review loop was not used because this session is not authorized to spawn subagents unless explicitly requested by the user.
