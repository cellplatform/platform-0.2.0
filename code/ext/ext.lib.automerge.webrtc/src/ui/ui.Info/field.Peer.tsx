import type { InfoField as PeerField } from 'ext.lib.peerjs/src/types';
import { PeerInfo, type t } from './common';

export function peer(data: t.InfoData['peer'], parentFields: t.InfoField[]) {
  if (!data) return undefined;

  const fields: PeerField[] = [];
  if (parentFields.includes('Peer')) fields.push('Peer');
  if (parentFields.includes('Peer.Remotes')) fields.push('Peer.Remotes');
  if (fields.length === 0) return;

  return PeerInfo.Field.peer(data, fields);
}
