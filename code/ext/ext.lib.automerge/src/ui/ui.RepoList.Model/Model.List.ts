import { ItemModel } from './Model.Item';
import { GetItem } from './Model.List.GetItem';
import { listBehavior } from './Model.List.b';
import { listRedrawBehavior } from './Model.List.b.redraw';
import { Wrangle } from './u.Wrangle';
import { DEFAULTS, Model, WebStore, rx, type t } from './common';

type Options = { dispose$?: t.UntilObservable; filter?: t.RepoIndexFilter } & t.RepoListHandlers;

export const List = {
  /**
   * Initialise a new state model for a Repo.
   */
  async init(store: t.WebStore, options: Options = {}) {
    const life = rx.lifecycle(options.dispose$);
    const { dispose$, dispose } = life;
    const { filter = DEFAULTS.filter } = options;
    const index = await WebStore.index(store);
    const total = Wrangle.filterDocs(index.doc.current, filter).length + 1;
    const handlers = wrangle.handlers(options);

    /**
     * Model.
     */
    const ctx: t.RepoListCtxGet = () => ({
      list,
      store,
      index,
      handlers,
      filter,
      dispose$,
    });
    const array = Model.List.array((i) => ItemModel.state({ ctx }));
    const getItem = GetItem(index, array, filter);
    const state: t.RepoListState = Model.List.state(
      { total, getItem },
      { type: DEFAULTS.typename.List, dispose$ },
    );

    /**
     * Behaviors.
     */
    const dispatch = Model.List.commands(state);
    const list = { state, dispatch };
    listBehavior({ ctx });
    listRedrawBehavior({ ctx });

    /**
     * API.
     */
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
const wrangle = {
  handlers(options: Options = {}): t.RepoListHandlers {
    const { onShareClick, onDatabaseClick } = options;
    return { onShareClick, onDatabaseClick };
  },
} as const;
