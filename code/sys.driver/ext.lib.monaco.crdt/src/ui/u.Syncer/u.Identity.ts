import { ObjectPath, rx, slug, type t } from './common';
import { PatchUtil } from './u.Patch';

type O = Record<string, unknown>;
type C = t.ImmutableChange<O, t.Patch>;
const UNKNOWN = 'UNKNOWN.';

/**
 * Helpers for working with identity.
 */
export const IdentityUtil = {
  /**
   * Ensure an identity ID value.
   */
  format(value?: string) {
    return value ?? `${UNKNOWN}${slug()}`;
  },

  /**
   * Resolve the {identities} object.
   */
  resolveIdentities(lens: t.Immutable, paths: t.EditorPaths) {
    return ObjectPath.resolve<t.EditorIdentities>(lens.current, paths.identity) ?? {};
  },

  /**
   * Prepare observables.
   */
  Observable: {
    identity$(changed$: t.Observable<C>, paths: t.EditorPaths) {
      return changed$.pipe(
        rx.filter((e) => PatchUtil.Includes.identity(e.patches, { paths })),
        rx.map((e) => {
          type T = t.EditorIdentityState;
          const identity = PatchUtil.extractIdentity(e.patches);
          const path = [...paths.identity, identity];
          const before = ObjectPath.resolve<T>(e.before, path);
          const after = ObjectPath.resolve<T>(e.after, path);
          const res: t.EditorIdentityStateChange = { identity, before, after };
          return res;
        }),
      );
    },

    identities$(changed$: t.Observable<C>, paths: t.EditorPaths) {
      return changed$.pipe(
        rx.filter((e) => PatchUtil.Includes.identity(e.patches, { paths })),
        rx.distinctWhile(
          (p, n) =>
            wrangle.identityKeys(p.after, paths).join() ===
            wrangle.identityKeys(n.after, paths).join(),
        ),
        rx.map((e) => wrangle.identityKeys(e.after, paths)),
      );
    },
  },

  Is: {
    /**
     * Determine if the given value is a "unknown" type.
     */
    unknown(value: string = '') {
      if (!value.trim()) return true;
      return value.startsWith(UNKNOWN) && value.length > UNKNOWN.length;
    },
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  identityKeys(d: O, paths: t.EditorPaths) {
    const obj = ObjectPath.resolve(d, paths.identity) ?? {};
    return Object.keys(obj);
  },
} as const;
