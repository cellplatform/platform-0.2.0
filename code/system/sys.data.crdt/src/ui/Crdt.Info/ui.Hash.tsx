import { COLORS, css, t, useMouseState, Wrangle, Value } from './common';

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
  const shortened = Value.shortenHash(hash, props.length ?? DEFAULT.length);
  const mouse = useMouseState();

  /**
   * [Render]
   */
  const styles = {
    base: css({ Flex: 'x-center-center' }),
    prefix: css({
      textTransform: 'uppercase',
      marginRight: 6,
      fontWeight: 'bold',
      opacity: mouse.isOver ? 0.4 : 0.15,
      color: mouse.isOver ? COLORS.MAGENTA : COLORS.DARK,
      transition: 'opacity 200ms, color 200ms',
      letterSpacing: -0.1,
    }),
    hash: css({}),
  };

  const elPrefix = prefix && <div {...styles.prefix}>{prefix}</div>;
  const elHash = <div {...styles.hash}>{shortened}</div>;

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
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
