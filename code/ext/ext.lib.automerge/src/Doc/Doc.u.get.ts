import { DEFAULTS, Is, Time, rx, type t } from './common';
import { Handle } from './u.Handle';

type Uri = t.DocUri | string;

/**
 * Find the document document from the repo.
 */
export function get<T>(args: {
  repo: t.Repo;
  uri: Uri;
  timeout?: t.Msecs;
  dispose$?: t.UntilObservable;
  throw?: boolean;
}) {
  type R = t.DocRefHandle<T> | undefined;
  return new Promise<R>((resolve, reject) => {
    const { repo, uri, dispose$, timeout = DEFAULTS.timeout.get } = args;

    const done$ = rx.subject();
    const done = (res: R) => {
      rx.done(done$);
      if (!res && args.throw) {
        const err = `Failed to retrieve document for the given URI "${uri}".`;
        return reject(new Error(err));
      } else {
        return resolve(res);
      }
    };

    if (!Is.automergeUrl(uri)) return done(undefined);

    const handle = repo.find<T>(uri);
    if (handle.isDeleted()) return done(undefined);

    Time.until(done$).delay(timeout, () => done(undefined));
    handle.whenReady().then(() => done(Handle.wrap<T>(handle, { dispose$ })));
  });
}

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
  handle.change((d: any) => args.initial(d));

  const ref = Handle.wrap<T>(handle, { dispose$ });
  await ref.handle.whenReady();
  return ref;
}
