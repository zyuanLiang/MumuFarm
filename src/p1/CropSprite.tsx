import type {CropId, GrowthStage} from './types';
import {CozyIcon} from './cozy/CozyIcon';
import {matureCropIconId, plotIconId} from './cozy/mappings';

interface CropSpriteProps {
  cropId: CropId;
  stage: GrowthStage;
}

/** Prefer cozy-kit illustrated plots/crops over CSS paper-cuts. */
export function CropSprite({cropId, stage}: CropSpriteProps) {
  if (stage === 'empty') return null;
  const id =
    stage === 'mature' ? matureCropIconId(cropId) : plotIconId(stage, false, cropId);
  return (
    <div className={`crop-sprite crop-${cropId} stage-${stage} has-cozy`} aria-hidden>
      <CozyIcon id={id} className="crop-cozy-art" alt="" />
    </div>
  );
}
