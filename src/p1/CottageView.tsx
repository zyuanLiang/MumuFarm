import type {AccessoryId} from './dayFeel';
import {BlackCat, GirlFigure} from './GirlFigure';
import type {OutfitId} from './outfits';

interface CottageViewProps {
  outfit: OutfitId;
  accessory: AccessoryId;
  entering?: boolean;
  onBack: () => void;
  onOpenWardrobe: () => void;
}

export function CottageView({
  outfit,
  accessory,
  entering = false,
  onBack,
  onOpenWardrobe,
}: CottageViewProps) {
  return (
    <div className={`p2-cottage ${entering ? 'is-entering' : ''}`}>
      <header className="p1-topbar">
        <button type="button" className="p1-chip" onClick={onBack} aria-label="回农场">
          ←
        </button>
        <div className="p1-chip">蘑菇屋</div>
      </header>

      {entering && (
        <div className="cottage-enter-veil" aria-hidden>
          <span className="cottage-enter-door" />
        </div>
      )}

      <div className="cottage-room">
        <div className="cottage-cap-spots" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="cottage-window" aria-hidden>
          <div className="cw-arch" />
          <div className="cw-view" />
        </div>
        <div className="cottage-shelf" aria-hidden>
          <span className="mini-mushroom" />
          <span className="mini-kettle" />
        </div>
        <div className="cottage-mirror" aria-hidden />
        <div className="cottage-bed" aria-hidden />
        <div className="cottage-rug" aria-hidden>
          <span className="rug-mushroom-arc" />
        </div>

        <div className="cottage-actors">
          <GirlFigure outfit={outfit} accessory={accessory} size="room" />
          <BlackCat size="room" />
        </div>
      </div>

      <p className="p1-feedback">推开蘑菇门，屋里暖暖的</p>

      <footer className="p1-dock">
        <button type="button" className="p1-primary" onClick={onOpenWardrobe}>
          换装
        </button>
      </footer>
    </div>
  );
}
