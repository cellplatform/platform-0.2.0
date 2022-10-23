import React, { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC, MarkdownUtil } from './common.mjs';

export type MarkdownOutlineRootSectionProps = {
  index: number;
  node: t.MdastHeading;
  siblings: { prev?: t.AstNode; next?: t.AstNode };
  style?: t.CssValue;
};

export const MarkdownOutlineRootSection: React.FC<MarkdownOutlineRootSectionProps> = (props) => {
  const { node, siblings } = props;
  const { next } = siblings;
  const child = node.children[0] as t.MdastText;

  /**
   * Derive the text label.
   */
  let _text = child?.value ?? '<Unnamed>';

  const regexZeroPrefix = new RegExp(/^\.\d\./);
  const isZero = Boolean(_text.match(regexZeroPrefix));
  _text = _text.replace(regexZeroPrefix, '');

  /**
   * TODO 🐷
   * - Numbering of subsequent non-zero items
   * - Intended sub-sections
   * - Move this AST walking logic into a specialized Parser helper.
   */

  /**
   * Interpret child blocks
   */
  const childBlocks: { text: string; depth: number }[] = [];

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
          childBlocks.push({ text, depth: childHeading.depth });
        }
      });
    }
  }

  /**
   * [Render]
   */
  const styles = {
    base: css({
      marginTop: 30,
      ':first-child': { marginTop: 0 },
      Flex: 'x-stretch-stretch',
    }),

    block: {
      base: css({
        flex: 1,
        boxSizing: 'border-box',
        cursor: 'default',
      }),
      root: css({
        padding: 30,
        paddingRight: 60,
        borderRadius: 10,
        fontSize: 24,
      }),

      child: css({
        padding: 30,
        fontSize: 18,
        marginLeft: 8,
        borderRadius: 8,
        marginTop: 10,
        ':first-child': { marginTop: 0 },
      }),

      magenta: css({
        color: COLORS.WHITE,
        background: COLORS.MAGENTA,
        ':hover': { backgroundColor: Color.lighten(COLORS.DARK, 5) },
      }),

      dark: css({
        color: COLORS.WHITE,
        background: COLORS.DARK,
        ':hover': { backgroundColor: Color.lighten(COLORS.DARK, 5) },
      }),

      silver: css({
        color: COLORS.DARK,
        border: `solid 1px ${Color.format(-0.1)}`,
        background: Color.alpha(COLORS.DARK, 0.1),
        ':hover': {
          backgroundColor: Color.lighten(COLORS.DARK, 5),
          color: COLORS.WHITE,
        },
      }),
    },

    children: css({
      flex: 2,
      Flex: 'y-stretch-stretch',
    }),
  };

  const elRootBlock = (
    <div {...css(styles.block.base, styles.block.root, styles.block.magenta)}>
      <div>{_text}</div>
    </div>
  );

  const elChildBlocks = childBlocks.length > 0 && (
    <div {...styles.children}>
      {childBlocks.map((child, i) => {
        const { depth, text } = child;

        let colors: t.CssValue | undefined;
        if (depth === 1) colors = styles.block.magenta;
        if (depth === 2) colors = styles.block.silver;
        if (depth === 3) colors = styles.block.dark;

        return (
          <div key={i} {...css(styles.block.base, styles.block.child, colors)}>
            {text}
          </div>
        );
      })}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elRootBlock}
      {elChildBlocks}
    </div>
  );
};
