import { ItemModel as Item } from './Model.Item';
import { List } from './Model.List';

export const Model = {
  init: List.init,
  List,
  Item,
} as const;
