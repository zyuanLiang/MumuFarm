# P28 — Cozy-kit UI wiring (farm + wardrobe)

Goal: stop stacking theme wallpapers / CSS silhouettes; drive the two playable screens with the sliced cozy-kit atlas.

## Farm

- Shell class `cozy-kit` always on.
- Side rails: wardrobe / home / codex / quest (left), map / task (right).
- Plots: `PlotTile` uses `plotIconId` → empty / wet / sprout / leafy / crop icons.
- Seeds tray: `SeedIcon` → crop icons.
- Dock: shop + storage | primary (`btn_water` or plant/harvest pill) | friends + calendar.

## Wardrobe

- Back + title use `back` / `wardrobe` icons.
- Preset / hat / dress / boots thumbs map through `mappings.ts`.
- Equip CTA always shows `btn_hanger` art (dimmed when already equipped).

## Atlas

See `public/skins/cozy-kit/` and `scripts/slice-cozy-kit.py`. Runtime helper: `src/p1/cozy/CozyIcon.tsx`.
