import { LabelItem as Label } from './LabelItem';
import { useEditController, State } from './LabelItem.Stateful';

/**
 * Representing a single, generic <Item>.
 * (concept, repeats to form <Lists>)
 */
export const Item = {
  Label,
  useEditController,
  state: State.init,
} as const;
