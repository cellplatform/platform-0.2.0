import { DEFAULTS, type t } from './common';
import { Wrangle } from './u.Wrangle';

type Options = { reload?: boolean };

export const Url = {
  push(url: URL, options: Options = {}) {
    const path = url.href;
    window.history.pushState({ path }, '', url.href);
    if (options.reload) window.location.reload();
  },

  mutateFilter(filter: string, options: Options = {}) {
    const { url, params } = Wrangle.url();
    const key = DEFAULTS.qs.filter;
    if (filter) params.set(key, filter);
    if (!filter) params.delete(key);
    Url.push(url, options);
  },

  mutateSelected(uri?: string, options: Options = {}) {
    const { url, params } = Wrangle.url();
    const key = DEFAULTS.qs.selected;
    if (uri) params.set(key, uri);
    if (!uri) params.delete(key);
    Url.push(url, options);
  },

  mutateLoadedNamespace(
    index: number,
    imports: t.ModuleImports | undefined,
    options: Options = {},
  ) {
    if (!imports) return;
    if (index < 0) return;

    const { url, params } = Wrangle.url();
    const namespace = Wrangle.selectedUriFromIndex(imports, index);
    if (!namespace) return;

    params.set(DEFAULTS.qs.dev, namespace);
    params.delete(DEFAULTS.qs.selected);
    Url.push(url, options);
  },
} as const;
