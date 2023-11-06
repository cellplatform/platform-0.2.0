import { type t } from './common';

export * from '../common';
export { Data, Model } from '../ui.Connector.Model';

/**
 * Constants
 */
const behavior: t.ConnectorPropsBehavior = {
  grabFocusOnArrowKey: false,
  focusOnLoad: false,
};

export const DEFAULTS = {
  displayName: 'Webrtc.Connector',
  behavior,
} as const;
