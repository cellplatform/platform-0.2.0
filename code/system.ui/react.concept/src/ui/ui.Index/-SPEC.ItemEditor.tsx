import type { t, T, TDoc } from './-SPEC.t';
import { Is, Icons, slug as slugid } from './common';

import { SelectedRef } from './-SPEC.Selected';

export async function DevItemEditor(dev: t.DevTools<T>, doc: t.CrdtDocRef<TDoc>) {
  const state = await dev.state();
  const Selected = SelectedRef(state, doc);

  dev.section('Slug', (dev) => {
    dev.textbox((txt) => {
      txt
        .margin([0, 0, 0, 20])
        .placeholder((e) => 'id')
        .left((e) => <Icons.Slug.Id size={16} style={{ Margin: 4 }} />)
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
        .placeholder((e) => 'title text')
        .left((e) => <Icons.Slug.Title size={16} style={{ Margin: 4 }} />)
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
    dev.button(['create', '(new)'], (e) => {
      const slug: t.Slug = { id: slugid(), kind: 'VideoDiagram' };
      doc.change((d) => d.slugs.push(slug));
    });
  });
}
