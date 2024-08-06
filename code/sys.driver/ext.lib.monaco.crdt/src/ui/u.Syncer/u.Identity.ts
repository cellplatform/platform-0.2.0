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
   * Prepare an observable
   */
  Observable: {
    identity$(changed$: t.Observable<C>, paths: t.EditorPaths) {
      return changed$.pipe(
        rx.filter((e) => PatchUtil.Includes.identity(e.patches, { paths })),
        rx.map((e) => {
          type T = t.EditorIdentityState;
          const identity = PatchUtil.extractIdentity(e.patches);
          const path = [...paths.identity, identity];
          const before = ObjectPath.resolve<T>(e.before, path)!;
          const after = ObjectPath.resolve<T>(e.after, path)!;
          const res: t.EditorIdentityStateChange = { identity, before, after };
          return res;
        }),
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
