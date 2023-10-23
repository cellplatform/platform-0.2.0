import type { t } from './common';

export type PeerJsCreateArgs = { host: string; path: string; key: string };
type Options = Partial<Partial<PeerJsCreateArgs>>;

/**
 * Wrapper for working with peers
 */
export type WebrtcPeerJs = {
  readonly Is: t.WebrtcIs;
  readonly Uri: t.WebrtcPeerUri;
  options(input?: Options): t.PeerJsOptions;
  create(): t.PeerJs;
  create(options?: Options): t.PeerJs;
  create(peerid: string, options?: Options): t.PeerJs;
};
