import { DEFAULTS, FC, type t } from './common';
import { Item } from './ui.Item';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const CrdtNamespaceItem = FC.decorate<t.CrdtNamespaceItemProps, Fields>(
  Item,
  { DEFAULTS },
  { displayName: 'Crdt.Namespace.Item' },
);

/**
 * TODO 🐷
 * - store value in local-storage
 * - focus (method)
 */
