import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, Wrangle } from './common';

const DEFAULT = {
  length: [8, 5] as [number, number],
};

export type HashProps = {
  text: string;
  length?: number | [number, number];
  style?: t.CssValue;
};

export const Hash: React.FC<HashProps> = (props) => {
  let text = props.text ?? '';
  const { prefix, hash } = Local.prefix(text);
  const shortened = Wrangle.displayHash(hash, props.length ?? DEFAULT.length);

  /**
   * [Render]
   */
  const styles = {
    base: css({ Flex: 'x-center-center' }),
    prefix: css({
      textTransform: 'uppercase',
      marginRight: 6,
      fontWeight: 'bold',
      opacity: 0.15,
      letterSpacing: -0.1,
    }),
    hash: css({}),
  };

  const elPrefix = prefix && <div {...styles.prefix}>{prefix}</div>;
  const elHash = <div {...styles.hash}>{shortened}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {elPrefix}
      {elHash}
    </div>
  );
};

/**
 * [Helpers]
 */
const Local = {
  prefix(input: string) {
    const regex = /^SHA256-/i;
    let prefix = '';
    let hash = input;

    const match = regex.test(input);
    if (match) {
      prefix = 'SHA256';
      hash = input.replace(regex, '');
    }

    return {
      input,
      prefix,
      hash,
    };
  },
};
