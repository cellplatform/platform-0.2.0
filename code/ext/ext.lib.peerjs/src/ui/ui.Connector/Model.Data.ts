import { State, type t } from './common';

type Input = t.LabelItem | t.LabelItemState;

export const Data = {
  self: (item: Input) => State.data<t.ConnectorDataSelf>(item),
  remote: (item: Input) => State.data<t.ConnectorDataRemote>(item),
} as const;
