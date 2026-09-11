import type {AccessoryId} from './dayFeel';
import type {OutfitId} from './outfits';
import {OUTFITS} from './outfits';

interface GirlFigureProps {
  outfit: OutfitId;
  accessory?: AccessoryId;
  size?: 'farm' | 'room' | 'wardrobe';
  pose?: 'idle' | 'showoff';
}

/** Same master: brown bob, oval eyes, round body. Clothes + optional accessory. */
export function GirlFigure({
  outfit,
  accessory = 'none',
  size = 'farm',
  pose = 'idle',
}: GirlFigureProps) {
  const outfitLabel = OUTFITS[outfit]?.name ?? '黄雨衣';
  const accessoryLabel =
    accessory === 'cat_ears'
      ? '猫耳'
      : accessory === 'scarf'
        ? '围巾'
        : accessory === 'flower_crown'
          ? '花冠'
          : '';

  return (
    <div
      className={`girl-figure size-${size} outfit-${outfit} accessory-${accessory} pose-${pose}`}
      aria-label={`穿${outfitLabel}的女孩${accessoryLabel ? `（${accessoryLabel}）` : ''}`}
    >
      <div className="gf-hat" aria-hidden />
      <div className="gf-crown" aria-hidden>
        <span className="petal a" />
        <span className="petal b" />
        <span className="petal c" />
      </div>
      <div className="gf-ears" aria-hidden>
        <span className="ear left" />
        <span className="ear right" />
      </div>
      <div className="gf-scarf" aria-hidden />
      <div className="gf-head" aria-hidden>
        <span className="gf-eye left" />
        <span className="gf-eye right" />
        <span className="gf-smile" />
      </div>
      <div className="gf-hair" aria-hidden />
      <div className="gf-body" aria-hidden />
      <div className="gf-apron" aria-hidden />
      <div className="gf-boots" aria-hidden />
    </div>
  );
}

export function BlackCat({
  size = 'farm',
  onAssist,
}: {
  size?: 'farm' | 'room' | 'wardrobe';
  onAssist?: () => void;
}) {
  const body = (
    <>
      <div className="cat-body" />
      <div className="cat-head" />
      <div className="cat-crescent" />
    </>
  );
  if (!onAssist) {
    return (
      <div className={`black-cat size-${size}`} aria-hidden>
        {body}
      </div>
    );
  }
  return (
    <button
      type="button"
      className={`black-cat size-${size} is-helper`}
      aria-label="黑猫帮忙浇一格"
      title="黑猫帮忙浇一格"
      onClick={onAssist}
    >
      {body}
    </button>
  );
}

export function StrayCat() {
  return (
    <span className="stray-cat" aria-hidden>
      <span className="stray-body" />
      <span className="stray-head" />
      <span className="stray-tail" />
    </span>
  );
}

export function SongBird() {
  return (
    <span className="song-bird" aria-hidden>
      <span className="bird-body" />
      <span className="bird-wing" />
    </span>
  );
}
