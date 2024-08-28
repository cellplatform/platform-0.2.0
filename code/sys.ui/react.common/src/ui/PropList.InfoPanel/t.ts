import type { t } from './common';

type O = Record<string, unknown>;

/**
 * Props: <Component>
 */
export type CommonInfoProps<F extends string = string, D extends O = {}> = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: (F | undefined | null)[];
  data?: D;
  margin?: t.CssEdgesInput;
  stateful?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

/**
 * Prop: Data
 */
export type InfoDataVisible<InfoField extends string = any> = {
  value?: boolean;
  enabled?: boolean;
  label?: string;
  filter?: (e: { visible: boolean; fields: InfoField[] }) => InfoField[];
  onToggle?: InfoDataVisibleToggle;
};

/**
 * Events
 */
export type InfoDataVisibleToggle = (e: InfoDataVisibleToggleArgs) => void;
export type InfoDataVisibleToggleArgs = { prev: boolean; next: boolean };
