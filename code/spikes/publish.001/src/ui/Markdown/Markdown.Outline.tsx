import React, { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common.mjs';

export type MarkdownOutlineProps = {
  ast: t.MdastRoot;
  style?: t.CssValue;
};

export const MarkdownOutline: React.FC<MarkdownOutlineProps> = (props) => {
  const { ast } = props;

  console.log('ast', ast);

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
    header: css({
      marginBottom: 50,
      overflow: 'hidden',
    }),
    block: css({
      padding: 30,
      background: COLORS.MAGENTA,
      color: COLORS.WHITE,
      borderRadius: 10,
      marginTop: 20,
      ':first-child': { marginTop: 0 },
      ':hover': {
        backgroundColor: 'rgba(255, 0, 0, 0.5)' /* RED */,
      },
    }),
    blockHeader: css({
      fontSize: 32,
    }),
  };

  const elBlocks = ast.children
    .filter((node) => node.type === 'heading')

    .map((node, i) => {
      const heading = node as t.MdastHeading;
      const child = heading.children[0] as t.MdastText;
      const text = child.value ?? '<unknown>';

      return (
        <div key={i} {...styles.block}>
          <div {...styles.blockHeader}>{text}</div>
        </div>
      );
    });

  return (
    <div {...css(styles.base, props.style)}>
      <div>{elBlocks}</div>
    </div>
  );
};
