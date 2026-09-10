import type {OutfitId} from './outfits';

interface GirlFigureProps {
  outfit: OutfitId;
  size?: 'farm' | 'room' | 'wardrobe';
  pose?: 'idle' | 'showoff';
}

/** Same master: brown bob, oval eyes, round body. Only clothes change. */
export function GirlFigure({outfit, size = 'farm', pose = 'idle'}: GirlFigureProps) {
  return (
    <div
      className={`girl-figure size-${size} outfit-${outfit} pose-${pose}`}
      aria-label={outfit === 'witch' ? '穿小魔女套装的女孩' : '穿黄雨衣的女孩'}
    >
      <div className="gf-hat" aria-hidden />
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
