import type { t, T, TDoc } from './-SPEC.t';
import { Wrangle } from './Wrangle';

export function DevSelected(doc: t.CrdtDocRef<TDoc>, getSelectedIndex: () => t.Index | undefined) {
  const Selected = {
    get index() {
      return getSelectedIndex() ?? -1;
    },

    get item() {
      return doc.current.slugs[Selected.index];
    },

    section: {
      get item() {
        return Wrangle.namespace(Selected.item);
      },
      get namespace() {
        return Selected.section.item?.namespace ?? '';
      },
      get title() {
        return Selected.section.item?.title ?? '';
      },
    },

    slug: {
      get item() {
        return Wrangle.slug(Selected.item);
      },
      get id() {
        return Selected.slug.item?.id ?? '';
      },
      get title() {
        return Selected.slug.item?.title ?? '';
      },
    },
  } as const;

  return Selected;
}
