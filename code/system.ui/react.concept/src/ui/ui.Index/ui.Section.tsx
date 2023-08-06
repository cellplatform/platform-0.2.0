import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type SectionProps = {
  ns: t.SlugNamespace;
  style?: t.CssValue;
};

export const Section: React.FC<SectionProps> = (props) => {
  const { ns } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    text: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.text}>{ns.namespace}</div>
    </div>
  );
};
