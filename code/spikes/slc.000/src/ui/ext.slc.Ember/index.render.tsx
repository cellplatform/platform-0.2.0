import { type t } from './common';

export async function render() {
  const { Concept } = await import('sys.ui.react.concept');

  const res = await fetch('/json/000.json');
  const json = await res.json();

  const slugs = json.slugs as t.SlugListItem[];
  console.info('json', json);

  return <Concept.Layout slugs={slugs} />;
}
