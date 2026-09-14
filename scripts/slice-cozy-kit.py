#!/usr/bin/env python3
"""
Slice cozy icon sheets (black background) into transparent PNGs + atlas JSON.

Usage:
  python3 scripts/slice-cozy-kit.py
  python3 scripts/slice-cozy-kit.py --sheet 03-farm-tools-crops --preview
"""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SHEETS_DIR = ROOT / "public" / "skins" / "cozy-kit" / "sheets"
OUT_DIR = ROOT / "public" / "skins" / "cozy-kit" / "icons"
ATLAS_PATH = ROOT / "public" / "skins" / "cozy-kit" / "atlas.json"
PREVIEW_DIR = ROOT / "public" / "skins" / "cozy-kit" / "previews"

BG_LUMA_MAX = 18
MIN_AREA = 900
PAD = 4

# Stable ids in reading order (L→R, T→B) for each sheet.
SHEET_IDS: dict[str, list[str]] = {
    "01-ui-nav": [
        "menu",
        "back",
        "settings",
        "map",
        "quest",
        "codex",
        "task_notify",
        "shop",
        "storage",
        "friends",
        "calendar",
        "home_mushroom",
        "wardrobe",
        "furniture",
        "craft",
        "folder_cat",
        "market",
        "gallery",
        "coin",
        "save",
        "add",
        "record",
        "chat",
        "info",
    ],
    "02-stats-growth": [
        "coin_mushroom",
        "star_gem",
        "heart",
        "level_leaf",
        "mood_smile",
        "exp_bar",
        "clock",
        "hourglass",
        "sparkle",
        "sprout",
        "lock_closed",
        "lock_open",
        "check",
        "slot_empty",
        "sale_tag",
        "heart_up",
        "coin_up",
        "seed_bag",
        "water_meter",
        "soil",
        "seedling",
        "plant_young",
        "harvest_carrot",
    ],
    "03-farm-tools-crops": [
        "tool_can",
        "tool_trowel",
        "tool_hoe",
        "basket_empty",
        "seed_sack",
        "seed_packet",
        "plot_empty",
        "plot_wet",
        "plot_sprout",
        "plot_leafy",
        "crop_carrot",
        "crop_strawberry",
        "crop_pumpkin",
        "crop_sunflower",
        "crop_mushroom",
        "crop_daisy",
        "pot_plant",
        "basket_full",
        "cat_black",
        "house_mushroom",
        "fence",
        "sign_mushroom",
        "btn_water",
    ],
    "04-wardrobe-furniture": [
        "hat_yellow_polka",
        "hat_witch",
        "hat_straw",
        "clip_daisy",
        "bag_satchel",
        "coat_raincoat",
        "dress_floral",
        "skirt_denim",
        "boots_yellow",
        "boots_red_polka",
        "boots_brown",
        "shoes_bow",
        "bed",
        "table_cafe",
        "chair",
        "wardrobe_cabinet",
        "rug_daisy",
        "frame_daisy",
        "vase_daisy",
        "lamp_mushroom",
        "window_curtain",
        "shelf_books",
        "btn_hanger",
    ],
}


@dataclass
class Blob:
    x0: int
    y0: int
    x1: int
    y1: int
    area: int

    @property
    def cx(self) -> float:
        return (self.x0 + self.x1) / 2

    @property
    def cy(self) -> float:
        return (self.y0 + self.y1) / 2


def is_fg(px: tuple[int, ...]) -> bool:
    r, g, b = px[0], px[1], px[2]
    a = px[3] if len(px) > 3 else 255
    if a < 8:
        return False
    return (r * 3 + g * 6 + b) // 10 > BG_LUMA_MAX


