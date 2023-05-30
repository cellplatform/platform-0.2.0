import { Button, COLORS, Icons, Switch, css, t, DEFAULTS } from '../common';
import { useSpecImport } from '../hooks/useSpecImport.mjs';
import { Util } from '../Util.mjs';

export type SpecsRowProps = {
  data: t.TestRunnerPropListData;
  import: t.SpecImport;
  style?: t.CssValue;
  onSelectionChange?: t.SpecSelectionHandler;
};

export const SpecsRow: React.FC<SpecsRowProps> = (props) => {
  const spec = useSpecImport(props.data, props.import);
  const ellipsis = props.data.specs?.ellipsis ?? DEFAULTS.ellipsis;

  /**
   * Handlers
   */
  const handleSwitchClick = (e: React.MouseEvent) => {
    if (spec.suite) {
      props.onSelectionChange?.({
        import: props.import,
        spec: spec.suite,
        from: spec.isSelected,
        to: !spec.isSelected,
        modifiers: Util.modifiers(e),
      });
    }
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
    }),
    left: css({
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: 8,
    }),
    right: css({
      paddingTop: 1,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'top',
    }),
    runIcon: css({
      paddingTop: 1,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'top',
    }),
    desc: css({ paddingRight: 5, color: COLORS.DARK }),
    ellipsis: css({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Button>
        <div {...styles.left}>
          <Icons.Play size={12} style={styles.runIcon} />
          <div {...css(styles.desc, ellipsis ? styles.ellipsis : false)}>{spec.description}</div>
        </div>
      </Button>
      <div {...styles.right}>
        <Switch height={12} value={spec.isSelected} onClick={handleSwitchClick} />
      </div>
    </div>
  );
};
