import { Model, type t } from './common';

type Input = t.LabelItem | t.LabelItemState;

export const Data = {
  self: (item: Input) => Model.data<t.ConnectorDataLocal>(item),
  remote: (item: Input) => Model.data<t.ConnectorDataRemote>(item),

  list(input: t.ConnectorListState) {
    const list = {
      get items() {
        return Model.List.map(input, (item) => item.current);
      },
      get data() {
        return list.items.map((item) => item.data!).filter(Boolean);
      },
      remotes: {
        get items() {
          return list.items
            .filter((item) => item.data?.kind === 'peer:remote')
            .map((item) => item as t.ConnectorItemRemote);
        },
        get data() {
          return list.remotes.items.map((item) => item.data!);
        },
      },
    } as const;
    return list;
  },
} as const;
