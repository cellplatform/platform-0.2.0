import { useEffect, useState } from 'react';
import { Color, css, Icons, rx, Time, type t } from './common';

export type LayoutProps = {
  lens?: t.Lens | t.Doc;
  top: JSX.Element;
  bottom: JSX.Element;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Layout: React.FC<LayoutProps> = (props) => {
  const { lens } = props;
  const [syncing, setSyncing] = useState(false);

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const events = lens?.events();
    let reset: (() => void) | undefined;
    events?.changed$.pipe(rx.debounceTime(100)).subscribe((e) => {
      reset?.();
      setSyncing(true);
      reset = Time.delay(1000, () => setSyncing(false)).cancel;
    });
    return events?.dispose;
  }, [lens?.instance]);

  /**
   * Render.
   */
  const t = (ms: t.Msecs, ...attr: string[]) => attr.map((prop) => `${prop} ${ms}ms ease-in-out`);
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
      display: 'grid',
      placeItems: 'center',
    }),
    syncIcon: css({
      opacity: syncing ? 1 : 0.2,
      transition: t(syncing ? 100 : 800, 'opacity').join(','),
    }),
  };

  const elGap = (
    <div {...styles.gap}>
      <Icons.Sync.Arrows size={32} style={styles.syncIcon} />
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
