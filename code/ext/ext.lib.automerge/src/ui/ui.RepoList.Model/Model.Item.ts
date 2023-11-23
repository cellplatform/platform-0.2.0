import { createDocumentBehavior } from './Model.Item.b.create';
import { renameBehavior } from './Model.Item.b.rename';
import { eventsBehavior } from './Model.Item.b.events';
import { DEFAULTS, Model, type t } from './common';

type Args = { ctx: t.RepoListCtxGet; dispose$?: t.UntilObservable };
type D = t.RepoItemData;

export const ItemModel = {
  initial(args: Args): t.RepoItem {
    const data: D = { mode: 'Add' };
    return {
      editable: false,
      label: '',
      left: { kind: 'Item:Left' },
      right: { kind: 'Item:Right' },
      data,
    };
  },

  /**
   * State wrapper.
   */
  state(args: Args) {
    const { ctx } = args;
    const initial = ItemModel.initial(args);
    const type = DEFAULTS.typename.Item;
    const item = Model.Item.state<t.RepoListAction, D>(initial, { type });
    const events = item.events(args.dispose$);

    /**
     * Behavior controllers.
     */
    createDocumentBehavior({ ctx, item, events });
    renameBehavior({ ctx, item, events });
    eventsBehavior({ ctx, item, events });

    /**
     * Finish up.
     */
    return item;
  },
} as const;
