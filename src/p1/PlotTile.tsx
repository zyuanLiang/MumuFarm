import {CropSprite} from './CropSprite';
import {CROPS} from './crops';
import type {CropId, GrowthStage} from './types';

interface PlotTileProps {
  id: number;
  selected: boolean;
  watered: boolean;
  cropId: CropId | null;
  stage: GrowthStage;
  progress: number;
  onSelect: (id: number) => void;
}

export function PlotTile({
  id,
  selected,
  watered,
  cropId,
  stage,
  progress,
  onSelect,
}: PlotTileProps) {
  const label =
    stage === 'empty'
      ? '空地'
      : cropId
        ? `${CROPS[cropId].name} ${Math.round(progress * 100)}%`
        : '地块';

  return (
    <button
      type="button"
      data-plot-id={id}
      className={[
        'plot-tile',
        watered ? 'is-watered' : 'is-dry',
        selected ? 'is-selected' : '',
        stage === 'mature' ? 'is-mature' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={label}
      aria-pressed={selected}
      onClick={() => onSelect(id)}
    >
      <div className="plot-soil">
        {cropId && stage !== 'empty' ? (
          <CropSprite cropId={cropId} stage={stage} />
        ) : (
          <span className="plot-empty-hint" />
        )}
      </div>
      {stage === 'mature' && <span className="plot-ready-dot" />}
    </button>
  );
}
