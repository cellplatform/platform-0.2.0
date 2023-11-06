import { Item } from './Item';
import { List } from './List';
import { Is } from './Model.Is';
import { data } from './Model.data';
import { PatchState } from './common';

const { toObject } = PatchState;
const { action } = Item;

/**
 * Safe/immutable/observable in-memory state.
 */
export const Model = {
  Item,
  List,
  Is,

  toObject,
  action,
  data,
} as const;
