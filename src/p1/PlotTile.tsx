import {CropSprite} from './CropSprite';
import {CROPS} from './crops';
import type {CropId, GrowthStage} from './types';

export type PlotFxKind = 'plant' | 'water' | 'harvest';

interface PlotTileProps {
  id: number;
  selected: boolean;
  watered: boolean;
  cropId: CropId | null;
  stage: GrowthStage;
  progress: number;
  fx?: PlotFxKind | null;
  fxKey?: number;
  onSelect: (id: number) => void;
}

export function PlotTile({
  id,
  selected,
  watered,
  cropId,
  stage,
  progress,
  fx = null,
  fxKey = 0,
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
        fx ? `fx-${fx}` : '',
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
        {fx && (
          <span key={fxKey} className={`plot-fx plot-fx-${fx}`} aria-hidden>
            {fx === 'water' && (
              <>
                <i className="drop a" />
                <i className="drop b" />
                <i className="drop c" />
              </>
            )}
            {fx === 'plant' && <i className="seed-drop" />}
            {fx === 'harvest' && (
              <>
                <i className="spark a" />
                <i className="spark b" />
                <i className="spark c" />
              </>
            )}
          </span>
        )}
      </div>
      {stage === 'mature' && <span className="plot-ready-dot" />}
    </button>
  );
}
