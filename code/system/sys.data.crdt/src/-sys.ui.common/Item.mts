import { LabelItem as Label } from './LabelItem';
import { State } from './LabelItem.Stateful';

/**
 * Representing a single, generic <Item>.
 * (concept, repeats to form <Lists>)
 */
export const Item = {
  Label,
  State,
} as const;
