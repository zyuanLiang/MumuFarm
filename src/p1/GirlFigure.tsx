import type {AccessoryId} from './dayFeel';
import {
  BOOTS,
  DRESSES,
  HATS,
  type Look,
} from './pieces';
import {fullBodyArtForLook} from './character/fullBody';
import {catArtUrl} from './themes';
import {useThemeRuntime} from './themes/ThemeRuntimeContext';

interface GirlFigureProps {
  look: Look;
  accessory?: AccessoryId;
  size?: 'farm' | 'room' | 'wardrobe';
  pose?: 'idle' | 'showoff';
}

/**
 * Character = full-body PNG for the closest outfit.
 * Never composites CSS head + clothing stickers.
 */
export function GirlFigure({
  look,
  accessory = 'none',
  size = 'farm',
  pose = 'idle',
}: GirlFigureProps) {
  const {theme} = useThemeRuntime();
  const fullArt = fullBodyArtForLook(theme, look);

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

  if (!fullArt) {
    return (
      <div className={`girl-figure size-${size} is-missing-art`} aria-label={aria}>
        <span className="gf-missing">立绘准备中</span>
      </div>
    );
  }

  return (
    <div
      className={['girl-figure', 'master-v1', 'has-full-art', `size-${size}`, `pose-${pose}`]
        .filter(Boolean)
        .join(' ')}
      aria-label={aria}
    >
      <img className="gf-full-art" src={fullArt} alt="" draggable={false} />
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
  pose?: 'idle' | 'follow' | 'look-up' | 'cheer' | 'shelter';
}) {
  const {theme} = useThemeRuntime();
  const art = catArtUrl(theme);
  const body = art ? (
    <img className="cat-art" src={art} alt="" draggable={false} />
  ) : (
    <span className="cat-missing" aria-hidden />
  );
  const cls = [
    'black-cat',
    `size-${size}`,
    `pose-${pose}`,
    art ? 'has-cat-art' : '',
    onAssist ? 'is-helper' : '',
  ]
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
  return null;
}

export function SongBird() {
  return null;
}
