import { Model, type t } from './common';

type Input = t.LabelItem | t.LabelItemState;

/**
 * Helpers for retreiving the typed {data} on the list/item models.
 */
export const Data = {
  /**
   * Item
   */
  kind: (item: Input) => Model.data<t.ConnectorData>(item).kind,
  self: (item: Input) => Model.data<t.ConnectorDataSelf>(item),
  remote: (item: Input) => Model.data<t.ConnectorDataRemote>(item),

  /**
   * List
   */
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
          type R = t.ConnectorItemRemote;
          return list.items
            .filter((item) => item.data?.kind === 'peer:remote')
            .map((item) => item as R);
        },
        get data() {
          return list.remotes.items.map((item) => item.data!);
        },
      },
    } as const;
    return list;
  },
} as const;
