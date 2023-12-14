import { eventsFactory } from './Doc.Events';
import { DocMeta as Meta } from './Doc.Meta';
import { DocPatch as Patch } from './Doc.Patch';
import { DEFAULTS, Data, Is, Time, DocUri as Uri, rx, slug, toObject, type t } from './common';

type Uri = t.DocUri | string;

export const Doc = {
  Uri,
  Meta,
  Data,
  Patch,
  toObject,

  /**
   * Find the document document from the repo.
   */
  get<T>(
    repo: t.Repo,
    uri: Uri,
    options: { timeout?: t.Msecs; dispose$?: t.UntilObservable; throw?: boolean } = {},
  ) {
    type R = t.DocRefHandle<T> | undefined;
    return new Promise<R>((resolve, reject) => {
      const { dispose$, timeout = DEFAULTS.timeout.get } = options;
      const done$ = rx.subject();
      const done = (res: R) => {
        rx.done(done$);
        if (!res && options.throw) {
          const err = `Failed to retrieve document for the given URI "${uri}".`;
          return reject(new Error(err));
        } else {
          return resolve(res);
        }
      };

      if (!Is.automergeUrl(uri)) return done(undefined);

      const handle = repo.find<T>(uri);
      Time.until(done$).delay(timeout, () => done(undefined));
      handle.whenReady().then(() => done(wrapHandle<T>({ handle, dispose$ })));
    });
  },

  /**
   * Find or initialize a new document from the repo.
   */
  async getOrCreate<T>(
    repo: t.Repo,
    args: {
      initial: t.ImmutableNext<T>;
      uri?: Uri;
      dispose$?: t.UntilObservable;
      timeout?: t.Msecs;
    },
  ): Promise<t.DocRefHandle<T>> {
    const { timeout, dispose$ } = args;

    /**
     * Lookup existing URI requested.
     */
    if (args.uri) {
      const res = await Doc.get(repo, args.uri, { timeout, dispose$, throw: true });
      return res as t.DocRefHandle<T>;
    }

    /**
     * New document creation
     */
    const handle = repo.create<T>();
    handle.change((d: any) => args.initial(d));

    const ref = wrapHandle<T>({ handle, dispose$ });
    await ref.handle.whenReady();
    return ref;
  },
} as const;

/**
 * Helpers
 */
function wrapHandle<T>(args: { handle: t.DocHandle<T>; dispose$?: t.UntilObservable }) {
  const { handle } = args;
  const api: t.DocRefHandle<T> = {
    instance: slug(),
    uri: handle.url,
    handle,
    get current() {
      return handle.docSync();
    },
    change(fn) {
      handle.change((d: any) => fn(d));
    },
    events(dispose$) {
      return eventsFactory<T>(handle, { dispose$: [args.dispose$, dispose$] });
    },
    toObject() {
      return toObject<T>(api.current);
    },
  };
  return api;
}
