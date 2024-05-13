import { DEFAULTS, FC, type t } from './common';
import { Field } from './field';
import { View } from './ui';
import { UriButton } from './ui.Button.Uri';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Field: typeof Field;
  UriButton: typeof UriButton;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, Field, UriButton },
  { displayName: 'Info' },
);
