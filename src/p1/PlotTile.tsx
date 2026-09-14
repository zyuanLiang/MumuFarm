import {CozyIcon} from './cozy/CozyIcon';
import {plotIconId} from './cozy/mappings';
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
      ? '空地，可播种'
      : cropId
        ? `${CROPS[cropId].name} ${Math.round(progress * 100)}%`
        : '地块';

  const iconId = plotIconId(stage, watered, cropId);
  const status =
    stage === 'empty' ? '空地' : stage === 'mature' ? '可收获' : `${Math.round(progress * 100)}%`;

  return (
    <button
      type="button"
      data-plot-id={id}
      className={[
        'plot-tile',
        'cozy-plot',
        watered ? 'is-watered' : 'is-dry',
        selected ? 'is-selected' : '',
        stage === 'empty' ? 'is-empty' : '',
        stage === 'mature' ? 'is-mature' : '',
        fx ? `fx-${fx}` : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={label}
      aria-pressed={selected}
      onClick={() => onSelect(id)}
    >
      <div className="plot-soil cozy-plot-art">
        <CozyIcon id={iconId} className="cozy-plot-icon" alt="" />
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
      <span className={`cozy-plot-tag${stage === 'mature' ? ' is-ready' : ''}`}>{status}</span>
    </button>
  );
}
