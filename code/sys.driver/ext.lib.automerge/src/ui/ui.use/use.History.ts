import { useEffect, useState } from 'react';
import { Doc, type t } from './common';

/**
 * Efficiently retrieves history from a doc.
 */
export function useHistory(doc?: t.Doc) {
  const heads = Doc.heads(doc);
  const [history, setHistory] = useState<t.DocHistory>();
  useEffect(() => setHistory(doc ? Doc.history(doc) : undefined), heads);
  return { history, heads } as const;
}
