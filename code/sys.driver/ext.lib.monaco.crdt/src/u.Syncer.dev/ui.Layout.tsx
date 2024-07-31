import { Color, css, type t } from './common';

export type LayoutProps = {
  top: JSX.Element;
  bottom: JSX.Element;
  theme?: t.CommonTheme;
};

export const Layout: React.FC<LayoutProps> = (props) => {
  const theme = Color.theme(props.theme);
  const border = `solid 1px ${Color.alpha(theme.fg, 0.2)}`;
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      rowGap: '50px',
      backgroundColor: Color.darken(theme.bg, 3),
    }),
    edge: css({ display: 'grid', backgroundColor: theme.bg }),
    top: css({ borderBottom: border }),
    bottom: css({ borderTop: border }),
  };
  return (
    <div {...css(styles.base)}>
      <div {...css(styles.edge, styles.top)}>{props.top}</div>
      <div {...css(styles.edge, styles.bottom)}>{props.bottom}</div>
    </div>
  );
};
