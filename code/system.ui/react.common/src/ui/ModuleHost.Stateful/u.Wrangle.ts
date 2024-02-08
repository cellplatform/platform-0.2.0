import { DEFAULTS, R, type t } from './common';

export const Wrangle = {
  url() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const filter = params.get(DEFAULTS.qs.filter) ?? '';
    const selected = params.get(DEFAULTS.qs.selected) ?? '';
    return { url, params, filter, selected };
  },

  selected(specs: t.ModuleImports<unknown> | undefined, next: number) {
    if (!specs) return -1;
    const total = Object.keys(specs).length - 1;
    return total >= 0 ? R.clamp(0, total, next) : -1;
  },

  selectedIndexFromNamespace(specs: t.ModuleImports<unknown> | undefined, namespace: string) {
    if (!specs || !namespace || namespace === 'true') return -1;
    const index = Object.keys(specs).indexOf(namespace);
    return Wrangle.selected(specs, index);
  },

  selectedNamespaceFromIndex(specs: t.ModuleImports<unknown> | undefined, index: number) {
    return Object.keys(specs ?? {})[index];
  },

  hintKey(args: {
    focused: boolean;
    imports?: t.ModuleImports<unknown>;
    selectedIndex: number;
    command: string;
  }) {
    if (!args.focused) return ['↑', '↓', '⌘K'];
    return ['↑', '↓', 'enter'];
  },
} as const;
