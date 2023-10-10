import { State, type t } from './common';

export const Data = {
  self: (item: t.LabelItem) => State.data<t.ConnectorDataSelf>(item),
  remote: (item: t.LabelItem) => State.data<t.ConnectorDataRemote>(item),
} as const;
