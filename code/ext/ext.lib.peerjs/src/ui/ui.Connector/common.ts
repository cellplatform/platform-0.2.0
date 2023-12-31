import { type t } from './common';

export * from '../common';
export { Data, Model } from '../ui.Connector.Model';

/**
 * Constants
 */

export const DEFAULTS = {
  displayName: 'Webrtc.Connector',
  tabIndex: 0,
  behaviors: {
    get all(): t.ConnectorBehavior[] {
      return ['Focus.OnLoad', 'Focus.OnArrowKey'];
    },
    get default(): t.ConnectorBehavior[] {
      return [];
    },
  },
} as const;
