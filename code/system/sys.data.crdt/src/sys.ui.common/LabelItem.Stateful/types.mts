import { type t } from './common';

export type LabelItemStatefulProps = {
  useController?: boolean;
  props?: t.LabelItemProps; // Passed in from a high-level state controller if local [useController] not in use.
  style?: t.CssValue;
};
