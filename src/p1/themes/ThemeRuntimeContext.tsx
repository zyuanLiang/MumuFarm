import {createContext, useContext} from 'react';
import {
  DEFAULT_CROP_SKIN_ID,
  DEFAULT_THEME_ID,
  getSkin,
  getTheme,
  type SkinPack,
  type ThemePack,
} from './index';

export interface ThemeRuntime {
  theme: ThemePack;
  cropSkin: SkinPack;
}

export const ThemeRuntimeContext = createContext<ThemeRuntime>({
  theme: getTheme(DEFAULT_THEME_ID),
  cropSkin: getSkin(DEFAULT_CROP_SKIN_ID),
});

export function useThemeRuntime(): ThemeRuntime {
  return useContext(ThemeRuntimeContext);
}
