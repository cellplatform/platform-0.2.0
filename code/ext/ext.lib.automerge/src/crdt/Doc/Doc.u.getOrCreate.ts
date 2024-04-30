import { A, DEFAULTS, R, Time, type t } from './common';
import { fromBinary } from './Doc.u.binary';
import { get } from './Doc.u.get';
import { Handle, Mutate } from './u';

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

  handle.change((d: any) => {
    initial(d);

    // Ensure the initializer function caused a change such that the
    // initial genesis timestamp is written into the commit history.
    if (R.equals(d, {})) Mutate.emptyChange(d);
  }, DEFAULTS.genesis.options());

  // Finish up.
  return Handle.wrap<T>(handle, { dispose$ });
}

/**
 * Helpers
 */
