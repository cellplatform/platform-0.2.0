import { DEFAULTS, type t } from './common';
import { Wrangle } from './u.Wrangle';

export const Url = {
  push(url: URL, options: { reload?: boolean } = {}) {
    const path = url.href;
    window.history.pushState({ path }, '', url.href);
    if (options.reload) window.location.reload();
  },

  mutateFilter(filter: string, options: { reload?: boolean } = {}) {
    const { url, params } = Wrangle.url();
    if (filter) params.set(DEFAULTS.qs.filter, filter);
    if (!filter) params.delete(DEFAULTS.qs.filter);
    Url.push(url, options);
  },

  mutateLoadedNamespace(
    index: number,
    imports: t.ModuleImports | undefined,
    options: { reload?: boolean } = {},
  ) {
    if (!imports) return;
    if (index < 0) return;

    const { url, params } = Wrangle.url();
    const namespace = Wrangle.selectedNamespaceFromIndex(imports, index);
    if (!namespace) return;

    params.set(DEFAULTS.qs.dev, namespace);
    params.delete(DEFAULTS.qs.selected);
    Url.push(url, options);
  },
} as const;
