import React, { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common.mjs';

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
   */
  console.log('isZero (prefix)', isZero);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,

      ':first-child': { marginTop: 0 },
    }),
    block: css({
      boxSizing: 'border-box',
      padding: 30,
      marginTop: 20,
      background: COLORS.MAGENTA,
      borderRadius: 10,
      ':hover': {
        backgroundColor: 'rgba(255, 0, 0, 0.5)' /* RED */,
      },
    }),
    title: css({
      color: COLORS.WHITE,
      fontSize: 24,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.block}>
        <div {...styles.title}>{_text}</div>
      </div>
    </div>
  );
};
