import type { t } from './common';

type P = t.PropListProps;

/**
 * <Component>
 */
export type InfoProps = {
  title?: P['title'];
  width?: P['width'];
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
export type InfoCtx = { fields: t.InfoField[]; theme: t.CommonTheme; enabled: boolean };
export type InfoData = {
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
};
