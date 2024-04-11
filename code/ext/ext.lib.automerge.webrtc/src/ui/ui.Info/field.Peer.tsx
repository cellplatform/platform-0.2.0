import type { InfoField as PeerField } from 'ext.lib.peerjs/src/types';
import { PeerInfo, type t } from './common';

export function peer(data: t.InfoData, parentFields: t.InfoField[], theme?: t.CommonTheme) {
  const self = data.peer?.self || data.network?.peer;
  if (!self) return;

  const fields: PeerField[] = [];
  if (parentFields.includes('Peer')) fields.push('Peer');
  if (parentFields.includes('Peer.Remotes')) fields.push('Peer.Remotes');
  if (fields.length === 0) return;

  return PeerInfo.Field.peer({ self }, fields, theme);
}
