import { Button, COLORS, Chain, DEFAULTS, css, type t } from './common';

export type ChainRowProps = {
  enabled?: boolean;
  chain: t.EvmChainName;
  modifiers: t.InfoFieldModifiers;
  data: t.InfoData;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const ChainRow: React.FC<ChainRowProps> = (props) => {
  const { enabled = true, chain, modifiers, theme } = props;
  const data = props.data.chain ?? DEFAULTS.data.chain!;

  const name = Chain.displayName(chain);
  const is = {
    selected: data.selected === chain,
    testnet: Chain.is.testnet(chain),
  };

  /**
   * Handlers
   */
  const handleClick = () => {
    if (!enabled) return;
    data.onSelected?.({ chain });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      cursor: enabled ? 'pointer' : 'default',
      opacity: enabled ? 1 : 0.7,
      filter: enabled ? undefined : 'grayscale(100%)',

      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      columnGap: '5px',
    }),
    selection: {
      base: css({ width: 15, display: 'grid', placeItems: 'center' }),
      dot: css({ Size: 6, backgroundColor: COLORS.BLUE, borderRadius: 20 }),
    },
    name: css({
      opacity: is.testnet ? 0.3 : 1,
      display: 'grid',
      alignContent: 'center',
    }),
    right: {
      base: css({ display: 'grid', alignContent: 'center' }),
    },
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.selection.base}>{is.selected && <div {...styles.selection.dot} />}</div>
      <Button style={styles.name} enabled={enabled} theme={theme} onClick={handleClick}>
        {name}
      </Button>
      <div {...styles.right.base}></div>
    </div>
  );
};