def find_blobs(im: Image.Image) -> list[Blob]:
    w, h = im.size
    px = im.load()
    seen = [[False] * w for _ in range(h)]
    blobs: list[Blob] = []

    for y in range(h):
        for x in range(w):
            if seen[y][x] or not is_fg(px[x, y]):
                continue
            stack = [(x, y)]
            seen[y][x] = True
            minx = maxx = x
            miny = maxy = y
            area = 0
            while stack:
                cx, cy = stack.pop()
                area += 1
                if cx < minx:
                    minx = cx
                if cx > maxx:
                    maxx = cx
                if cy < miny:
                    miny = cy
                if cy > maxy:
                    maxy = cy
                for nx, ny in (
                    (cx - 1, cy),
                    (cx + 1, cy),
                    (cx, cy - 1),
                    (cx, cy + 1),
                ):
                    if nx < 0 or ny < 0 or nx >= w or ny >= h:
                        continue
                    if seen[ny][nx]:
                        continue
                    if not is_fg(px[nx, ny]):
                        continue
                    seen[ny][nx] = True
                    stack.append((nx, ny))
            if area >= MIN_AREA:
                blobs.append(Blob(minx, miny, maxx, maxy, area))
    return blobs


def sort_reading_order(blobs: list[Blob], row_tol: int = 90) -> list[Blob]:
    if not blobs:
        return []
    ordered = sorted(blobs, key=lambda b: (b.cy, b.cx))
    rows: list[list[Blob]] = []
    for b in ordered:
        if not rows or abs(b.cy - sum(x.cy for x in rows[-1]) / len(rows[-1])) > row_tol:
            rows.append([b])
        else:
            rows[-1].append(b)
    out: list[Blob] = []
    for row in rows:
        out.extend(sorted(row, key=lambda b: b.cx))
    return out


