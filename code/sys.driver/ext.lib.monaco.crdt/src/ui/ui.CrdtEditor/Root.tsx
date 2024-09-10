import { CrdtInfo, DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { FieldSelector } from './ui.FieldSelector';
import { IdentityLabel } from './ui.Identity.Label';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  CrdtInfo: typeof CrdtInfo;
  IdentityLabel: typeof IdentityLabel;
  FieldSelector: typeof FieldSelector;
};
export const CrdtEditor = FC.decorate<t.CrdtEditorProps, Fields>(
  View,
  { DEFAULTS, CrdtInfo, IdentityLabel, FieldSelector },
  { displayName: DEFAULTS.displayName },
);
