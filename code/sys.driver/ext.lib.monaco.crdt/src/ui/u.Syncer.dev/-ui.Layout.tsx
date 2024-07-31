import { Color, css, Icons, type t } from './common';

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
      gridTemplateRows: '1fr auto 1fr',
      userSelect: 'none',
    }),
    edge: css({
      display: 'grid',
      backgroundColor: theme.bg,
    }),
    gap: css({
      height: 50,
      transform: 'rotate(90deg)',
      opacity: 0.1,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elGap = (
    <div {...styles.gap}>
      <Icons.Sync.Arrows size={32} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.edge}>{props.top}</div>
      {elGap}
      <div {...styles.edge}>{props.bottom}</div>
    </div>
  );
};
