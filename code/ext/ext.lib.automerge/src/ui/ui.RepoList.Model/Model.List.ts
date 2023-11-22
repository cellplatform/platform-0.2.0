import { ItemModel } from './Model.Item';
import { GetItem } from './Model.List.GetItem';
import { DEFAULTS, Model, WebStore, rx, type t } from './common';

type Options = { dispose$?: t.UntilObservable } & t.RepoListHandlers;

export const List = {
  /**
   * Initialise a new state model for a Repo.
   */
  async init(store: t.WebStore, options: Options = {}) {
    const life = rx.lifecycle(options.dispose$);
    const { dispose$, dispose } = life;
    const index = await WebStore.index(store);
    const total = index.doc.current.docs.length + 1;
    const handlers = Wrangle.handlers(options);

    /**
     * Model.
     */
    const ctx: t.RepoListCtxGet = () => ({ list, store, index, handlers, dispose$ });
    const array = Model.List.array((i) => ItemModel.state({ ctx }));
    const getItem = GetItem(index, array);
    const state: t.RepoListState = Model.List.state(
      { total, getItem },
      { type: DEFAULTS.typename.List, dispose$ },
    );

    /**
     * API.
     */
    const dispatch = Model.List.commands(state);
    const list = { state, dispatch };
    const api: t.RepoListModel = {
      ctx,
      store,
      index,
      list,

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

/**
 * Helpers
 */
const Wrangle = {
  handlers(options: Options = {}): t.RepoListHandlers {
    const { onShareClick, onDatabaseClick } = options;
    return { onShareClick, onDatabaseClick };
  },
} as const;
