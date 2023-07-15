import { DEFAULTS as item } from '../../-sys.ui.common/LabelItem/common';
import { type t } from '../common';

export { CrdtLens } from '../../crdt/crdt.Lens';
export * from '../common';

/**
 * @system → sys.ui.common
 */
export { LabelItem } from '../../-sys.ui.common';

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
  placeholder: 'namespace',
} as const;
