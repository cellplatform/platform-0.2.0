import { type t } from '../common';

export * from '../common';
export { CrdtLens } from '../../crdt.Lens';

/**
 * @system → sys.ui.common
 */
export { LabelItem } from '../../sys.ui.common';
import { DEFAULTS as item } from '../../sys.ui.common/LabelItem/common';

/**
 * Constants.
 */
const data: t.CrdtNsInfoData = {
  maxLength: item.maxLength,
};

export const DEFAULTS = {
  data,
  item,
  enabled: true,
  indent: 0,
} as const;
