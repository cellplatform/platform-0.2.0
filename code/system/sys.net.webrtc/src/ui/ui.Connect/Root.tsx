import { DEFAULTS, FC, type t } from './common';
import { Connect as View } from './ui.Connect';
import { ConnectStateful as Stateful } from './ui.ConnectStateful';
import { useConnectController } from './useConnectController.mjs';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
  useConnectController: typeof useConnectController;
};
export const Connect = FC.decorate<t.ConnectProps, Fields>(
  View,
  { DEFAULTS, Stateful, useConnectController },
  { displayName: 'Connect' },
);
