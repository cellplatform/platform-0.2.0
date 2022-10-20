import React, { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from './common.mjs';

export type MarkdownOutlineRootSectionProps = {
  index: number;
  node: t.MdastHeading;
  siblings: { prev?: t.MdastHeading; next?: t.MdastHeading };
  style?: t.CssValue;
};

export const MarkdownOutlineRootSection: React.FC<MarkdownOutlineRootSectionProps> = (props) => {
  const { node, siblings } = props;

  const child = node.children[0] as t.MdastText;

  console.log('-------------------------------------------');
  console.log('node', node);
  console.log('siblings', siblings);

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
   */
  console.log('isZero (prefix)', isZero);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      marginTop: 20,
      ':first-child': { marginTop: 0 },

      Flex: 'x-stretch-stretch',
    }),

    block: {
      base: css({
        flex: 1,
        boxSizing: 'border-box',
        color: COLORS.WHITE,
        background: COLORS.MAGENTA,
        ':hover': {
          backgroundColor: 'rgba(255, 0, 0, 0.5)' /* RED */,
        },
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
    },

    children: css({
      flex: 1,
    }),
  };

  const elChildBlocks = (
    <div {...styles.children}>
      <div {...css(styles.block.base, styles.block.child)}>child</div>
      <div {...css(styles.block.base, styles.block.child)}>child</div>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...css(styles.block.base, styles.block.root)}>
        <div>{_text}</div>
      </div>
      {elChildBlocks}
    </div>
  );
};
