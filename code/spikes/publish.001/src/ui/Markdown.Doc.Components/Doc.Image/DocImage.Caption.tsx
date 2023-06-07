import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../../common';
import { Util } from './Util.mjs';

export type DocImageCaptionProps = {
  def: t.DocImageCaption;
  style?: t.CssValue;
};

export const DocImageCaption: React.FC<DocImageCaptionProps> = (props) => {
  const { def } = props;

  const text = def.text;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Flex: Util.getFlexAlignment(def?.align),
    }),
    text: css({
      fontSize: 14,
      opacity: 0.6,
      fontWeight: 400,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.text}>{text}</div>
    </div>
  );
};
