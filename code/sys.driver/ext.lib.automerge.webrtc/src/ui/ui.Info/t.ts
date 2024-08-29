import type { t } from './common';
export type * from './t.Stateful';

import type { InfoHandlers as InfoHandlersBase } from 'ext.lib.automerge/src/types';

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
  handlers: t.InfoHandlers;
};

/**
 * <Component>
 */
export type InfoProps = t.InfoHandlers & {
  title?: P['title'];
  width?: P['width'];
  fields?: (t.InfoField | undefined)[];
  data?: t.InfoData;
  network?: t.NetworkStore;
  margin?: t.CssEdgesInput;
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export type InfoHandlers = InfoHandlersBase;

/**
 * Data
 */
export type InfoData = {
  visible?: t.InfoVisible;
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  shared?: InfoShared | InfoShared[];
};

export type InfoShared = t.InfoDoc;
export type InfoObject = {
  visible?: boolean;
  expand?: { level?: number; paths?: string[] };
  dotMeta?: boolean; // Default true. Deletes a [.meta] field if present.
};
