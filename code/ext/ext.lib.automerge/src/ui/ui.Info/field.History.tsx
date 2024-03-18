import { Doc, Time, Value, type t } from './common';
import { HistoryCommit } from './ui.History.Commit';

type D = t.InfoDataHistory;

export function history(history: D | undefined, fields: t.InfoField[]) {
  if (!history) return;
  const res: t.PropListItem[] = [];

  const doc = history.doc;
  const label = history.label || 'History';
  const value = doc ? wrangle.elapsed(doc) : '-';

  const main: t.PropListItem = { label, value };
  res.push(main);

  if (fields.includes('History.List') && doc) {
    const list = Doc.history(doc).commits.map((commit, index) => ({ commit, index }));
    list.reverse();
    list.forEach((item) => {
      const { index, commit } = item;
      const style: React.CSSProperties = { flex: 1, marginLeft: 0 };
      const value = <HistoryCommit index={index} commit={commit} style={style} />;
      res.push({ value, divider: false });
    });
  }

  return res;
}

/**
 * Helpers
 */
const wrangle = {
  elapsed(doc: t.DocRef<unknown>) {
    /**
     * TODO 🐷
     * write the [change.time] value on genesis.
     */
    const history = Doc.history(doc);
    const commits = history.commits;

    const firstWithTime = commits.find((item) => item.change.time);
    const now = Time.now.timestamp;
    const elapsed = firstWithTime ? Time.duration(now - firstWithTime.change.time) : undefined;
    const total = commits.length ?? 0;

    const text = {
      total: total.toLocaleString(),
      commits: Value.plural(total, 'commit (genesis)', 'commits'),
      age: elapsed ? `← genesis (${elapsed.toString()})` : '',
    } as const;

    return `${text.total} ${text.commits} ${text.age}`.trim();
  },
} as const;
