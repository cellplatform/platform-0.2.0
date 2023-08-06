import type { t, T, TDoc } from './-SPEC.t';

import { DevSelected } from './-SPEC.Selected';
import { Icons, Is, slug as slugid } from './common';

export async function DevItemEditor(dev: t.DevTools<T>, doc: t.CrdtDocRef<TDoc>) {
  const state = await dev.state();
  const Selected = DevSelected(state, doc);

  const elIconId = <Icons.Slug.Id size={16} style={{ Margin: 4 }} />;
  const elIconTitle = <Icons.Slug.Title size={16} style={{ Margin: 4 }} />;

  const findSection = (doc: TDoc) => {
    const selected = Selected.slug;
    if (!Is.slug(selected.item)) return undefined;

    let section: t.SlugNamespace | undefined;
    for (const item of doc.slugs) {
      if (Is.namespace(item)) section = item;
      if (Is.slug(item) && item.id === selected.item.id) break;
    }
    return section;
  };

  dev.section('Section', (dev) => {
    dev.textbox((txt) => {
      txt
        .margin([0, 0, 0, 20])
        .placeholder((e) => 'namespace')
        .left(elIconId)
        .enabled((e) => Boolean(findSection(doc.current)))
        .value((e) => findSection(doc.current)?.namespace)
        .onChange((e) => {
          doc.change((d) => {
            const section = findSection(d);
            if (section) section.namespace = e.to.value;
          });
        });
    });

    dev.textbox((txt) => {
      txt
        .margin([0, 0, 0, 20])
        .placeholder((e) => 'title (optional)')
        .left(elIconTitle)
        .enabled((e) => Boolean(findSection(doc.current)))
        .value((e) => findSection(doc.current)?.title)
        .onChange((e) => {
          doc.change((d) => {
            const section = findSection(d);
            if (section) section.title = e.to.value;
          });
        });
    });

    dev.hr(0, 5);
    dev.button(['create 🌳', '(new)'], (e) => {
      const slug: t.SlugNamespace = { kind: 'slug:namespace', namespace: '' };
      doc.change((d) => d.slugs.push(slug));
    });
  });

  dev.hr(5, 20);

  dev.section('Slug', (dev) => {
    dev.textbox((txt) => {
      txt
        .margin([0, 0, 0, 20])
        .placeholder((e) => 'id')
        .left(elIconId)
        .enabled((e) => Boolean(Selected.slug.id))
        .value((e) => Selected.slug.id)
        .onChange((e) => {
          doc.change((d) => {
            const selected = d.slugs[Selected.index];
            if (Is.slug(selected)) selected.id = e.to.value;
          });
        });
    });

    dev.textbox((txt) => {
      txt
        .margin([0, 0, 0, 20])
        .placeholder((e) => 'title')
        .left(elIconTitle)
        .enabled((e) => Boolean(Selected.slug.id))
        .value((e) => Selected.slug.title)
        .onChange((e) => {
          doc.change((d) => {
            const selected = d.slugs[Selected.index];
            if (Is.slug(selected)) selected.title = e.to.value;
          });
        });
    });

    dev.hr(0, 5);
    dev.button(['create 🌳', '(new)'], (e) => {
      const slug: t.Slug = { id: slugid(), kind: 'slug:VideoDiagram' };
      doc.change((d) => d.slugs.push(slug));
    });
  });
}
