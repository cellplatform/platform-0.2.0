import { DEFAULTS, FC, type t } from './common';
import { Field } from './field';
import { View } from './ui';
import { DocUriButton } from './ui.Doc.UriButton';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Field: typeof Field;
  DocUriButton: typeof DocUriButton;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, Field, DocUriButton },
  { displayName: 'Info' },
);
