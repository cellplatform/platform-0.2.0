import { Button, Icons, css, type t } from './common';

export type ReloadProps = {
  isCloseable?: boolean;
  style?: t.CssValue;
  onCloseClick?: () => void;
  onReloadClick?: () => void;
};

export const Reload: React.FC<ReloadProps> = (props) => {
  const { isCloseable = true } = props;
  const reload = () => {
    if (props.onReloadClick) {
      props.onReloadClick();
    } else {
      location.reload();
    }
  };

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative', display: 'grid', placeItems: 'center' }),
    reload: {
      base: css({}),
      body: css({ display: 'grid', placeItems: 'center', gridTemplateRows: 'auto auto' }),
    },
    close: css({ Absolute: [5, 5, null, null] }),
  };

  const elReload = (
    <Button onClick={reload} style={styles.reload.base}>
      <div {...styles.reload.body}>
        <Icons.Refresh size={48} />
        <div>{'reload required'}</div>
      </div>
    </Button>
  );

  const elClose = isCloseable && (
    <Button style={styles.close} onClick={() => props.onCloseClick?.()}>
      <Icons.Close />
    </Button>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elReload}
      {elClose}
    </div>
  );
};
