import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { List } from './ui.List';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  List: typeof List;
};
export const ModuleNamespace = FC.decorate<t.ModuleNamespaceProps, Fields>(
  View,
  { DEFAULTS, List },
  { displayName: DEFAULTS.displayName },
);