def split_wide_blob(im: Image.Image, blob: Blob) -> list[Blob]:
    """If a blob is much wider than tall, split on vertical gutters / valleys."""
    width = blob.x1 - blob.x0 + 1
    height = blob.y1 - blob.y0 + 1
    if width < height * 1.45 or width < 260:
        return [blob]

    px = im.load()
    col_fg = []
    for x in range(blob.x0, blob.x1 + 1):
        count = 0
        for y in range(blob.y0, blob.y1 + 1):
            if is_fg(px[x, y]):
                count += 1
        col_fg.append(count)

    # Smooth a bit.
    smooth = col_fg[:]
    for i in range(1, len(col_fg) - 1):
        smooth[i] = (col_fg[i - 1] + col_fg[i] + col_fg[i + 1]) / 3

    max_fg = max(smooth) if smooth else 0
    if max_fg <= 0:
        return [blob]

    # Prefer true gutters; else deepest valley in the middle 60%.
    threshold = max(2, height // 40)
    gaps: list[tuple[int, int]] = []
    i = 0
    while i < len(smooth):
        if smooth[i] <= threshold:
            j = i
            while j < len(smooth) and smooth[j] <= threshold:
                j += 1
            if j - i >= 3:
                gaps.append((i, j))
            i = j
        else:
            i += 1

    cuts: list[int] = []
    for g0, g1 in gaps:
        left = sum(col_fg[:g0])
        right = sum(col_fg[g1:])
        if left >= MIN_AREA // 3 and right >= MIN_AREA // 3:
            cuts.append((g0 + g1) // 2)

    if not cuts:
        lo = int(len(smooth) * 0.18)
        hi = int(len(smooth) * 0.82)
        if hi > lo + 8:
            valley = min(range(lo, hi), key=lambda idx: smooth[idx])
            left_peak = max(smooth[:valley]) if valley else 0
            right_peak = max(smooth[valley:]) if valley < len(smooth) else 0
            peak = max(left_peak, right_peak)
            # Connected grass can keep a shallow valley — still split very wide blobs.
            ratio_ok = peak > 0 and smooth[valley] <= peak * (0.55 if width >= 400 else 0.35)
            mass_ok = (
                sum(col_fg[:valley]) >= MIN_AREA // 3
                and sum(col_fg[valley:]) >= MIN_AREA // 3
            )
            if ratio_ok and mass_ok:
                cuts.append(valley)

    if not cuts:
        return [blob]

    parts: list[Blob] = []
    edges = [0, *sorted(cuts), len(col_fg)]
    for a, b in zip(edges, edges[1:]):
        minx = maxx = miny = maxy = None
        area = 0
        for x in range(blob.x0 + a, blob.x0 + b):
            for y in range(blob.y0, blob.y1 + 1):
                if not is_fg(px[x, y]):
                    continue
                area += 1
                minx = x if minx is None else min(minx, x)
                maxx = x if maxx is None else max(maxx, x)
                miny = y if miny is None else min(miny, y)
                maxy = y if maxy is None else max(maxy, y)
        if minx is not None and area >= MIN_AREA // 2:
            parts.append(Blob(minx, miny, maxx, maxy, area))
    return parts or [blob]


def refine_blobs(im: Image.Image, blobs: list[Blob]) -> list[Blob]:
    refined: list[Blob] = []
    for blob in blobs:
        refined.extend(split_wide_blob(im, blob))
    return sort_reading_order(refined)


def cut_icon(im: Image.Image, blob: Blob) -> Image.Image:
    x0 = max(0, blob.x0 - PAD)
    y0 = max(0, blob.y0 - PAD)
    x1 = min(im.width - 1, blob.x1 + PAD)
    y1 = min(im.height - 1, blob.y1 + PAD)
    crop = im.crop((x0, y0, x1 + 1, y1 + 1)).convert("RGBA")
    px = crop.load()
    for y in range(crop.height):
        for x in range(crop.width):
            r, g, b, _a = px[x, y]
            if (r * 3 + g * 6 + b) // 10 <= BG_LUMA_MAX:
                px[x, y] = (0, 0, 0, 0)
    bbox = crop.getbbox()
    return crop.crop(bbox) if bbox else crop


def process_sheet(path: Path, preview: bool = False) -> dict:
    key = path.stem
    im = Image.open(path).convert("RGBA")
    blobs = refine_blobs(im, find_blobs(im))
    ids = SHEET_IDS.get(key, [])
    sheet_out = OUT_DIR / key
    sheet_out.mkdir(parents=True, exist_ok=True)

    entries = []
    for i, blob in enumerate(blobs):
        icon_id = ids[i] if i < len(ids) else f"item_{i:02d}"
        icon = cut_icon(im, blob)
        dest = sheet_out / f"{icon_id}.png"
        icon.save(dest)
        entries.append(
            {
                "id": icon_id,
                "sheet": key,
                "index": i,
                "src": f"/skins/cozy-kit/icons/{key}/{icon_id}.png",
                "w": icon.width,
                "h": icon.height,
                "bbox": [blob.x0, blob.y0, blob.x1, blob.y1],
            }
        )

    if preview:
        PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
        vis = im.convert("RGBA")
        draw = ImageDraw.Draw(vis)
        for i, blob in enumerate(blobs):
            draw.rectangle(
                [blob.x0, blob.y0, blob.x1, blob.y1],
                outline=(0, 255, 120, 255),
                width=3,
            )
            draw.text((blob.x0 + 4, blob.y0 + 4), str(i), fill=(255, 255, 0, 255))
        vis.save(PREVIEW_DIR / f"{key}-boxes.png")

    return {
        "sheet": key,
        "source": f"/skins/cozy-kit/sheets/{path.name}",
        "detected": len(blobs),
        "named": min(len(blobs), len(ids)) if ids else len(blobs),
        "unmatchedExtra": max(0, len(blobs) - len(ids)) if ids else 0,
        "missingNames": max(0, len(ids) - len(blobs)) if ids else 0,
        "icons": entries,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Slice cozy-kit sprite sheets")
    parser.add_argument("--sheet", help="Only process one sheet stem")
    parser.add_argument("--preview", action="store_true")
    args = parser.parse_args()

    sheets = sorted(SHEETS_DIR.glob("*.png"))
    if args.sheet:
        sheets = [p for p in sheets if p.stem == args.sheet]
        if not sheets:
            raise SystemExit(f"No sheet named {args.sheet}")

    atlas: dict = {"kit": "cozy-kit", "sheets": {}, "byId": {}}
    for path in sheets:
        result = process_sheet(path, preview=args.preview)
        atlas["sheets"][result["sheet"]] = result
        for icon in result["icons"]:
            # later sheets overwrite earlier on id clash — keep unique names in SHEET_IDS
            atlas["byId"][icon["id"]] = icon
        print(
            f"{result['sheet']}: detected={result['detected']} "
            f"named={result['named']} extra={result['unmatchedExtra']} "
            f"missing={result['missingNames']}"
        )

    ATLAS_PATH.write_text(json.dumps(atlas, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {ATLAS_PATH.relative_to(ROOT)} ({len(atlas['byId'])} icons)")


if __name__ == "__main__":
    main()
