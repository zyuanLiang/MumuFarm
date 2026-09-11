import type {AccessoryId} from './dayFeel';
import {
  BOOTS,
  DRESSES,
  HATS,
  type Look,
} from './pieces';
import {bootsArtUrl, dressArtUrl, hatArtUrl} from './themes';
import {useThemeRuntime} from './themes/ThemeRuntimeContext';

interface GirlFigureProps {
  look: Look;
  accessory?: AccessoryId;
  size?: 'farm' | 'room' | 'wardrobe';
  pose?: 'idle' | 'showoff';
}

/**
 * Fixed girl master (CSS face/hair) + optional ThemePack stickers.
 * Anchor slots are shared across farm / room / wardrobe sizes — only scale the figure.
 */
export function GirlFigure({
  look,
  accessory = 'none',
  size = 'farm',
  pose = 'idle',
}: GirlFigureProps) {
  const {theme} = useThemeRuntime();
  const dressArt = dressArtUrl(theme, look.dress);
  const hatArt = look.hat === 'bare' ? undefined : hatArtUrl(theme, look.hat);
  const bootsArt = bootsArtUrl(theme, look.boots);

  const dressLabel = DRESSES[look.dress]?.name ?? '衣服';
  const hatLabel = look.hat === 'bare' ? '' : HATS[look.hat]?.name ?? '';
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
      className={[
        'girl-figure',
        'master-v1',
        `size-${size}`,
        `dress-${look.dress}`,
        `hat-${look.hat}`,
        `boots-${look.boots}`,
        `accessory-${accessory}`,
        `pose-${pose}`,
        dressArt ? 'has-dress-art' : '',
        hatArt ? 'has-hat-art' : '',
        bootsArt ? 'has-boots-art' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={aria}
    >
      {hatArt ? (
        <img className="gf-hat-art" src={hatArt} alt="" draggable={false} aria-hidden />
      ) : (
        <div className="gf-hat" aria-hidden />
      )}
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
      <div className="gf-hair" aria-hidden />
      <div className="gf-head" aria-hidden>
        <span className="gf-blush left" />
        <span className="gf-blush right" />
        <span className="gf-eye left" />
        <span className="gf-eye right" />
        <span className="gf-smile" />
      </div>
      {dressArt ? (
        <img className="gf-dress-art" src={dressArt} alt="" draggable={false} aria-hidden />
      ) : (
        <>
          <div className="gf-body" aria-hidden />
          <div className="gf-apron" aria-hidden />
        </>
      )}
      {bootsArt ? (
        <img className="gf-boots-art" src={bootsArt} alt="" draggable={false} aria-hidden />
      ) : (
        <div className="gf-boots" aria-hidden />
      )}
    </div>
  );
}

export function BlackCat({
  size = 'farm',
  onAssist,
  pose = 'idle',
}: {
  size?: 'farm' | 'room' | 'wardrobe';
  onAssist?: () => void;
  pose?: 'idle' | 'follow' | 'look-up';
}) {
  const body = (
    <>
      <div className="cat-body" />
      <div className="cat-head" />
      <div className="cat-crescent" />
    </>
  );
  const cls = ['black-cat', `size-${size}`, `pose-${pose}`, onAssist ? 'is-helper' : '']
    .filter(Boolean)
    .join(' ');
  if (!onAssist) {
    return (
      <div className={cls} aria-hidden>
        {body}
      </div>
    );
  }
  return (
    <button
      type="button"
      className={cls}
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
