import { Model, type t } from './common';

type ItemInput = t.LabelItem | t.LabelItemState;

/**
 * Helpers for retreiving the typed {data} on the list/item models.
 */
export const Data = {
  /**
   * Item
   */
  kind: (input: ItemInput) => Model.data<t.ConnectorData>(input).kind,
  self: (input: ItemInput) => Model.data<t.ConnectorDataSelf>(input),
  remote: (input: ItemInput) => Model.data<t.ConnectorDataRemote>(input),

  peerid(input?: ItemInput) {
    if (!input) return;
    const kind = Data.kind(input);
    if (kind === 'peer:self') return Data.self(input).peerid;
    if (kind === 'peer:remote') return Data.remote(input).remoteid;
    return;
  },

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
