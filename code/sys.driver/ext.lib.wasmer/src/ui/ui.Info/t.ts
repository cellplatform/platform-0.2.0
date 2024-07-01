import type { t } from './common';

/**
 * <Component>
 */
export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: (t.InfoField | undefined)[];
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

/**
 * Data
 */
export type InfoField = 'Module' | 'Module.Verify' | 'Component';
export type InfoFieldCtx = { fields: t.InfoField[]; theme: t.CommonTheme };
export type InfoData = {
  component?: { label?: string; name?: string };
};
