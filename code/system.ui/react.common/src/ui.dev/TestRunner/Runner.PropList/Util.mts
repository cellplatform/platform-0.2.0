import { Hash, t } from './common';

export const Util = {
  async ensureLoaded(input: t.SpecImport) {
    const suite = (await input).default;
    if (suite?.kind !== 'TestSuite') return;
    if (!suite.state.ready) await suite.init();
    return {
      import: input,
      suite,
      get hash() {
        return Util.hash(suite);
      },
    };
  },

  hash(suite: t.TestSuiteModel) {
    return `suite:${Hash.sha1(suite.description)}`;
  },

  modifiers(e: React.MouseEvent): t.KeyboardModifierFlags {
    return {
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      meta: e.metaKey,
    };
  },
};
