import { css, Switch, t } from '../common';

import { Util } from '../Util.mjs';
import { Body } from './Specs.Row.Body';

export type SpecsRowProps = {
  data: t.TestRunnerPropListData;
  spec: t.TestSuiteModel;
  style?: t.CssValue;
  onSelectionChange?: t.SpecsSelectionHandler;
  onRunClick?: t.SpecRunClickHandler;
};

export const SpecsRow: React.FC<SpecsRowProps> = (props) => {
  const { data, spec } = props;
  const isSelected = Util.isSelected(data, spec);

  /**
   * Handlers
   */
  const handleSwitchClick = (e: React.MouseEvent) => {
    props.onSelectionChange?.({
      spec,
      from: isSelected,
      to: !isSelected,
      modifiers: Util.modifiers(e),
    });
  };

  const handleBodyClick = (e: React.MouseEvent) => {
    props.onRunClick?.({
      spec,
      modifiers: Util.modifiers(e),
    });
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
      <Body data={props.data} suite={spec} isSelected={isSelected} onClick={handleBodyClick} />
      <div {...styles.switch} onClick={handleSwitchClick}>
        <Switch height={12} value={isSelected} />
      </div>
    </div>
  );
};
