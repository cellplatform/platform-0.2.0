import type { t } from './common';

export type InfoField = 'Module' | 'Module.Verify';
export type InfoData = {
  url?: { href: string; title?: string };
};

/**
 * <Component>>
 */
export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: (t.InfoField | undefined)[];
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  style?: t.CssValue;
};
