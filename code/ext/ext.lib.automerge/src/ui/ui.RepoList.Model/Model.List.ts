import { eventsFactory } from './Model.Events';
import { ItemModel } from './Model.Item';
import { GetItem } from './Model.List.GetItem';
import { listBehavior } from './Model.List.b';
import { listRedrawBehavior } from './Model.List.b.redraw';
import { listSelectionBehavior } from './Model.List.b.selection';
import { DEFAULTS, Model, WebStore, rx, type t } from './common';
import { Wrangle } from './u.Wrangle';

type Options = { dispose$?: t.UntilObservable; filter?: t.StoreIndexFilter } & t.RepoListHandlers;

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
    const events = (dispose$?: t.UntilObservable) => eventsFactory({ ctx: () => model, dispose$ });

    const array = Model.List.array((i) => ItemModel.state(() => model, 'Doc', { dispose$ }));
    const getItem = GetItem(() => model, array);
    const state: t.RepoListState = Model.List.state(
      { total, getItem },
      { type: DEFAULTS.typename.List, dispose$ },
    );

    /**
     * API.
     */
    const dispatch = Model.List.commands(state);
    const list = { state, dispatch };
    const model: t.RepoListModel = {
      store,
      index,
      list,
      filter,
      handlers,
      events,

      /**
       * Lifecycle.
       */
      dispose,
      dispose$,
      get disposed() {
        return life.disposed;
      },
    };

    /**
     * Behaviors.
     */
    listBehavior({ ctx: () => model });
    listSelectionBehavior({ ctx: () => model });
    listRedrawBehavior({ ctx: () => model, array });

    // Finish up.
    return model;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  handlers(options: Options = {}): t.RepoListHandlers {
    const { onShareClick, onDatabaseClick, onActiveChanged } = options;
    return { onShareClick, onDatabaseClick, onActiveChanged } as const;
  },
} as const;
