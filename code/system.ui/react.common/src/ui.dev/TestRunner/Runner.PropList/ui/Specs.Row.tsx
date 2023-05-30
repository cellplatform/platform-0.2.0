import { Button, COLORS, Icons, Switch, css, t } from '../common';
import { useSpecImport } from '../hooks/useSpecImport.mjs';

export type SpecsRowProps = {
  data: t.TestRunnerPropListData;
  import: t.SpecImport;
  style?: t.CssValue;
  onSelectionChange?: t.SpecSelectionHandler;
};

export const SpecsRow: React.FC<SpecsRowProps> = (props) => {
  const spec = useSpecImport(props.data, props.import);
  const isSelected = spec.isSelected;

  /**
   * Handlers
   */
  const handleSwitchClick = () => {
    if (spec.suite) {
      props.onSelectionChange?.({
        import: props.import,
        spec: spec.suite,
        from: isSelected,
        to: !isSelected,
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
    desc: css({
      paddingRight: 5,
      color: COLORS.DARK,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Button>
        <div {...styles.left}>
          <Icons.Play size={12} style={styles.runIcon} />
          <div {...styles.desc}>{spec.description}</div>
        </div>
      </Button>
      <div {...styles.right}>
        <Switch height={12} value={isSelected} onClick={handleSwitchClick} />
      </div>
    </div>
  );
};
