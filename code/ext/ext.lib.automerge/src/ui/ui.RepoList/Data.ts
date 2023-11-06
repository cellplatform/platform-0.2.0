import { Model, type t } from './common';

type Input = t.LabelItem | t.LabelItemState;

export const Data = {
  item: (item: Input) => Model.data<t.RepoItemData>(item),
} as const;
