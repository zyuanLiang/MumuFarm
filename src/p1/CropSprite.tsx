import type {CropId, GrowthStage} from './types';

interface CropSpriteProps {
  cropId: CropId;
  stage: GrowthStage;
}

/** Flat paper-cut crop shapes — readable stages, no emoji/neon. */
export function CropSprite({cropId, stage}: CropSpriteProps) {
  if (stage === 'empty') return null;

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
