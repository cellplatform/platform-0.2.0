import type { t } from './common';

/**
 * An ephemeral
 */
export type WebrtcSyncDoc = t.DocWithMeta & {
  shared: WebrtcSyncDocShared;
};
export type WebrtcSyncDocShared = { [docuri: string]: WebrtcSyncDocSharedRef };
export type WebrtcSyncDocSharedRef = {
  name?: string;
};

/**
 * Events
 */
export type WebrtcSyncDocEvent = WebrtcSyncDocSetupEvent | WebrtcSyncDocConfirmedEvent;

export type WebrtcSyncDocSetupEvent = {
  type: 'webrtc:ephemeral/setup';
  payload: t.WebrtcSyncDocSetup;
};
export type WebrtcSyncDocSetup = {
  conn: { id: string };
  peer: { from: string; to: string };
  doc: { uri: string };
};

export type WebrtcSyncDocConfirmedEvent = {
  type: 'webrtc:ephemeral/confirmed';
  payload: t.WebrtcSyncDocConfirmed;
};

export type WebrtcSyncDocConfirmed = {
  conn: { id: string };
  peer: { from: string; to: string };
  doc: { uri: string };
};
