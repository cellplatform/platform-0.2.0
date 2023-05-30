import { t } from './common';

export const Util = {
  async ensureLoaded(input: t.SpecImport) {
    const suite = (await input).default;
    if (suite?.kind !== 'TestSuite') return;
    if (!suite.ready) await suite.init();
    return {
      import: input,
      suite,
    };
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
