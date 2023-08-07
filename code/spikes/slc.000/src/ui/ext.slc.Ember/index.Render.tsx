import { type t } from './common';

export const Render = {
  async slc() {
    const { Concept } = await import('sys.ui.react.concept');
    const res = await fetch('/json/ember-slc.json');
    const json = await res.json();
    const slugs = json.slugs as t.SlugListItem[];
    return <Concept.Layout slugs={slugs} />;
  },
} as const;
