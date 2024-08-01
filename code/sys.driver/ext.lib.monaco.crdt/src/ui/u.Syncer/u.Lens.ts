import { Doc, ObjectPath, type t } from './common';

type O = Record<string, unknown>;

export const SyncerLens = {
  /**
   * Text helpers
   */
  text(lens: t.Immutable, paths: t.EditorPaths) {
    const api = {
      get current() {
        return api.resolve(lens.current);
      },
      resolve(d: O) {
        return ObjectPath.resolve<string>(d, paths.text);
      },
      splice(d: O, index: number, del: number, value?: string) {
        Doc.Text.splice(d, paths.text, index, del, value);
      },
      replace(d: O, value: string) {
        ObjectPath.Mutate.value(d, paths.text, value);
      },
    } as const;
    return api;
  },
} as const;
