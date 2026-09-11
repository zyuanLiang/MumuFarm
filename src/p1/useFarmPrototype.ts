import {useCallback, useEffect, useReducer} from 'react';
import {
  CROPS,
  advancePlot,
  applyPlotAction,
  createEmptyPlots,
  helpWaterPlots,
  primaryKind,
  primaryLabel,
  progressOf,
  stageFromProgress,
  type PrimaryKind,
} from './crops';
import {loadSave} from './save';
import type {CropId, FarmAction, FarmPrototypeState} from './types';

function buildInitial(): FarmPrototypeState {
  const saved = typeof localStorage !== 'undefined' ? loadSave() : null;
  const now = Date.now();
  return {
    gold: saved?.gold ?? 20,
    selectedPlotId: 0,
    selectedSeed: saved?.selectedSeed ?? 'wheat',
    plots: saved?.plots?.length === 6 ? saved.plots : createEmptyPlots(6),
    lastAction: saved
      ? '欢迎回来，衣服还在身上哦'
      : '选好种子，点空地就能种；手指滑过可浇水/收获',
    harvestBurstId: 0,
    lastTickAt: now,
    harvestCount: saved?.harvestCount ?? 0,
    lastHarvestCrop: null,
  };
}

function applyToState(
  state: FarmPrototypeState,
  plotId: number,
  now: number,
  mode: PrimaryKind | 'auto',
): FarmPrototypeState {
  const plots = state.plots.map((plot) => advancePlot(plot, now, 0));
  const plot = plots[plotId];
  if (!plot) return state;
  const result = applyPlotAction(plot, state.selectedSeed, now, mode);
  if (!result.changed) {
    // Still select the plot so the dock button stays useful.
    const kind = primaryKind(plot);
    const hint =
      kind === 'plant'
        ? `种子粘在手上：点空地播${CROPS[state.selectedSeed].name}`
        : kind === 'water'
          ? '土有点干，点一下或滑过去浇水'
          : kind === 'harvest'
            ? '成熟了，点一下或滑过去收获'
            : '还在长，看看别的地';
    return {...state, plots, selectedPlotId: plotId, lastAction: hint};
  }

  const nextPlots = plots.map((p) => (p.id === plotId ? result.plot : p));
  return {
    ...state,
    selectedPlotId: plotId,
    plots: nextPlots,
    gold: state.gold + result.goldGained,
    harvestCount: result.harvestCrop ? state.harvestCount + 1 : state.harvestCount,
    lastHarvestCrop: result.harvestCrop ?? state.lastHarvestCrop,
    harvestBurstId: result.harvestCrop ? state.harvestBurstId + 1 : state.harvestBurstId,
    lastAction: result.message,
  };
}

function reducer(state: FarmPrototypeState, action: FarmAction): FarmPrototypeState {
  const now = action.type === 'tick' ? action.now : Date.now();

  switch (action.type) {
    case 'select_plot': {
      // Sticky seed: tapping an actionable plot applies immediately.
      return applyToState(state, action.plotId, now, 'auto');
    }
    case 'select_seed':
      return {
        ...state,
        selectedSeed: action.seed,
        lastAction: `${CROPS[action.seed].name}粘在手上了，点空地就能种`,
      };
    case 'tick': {
      const dt = Math.min(500, Math.max(0, now - state.lastTickAt));
      return {
        ...state,
        lastTickAt: now,
        plots: state.plots.map((plot) => advancePlot(plot, now, dt)),
      };
    }
    case 'add_gold':
      return {
        ...state,
        gold: state.gold + action.amount,
        lastAction: action.message ?? `+${action.amount} 金`,
      };
    case 'set_feedback':
      return {...state, lastAction: action.message};
    case 'clear_last_harvest':
      return {...state, lastHarvestCrop: null};
    case 'primary':
      return applyToState(state, state.selectedPlotId, now, 'auto');
    case 'apply_plot':
      return applyToState(state, action.plotId, now, action.mode ?? 'auto');
    case 'help_water': {
      const plots = state.plots.map((plot) => advancePlot(plot, now, 0));
      const helped = helpWaterPlots(plots, now, action.limit ?? 1);
      if (helped.wateredIds.length === 0) {
        return {...state, plots, lastAction: action.message};
      }
      return {
        ...state,
        plots: helped.plots,
        lastAction: action.message,
      };
    }
    default:
      return state;
  }
}

export function useFarmPrototype() {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitial);

  useEffect(() => {
    const id = window.setInterval(() => {
      dispatch({type: 'tick', now: Date.now()});
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  const selectedPlot = state.plots[state.selectedPlotId] ?? state.plots[0];
  const kind = primaryKind(selectedPlot);
  const seedName = CROPS[state.selectedSeed].name;

  const plots = state.plots.map((plot) => ({
    ...plot,
    progress: progressOf(plot),
    stage: stageFromProgress(progressOf(plot), Boolean(plot.cropId)),
  }));

  const onSelectPlot = useCallback((plotId: number) => {
    dispatch({type: 'select_plot', plotId});
  }, []);
  const onSelectSeed = useCallback((seed: CropId) => {
    dispatch({type: 'select_seed', seed});
  }, []);
  const onPrimary = useCallback(() => {
    dispatch({type: 'primary'});
  }, []);
  const onApplyPlot = useCallback((plotId: number, mode: Exclude<PrimaryKind, 'noop'> | 'auto' = 'auto') => {
    dispatch({type: 'apply_plot', plotId, mode});
  }, []);
  const onHelpWater = useCallback((message: string, limit = 1) => {
    dispatch({type: 'help_water', limit, message});
  }, []);
  const addGold = useCallback((amount: number, message: string) => {
    dispatch({type: 'add_gold', amount, message});
  }, []);
  const setFeedback = useCallback((message: string) => {
    dispatch({type: 'set_feedback', message});
  }, []);
  const clearLastHarvest = useCallback(() => {
    dispatch({type: 'clear_last_harvest'});
  }, []);

  return {
    gold: state.gold,
    selectedPlotId: state.selectedPlotId,
    selectedSeed: state.selectedSeed,
    lastAction: state.lastAction,
    harvestBurstId: state.harvestBurstId,
    harvestCount: state.harvestCount,
    lastHarvestCrop: state.lastHarvestCrop,
    rawPlots: state.plots,
    plots,
    primaryKind: kind,
    primaryLabel: primaryLabel(kind, seedName),
    onSelectPlot,
    onSelectSeed,
    onPrimary,
    onApplyPlot,
    onHelpWater,
    addGold,
    setFeedback,
    clearLastHarvest,
  };
}
