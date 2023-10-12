import { State, type t } from './common';

type Input = t.LabelItem | t.LabelItemState;

export const Data = {
  item: (item: Input) => State.data<t.RepoItemData>(item),
} as const;
