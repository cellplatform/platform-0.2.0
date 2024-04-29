import { A, DEFAULTS, R, Time, slug, type t } from './common';

import { get } from './Doc.u.get';
import { Handle } from './u.Handle';
import { fromBinary } from './Doc.u.binary';

type O = Record<string, unknown>;
type Uri = t.DocUri | t.UriString;

/**
 * Find or initialize a new document from the repo.
 */
export async function getOrCreate<T extends O>(args: {
  repo: t.Repo;
  initial: t.ImmutableNext<T> | Uint8Array;
  uri?: Uri;
  dispose$?: t.UntilObservable;
  timeout?: t.Msecs;
}): Promise<t.DocRefHandle<T>> {
  const { initial, repo, uri, timeout, dispose$ } = args;

  /**
   * Lookup existing URI requested.
   */
  if (uri) {
    const res = await get({ repo, uri, timeout, dispose$, throw: true });
    return res as t.DocRefHandle<T>;
  }

  /**
   * From binary: "hard-coded byte array hack"
   */
  if (initial instanceof Uint8Array) {
    const binary = initial;
    return fromBinary({ repo, binary, uri, dispose$ });
  }

  /**
   * New document initialization.
   */
  const handle = repo.create<T>();
  await handle.whenReady();

  const message = DEFAULTS.message.initial;
  const time = Time.now.timestamp;
  const options: A.ChangeOptions<T> = { message, time };

  handle.change((d: any) => {
    initial(d);

    // Ensure the initializer function caused a change such that the
    // initial genesis timestamp is written into the commit history.
    if (R.equals(d, {})) mutate.emptyChange(d);
  }, options);

  // Finish up.
  return Handle.wrap<T>(handle, { dispose$ });
}

/**
 * Helpers
 */
const mutate = {
  emptyChange(d: any) {
    const key = `__tmp:${slug()}`;
    d[key] = 0;
    delete d[key]; // Clean up.
  },
} as const;
