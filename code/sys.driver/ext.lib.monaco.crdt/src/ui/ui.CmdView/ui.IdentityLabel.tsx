import { Color, css, type t } from './common';

export type IdentityLabelProps = {
  identity?: t.IdString;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const IdentityLabel: React.FC<IdentityLabelProps> = (props) => {
  const { identity = 'UNKNOWN' } = props;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      fontFamily: 'monospace',
      fontSize: 10,
      color: Color.alpha(theme.fg, 0.3),
    }),
    identity: css({ color: Color.alpha(theme.fg, 1) }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <span>{`identity: “`}</span>
      <span {...styles.identity}>{identity}</span>
      <span>{`”`}</span>
    </div>
  );
};
