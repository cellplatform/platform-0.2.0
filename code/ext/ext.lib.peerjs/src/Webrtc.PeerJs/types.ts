import type { t } from './common';

type Id = string;
type Options = Partial<Partial<PeerJsCreateArgs>>;

export type PeerJsCreateArgs = {
  host: string;
  path: string;
  key: string;
};

/**
 * Wrapper for working with peers
 */
export type WebrtcPeerJs = {
  readonly Is: t.WebrtcIs;
  readonly Uri: t.WebrtcPeerUri;
  options(input?: Options): t.PeerJsOptions;
  create(): t.PeerJs;
  create(options?: Options): t.PeerJs;
  create(peerid: Id, options?: Options): t.PeerJs;
};
