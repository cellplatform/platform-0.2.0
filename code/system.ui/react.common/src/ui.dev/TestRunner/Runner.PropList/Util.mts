import { Test, t } from './common';

export const Util = {
  modifiers(e: React.MouseEvent): t.KeyboardModifierFlags {
    return {
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      meta: e.metaKey,
    };
  },

  isSelected(data: t.TestRunnerPropListData, spec?: t.TestSuiteModel) {
    if (!spec) return false;
    const selected = (data.specs ?? {}).selected ?? [];
    return selected.includes(spec.hash());
  },

  async importAndInitialize(data: t.TestRunnerPropListData) {
    const all = data.run?.all ?? [];
    const list = typeof all === 'function' ? all() : all;
    return Test.import(list, { init: true });
  },
};
