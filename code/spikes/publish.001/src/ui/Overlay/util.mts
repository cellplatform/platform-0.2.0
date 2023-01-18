import type { t } from '../../common.t';
import { visit } from 'unist-util-visit';

export function getLinks(mdast?: t.MdastRoot): t.StateOverlayContext[] {
  if (!mdast) return [];
  const res: t.StateOverlayContext[] = [];

  visit(mdast, 'link', (node) => {
    const path = node.url.replace(/^\.\//, '');
    let title = 'Untitled';
    if (node.children[0].type === 'text') title = node.children[0].value;
    res.push({ title, path });
  });

  return res;
}
