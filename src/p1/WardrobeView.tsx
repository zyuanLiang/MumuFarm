import type {AccessoryId} from './dayFeel';
import {BlackCat, GirlFigure} from './GirlFigure';
import {OUTFIT_ORDER, OUTFITS, type OutfitId} from './outfits';

interface WardrobeViewProps {
  equipped: OutfitId;
  preview: OutfitId;
  accessory: AccessoryId;
  previewAccessory: AccessoryId;
  unlockedAccessories: AccessoryId[];
  onPreview: (id: OutfitId) => void;
  onPreviewAccessory: (id: AccessoryId) => void;
  onEquip: () => void;
  onBack: () => void;
}

export function WardrobeView({
  equipped,
  preview,
  accessory,
  previewAccessory,
  unlockedAccessories,
  onPreview,
  onPreviewAccessory,
  onEquip,
  onBack,
}: WardrobeViewProps) {
  const def = OUTFITS[preview];
  const same = preview === equipped && previewAccessory === accessory;
  const hasEars = unlockedAccessories.includes('cat_ears');

  return (
    <div className="p2-wardrobe">
      <header className="p1-topbar">
        <button type="button" className="p1-chip" onClick={onBack} aria-label="返回小屋">
          ←
        </button>
        <div className="p1-chip">试衣间</div>
      </header>

      <div className="wardrobe-stage">
        <GirlFigure outfit={preview} accessory={previewAccessory} size="wardrobe" />
        <BlackCat size="wardrobe" />
      </div>

      <p className="p1-feedback">
        {def.name}
        {previewAccessory === 'cat_ears' ? ' + 猫耳' : ''} · {def.blurb}
        {same ? '（穿着中）' : ''}
      </p>

      <div className="outfit-row" role="listbox" aria-label="服装">
        {OUTFIT_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            role="option"
            aria-selected={preview === id}
            className={`outfit-card ${preview === id ? 'is-on' : ''} ${equipped === id ? 'is-equipped' : ''}`}
            onClick={() => onPreview(id)}
          >
            <span className={`outfit-thumb thumb-${id}`} />
            <span>{OUTFITS[id].name}</span>
          </button>
        ))}
      </div>

      {hasEars && (
        <div className="outfit-row" role="listbox" aria-label="饰品">
          <button
            type="button"
            className={`outfit-card ${previewAccessory === 'none' ? 'is-on' : ''}`}
            onClick={() => onPreviewAccessory('none')}
          >
            <span className="outfit-thumb thumb-none" />
            <span>无饰品</span>
          </button>
          <button
            type="button"
            className={`outfit-card ${previewAccessory === 'cat_ears' ? 'is-on' : ''}`}
            onClick={() => onPreviewAccessory('cat_ears')}
          >
            <span className="outfit-thumb thumb-ears" />
            <span>猫耳</span>
          </button>
        </div>
      )}

      <footer className="p1-dock">
        <button type="button" className="p1-primary" onClick={onEquip} disabled={same}>
          {same ? '已穿上' : '穿上并回农场'}
        </button>
      </footer>
    </div>
  );
}
