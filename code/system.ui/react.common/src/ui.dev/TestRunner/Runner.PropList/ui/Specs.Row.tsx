import { css, Switch, t } from '../common';
import { useSpecImport } from '../hooks/useSpecImport.mjs';
import { Util } from '../Util.mjs';
import { Body } from './Spec.Row.Body';

export type SpecsRowProps = {
  data: t.TestRunnerPropListData;
  import: t.SpecImport;
  style?: t.CssValue;
  onSelectionChange?: t.SpecsSelectionHandler;
  onRunClick?: t.SpecRunClickHandler;
};

export const SpecsRow: React.FC<SpecsRowProps> = (props) => {
  const spec = useSpecImport(props.data, props.import);

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

  const handleBodyClick = (e: React.MouseEvent) => {
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
      columnGap: 5,
    }),
    switch: css({
      paddingTop: 2,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'top',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Body
        data={props.data}
        suite={spec.suite}
        isSelected={spec.isSelected}
        onClick={handleBodyClick}
      />
      <div {...styles.switch} onClick={handleSwitchClick}>
        <Switch height={12} value={spec.isSelected} />
      </div>
    </div>
  );
};
