import { LabelItem } from '../Item.LabelItem';
import { LabelItemState } from '../Item.LabelItem.Stateful';

/**
 * Representing a single, generic <Item>.
 * (concept, repeats to form <Lists>)
 */
export const Item = {
  Label: {
    View: LabelItem,
    State: LabelItemState,
  },
} as const;
