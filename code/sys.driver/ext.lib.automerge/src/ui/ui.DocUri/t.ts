import type { t } from './common';

type D = t.InfoDataDocUri;

/**
 * <Component>
 */
export type DocUriProps = {
  uri?: string;
  shorten?: D['shorten'];
  prefix?: D['prefix'];
  head?: D['head'];
  heads?: t.HashString[] | t.Doc<any>;
  clipboard?: D['clipboard'];
  fontSize?: number;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
