import { DEFAULTS, FC, type t } from './common';
import { Field } from './field';
import { Diff } from './u';
import { View } from './ui';
import { DocUriButton } from './ui.Doc.UriButton';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Field: typeof Field;
  Diff: typeof Diff;
  DocUriButton: typeof DocUriButton;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, Field, Diff, DocUriButton },
  { displayName: DEFAULTS.displayName },
);
