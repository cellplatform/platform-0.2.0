import { ItemModel as Item } from './Model.Item';
import { List } from './Model.List';

const init = List.init;

export const Model = {
  init,
  List,
  Item,
} as const;
