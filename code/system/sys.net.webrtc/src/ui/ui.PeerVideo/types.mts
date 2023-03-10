import type { t } from '../../common.t';

export type PeerVideoRemoteChangedHandler = (e: PeerVideoRemoteChangedHandlerArgs) => void;
export type PeerVideoRemoteChangedHandlerArgs = { local: t.PeerId; remote: t.PeerId };

export type PeerVideoLocalCopiedHandler = (e: PeerVideoLocalCopiedHandlerArgs) => void;
export type PeerVideoLocalCopiedHandlerArgs = { local: t.PeerId };

export type PeerVideoConnectRequestHandler = (e: PeerVideoConnectRequestHandlerArgs) => void;
export type PeerVideoConnectRequestHandlerArgs = { local: t.PeerId; remote: t.PeerId };
