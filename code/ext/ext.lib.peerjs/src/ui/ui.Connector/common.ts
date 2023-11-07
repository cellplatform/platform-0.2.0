import { type t } from './common';

export * from '../common';
export { Data, Model } from '../ui.Connector.Model';

/**
 * Constants
 */
const behavior: t.ConnectorBehavior = {
  focusOnArrowKey: false,
  focusOnLoad: false,
};

export const DEFAULTS = {
  displayName: 'Webrtc.Connector',
  behavior,
  tabIndex: 0,
} as const;
