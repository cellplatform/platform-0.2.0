import { type t } from '../common.t';

export type SwitchThemeName = 'LIGHT' | 'DARK';

export type SwitchTheme = {
  trackColor: { on: number | string; off: number | string; disabled: number | string };
  thumbColor: { on: number | string; off: number | string; disabled: number | string };
  shadowColor: number | string;
  disabledOpacity: number;
};

export type SwitchTrack = {
  widthOffset: number;
  heightOffset: number;
  color: { on: number | string; off: number | string; disabled: number | string };
  borderRadius: number;
  borderWidth: { on?: number; off?: number };
};

export type SwitchThumb = {
  width: number;
  height: number;
  xOffset: number;
  yOffset: number;
  borderRadius: number;
  color: { on: number | string; off: number | string; disabled: number | string };
  shadow: t.CssShadow;
};
