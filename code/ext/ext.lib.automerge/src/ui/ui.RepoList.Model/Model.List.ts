import { ItemModel } from './Model.Item';
import { repoListenerBehavior } from './Model.List.b.repo';
import { DEFAULTS, Model, rx, type t } from './common';

export const List = {
  /**
   * Initialise a new state model for a Repo.
   */
  init(store: t.WebStore, options: { dispose$?: t.UntilObservable } = {}) {
    const life = rx.lifecycle(options.dispose$);
    const { dispose$, dispose } = life;

    /**
     * Model.
     */
    const ctx: t.RepoListCtxGet = () => ({ list, store, dispatch, dispose$ });
    const array = Model.List.array((i) => ItemModel.state({ ctx }));
    const list: t.RepoListState = Model.List.state(
      { total: 1, getItem: array.getItem },
      { type: DEFAULTS.typename.list, dispose$ },
    );
    const dispatch = Model.List.commands(list);

    /**
     * Behaviors.
     */
    repoListenerBehavior({ store, ctx });

    /**
     * API.
     */
    const api: t.RepoListModel = {
      ctx,
      list,
      dispatch,

      /**
       * Lifecycle.
       */
      dispose,
      dispose$,
      get disposed() {
        return life.disposed;
      },
    };
    return api;
  },
} as const;
