import type {AccessoryId} from './dayFeel';
import {BlackCat, GirlFigure} from './GirlFigure';
import type {Look} from './pieces';
import {cottageArtUrl} from './themes';
import {useThemeRuntime} from './themes/ThemeRuntimeContext';

interface CottageViewProps {
  look: Look;
  accessory: AccessoryId;
  entering?: boolean;
  onBack: () => void;
  onOpenWardrobe: () => void;
}

/** Pocket dollhouse — CSS mushroom structure + optional ThemePack interior art. */
export function CottageView({
  look,
  accessory,
  entering = false,
  onBack,
  onOpenWardrobe,
}: CottageViewProps) {
  const {theme} = useThemeRuntime();
  const interiorArt = cottageArtUrl(theme);

  return (
    <div className={`p2-cottage mushroom-echo ${entering ? 'is-entering' : ''}`}>
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

      <div className={`cottage-room${interiorArt ? ' has-art' : ''}`}>
        {interiorArt ? (
          <img className="cottage-art" src={interiorArt} alt="" draggable={false} aria-hidden />
        ) : null}
        <div className="cottage-cap-band" aria-hidden />
        <div className="cottage-cap-spots" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="cottage-stem-wall" aria-hidden />
        <div className="cottage-window" aria-hidden>
          <div className="cw-arch" />
          <div className="cw-glow" />
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
          <GirlFigure look={look} accessory={accessory} size="room" />
          <BlackCat size="room" />
        </div>
      </div>

      <p className="p1-feedback">推开蘑菇门，屋里暖暖的——像走进菌盖里</p>

      <footer className="p1-dock">
        <button type="button" className="p1-primary" onClick={onOpenWardrobe}>
          换装
        </button>
      </footer>
    </div>
  );
}
