import { State, type t } from './common';

type Input = t.LabelItem | t.LabelItemState;

export const Data = {
  self: (item: Input) => State.data<t.ConnectorDataSelf>(item),
  remote: (item: Input) => State.data<t.ConnectorDataRemote>(item),

  list(input: t.ConnectorListState) {
    const list = {
      get items() {
        return input.current.items.map(({ state }) => state.current);
      },
      get data() {
        return list.items.map((item) => item.data!).filter(Boolean);
      },
      remotes: {
        get items() {
          return list.items
            .filter((item) => item.data?.kind === 'peer:remote')
            .map((item) => item as t.LabelItem<t.ConnectorAction, t.ConnectorDataRemote>);
        },
        get data() {
          return list.remotes.items.map((item) => item.data!);
        },
      },
    } as const;
    return list;
  },
} as const;
