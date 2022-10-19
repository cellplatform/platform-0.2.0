import React, { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common.mjs';

import type { Node as AstNode } from 'unist';
import type {
  Root as MdastRoot,
  Code as MdastCode,
  Heading as MdastHeading,
  Text as MdastText,
} from 'mdast';

export type MarkdownDocOutlineProps = {
  ast: t.MdastRoot;
  style?: t.CssValue;
};

export const MarkdownDocOutline: React.FC<MarkdownDocOutlineProps> = (props) => {
  const { ast } = props;

  console.log('ast', ast);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    header: css({
      marginBottom: 50,
      overflow: 'hidden',
    }),
    block: css({
      // backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 30,
      background: COLORS.MAGENTA,
      color: COLORS.WHITE,
      borderRadius: 10,
      marginTop: 20,
      ':first-child': { marginTop: 0 },
      ':hover': {
        backgroundColor: 'rgba(255, 0, 0, 0.5)' /* RED */,
        // boxShadow: `0 3px 8px 0 ${Color.format(-0.3)}`,
      },
    }),
    blockHeader: css({
      fontSize: 32,
      // fontWeight: 'bold',
    }),
  };

  const elBlocks = ast.children
    .filter((node) => node.type === 'heading')

    .map((node, i) => {
      console.log('> node', node);

      const heading = node as MdastHeading;
      const child = heading.children[0] as MdastText;
      const text = child.value ?? '<unknown>';

      return (
        <div key={i} {...styles.block}>
          <div {...styles.blockHeader}>{text}</div>
        </div>
      );
    });

  return (
    <div {...css(styles.base, props.style)}>
      MarkdownDocOutline 🐷
      <div {...styles.header}>
        <pre {...css({ maxWidth: 30 })}>{JSON.stringify(props.ast)}</pre>
      </div>
      <div>{elBlocks}</div>
    </div>
  );
};
