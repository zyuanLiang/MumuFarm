export interface GoldDebugClickState {
  lastClickAt: number | null;
  shouldTrigger: boolean;
}

export const resolveGoldDebugClick = (
  lastClickAt: number | null,
  now: number,
  thresholdMs = 350,
): GoldDebugClickState => {
  if (lastClickAt !== null && now - lastClickAt <= thresholdMs) {
    return {
      lastClickAt: null,
      shouldTrigger: true,
    };
  }

  return {
    lastClickAt: now,
    shouldTrigger: false,
  };
};
