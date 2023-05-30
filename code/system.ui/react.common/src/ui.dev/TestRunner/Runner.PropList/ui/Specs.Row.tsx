import { Button, COLORS, Icons, Switch, css, t, DEFAULTS } from '../common';
import { useSpecImport } from '../hooks/useSpecImport.mjs';
import { Util } from '../Util.mjs';

export type SpecsRowProps = {
  data: t.TestRunnerPropListData;
  import: t.SpecImport;
  style?: t.CssValue;
  onSelectionChange?: t.SpecsSelectionHandler;
  onRunClick?: t.SpecRunClickHandler;
};

export const SpecsRow: React.FC<SpecsRowProps> = (props) => {
  const spec = useSpecImport(props.data, props.import);
  const ellipsis = Wrangle.ellipsis(props);

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

  const handleTestRunClick = (e: React.MouseEvent) => {
    if (spec.suite) {
      props.onRunClick?.({
        spec: spec.suite,
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
    description: css({
      paddingRight: 5,
    }),
    ellipsis: css({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Button onClick={handleTestRunClick}>
        <div {...styles.left}>
          <Icons.Run.FullCircle.Outline size={16} style={styles.runIcon} />
          <div {...css(styles.description, ellipsis ? styles.ellipsis : false)}>
            {spec.description}
          </div>
        </div>
      </Button>
      <div {...styles.right}>
        <Switch height={12} value={spec.isSelected} onClick={handleSwitchClick} />
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  ellipsis(props: SpecsRowProps) {
    const ellipsis = props.data.specs?.ellipsis ?? DEFAULTS.ellipsis;
    return typeof ellipsis === 'function' ? ellipsis() : ellipsis;
  },
};
