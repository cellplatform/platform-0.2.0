import { asHandle } from './Doc.u';
import { A, Is, Time, type t } from './common';

/**
 * Stamp a commit message/timestamp into the document history.
 */
export const Tag = {
  commit<T>(
    doc: t.DocRef<T> | t.DocHandle<T>,
    message: string,
    options: { time?: t.UnixTimestamp | boolean } = {},
  ) {
    const handle = wrangle.handle(doc);
    const time = wrangle.timestamp(options.time);
    A.emptyChange(handle.docSync(), { message, time });
    return { message, time } as const;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  timestamp(input?: t.UnixTimestamp | boolean) {
    if (input === false) return undefined;
    if (input === true || input === undefined) return Time.now.timestamp;
    return input;
  },

  handle<T>(input: t.DocRef<T> | t.DocHandle<T>): t.DocHandle<T> {
    if (Is.handle(input)) return input as t.DocHandle<T>;
    return asHandle(input as t.DocRef<T>).handle;
  },
} as const;
