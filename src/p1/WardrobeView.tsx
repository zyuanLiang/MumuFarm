import type {AccessoryId} from './dayFeel';
import {BlackCat, GirlFigure} from './GirlFigure';
import {OUTFITS, type OutfitId} from './outfits';
import {
  BOOTS,
  DRESSES,
  HATS,
  describeLookBlurb,
  lookLabel,
  looksEqual,
  type BootsId,
  type DressId,
  type HatId,
  type Look,
} from './pieces';
import {playSfx} from './sfx';

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

export function WardrobeView({
  equipped,
  preview,
  accessory,
  previewAccessory,
  unlockedPresets,
  unlockedHats,
  unlockedDresses,
  unlockedBoots,
  unlockedAccessories,
  onApplyPreset,
  onPreviewHat,
  onPreviewDress,
  onPreviewBoots,
  onPreviewAccessory,
  onEquip,
  onBack,
}: WardrobeViewProps) {
  const same = looksEqual(preview, equipped) && previewAccessory === accessory;
  const hasEars = unlockedAccessories.includes('cat_ears');
  const hasScarf = unlockedAccessories.includes('scarf');
  const hasCrown = unlockedAccessories.includes('flower_crown');
  const hasPin = unlockedAccessories.includes('mushroom_pin');
  const hasAnyAccessory = hasEars || hasScarf || hasCrown || hasPin;

  return (
    <div className="p2-wardrobe">
      <header className="p1-topbar">
        <button type="button" className="p1-chip" onClick={onBack} aria-label="返回小屋">
          ←
        </button>
        <div className="p1-chip">试衣间</div>
      </header>

      <div className="wardrobe-stage">
        <GirlFigure look={preview} accessory={previewAccessory} size="wardrobe" />
        <BlackCat size="wardrobe" />
      </div>

      <p className="p1-feedback">
        {lookLabel(preview)}
        {previewAccessory === 'cat_ears' ? ' + 猫耳' : ''}
        {previewAccessory === 'scarf' ? ' + 围巾' : ''}
        {previewAccessory === 'flower_crown' ? ' + 花冠' : ''}
        {previewAccessory === 'mushroom_pin' ? ' + 蘑菇胸针' : ''}
        {' · '}
        {describeLookBlurb(preview)}
        {same ? '（穿着中）' : ''}
      </p>

      <p className="wardrobe-slot-label">套装（一键穿上，再混搭）</p>
      <div className="outfit-row" role="listbox" aria-label="套装">
        {unlockedPresets.map((id) => (
          <button
            key={id}
            type="button"
            role="option"
            aria-selected={preview.dress === id}
            className={`outfit-card ${preview.dress === id ? 'is-on' : ''} ${equipped.dress === id ? 'is-equipped' : ''}`}
            onClick={() => {
              playSfx('tap');
              onApplyPreset(id);
            }}
          >
            <span className={`outfit-thumb thumb-${id}`} />
            <span>{OUTFITS[id].name}</span>
          </button>
        ))}
      </div>

      <p className="wardrobe-slot-label">帽子</p>
      <div className="outfit-row" role="listbox" aria-label="帽子">
        {unlockedHats.map((id) => (
          <button
            key={id}
            type="button"
            role="option"
            aria-selected={preview.hat === id}
            className={`outfit-card ${preview.hat === id ? 'is-on' : ''}`}
            onClick={() => {
              playSfx('tap');
              onPreviewHat(id);
            }}
          >
            <span className={`outfit-thumb thumb-hat-${id}`} />
            <span>{HATS[id].name}</span>
          </button>
        ))}
      </div>

      <p className="wardrobe-slot-label">衣服</p>
      <div className="outfit-row" role="listbox" aria-label="衣服">
        {unlockedDresses.map((id) => (
          <button
            key={id}
            type="button"
            role="option"
            aria-selected={preview.dress === id}
            className={`outfit-card ${preview.dress === id ? 'is-on' : ''}`}
            onClick={() => {
              playSfx('tap');
              onPreviewDress(id);
            }}
          >
            <span className={`outfit-thumb thumb-${id}`} />
            <span>{DRESSES[id].name}</span>
          </button>
        ))}
      </div>

      <p className="wardrobe-slot-label">鞋子</p>
      <div className="outfit-row" role="listbox" aria-label="鞋子">
        {unlockedBoots.map((id) => (
          <button
            key={id}
            type="button"
            role="option"
            aria-selected={preview.boots === id}
            className={`outfit-card ${preview.boots === id ? 'is-on' : ''}`}
            onClick={() => {
              playSfx('tap');
              onPreviewBoots(id);
            }}
          >
            <span className={`outfit-thumb thumb-boots-${id}`} />
            <span>{BOOTS[id].name}</span>
          </button>
        ))}
      </div>

      {hasAnyAccessory && (
        <>
          <p className="wardrobe-slot-label">饰品</p>
          <div className="outfit-row" role="listbox" aria-label="饰品">
            <button
              type="button"
              className={`outfit-card ${previewAccessory === 'none' ? 'is-on' : ''}`}
              onClick={() => onPreviewAccessory('none')}
            >
              <span className="outfit-thumb thumb-none" />
              <span>无饰品</span>
            </button>
            {hasEars && (
              <button
                type="button"
                className={`outfit-card ${previewAccessory === 'cat_ears' ? 'is-on' : ''}`}
                onClick={() => onPreviewAccessory('cat_ears')}
              >
                <span className="outfit-thumb thumb-ears" />
                <span>猫耳</span>
              </button>
            )}
            {hasScarf && (
              <button
                type="button"
                className={`outfit-card ${previewAccessory === 'scarf' ? 'is-on' : ''}`}
                onClick={() => onPreviewAccessory('scarf')}
              >
                <span className="outfit-thumb thumb-scarf" />
                <span>围巾</span>
              </button>
            )}
            {hasCrown && (
              <button
                type="button"
                className={`outfit-card ${previewAccessory === 'flower_crown' ? 'is-on' : ''}`}
                onClick={() => onPreviewAccessory('flower_crown')}
              >
                <span className="outfit-thumb thumb-crown" />
                <span>花冠</span>
              </button>
            )}
            {hasPin && (
              <button
                type="button"
                className={`outfit-card ${previewAccessory === 'mushroom_pin' ? 'is-on' : ''}`}
                onClick={() => onPreviewAccessory('mushroom_pin')}
              >
                <span className="outfit-thumb thumb-pin" />
                <span>蘑菇胸针</span>
              </button>
            )}
          </div>
        </>
      )}

      <footer className="p1-dock">
        <button type="button" className="p1-primary" onClick={onEquip} disabled={same}>
          {same ? '已穿上' : '穿上并回农场'}
        </button>
      </footer>
    </div>
  );
}
