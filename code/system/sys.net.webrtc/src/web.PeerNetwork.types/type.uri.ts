import { t } from './common';

export type PeerUriString = string;
export type PeerConnectionUriString = string;

/**
 * Parsed URI Objects
 */
export type PeerUri = PeerUriObject | PeerUriConnectionObject;

export type PeerUriObject = {
  ok: boolean;
  type: 'peer';
  peer: t.PeerId;
  errors: string[];
};

export type PeerUriConnectionObject = {
  ok: boolean;
  type: 'connection';
  kind: t.PeerConnectionKind;
  peer: t.PeerId;
  connection: t.PeerConnectionId;
  errors: string[];
};
