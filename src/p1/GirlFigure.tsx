import type {AccessoryId} from './dayFeel';
import type {OutfitId} from './outfits';

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
  const label =
    outfit === 'witch' ? '穿小魔女套装的女孩' : '穿黄雨衣的女孩';

  return (
    <div
      className={`girl-figure size-${size} outfit-${outfit} accessory-${accessory} pose-${pose}`}
      aria-label={accessory === 'cat_ears' ? `${label}（猫耳）` : label}
    >
      <div className="gf-hat" aria-hidden />
      <div className="gf-ears" aria-hidden>
        <span className="ear left" />
        <span className="ear right" />
      </div>
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

export function BlackCat({size = 'farm'}: {size?: 'farm' | 'room' | 'wardrobe'}) {
  return (
    <div className={`black-cat size-${size}`} aria-hidden>
      <div className="cat-body" />
      <div className="cat-head" />
      <div className="cat-crescent" />
    </div>
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
