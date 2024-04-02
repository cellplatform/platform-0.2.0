import { A, DEFAULTS, Time, Value, type t } from './common';

/**
 * Retrieve the history of the given document.
 */
export function history<T>(doc?: t.DocRef<T>): t.DocHistory<T> {
  const commits = doc ? A.getHistory<T>(doc.current) : [];
  let _genesis: t.DocHistoryGenesis<T> | false | undefined;

  /**
   * History
   */
  return {
    commits,

    get length() {
      return commits.length;
    },

    get latest() {
      return commits[commits.length - 1];
    },

    get genesis() {
      if (_genesis === false) return undefined;
      if (_genesis) return _genesis;

      const initial = commits.find(isInitial);
      if (!initial) {
        _genesis = false;
        return undefined;
      }

      const now = Time.now.timestamp;
      const elapsed = Time.duration(now - initial.change.time);
      return (_genesis = { initial, elapsed });
    },

    page(index, limit, sort = DEFAULTS.page.sort) {
      const list = index < 0 ? [] : commits.map((commit, index) => ({ index, commit }));
      if (sort === 'desc') list.reverse();
      const items = Value.page(list, index, limit);
      const length = items.length;
      const total = commits.length;
      let _commits: t.DocHistoryCommit<T>[] | undefined;
      return {
        order: sort,
        index,
        limit,
        length,
        total,
        items,
        get commits() {
          return _commits ?? (_commits = items.map((m) => m.commit));
        },
      };
    },
  };
}

/**
 * Retrieve the list of hashes for the current HEAD.
 */
export function heads<T>(doc: t.DocRef<T> | undefined): t.HashString[] {
  return doc ? A.getHeads(doc.current as A.Doc<T>) : [];
}

/**
 * Helpers
 */
function isInitial(item: t.DocHistoryCommit) {
  const { change } = item;
  const message = DEFAULTS.message.initial;
  return change.time > 0 && change.message === message;
}