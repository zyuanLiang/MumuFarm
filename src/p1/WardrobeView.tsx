import {useMemo} from 'react';
import type {AccessoryId} from './dayFeel';
import {BlackCat, GirlFigure} from './GirlFigure';
import {OUTFITS, type OutfitId} from './outfits';
import {
  lookLabel,
  looksEqual,
  type BootsId,
  type DressId,
  type HatId,
  type Look,
} from './pieces';
import {playSfx} from './sfx';
import {CozyIcon} from './cozy/CozyIcon';
import {dressIconId, hatIconId} from './cozy/mappings';
import {outfitsWithFullBody} from './character/fullBody';
import {useThemeRuntime} from './themes/ThemeRuntimeContext';

interface WardrobeViewProps {
  equipped: Look;
  preview: Look;
  accessory: AccessoryId;
  previewAccessory: AccessoryId;
  unlockedPresets: OutfitId[];
  unlockedHats: HatId[];
  unlockedDresses: DressId[];
  unlockedBoots: BootsId[];
  unlockedAccessories: AccessoryId[];
  onApplyPreset: (id: OutfitId) => void;
  onPreviewHat: (id: HatId) => void;
  onPreviewDress: (id: DressId) => void;
  onPreviewBoots: (id: BootsId) => void;
  onPreviewAccessory: (id: AccessoryId) => void;
  onEquip: () => void;
  onBack: () => void;
}

/**
 * Wardrobe UI for the full-body character model:
 * picking a 套装 swaps the full-body PNG. No CSS sticker collage.
 */
export function WardrobeView({
  equipped,
  preview,
  accessory,
  previewAccessory,
  unlockedPresets,
  onApplyPreset,
  onEquip,
  onBack,
}: WardrobeViewProps) {
  const {theme} = useThemeRuntime();
  const same = looksEqual(preview, equipped) && previewAccessory === accessory;
  const bodyOutfits = useMemo(() => {
    const withArt = new Set(outfitsWithFullBody(theme));
    return unlockedPresets.filter((id) => withArt.has(id));
  }, [theme, unlockedPresets]);

  return (
    <div className="p2-wardrobe cozy-kit fullbody-model">
      <header className="p1-topbar">
        <button
          type="button"
          className="p1-chip wardrobe-back cozy-back"
          onClick={() => {
            playSfx('tap');
            onBack();
          }}
          aria-label="回小院"
        >
          <CozyIcon id="back" className="cozy-chip-icon" alt="" />
          回小院
        </button>
        <div className="p1-chip wardrobe-title">
          <CozyIcon id="wardrobe" className="cozy-chip-icon" alt="" />
          换装
        </div>
      </header>

      <div className="wardrobe-stage">
        <GirlFigure look={preview} accessory={previewAccessory} size="wardrobe" />
        <BlackCat size="wardrobe" />
      </div>

      <div className="wardrobe-scroll">
        <p className="p1-feedback cozy-look-line">
          {lookLabel(preview)}
          {same ? ' · 穿着中' : ''}
        </p>

        <p className="wardrobe-slot-label">套装</p>
        <div className="outfit-row outfit-row-fullbody" role="listbox" aria-label="套装">
          {bodyOutfits.map((id) => {
            const lookDress = id;
            const selected = preview.dress === lookDress;
            const wearing = equipped.dress === lookDress;
            const thumb =
              id === 'raincoat'
                ? dressIconId('raincoat')
                : id === 'witch'
                  ? hatIconId('witch_hat') ?? dressIconId('witch')
                  : id === 'denim'
                    ? dressIconId('denim')
                    : dressIconId(id);
            return (
              <button
                key={id}
                type="button"
                role="option"
                aria-selected={selected}
                className={`outfit-card ${selected ? 'is-on' : ''} ${wearing ? 'is-equipped' : ''}`}
                onClick={() => {
                  playSfx('tap');
                  onApplyPreset(id);
                }}
              >
                {thumb ? (
                  <CozyIcon id={thumb} className="outfit-thumb cozy-thumb" alt="" />
                ) : (
                  <span className={`outfit-thumb thumb-${id}`} />
                )}
                <span>{OUTFITS[id].name}</span>
                {wearing ? <em className="outfit-wearing">穿着</em> : null}
              </button>
            );
          })}
        </div>
      </div>

      <footer className="p1-dock cozy-dock wardrobe-dock">
        <button
          type="button"
          className={`p1-primary cozy-primary${same ? ' is-equipped' : ''}`}
          onClick={onEquip}
          disabled={same}
          aria-label={same ? '已穿上' : '穿上并回农场'}
        >
          <CozyIcon id="btn_hanger" className="cozy-primary-art" alt="" />
        </button>
      </footer>
    </div>
  );
}
