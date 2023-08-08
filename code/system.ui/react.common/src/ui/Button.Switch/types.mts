import { type t } from '../common.t';

export type SwitchThemeName = 'LIGHT' | 'DARK';

type Color = string | number;

export type SwitchTheme = {
  trackColor: { on: Color; off: Color; disabled: Color };
  thumbColor: { on: Color; off: Color; disabled: Color };
  shadowColor: Color;
  disabledOpacity: t.Percent;
};

export type SwitchTrack = {
  widthOffset: number;
  heightOffset: number;
  color: { on: Color; off: Color; disabled: Color };
  borderRadius: number;
  borderWidth: { on?: number; off?: number };
};

export type SwitchThumb = {
  width: number;
  height: number;
  xOffset: number;
  yOffset: number;
  borderRadius: number;
  color: { on: Color; off: Color; disabled: Color };
  shadow: t.CssShadow;
};
