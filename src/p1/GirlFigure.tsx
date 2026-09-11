import type {AccessoryId} from './dayFeel';
import {
  BOOTS,
  DRESSES,
  HATS,
  type Look,
} from './pieces';

interface GirlFigureProps {
  look: Look;
  accessory?: AccessoryId;
  size?: 'farm' | 'room' | 'wardrobe';
  pose?: 'idle' | 'showoff';
}

/** Same master: brown bob, oval eyes, round body. Mixable clothes + accessory. */
export function GirlFigure({
  look,
  accessory = 'none',
  size = 'farm',
  pose = 'idle',
}: GirlFigureProps) {
  const dressLabel = DRESSES[look.dress]?.name ?? '衣服';
  const hatLabel = look.hat === 'bare' ? '' : HATS[look.hat].name;
  const bootsLabel = BOOTS[look.boots]?.name ?? '';
  const accessoryLabel =
    accessory === 'cat_ears'
      ? '猫耳'
      : accessory === 'scarf'
        ? '围巾'
        : accessory === 'flower_crown'
          ? '花冠'
          : accessory === 'mushroom_pin'
            ? '蘑菇胸针'
            : '';

  const aria = [
    `穿${dressLabel}的女孩`,
    hatLabel ? `戴${hatLabel}` : '',
    bootsLabel ? bootsLabel : '',
    accessoryLabel ? `（${accessoryLabel}）` : '',
  ]
    .filter(Boolean)
    .join('·');

  return (
    <div
      className={`girl-figure size-${size} dress-${look.dress} hat-${look.hat} boots-${look.boots} accessory-${accessory} pose-${pose}`}
      aria-label={aria}
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
      <div className="gf-mushroom-pin" aria-hidden />
      <div className="gf-head" aria-hidden>
        <span className="gf-blush left" />
        <span className="gf-blush right" />
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
