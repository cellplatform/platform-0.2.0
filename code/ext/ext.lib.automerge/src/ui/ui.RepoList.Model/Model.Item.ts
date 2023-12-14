import { actionLeftBehavior } from './Model.Item.b.action.left';
import { actionShareBehavior } from './Model.Item.b.action.share';
import { addBehavior } from './Model.Item.b.add';
import { deleteBehavior } from './Model.Item.b.delete';
import { renameBehavior } from './Model.Item.b.rename';
import { DEFAULTS, Model, type t } from './common';

type D = t.RepoItemData;
type K = D['kind'];

export const ItemModel = {
  initial(kind: K): t.RepoItem {
    const data: D = { kind };
    return {
      data,
      label: '',
      left: { kind: 'Item:Left' },
      right: { kind: 'Item:Right' },
      editable: kind === 'Doc',
    };
  },

  /**
   * State wrapper.
   */
  state(ctx: t.GetRepoListModel, kind: K, options: { dispose$?: t.UntilObservable } = {}) {
    const initial = ItemModel.initial(kind);
    const type = DEFAULTS.typename.Item;
    const state = Model.Item.state<t.RepoListAction, D>(initial, { type });
    const events = state.events(options.dispose$);
    const dispatch = Model.Item.commands(state);
    const item: t.RepoItemModel = { state, events, dispatch };

    /**
     * Behavior controllers.
     */
    addBehavior({ ctx, item });
    renameBehavior({ ctx, item });
    actionLeftBehavior({ ctx, item });
    actionShareBehavior({ ctx, item });
    deleteBehavior({ ctx, item });

    /**
     * Finish up.
     */
    return state;
  },
} as const;
