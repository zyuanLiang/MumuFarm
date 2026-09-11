import type {CropId, GrowthStage} from './types';

interface CropSpriteProps {
  cropId: CropId;
  stage: GrowthStage;
}

/** Flat paper-cut crop shapes — no emoji, no neon. */
export function CropSprite({cropId, stage}: CropSpriteProps) {
  if (stage === 'empty') return null;

  return (
    <div className={`crop-sprite crop-${cropId} stage-${stage}`} aria-hidden>
      {stage === 'seed' && <span className="crop-seed" />}
      {stage === 'sprout' && <span className="crop-sprout" />}
      {stage === 'growing' && <span className="crop-growing" />}
      {stage === 'mature' && <span className="crop-mature" />}
    </div>
  );
}
