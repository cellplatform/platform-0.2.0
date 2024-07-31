import { Color, css, type t } from './common';

export type LayoutProps = {
  top: JSX.Element;
  bottom: JSX.Element;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Layout: React.FC<LayoutProps> = (props) => {
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      rowGap: '50px',
    }),
    edge: css({
      display: 'grid',
      backgroundColor: theme.bg,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.edge}>{props.top}</div>
      <div {...styles.edge}>{props.bottom}</div>
    </div>
  );
};
