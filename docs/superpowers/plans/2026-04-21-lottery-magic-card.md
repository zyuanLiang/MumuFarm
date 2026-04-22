# Lottery Magic Card Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the lottery reward hero card into a floating magic card with rarity-driven glow, pulse, particle border, and background brightness spike.

**Architecture:** Keep the work isolated inside `src/components/LotteryModal.tsx` so the draw flow and reward data stay unchanged. Use layered `motion.div` wrappers around the existing reward art to create tilt, glass glow, pulse, and tap feedback, then verify the source contains the required animation hooks through the existing text-sanity test file.

**Tech Stack:** React 19, TypeScript, Motion, existing Node test runner, Vite

---

### Task 1: Lock the visual contract with a failing text-based test

**Files:**
- Modify: `src/text-sanity.test.ts`
- Test: `src/text-sanity.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
test('LotteryModal.tsx contains floating magic card visual treatment', () => {
  const content = readUtf8('src/components/LotteryModal.tsx');

  assert.ok(content.includes('rotateX: [0, 5, -5, 0]'));
  assert.ok(content.includes('whileTap={{scale: 0.96}}'));
  assert.ok(content.includes('backdrop-blur-2xl'));
  assert.ok(content.includes('particle border'));
  assert.ok(content.includes('brightnessSpike'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --test-name-pattern="floating magic card"`
Expected: FAIL because `LotteryModal.tsx` does not yet contain the new animation hooks.

### Task 2: Rebuild RewardDisplay as a layered floating card

**Files:**
- Modify: `src/components/LotteryModal.tsx`
- Test: `src/text-sanity.test.ts`

- [ ] **Step 1: Add derived rarity flags and color helpers**

```ts
const highlightedReward = reward.rarity === 'epic' || reward.rarity === 'legendary';
const glowColor = `${rarityStyle.color}99`;
```

- [ ] **Step 2: Replace the single wrapper with layered motion shells**

```tsx
<motion.button whileTap={{scale: 0.96}}>
  <motion.div animate={{rotateX: [0, 5, -5, 0]}} />
</motion.button>
```

- [ ] **Step 3: Add glass glow, pulse, and particle border layers**

```tsx
{/* particle border */}
<motion.div className="absolute inset-0 backdrop-blur-2xl" />
```

### Task 3: Add epic/legendary backdrop spike and verify

**Files:**
- Modify: `src/components/LotteryModal.tsx`
- Test: `src/text-sanity.test.ts`

- [ ] **Step 1: Add a brightness spike animation token for highlighted rewards**

```ts
const brightnessSpike = highlightedReward
  ? ['brightness(0.95) saturate(1.15)', 'brightness(2) saturate(1.8)', 'brightness(1.35) saturate(1.4)']
  : ['brightness(0.9) saturate(1.2)', 'brightness(0.95) saturate(1.25)', 'brightness(0.9) saturate(1.2)'];
```

- [ ] **Step 2: Run the targeted test and the full build**

Run: `npm test -- --test-name-pattern="floating magic card"`
Expected: PASS

Run: `npm run build`
Expected: PASS
