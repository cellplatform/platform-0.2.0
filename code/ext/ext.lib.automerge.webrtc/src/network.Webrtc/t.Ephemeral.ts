import type { t } from './common';

/**
 * An ephemeral
 */
export type WebrtcEphemeral = t.DocWithMeta & {
  count: number; // TEMP 🐷
};

/**
 * Events
 */
export type WebrtcEphemeralEvent = WebrtcEphemeralSetupEvent | WebrtcEphemeralConfirmedEvent;

export type WebrtcEphemeralSetupEvent = {
  type: 'webrtc:ephemeral/setup';
  payload: t.WebrtcEphemeralSetup;
};
export type WebrtcEphemeralSetup = {
  conn: { id: string };
  peer: { from: string; to: string };
  doc: { uri: string };
};

export type WebrtcEphemeralConfirmedEvent = {
  type: 'webrtc:ephemeral/confirmed';
  payload: t.WebrtcEphemeralConfirmed;
};
export type WebrtcEphemeralConfirmed = {
  conn: { id: string };
  peer: { from: string; to: string };
  doc: { uri: string };
};
