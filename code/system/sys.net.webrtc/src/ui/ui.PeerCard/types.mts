import type { t } from '../../common.t';

export type PeerCardRemoteChangedHandler = (e: PeerCardRemoteChangedHandlerArgs) => void;
export type PeerCardRemoteChangedHandlerArgs = { local: t.PeerId; remote: t.PeerId };

export type PeerCardLocalCopiedHandler = (e: PeerCardLocalCopiedHandlerArgs) => void;
export type PeerCardLocalCopiedHandlerArgs = { local: t.PeerId };

export type PeerCardConnectRequestHandler = (e: PeerCardConnectRequestHandlerArgs) => void;
export type PeerCardConnectRequestHandlerArgs = { local: t.PeerId; remote: t.PeerId };
