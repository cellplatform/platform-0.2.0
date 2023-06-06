import { Test, t, Is } from './common';

export const Util = {
  modifiers(e: React.MouseEvent): t.KeyboardModifierFlags {
    return {
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      meta: e.metaKey,
    };
  },

  isSelected(data: t.TestPropListData, spec?: t.TestSuiteModel) {
    if (!spec) return false;
    const selected = (data.specs ?? {}).selected ?? [];
    return selected.includes(spec.hash());
  },

  async importAndInitialize(data: t.TestPropListData) {
    const input = data.run?.list ?? [];
    const value = typeof input === 'function' ? input() : input;
    const list = Is.promise(value) ? await value : value;
    return Test.import(list, { init: true });
  },
};
