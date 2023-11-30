import { actionLeftBehavior } from './Model.Item.b.action.left';
import { actionShareBehavior } from './Model.Item.b.action.share';
import { addBehavior } from './Model.Item.b.add';
import { renameBehavior } from './Model.Item.b.rename';
import { DEFAULTS, Model, type t } from './common';

type D = t.RepoItemData;
type M = D['mode'];

export const ItemModel = {
  initial(mode: M): t.RepoItem {
    const data: D = { mode };
    return {
      label: '',
      left: { kind: 'Item:Left' },
      right: { kind: 'Item:Right' },
      data,
      editable: mode === 'Doc',
    };
  },

  /**
   * State wrapper.
   */
  state(ctx: t.RepoListCtxGet, mode: M, options: { dispose$?: t.UntilObservable } = {}) {
    const initial = ItemModel.initial(mode);
    const type = DEFAULTS.typename.Item;
    const state = Model.Item.state<t.RepoListAction, D>(initial, { type });
    const events = state.events(options.dispose$);
    const dispatch = Model.Item.commands(state);
    const item: t.RepoItemCtx = { state, events, dispatch };

    /**
     * Behavior controllers.
     */
    addBehavior({ ctx, item });
    renameBehavior({ ctx, item });
    actionLeftBehavior({ ctx, item });
    actionShareBehavior({ ctx, item });

    /**
     * Finish up.
     */
    return state;
  },
} as const;
