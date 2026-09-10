import {BlackCat, GirlFigure} from './GirlFigure';
import {OUTFIT_ORDER, OUTFITS, type OutfitId} from './outfits';

interface WardrobeViewProps {
  equipped: OutfitId;
  preview: OutfitId;
  onPreview: (id: OutfitId) => void;
  onEquip: () => void;
  onBack: () => void;
}

export function WardrobeView({
  equipped,
  preview,
  onPreview,
  onEquip,
  onBack,
}: WardrobeViewProps) {
  const def = OUTFITS[preview];
  const same = preview === equipped;

  return (
    <div className="p2-wardrobe">
      <header className="p1-topbar">
        <button type="button" className="p1-chip" onClick={onBack} aria-label="返回小屋">
          ←
        </button>
        <div className="p1-chip">试衣间</div>
      </header>

      <div className="wardrobe-stage">
        <GirlFigure outfit={preview} size="wardrobe" />
        <BlackCat size="wardrobe" />
      </div>

      <p className="p1-feedback">
        {def.name} · {def.blurb}
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

      <footer className="p1-dock">
        <button type="button" className="p1-primary" onClick={onEquip} disabled={same}>
          {same ? '已穿上' : '穿上并回农场'}
        </button>
      </footer>
    </div>
  );
}
