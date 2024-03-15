import { Doc, Time, Value, type t } from './common';

type D = t.InfoDataHistory;

export function history(history: D | undefined, fields: t.InfoField[]) {
  if (!history) return;

  const doc = history.doc;
  const label = history.label || 'History';
  const value = doc ? wrangle.elapsed(doc) : '-';

  const res: t.PropListItem = { label, value };
  return res;
}

/**
 * Helpers
 */
const wrangle = {
  elapsed(doc: t.DocRef<unknown>) {

    const history = Doc.history(doc);
    const firstWithTime = history.find((item) => item.change.time);
    const now = Time.now.timestamp;
    const elapsed = firstWithTime ? Time.duration(now - firstWithTime.change.time) : undefined;
    const age = elapsed ? `← genesis (${elapsed.toString()})` : '';
    const total = history.length ?? 0;
    const commits = Value.plural(total, 'commit (genesis)', 'commits');

    return `${total.toLocaleString()} ${commits} ${age}`.trim();
  },
} as const;
