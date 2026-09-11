import {progressOf, stageFromProgress} from './crops';
import type {PlotState} from './types';

export interface YardSummary {
  readyIds: number[];
  thirstyIds: number[];
  emptyIds: number[];
  growingIds: number[];
  focusPlotId: number | null;
  message: string | null;
}

/** Glanceable "what to do now" for returning players — no modal, no tasks board. */
export function summarizeYard(plots: PlotState[], now = Date.now()): YardSummary {
  const readyIds: number[] = [];
  const thirstyIds: number[] = [];
  const emptyIds: number[] = [];
  const growingIds: number[] = [];

  for (const plot of plots) {
    const progress = progressOf(plot);
    const stage = stageFromProgress(progress, Boolean(plot.cropId));
    if (stage === 'empty') {
      emptyIds.push(plot.id);
      continue;
    }
    if (stage === 'mature') {
      readyIds.push(plot.id);
      continue;
    }
    // Dry growing crops need water (same rule as primaryKind).
    if (!plot.watered) {
      thirstyIds.push(plot.id);
    } else {
      growingIds.push(plot.id);
    }
  }

  const focusPlotId =
    readyIds[0] ?? thirstyIds[0] ?? emptyIds[0] ?? growingIds[0] ?? null;

  let message: string | null = null;
  if (readyIds.length > 0 && thirstyIds.length > 0) {
    message = `有 ${readyIds.length} 块熟了，还有 ${thirstyIds.length} 块该浇水`;
  } else if (readyIds.length > 0) {
    message =
      readyIds.length === 1
        ? '有一块菜熟了，点一下就能收'
        : `有 ${readyIds.length} 块菜熟了，可以滑过去收`;
  } else if (thirstyIds.length > 0) {
    message =
      thirstyIds.length === 1
        ? '有一块地干了，浇一壶吧'
        : `有 ${thirstyIds.length} 块地干了，滑过去浇水`;
  } else if (emptyIds.length === plots.length) {
    message = '菜地空着，选颗种子点下去吧';
  } else if (growingIds.length > 0) {
    message = '菜还在长，换身衣服或拍张照也好';
  }

  void now;
  return {readyIds, thirstyIds, emptyIds, growingIds, focusPlotId, message};
}
