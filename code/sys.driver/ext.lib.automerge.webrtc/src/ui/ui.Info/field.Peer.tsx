import type { InfoField as PeerField } from 'ext.lib.peerjs/src/types';
import { PeerInfo, type t } from './common';

export function peer(ctx: t.InfoCtx, network?: t.NetworkStore) {
  const self = network?.peer;
  if (!self) return;

  const fields: PeerField[] = [];
  if (ctx.fields.includes('Peer')) fields.push('Peer');
  if (ctx.fields.includes('Peer.Remotes')) fields.push('Peer.Remotes');
  if (fields.length === 0) return;

  return PeerInfo.Field.peer({ ...ctx, fields }, self);
}
