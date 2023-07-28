import { t, Text } from '../common';
import { visit } from 'unist-util-visit';

type LinkMatch = { node: t.MdastLink; text: string; url: string };

export const MarkdownFind = {
  image: Text.Markdown.Find.image,

  /**
   * Looks for any links within the given node.
   */
  links(node: t.MdastNode): LinkMatch[] {
    const matches: LinkMatch[] = [];
    visit(node, (e) => {
      if (e.type === 'link') {
        const child = e.children[0];
        if (child?.type === 'text') {
          const text = (child.value || '').trim();
          const url = e.url;
          matches.push({ node: e, text, url });
        }
      }
    });
    return matches;
  },

  /**
   * Matches links of the format [ref](<url>) OR [ref:<type>](<url>)
   */
  refLinks(node: t.MdastNode): LinkMatch[] {
    const isRef = (text: string) => text === 'ref' || text.startsWith('ref:');
    return MarkdownFind.links(node).filter((e) => isRef(e.text));
  },
};
