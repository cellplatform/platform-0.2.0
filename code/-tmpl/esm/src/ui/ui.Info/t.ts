import type { t } from './common';
export type * from './t.Stateful';

/**
 * <Component>
 */
export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: (t.InfoField | undefined | null)[];
  data?: t.InfoData;
  enabled?: boolean;
  margin?: t.CssEdgesInput;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

/**
 * Data
 */
export type InfoField = 'Module' | 'Module.Verify' | 'Component';
export type InfoFieldCtx = { fields: t.InfoField[]; theme: t.CommonTheme; enabled: boolean };
export type InfoData = {
  component?: { label?: string; name?: string };
};
