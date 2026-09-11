import type {CSSProperties} from 'react';
import {themeToCssVars, type ThemePack} from './index';

/** Apply theme pack tokens as inline CSS variables on a shell element. */
export function themeStyle(theme: ThemePack): CSSProperties {
  return themeToCssVars(theme.tokens) as CSSProperties;
}
