import { createDocumentBehavior } from './Model.Item.b.create';
import { DEFAULTS, Model, type t } from './common';

type Args = { ctx: t.RepoListCtxGet; dispose$?: t.UntilObservable };
type D = t.RepoItemData;

export const ItemModel = {
  initial(args: Args): t.RepoItem {
    const data: D = { mode: 'Add' };
    return {
      editable: false,
      label: '',
      left: { kind: 'Store:Left' },
      data,
    };
  },

  /**
   * State wrapper.
   */
  state(args: Args) {
    const { ctx } = args;
    const initial = ItemModel.initial(args);
    const item = Model.Item.state<t.RepoListAction, D>(initial, { type: DEFAULTS.typename.item });
    const events = item.events(args.dispose$);

    /**
     * Behavior controllers.
     */
    createDocumentBehavior({ ctx, item, events });

    /**
     * Finish up.
     */
    return item;
  },
} as const;
