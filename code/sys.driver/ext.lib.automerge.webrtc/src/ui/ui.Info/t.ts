import type { t } from './common';
export type * from './t.Stateful';

import type { InfoPropsHandlers as InfoHandlersBase } from 'ext.lib.automerge/src/types';

type P = t.PropListProps;

export type InfoField =
  | 'Visible'
  | 'Module'
  | 'Module.Verify'
  | 'Component'
  | 'Peer'
  | 'Peer.Remotes'
  | 'Repo'
  | 'Network.Shared'
  | 'Network.Transfer';

export type InfoCtx = {
  enabled: boolean;
  fields: t.InfoField[];
  theme: t.CommonTheme;
  handlers: t.InfoPropsHandlers;
  internal?: t.InfoPropsStateful;
};

/**
 * <Component>
 */
export type InfoProps = t.InfoPropsHandlers & {
  title?: P['title'];
  width?: P['width'];
  fields?: (t.InfoField | undefined)[];
  data?: t.InfoData;
  network?: t.NetworkStore;
  margin?: t.CssEdgesInput;
  enabled?: boolean;
  theme?: t.CommonTheme;
  internal?: InfoPropsStateful;
  style?: t.CssValue;
};

export type InfoPropsStateful = {
  shared?: t.CrdtInfoStatefulController;
};

export type InfoPropsHandlers = InfoHandlersBase;

/**
 * Data
 */
export type InfoData = {
  visible?: t.InfoVisible<t.InfoField>;
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  shared?: t.InfoDoc | t.InfoDoc[];
};
