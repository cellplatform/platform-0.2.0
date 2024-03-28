import type { t } from './common';

import { useEffect, useState } from 'react';
import { Doc } from '../../crdt';

/**
 * Efficiently retrieves history from a doc.
 */
export function useHistory(doc?: t.DocRef) {
  const heads = Doc.heads(doc);
  const [history, setHistory] = useState<t.DocHistory>();
  useEffect(() => setHistory(doc ? Doc.history(doc) : undefined), heads);
  return { history, heads } as const;
}
