import { UI } from 'ext.lib.peerjs';
import { type t } from './common';

export function fieldPeer(data: t.InfoData, parentFields: t.InfoField[]) {
  const peer = data.peer;
  if (!peer) return;

  const fields: t.InfoField[] = [];
  if (parentFields.includes('Peer')) fields.push('Peer');
  if (parentFields.includes('Peer.Remotes')) fields.push('Peer.Remotes');
  if (fields.length === 0) return;

  const value = <UI.Info style={{ flex: 1 }} fields={fields} data={{ peer }} />;
  return { value };
}
