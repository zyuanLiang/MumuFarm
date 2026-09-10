import {useCallback, useEffect, useReducer} from 'react';
import {
  CROPS,
  advancePlot,
  createEmptyPlots,
  primaryKind,
  primaryLabel,
  progressOf,
  stageFromProgress,
} from './crops';
import {loadSave} from './save';
import type {CropId, FarmAction, FarmPrototypeState, PlotState} from './types';

function buildInitial(): FarmPrototypeState {
  const saved = typeof localStorage !== 'undefined' ? loadSave() : null;
  const now = Date.now();
  return {
    gold: saved?.gold ?? 20,
    selectedPlotId: 0,
    selectedSeed: saved?.selectedSeed ?? 'wheat',
    plots: saved?.plots?.length === 6 ? saved.plots : createEmptyPlots(6),
    lastAction: saved ? '欢迎回来，衣服还在身上哦' : '点一块地，开始种吧',
    harvestBurstId: 0,
    lastTickAt: now,
  };
}

function reducer(state: FarmPrototypeState, action: FarmAction): FarmPrototypeState {
  const now = action.type === 'tick' ? action.now : Date.now();

  switch (action.type) {
    case 'select_plot': {
      const plot = state.plots[action.plotId];
      if (!plot) return state;
      const kind = primaryKind(plot);
      const hint =
        kind === 'plant'
          ? '选好地了，可以播种'
          : kind === 'water'
            ? '土有点干，浇一下吧'
            : kind === 'harvest'
              ? '成熟了，可以收获'
              : '还在长，看看别的地';
      return {...state, selectedPlotId: action.plotId, lastAction: hint};
    }
    case 'select_seed':
      return {...state, selectedSeed: action.seed, lastAction: `选中${CROPS[action.seed].name}`};
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
    case 'primary': {
      const plots = state.plots.map((plot) => advancePlot(plot, now, 0));
      const plot = plots[state.selectedPlotId];
      if (!plot) return state;
      const kind = primaryKind(plot);

      if (kind === 'plant') {
        const next: PlotState = {
          ...plot,
          cropId: state.selectedSeed,
          grownMs: 0,
          watered: true,
          wateredAt: now,
          progress: 0,
        };
        return {
          ...state,
          plots: plots.map((p) => (p.id === plot.id ? next : p)),
          lastAction: `播下${CROPS[state.selectedSeed].name}`,
        };
      }

      if (kind === 'water') {
        const wateredPlot: PlotState = {
          ...plot,
          watered: true,
          wateredAt: now,
        };
        return {
          ...state,
          plots: plots.map((p) => (p.id === plot.id ? wateredPlot : p)),
          lastAction: '浇了一壶水',
        };
      }

      if (kind === 'harvest' && plot.cropId) {
        const reward = CROPS[plot.cropId].gold;
        return {
          ...state,
          gold: state.gold + reward,
          plots: plots.map((p) =>
            p.id === plot.id
              ? {
                  id: p.id,
                  cropId: null,
                  grownMs: 0,
                  watered: false,
                  wateredAt: null,
                  progress: 0,
                }
              : p,
          ),
          lastAction: `收获 +${reward} 金`,
          harvestBurstId: state.harvestBurstId + 1,
        };
      }

      return {...state, plots, lastAction: '还在长，稍等一下'};
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

  const addGold = useCallback((amount: number, message: string) => {
    dispatch({type: 'add_gold', amount, message});
  }, []);

  const setFeedback = useCallback((message: string) => {
    dispatch({type: 'set_feedback', message});
  }, []);

  return {
    gold: state.gold,
    selectedPlotId: state.selectedPlotId,
    selectedSeed: state.selectedSeed,
    lastAction: state.lastAction,
    harvestBurstId: state.harvestBurstId,
    rawPlots: state.plots,
    plots,
    primaryKind: kind,
    primaryLabel: primaryLabel(kind, seedName),
    onSelectPlot,
    onSelectSeed,
    onPrimary,
    addGold,
    setFeedback,
  };
}
