import type { t } from './common';

export type InfoField = 'Module' | 'Module.Verify' | 'Component';
export type InfoData = {
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
};

/**
 * <Component>
 */
export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: (t.InfoField | undefined)[];
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  style?: t.CssValue;
};
