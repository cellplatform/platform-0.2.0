import type { t, T, TDoc } from './-SPEC.t';
import { Wrangle } from './Wrangle';

export function DevSelected(state: t.DevCtxState<T>, doc: t.CrdtDocRef<TDoc>) {
  const Selected = {
    get index() {
      return state.current.props.selected ?? -1;
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
