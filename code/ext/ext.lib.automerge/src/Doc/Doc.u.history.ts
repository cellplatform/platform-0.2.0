import { A, DEFAULTS, Time, type t } from './common';

/**
 * Retrieve the history of the given document.
 */
export function history<T>(doc: t.DocRef<T>): t.DocHistory<T> {
  const commits = A.getHistory<T>(doc.current);
  let _genesis: t.DocHistoryGenesis<T> | false | undefined;

  return {
    commits,
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
  };
}

export function heads<T>(doc: t.DocRef<T>): t.DocHeads {
  const heads = doc ? A.getHeads(doc.current as A.Doc<T>) : [];
  return heads;
}

/**
 * Helpers
 */
function isInitial(item: t.DocHistoryCommit) {
  const { change } = item;
  const message = DEFAULTS.message.initial;
  return change.time > 0 && change.message === message;
}
