import { COLORS, css, t } from '../common';
import { Footer } from './Root.Footer';
import { useKeyboard } from './useKeyboard.mjs';

export type RootProps = {
  fill?: boolean;
  style?: t.CssValue;
};

export const Root: React.FC<RootProps> = (props) => {
  const href = '?dev';
  useKeyboard();

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: props.fill ? 0 : undefined,
      fontFamily: 'sans-serif',
      color: COLORS.DARK,
      fontSize: 14,
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
    body: css({
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'center',
      fontSize: 80,
    }),
    a: css({
      color: COLORS.CYAN,
      fontWeight: 'bold',
      letterSpacing: '-0.03em',
      textDecoration: 'none',
      ':hover': { textDecoration: 'underline' },
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <a {...styles.a} href={href}>
          {href}
        </a>
      </div>

      <Footer />
    </div>
  );
};

/**
 * <Root> that fills the screen (absolute positioning)
 * Use for entry.
 */
export const RootFill: React.FC<RootProps> = (props) => {
  return <Root fill={true} {...props} />;
};
