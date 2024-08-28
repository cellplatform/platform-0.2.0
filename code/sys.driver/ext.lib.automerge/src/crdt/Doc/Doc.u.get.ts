import { DEFAULTS, Is, Time, rx, type t } from './common';
import { Handle } from './u.Handle';

type O = Record<string, unknown>;
type Uri = t.DocUri | t.UriString;

/**
 * Find the document document from the repo.
 */
export function get<T extends O>(args: {
  repo: t.AutomergeRepo;
  uri: Uri;
  timeout?: t.Msecs;
  dispose$?: t.UntilObservable;
  throw?: boolean;
}) {
  type R = t.DocWithHandle<T> | undefined;
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
