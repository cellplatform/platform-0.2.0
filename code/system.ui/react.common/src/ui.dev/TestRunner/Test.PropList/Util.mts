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
    const source = data.run?.all ?? [];
    const list = typeof source === 'function' ? source() : source;
    const all = Is.promise(list) ? await list : list;
    return Test.import(all, { init: true });
  },
};
