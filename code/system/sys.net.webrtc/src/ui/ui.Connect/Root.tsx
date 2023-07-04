import { DEFAULTS, FC, type t } from './common';
import { Connect as View } from './ui.Connect';
import { ConnectStateful as Stateful } from './ui.Connect.Stateful';
import { useController } from './useController.mjs';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
  useController: typeof useController;
};
export const Connect = FC.decorate<t.ConnectProps, Fields>(
  View,
  { DEFAULTS, Stateful, useController },
  { displayName: 'Connect' },
);
