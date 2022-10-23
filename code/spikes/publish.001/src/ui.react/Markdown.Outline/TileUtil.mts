import { t } from './common.mjs';

export const TileUtil = {
  /**
   * Interpret a heading node.
   */
  heading(args: {
    node: t.MdastHeading;
    siblings: { prev?: t.AstNode; next?: t.AstNode };
    defaultTitle?: string;
  }) {
    const { node, siblings, defaultTitle = '<Unnamed>' } = args;
    const { next } = siblings;
    const child = node.children[0] as t.MdastText;

    /**
     * Text/title.
     */
    let title = child?.value ?? defaultTitle;
    const regexZeroPrefix = new RegExp(/^\.\d\./);
    const isZero = Boolean(title.match(regexZeroPrefix));
    title = title.replace(regexZeroPrefix, '');

    /**
     * Interpret child blocks
     */
    const children: { text: string; depth: number }[] = [];

    if (next?.type === 'list') {
      const list = next as t.MdastList;
      const first = list.children[0];
      if (first?.children[0]?.type === 'heading' && first?.children[1]?.type === 'list') {
        const childHeading = first.children[0] as t.MdastHeading;
        const childList = first.children[1] as t.MdastList;

        childList.children.forEach((item) => {
          type P = t.MdastParagraph;
          type T = t.MdastText;
          const paragraph = item.children.find(({ type }) => type === 'paragraph') as P;
          if (paragraph) {
            const firstText = paragraph.children.find(({ type }) => type === 'text') as T;
            const text = firstText.value;
            children.push({ text, depth: childHeading.depth });
          }
        });
      }
    }

    return {
      title,
      isZero,
      children,
    };
  },
};
