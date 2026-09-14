import type {CropId, GrowthStage} from './types';
import {cropArtUrl} from './themes';
import {useThemeRuntime} from './themes/ThemeRuntimeContext';

interface CropSpriteProps {
  cropId: CropId;
  stage: GrowthStage;
}

/** Flat paper-cut crop shapes — uses SkinPack art when URL present. */
export function CropSprite({cropId, stage}: CropSpriteProps) {
  const {cropSkin} = useThemeRuntime();
  if (stage === 'empty') return null;

  const art = cropArtUrl(cropSkin, cropId, stage);
  if (art) {
    return (
      <div className={`crop-sprite crop-${cropId} stage-${stage} has-art`} aria-hidden>
        <img className="crop-art" src={art} alt="" draggable={false} />
      </div>
    );
  }

  return (
    <div className={`crop-sprite crop-${cropId} stage-${stage}`} aria-hidden>
      {stage === 'seed' && (
        <span className="crop-seed">
          <i className="seed-core" />
        </span>
      )}
      {stage === 'sprout' && (
        <span className="crop-sprout">
          <i className="leaf left" />
          <i className="stem" />
          <i className="leaf right" />
        </span>
      )}
      {stage === 'growing' && (
        <span className="crop-growing">
          <i className="leaf left" />
          <i className="stem" />
          <i className="leaf right" />
          <i className="bud" />
        </span>
      )}
      {stage === 'mature' && (
        <span className="crop-mature">
          {cropId === 'wheat' && (
            <>
              <i className="ear a" />
              <i className="ear b" />
              <i className="ear c" />
            </>
          )}
          {cropId === 'carrot' && (
            <>
              <i className="tops" />
              <i className="root" />
            </>
          )}
          {cropId === 'sunflower' && (
            <>
              <i className="petals" />
              <i className="center" />
              <i className="stalk" />
            </>
          )}
          {cropId === 'star_pumpkin' && (
            <>
              <i className="body" />
              <i className="star" />
              <i className="stem-top" />
            </>
          )}
        </span>
      )}
    </div>
  );
}
