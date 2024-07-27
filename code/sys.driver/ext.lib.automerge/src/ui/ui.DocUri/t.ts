import type { t } from './common';

type D = t.InfoDataDocUri;

export type DocUriPart = 'Prefix' | 'Id' | 'Head';

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
  copiedText?: string;
  fontSize?: number;
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler;
  onMouse?: t.OnDocUriMouseHandler;
  onCopy?: t.OnDocUriMouseHandler;
};

/**
 * Events
 */
export type OnDocUriMouseHandler = (e: OnDocUriMouseHandlerArgs) => void;
export type OnDocUriMouseHandlerArgs = {
  uri: t.UriString;
  part: t.DocUriPart;
  is: { over: boolean; down: Boolean };
};
