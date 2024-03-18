import { type t, A } from './common';

import { get } from './Doc.u.get';
import { Handle } from './u.Handle';

type Uri = t.DocUri | string;

/**
 * Find or initialize a new document from the repo.
 */
export async function getOrCreate<T>(args: {
  repo: t.Repo;
  initial: t.ImmutableNext<T>;
  uri?: Uri;
  dispose$?: t.UntilObservable;
  timeout?: t.Msecs;
}): Promise<t.DocRefHandle<T>> {
  const { repo, uri, timeout, dispose$ } = args;

  /**
   * Lookup existing URI requested.
   */
  if (uri) {
    const res = await get({ repo, uri, timeout, dispose$, throw: true });
    return res as t.DocRefHandle<T>;
  }

  /**
   * New document creation
   */
  const handle = repo.create<T>();
  handle.change((d: any) => args.initial(d), options);

  const ref = Handle.wrap<T>(handle, { dispose$ });
  await ref.handle.whenReady();
  return ref;
}
