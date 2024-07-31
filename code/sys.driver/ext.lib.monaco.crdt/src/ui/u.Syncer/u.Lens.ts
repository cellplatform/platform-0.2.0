import { Doc, Path, type t } from './common';

type O = Record<string, unknown>;

export const LensUtil = {
  /**
   * Text helpers
   */
  text(lens: t.Lens | t.Doc, paths: t.EditorPaths) {
    const api = {
      get current() {
        return api.resolve(lens.current);
      },
      resolve(d: O) {
        return Path.Object.resolve<string>(d, paths.text);
      },
      splice(d: O, index: number, del: number, value?: string) {
        Doc.Text.splice(d, paths.text, index, del, value);
      },
      replace(d: O, value: string) {
        Path.Object.Mutate.value(d, paths.text, value);
      },
    } as const;
    return api;
  },
} as const;
