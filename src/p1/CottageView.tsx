import type {AccessoryId} from './dayFeel';
import {BlackCat, GirlFigure} from './GirlFigure';
import type {OutfitId} from './outfits';

interface CottageViewProps {
  outfit: OutfitId;
  accessory: AccessoryId;
  onBack: () => void;
  onOpenWardrobe: () => void;
}

export function CottageView({outfit, accessory, onBack, onOpenWardrobe}: CottageViewProps) {
  return (
    <div className="p2-cottage">
      <header className="p1-topbar">
        <button type="button" className="p1-chip" onClick={onBack} aria-label="回农场">
          ←
        </button>
        <div className="p1-chip">蘑菇屋</div>
      </header>

      <div className="cottage-room">
        <div className="cottage-window" aria-hidden>
          <div className="cw-arch" />
          <div className="cw-view" />
        </div>
        <div className="cottage-shelf" aria-hidden>
          <span className="mini-mushroom" />
        </div>
        <div className="cottage-bed" aria-hidden />
        <div className="cottage-rug" aria-hidden />

        <div className="cottage-actors">
          <GirlFigure outfit={outfit} accessory={accessory} size="room" />
          <BlackCat size="room" />
        </div>
      </div>

      <p className="p1-feedback">真的走进黄色蘑菇屋了</p>

      <footer className="p1-dock">
        <button type="button" className="p1-primary" onClick={onOpenWardrobe}>
          换装
        </button>
      </footer>
    </div>
  );
}
