import type { t } from './common';

type D = t.InfoDataDocUri;

/**
 * <Component>
 */
export type DocUriProps = {
  doc?: t.UriString | t.Doc;
  shorten?: D['shorten'];
  prefix?: D['prefix'];
  head?: D['head'];
  heads?: t.HashString[] | t.Doc;
  clipboard?: D['clipboard'];
  fontSize?: number;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler;
};
