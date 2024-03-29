import type { t } from './common';

/**
 * <Component>
 */
export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.InfoField[];
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  style?: t.CssValue;
};

/**
 * Data
 */
export type InfoField = 'Module' | 'Module.Verify' | 'Component';
export type InfoData = {
  component?: { label?: string; name?: string };
};
